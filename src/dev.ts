import path from 'node:path';
import whisper from './index.js';

// //TEST
export const test = async () => {
  const audio = path.join('media', 'audio.mp3');
  const data = await whisper(audio, { output_format: 'all', output_dir: 'media' });
  console.log(await data.srt.getContent());
};

test();
