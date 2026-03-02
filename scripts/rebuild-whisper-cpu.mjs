#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawnSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const whisperCppDir = path.join(projectRoot, 'node_modules', 'whisper-node', 'lib', 'whisper.cpp')

if (!fs.existsSync(whisperCppDir)) {
  console.error('whisper.cpp directory not found. Install dependencies first (npm install).')
  process.exit(1)
}

console.log('Rebuilding whisper.cpp in CPU-only mode (WHISPER_NO_METAL=1)...')

runMake(['clean'])
runMake(['-j'], { WHISPER_NO_METAL: '1' })

const mainBinary = path.join(whisperCppDir, 'main')
if (!fs.existsSync(mainBinary)) {
  console.error('Rebuild completed but main binary was not found.')
  process.exit(1)
}

console.log('Done. whisper.cpp main binary rebuilt with Metal disabled.')

function runMake(makeArgs, extraEnv = {}) {
  const result = spawnSync('make', makeArgs, {
    cwd: whisperCppDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...extraEnv,
    },
  })

  if (result.status !== 0) {
    console.error(`make ${makeArgs.join(' ')} failed.`)
    process.exit(result.status || 1)
  }
}
