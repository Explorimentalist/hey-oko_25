#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const rawDir = path.join(projectRoot, 'public', 'audio', 'raw')

const args = process.argv.slice(2)
const skipTranscription = args.includes('--skip-transcription')
const noInitial = args.includes('--no-initial')
const intervalMs = getIntervalMs(args) ?? 1500

fs.mkdirSync(rawDir, { recursive: true })

const pendingProjects = new Set()
const debounceTimers = new Map()
let isProcessing = false
const knownFileState = new Map()

if (!noInitial) {
  enqueueAllExistingWavs()
} else {
  primeKnownState()
}

console.log(`Watching ${path.relative(projectRoot, rawDir)} for .wav changes (polling every ${intervalMs}ms)...`)
if (skipTranscription) {
  console.log('Transcription is disabled for watcher runs (--skip-transcription).')
}

setInterval(scanForChanges, intervalMs)
scanForChanges()

function enqueueAllExistingWavs() {
  const files = fs.readdirSync(rawDir, { withFileTypes: true })
  for (const file of files) {
    if (!file.isFile()) continue
    if (!file.name.toLowerCase().endsWith('.wav')) continue
    const projectId = normalizeProjectId(file.name.replace(/\.wav$/i, ''))
    queueProject(projectId)
  }
}

function primeKnownState() {
  const files = fs.readdirSync(rawDir, { withFileTypes: true })
  for (const file of files) {
    if (!file.isFile()) continue
    if (!file.name.toLowerCase().endsWith('.wav')) continue
    const fullPath = path.join(rawDir, file.name)
    const stat = fs.statSync(fullPath)
    knownFileState.set(file.name, `${stat.size}:${stat.mtimeMs}`)
  }
}

function scanForChanges() {
  const files = fs.readdirSync(rawDir, { withFileTypes: true })
  const seenThisScan = new Set()

  for (const file of files) {
    if (!file.isFile()) continue
    if (!file.name.toLowerCase().endsWith('.wav')) continue

    const fullPath = path.join(rawDir, file.name)
    const stat = fs.statSync(fullPath)
    const signature = `${stat.size}:${stat.mtimeMs}`
    seenThisScan.add(file.name)

    if (knownFileState.get(file.name) !== signature) {
      knownFileState.set(file.name, signature)
      const projectId = normalizeProjectId(file.name.replace(/\.wav$/i, ''))
      queueProject(projectId)
    }
  }

  for (const existingFile of [...knownFileState.keys()]) {
    if (!seenThisScan.has(existingFile)) {
      knownFileState.delete(existingFile)
    }
  }
}

function queueProject(projectId) {
  if (!projectId) return

  if (debounceTimers.has(projectId)) {
    clearTimeout(debounceTimers.get(projectId))
  }

  const timer = setTimeout(() => {
    debounceTimers.delete(projectId)
    pendingProjects.add(projectId)
    void processQueue()
  }, 400)

  debounceTimers.set(projectId, timer)
}

async function processQueue() {
  if (isProcessing) return
  isProcessing = true

  try {
    while (pendingProjects.size > 0) {
      const projectId = pendingProjects.values().next().value
      pendingProjects.delete(projectId)
      await runProcessor(projectId)
    }
  } finally {
    isProcessing = false
  }
}

function runProcessor(projectId) {
  return new Promise((resolve) => {
    const processArgs = ['scripts/process-audio.mjs', '--project', projectId]
    if (skipTranscription) processArgs.push('--skip-transcription')

    console.log(`\nDetected update for project "${projectId}". Processing...`)

    const child = spawn('node', processArgs, {
      cwd: projectRoot,
      stdio: 'inherit',
    })

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`Completed project "${projectId}".`)
      } else {
        console.error(`Processing failed for project "${projectId}" (exit ${code ?? 'unknown'}).`)
      }
      resolve()
    })
  })
}

function normalizeProjectId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getIntervalMs(argsList) {
  const index = argsList.indexOf('--interval')
  if (index === -1) return null
  const value = Number(argsList[index + 1])
  if (!Number.isFinite(value) || value < 250) return null
  return Math.floor(value)
}
