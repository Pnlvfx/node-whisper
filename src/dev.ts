import path from 'node:path';
import whisper from './index.js';

// //TEST
export const test = async () => {
  const audio = path.join('media', 'audio.mp3');
  const data = await whisper(audio, { fp16: true, output_format: 'all' });
  console.log(await data.srt.getContent());
};

test();
