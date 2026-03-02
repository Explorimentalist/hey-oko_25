Deprecated location

This folder was an earlier single-project layout.

Use the modular layout instead:

- `public/audio/raw/<ProjectName>.wav`
- `public/audio/projects/<project-id>/playback/audio.mp3`
- `public/audio/projects/<project-id>/transcription/audio_16k.wav`
- `public/audio/projects/<project-id>/transcription/transcript.json`

Process files with:

- `npm run audio:process` (all WAV files in `public/audio/raw`)
- `npm run audio:process -- --project aa` (single project by id)
