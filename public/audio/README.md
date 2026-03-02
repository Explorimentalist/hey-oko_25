Audio Pipeline (Modular)

Folder structure

- `raw/`: place source WAV files here, one per project (example: `AA.wav`).
- `projects/<project-id>/playback/audio.mp3`: generated compressed playback file.
- `projects/<project-id>/transcription/audio_16k.wav`: generated 16 kHz WAV for Whisper.
- `projects/<project-id>/transcription/transcript.json`: generated teleprompter transcript.

How project ids are created

- The script converts source file names to ids by lowercasing and replacing non-alphanumeric characters with `-`.
- Example: `AA.wav` -> `aa`, `Flight Global.wav` -> `flight-global`.

Commands

1. Process all WAV files in `raw/`:
   - `npm run audio:process`
2. Process one project:
   - `npm run audio:process -- --project aa`
3. Regenerate transcript only for one project:
   - `npm run audio:transcribe -- --project aa`
4. Watch for file drops/updates and process automatically:
   - `npm run audio:watch`
   - Optional: `npm run audio:watch -- --skip-transcription`
   - Optional: `npm run audio:watch -- --no-initial`
   - Optional: `npm run audio:watch -- --interval 800`
5. Rebuild whisper.cpp in CPU-only mode (fixes Metal-related crashes on some macOS setups):
   - `npm run audio:whisper:rebuild-cpu`

Notes

- `DecisionPointPlayer` playback should point to `projects/<project-id>/playback/audio.mp3`.
- Transcript fetch should use `projects/<project-id>/transcription/transcript.json` or `/api/transcribe?project=<project-id>`.
- Project IDs are inferred from WAV filenames in `raw/`.
- If your filename is `AA.wav`, outputs are generated under `projects/aa/`.
- `audio:watch` uses polling and debouncing, so it is stable across environments where native file watching is limited.
