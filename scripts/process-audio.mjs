#!/usr/bin/env node
import { whisper } from 'whisper-node'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const rawDir = path.join(projectRoot, 'public', 'audio', 'raw')
const projectsDir = path.join(projectRoot, 'public', 'audio', 'projects')

const args = process.argv.slice(2)
const targetProject = getArgValue(args, '--project')
const skipTranscription = args.includes('--skip-transcription')

const entries = listRawWavs(rawDir)
if (entries.length === 0) {
  console.error(`No .wav files found in ${rawDir}`)
  process.exit(1)
}

const selected = targetProject
  ? entries.filter(entry => entry.projectId === normalizeProjectId(targetProject))
  : entries

if (selected.length === 0) {
  console.error(`No matching WAV found for project "${targetProject}" in ${rawDir}`)
  process.exit(1)
}

try {
  for (const entry of selected) {
    await processProjectAudio(entry, { projectsDir, skipTranscription })
  }
} catch (error) {
  console.error(`Processing failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}

async function processProjectAudio(entry, options) {
  const { projectId, inputPath } = entry
  const { projectsDir: baseProjectsDir, skipTranscription: skipTranscript } = options
  const outputRoot = path.join(baseProjectsDir, projectId)
  const playbackDir = path.join(outputRoot, 'playback')
  const transcriptionDir = path.join(outputRoot, 'transcription')
  const playbackMp3 = path.join(playbackDir, 'audio.mp3')
  const transcriptionWav = path.join(transcriptionDir, 'audio_16k.wav')
  const transcriptJson = path.join(transcriptionDir, 'transcript.json')

  fs.mkdirSync(playbackDir, { recursive: true })
  fs.mkdirSync(transcriptionDir, { recursive: true })

  console.log(`\nProcessing project "${projectId}" from ${relative(inputPath)}`)
  runFfmpeg(['-y', '-i', inputPath, '-ac', '1', '-b:a', '128k', playbackMp3], 'playback MP3')
  runFfmpeg(['-y', '-i', inputPath, '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', transcriptionWav], '16k WAV')

  if (skipTranscript) {
    console.log(`Skipped transcription for "${projectId}"`)
    return
  }

  console.log(`Transcribing ${relative(transcriptionWav)}`)
  const transcript = await whisperSyncSafe(transcriptionWav)
  if (!Array.isArray(transcript)) {
    throw new Error(`Whisper returned an unexpected response for "${projectId}".`)
  }
  const teleprompterText = transcript.map((segment) => ({
    time: parseTimestamp(segment.start),
    text: segment.speech,
  }))
  fs.writeFileSync(transcriptJson, JSON.stringify(teleprompterText, null, 2))
  console.log(`Saved transcript: ${relative(transcriptJson)} (${teleprompterText.length} segments)`)
}

function whisperSyncSafe(audioPath) {
  return whisper(audioPath, {
    modelName: 'base.en',
    whisperOptions: {
      language: 'en',
      word_timestamps: true,
    },
  })
}

function runFfmpeg(ffmpegArgs, label) {
  const result = spawnSync('ffmpeg', ffmpegArgs, { stdio: 'inherit' })
  if (result.status !== 0) {
    console.error(`ffmpeg failed while generating ${label}`)
    process.exit(result.status || 1)
  }
}

function listRawWavs(dir) {
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir, { withFileTypes: true })
  return files
    .filter(file => file.isFile() && file.name.toLowerCase().endsWith('.wav'))
    .map(file => {
      const basename = file.name.replace(/\.wav$/i, '')
      return {
        projectId: normalizeProjectId(basename),
        inputPath: path.join(dir, file.name),
      }
    })
}

function getArgValue(argsList, key) {
  const index = argsList.indexOf(key)
  if (index === -1) return null
  return argsList[index + 1] || null
}

function normalizeProjectId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseTimestamp(timestamp) {
  const parts = timestamp.split(':')
  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  const seconds = parseFloat(parts[2])
  return hours * 3600 + minutes * 60 + seconds
}

function relative(filePath) {
  return path.relative(projectRoot, filePath) || '.'
}
