/* eslint-disable no-console */
import { describe, it } from '@jest/globals';
import path from 'node:path';
import whisper from '../src/whisper.js';

describe('whisper function', () => {
  it(
    'should transcribe audio successfully',
    async () => {
      const content = await whisper('media/audio.mp3', { model: 'base', output_dir: path.join(process.cwd(), 'media') });
      const data = await whisper.readAllFiles(content);
      const srt = await content.srt.getContent();
      const json = await content.json.getContent();
      console.log({ data });
      console.log({ srt });
      console.log({ json });
    },
    10 * 60 * 1000,
  );
});
