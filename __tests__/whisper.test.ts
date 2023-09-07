import { describe, it } from '@jest/globals';
import path from 'node:path';
import whisper from '../src/index';
const getFile = (file: string) => path.join(process.cwd(), 'media', file);

describe('concat function', () => {
  it(
    'should transcribe audio successfully',
    async () => {
      await whisper(getFile('audio.mp3'), { output_dir: path.join(process.cwd(), 'media') });
    },
    2 * 60 * 1000,
  );
});
