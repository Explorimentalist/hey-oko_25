#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const args = process.argv.slice(2)

const projectId = normalizeProjectId(getArgValue(args, '--project') || 'aa-dp')
const scriptPath = getArgValue(args, '--script')

if (!scriptPath) {
  console.error('Missing required --script argument (path to .rtf or .txt).')
  process.exit(1)
}

const transcriptPath = path.join(projectRoot, 'public', 'audio', 'projects', projectId, 'transcription', 'transcript.json')
if (!fs.existsSync(transcriptPath)) {
  console.error(`Transcript not found: ${transcriptPath}`)
  process.exit(1)
}

const whisperSegments = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'))
if (!Array.isArray(whisperSegments) || whisperSegments.length === 0) {
  console.error('Transcript JSON is empty or invalid.')
  process.exit(1)
}

const scriptText = loadScriptText(scriptPath)
const scriptTokens = tokenizeScript(scriptText)
if (scriptTokens.length === 0) {
  console.error('No usable script tokens found after normalization.')
  process.exit(1)
}

const whisperTokens = tokenizeWhisper(whisperSegments)
if (whisperTokens.length === 0) {
  console.error('No usable whisper tokens found in transcript.')
  process.exit(1)
}

const matches = lcsMatch(scriptTokens, whisperTokens)
const aligned = buildAlignedTranscript(scriptTokens, whisperTokens, matches)

fs.writeFileSync(transcriptPath, JSON.stringify(aligned, null, 2))

console.log(`Aligned transcript saved: ${relative(transcriptPath)}`)
console.log(`Script tokens: ${scriptTokens.length}`)
console.log(`Whisper tokens: ${whisperTokens.length}`)
console.log(`Anchor matches: ${matches.length}`)

function loadScriptText(inputPath) {
  const resolved = path.resolve(inputPath)
  if (!fs.existsSync(resolved)) {
    console.error(`Script file not found: ${resolved}`)
    process.exit(1)
  }

  const ext = path.extname(resolved).toLowerCase()
  let raw = ''

  if (ext === '.rtf') {
    const result = spawnSync('textutil', ['-convert', 'txt', '-stdout', resolved], { encoding: 'utf8' })
    if (result.status !== 0) {
      console.error(result.stderr || 'Failed to convert RTF with textutil.')
      process.exit(result.status || 1)
    }
    raw = result.stdout
  } else {
    raw = fs.readFileSync(resolved, 'utf8')
  }

  return raw
    .replace(/^\d{4}-\d{2}-\d{2}[^\n]*textutil[^\n]*\n/gm, '')
    .replace(/\u2022/g, ' ')
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/[—–]/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenizeScript(text) {
  return text
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean)
    .map(token => ({
      raw: token,
      norm: normalizeToken(token),
    }))
    .filter(token => token.norm.length > 0)
}

function tokenizeWhisper(segments) {
  return segments
    .map(segment => ({
      raw: String(segment?.text ?? '').trim(),
      time: Number(segment?.time ?? 0),
    }))
    .filter(segment => segment.raw.length > 0)
    .map(segment => ({
      ...segment,
      norm: normalizeToken(segment.raw),
    }))
    .filter(segment => segment.norm.length > 0)
}

function normalizeToken(token) {
  return token
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

function lcsMatch(script, whisper) {
  const n = script.length
  const m = whisper.length
  const width = m + 1
  const dp = new Uint16Array((n + 1) * (m + 1))

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      const idx = i * width + j
      if (script[i].norm === whisper[j].norm) {
        dp[idx] = dp[(i + 1) * width + (j + 1)] + 1
      } else {
        const down = dp[(i + 1) * width + j]
        const right = dp[i * width + (j + 1)]
        dp[idx] = down >= right ? down : right
      }
    }
  }

  const pairs = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (script[i].norm === whisper[j].norm) {
      pairs.push([i, j])
      i += 1
      j += 1
      continue
    }

    const down = dp[(i + 1) * width + j]
    const right = dp[i * width + (j + 1)]
    if (down >= right) i += 1
    else j += 1
  }

  return pairs
}

function buildAlignedTranscript(script, whisper, matches) {
  const n = script.length
  const timeByScriptIndex = new Array(n).fill(null)

  for (const [scriptIndex, whisperIndex] of matches) {
    timeByScriptIndex[scriptIndex] = whisper[whisperIndex].time
  }

  const whisperTimes = whisper.map(token => token.time).filter(Number.isFinite)
  const medianStep = estimateMedianStep(whisperTimes)
  const fallbackStart = whisperTimes[0] ?? 0

  if (matches.length === 0) {
    for (let i = 0; i < n; i += 1) {
      timeByScriptIndex[i] = fallbackStart + i * medianStep
    }
  } else {
    const [firstScriptIndex] = matches[0]
    const firstTime = timeByScriptIndex[firstScriptIndex] ?? fallbackStart

    for (let i = firstScriptIndex - 1; i >= 0; i -= 1) {
      timeByScriptIndex[i] = Math.max(0, firstTime - (firstScriptIndex - i) * medianStep)
    }

    for (let pair = 0; pair < matches.length - 1; pair += 1) {
      const [leftScript] = matches[pair]
      const [rightScript] = matches[pair + 1]
      const leftTime = timeByScriptIndex[leftScript]
      const rightTime = timeByScriptIndex[rightScript]

      if (rightScript - leftScript <= 1) continue

      for (let i = leftScript + 1; i < rightScript; i += 1) {
        const ratio = (i - leftScript) / (rightScript - leftScript)
        timeByScriptIndex[i] = leftTime + (rightTime - leftTime) * ratio
      }
    }

    const [lastScript] = matches[matches.length - 1]
    const lastTime = timeByScriptIndex[lastScript] ?? (whisperTimes[whisperTimes.length - 1] ?? fallbackStart)
    for (let i = lastScript + 1; i < n; i += 1) {
      timeByScriptIndex[i] = lastTime + (i - lastScript) * medianStep
    }
  }

  const out = []
  let previousTime = 0
  for (let i = 0; i < n; i += 1) {
    let t = Number(timeByScriptIndex[i] ?? previousTime)
    if (!Number.isFinite(t)) t = previousTime
    if (t < previousTime) t = previousTime
    previousTime = t

    out.push({
      time: roundToHundredth(t),
      text: script[i].raw,
    })
  }

  return out
}

function estimateMedianStep(times) {
  const deltas = []
  for (let i = 1; i < times.length; i += 1) {
    const delta = times[i] - times[i - 1]
    if (Number.isFinite(delta) && delta > 0) deltas.push(delta)
  }
  if (deltas.length === 0) return 0.28
  deltas.sort((a, b) => a - b)
  return deltas[Math.floor(deltas.length / 2)]
}

function roundToHundredth(value) {
  return Math.round(value * 100) / 100
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

function relative(filePath) {
  return path.relative(projectRoot, filePath) || '.'
}
