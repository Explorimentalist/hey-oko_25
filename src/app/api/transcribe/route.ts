import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { normalizeProjectId } from '@/lib/decisionPointAudio'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawProject = searchParams.get('project') || 'aa'
    const projectId = normalizeProjectId(rawProject)

    const transcriptCandidates = [
      path.join(process.cwd(), 'public', 'audio', 'projects', projectId, 'transcription', 'transcript.json'),
      path.join(process.cwd(), 'public', 'audio', 'decision-point', 'transcription', 'transcript.json'),
      path.join(process.cwd(), 'public', 'audio', 'transcript.json'),
    ]
    const transcriptPath = transcriptCandidates.find(candidate => fs.existsSync(candidate))

    if (!transcriptPath) {
      return NextResponse.json(
        { error: 'Transcript not found. Run: node scripts/transcribe.mjs' },
        { status: 404 }
      )
    }

    const transcript = JSON.parse(fs.readFileSync(transcriptPath, 'utf-8'))
    return NextResponse.json({ transcript })
  } catch (error) {
    console.error('Error reading transcript:', error)
    return NextResponse.json(
      { error: 'Failed to read transcript' },
      { status: 500 }
    )
  }
}
