import path from 'node:path';
import whisper from './index.js';

// //TEST
const audio = path.join('media', 'audio.mp3');
const data = await whisper(audio, { fp16: true });
console.log(await data.srt.getContent());
