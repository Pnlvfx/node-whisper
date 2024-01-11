import { describe, it } from '@jest/globals';
import path from 'node:path';
import whisper from '../src/index';
const getFile = (file: string) => path.join(process.cwd(), 'media', file);

describe('whisper function', () => {
  it(
    'should transcribe audio successfully',
    () => {
      whisper(getFile('audio.mp3'), { model: 'base', output_dir: path.join(process.cwd(), 'media') });
    },
    2 * 60 * 1000,
  );
});
