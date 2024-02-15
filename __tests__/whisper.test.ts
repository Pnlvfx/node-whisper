import { describe, it } from '@jest/globals';
import path from 'node:path';
import whisper from '../src/index';
const getFile = (file: string) => path.join(process.cwd(), 'media', file);

describe('whisper function', () => {
  it(
    'should transcribe audio successfully',
    async () => {
      const content = await whisper(getFile('audio.mp3'), { model: 'base', output_dir: path.join(process.cwd(), 'media') });
      const data = await whisper.readAllFiles(content);
      const srt = await content.srt.getContent();
      const json = await content.json.getContent();
      // eslint-disable-next-line no-console
      console.log({ data });
      // eslint-disable-next-line no-console
      console.log({ srt });
      // eslint-disable-next-line no-console
      console.log({ json });
    },
    10 * 60 * 1000,
  );
});
