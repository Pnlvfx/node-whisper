/* eslint-disable no-unused-vars */
import { spawn } from 'node:child_process';
import { AudioToTextOptions, OutputFormat } from './types/options.js';
import path from 'node:path';
import { AudioToTextFiles, Proto } from './types/output.js';
import { getProto } from './lib/proto.js';
import { getParams } from './lib/params.js';

export type WhisperOptions<T extends OutputFormat | undefined> = AudioToTextOptions & { output_format?: T };

// Function overload for when there are options, but the output_format
function whisper<T extends undefined>(audio: string, options: WhisperOptions<T>): Promise<AudioToTextFiles>;

// Function overload for when output_format is provided
function whisper<T extends OutputFormat>(
  audio: string,
  options: WhisperOptions<T>,
): Promise<T extends 'all' ? AudioToTextFiles : { [K in T]: Proto }>;

// Function overload for when options are not provided
function whisper(audio: string): Promise<AudioToTextFiles>;

function whisper<T extends OutputFormat>(audio: string, options?: WhisperOptions<T>): Promise<AudioToTextFiles | { [K in T]: Proto }> {
  return new Promise((resolve, reject) => {
    const params = getParams(options);
    params.unshift(audio);
    if (options?.verbose) {
      console.log('command:', params);
    }
    const whisper = spawn('whisper', params);
    whisper.on('error', (error) => {
      reject(error);
    });

    whisper.stdout.on('data', (data) => {
      if (options?.verbose) {
        console.log('stdout:', data.toString());
      }
    });

    let error = '';

    whisper.stderr.on('data', (data) => {
      if (options?.verbose) {
        console.log('stderr:', data.toString());
      }
      error += data;
    });

    whisper.on('close', async (code) => {
      if (code === 1) return reject(error.toString());
      const folder = options?.output_dir || '.';
      const name = path.basename(audio).replace(path.extname(audio), '');
      if (!options?.output_format || options.output_format === 'all') {
        const json = `${folder}/${name}.json`;
        const tsv = `${folder}/${name}.tsv`;
        const srt = `${folder}/${name}.srt`;
        const vtt = `${folder}/${name}.vtt`;
        const txt = `${folder}/${name}.txt`;
        resolve({
          json: getProto('json', json),
          tsv: getProto('tsv', tsv),
          srt: getProto('srt', srt),
          vtt: getProto('vtt', vtt),
          txt: getProto('txt', txt),
        });
      } else {
        const custom = `${folder}/${name}.${options.output_format}`;
        resolve({
          [options.output_format]: getProto(options.output_format, custom),
        } as unknown as { [K in T]: Proto });
      }
    });
  });
}

export default whisper;

// //TEST
// const audio = path.join('media', 'audio.mp3');
// const data = await whisper(audio, { fp16: true });
// console.log(await data.srt.getContent());
