#!/usr/bin/env node
import { whisper } from 'whisper-node'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const args = process.argv.slice(2)
const projectArgIndex = args.indexOf('--project')
const projectId =
  projectArgIndex >= 0 && args[projectArgIndex + 1]
    ? normalizeProjectId(args[projectArgIndex + 1])
    : 'aa'

const audioCandidates = [
  path.join(projectRoot, 'public', 'audio', 'projects', projectId, 'transcription', 'audio_16k.wav'),
  path.join(projectRoot, 'public', 'audio', 'decision-point', 'transcription', 'audio_16k.wav'),
  path.join(projectRoot, 'public', 'audio', 'audio_16k.wav'),
]
const audioPath = audioCandidates.find(candidate => fs.existsSync(candidate))
const outputPath = path.join(projectRoot, 'public', 'audio', 'projects', projectId, 'transcription', 'transcript.json')

if (!audioPath) {
  console.error('Error: audio file not found. Expected one of:')
  for (const candidate of audioCandidates) {
    console.error(`  - ${candidate}`)
  }
  process.exit(1)
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })

console.log('Transcribing:', audioPath)

try {
  const transcript = await whisper(audioPath, {
    modelName: 'base.en',
    whisperOptions: {
      language: 'en',
      word_timestamps: true,
    }
  })
  if (!Array.isArray(transcript)) {
    throw new Error('Whisper returned an unexpected response.')
  }

  // Transform to teleprompter format
  const teleprompterText = transcript.map((segment) => ({
    time: parseTimestamp(segment.start),
    text: segment.speech,
  }))

  fs.writeFileSync(outputPath, JSON.stringify(teleprompterText, null, 2))
  console.log('Saved transcript to:', outputPath)
  console.log('Segments:', teleprompterText.length)
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
}

function parseTimestamp(timestamp) {
  const parts = timestamp.split(':')
  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  const seconds = parseFloat(parts[2])
  return hours * 3600 + minutes * 60 + seconds
}

function normalizeProjectId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
