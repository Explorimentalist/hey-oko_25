export function getDecisionPointAudioUrls(projectId: string) {
  const safeProjectId = normalizeProjectId(projectId)
  return {
    playbackSrc: `/audio/projects/${safeProjectId}/playback/audio.mp3`,
    transcriptUrl: `/audio/projects/${safeProjectId}/transcription/transcript.json`,
  }
}

export function normalizeProjectId(projectId: string) {
  return projectId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
