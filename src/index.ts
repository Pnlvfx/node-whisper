import type { AudioToTextOptions, OutputFormat } from './types/options.js';
import type { AudioToText, AudioToTextFiles, Proto } from './types/output.js';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { getProto } from './lib/proto.js';
import { getParams } from './lib/params.js';

export type WhisperOptions<T extends OutputFormat | undefined> = AudioToTextOptions & { output_format?: T };

// Function overload for when output_format is provided
function whisper<T extends OutputFormat>(
  audio: string,
  options: WhisperOptions<T>,
): Promise<T extends 'all' ? AudioToTextFiles : { [K in T]: Proto }>;

// Function overload for when there are options, but the output_format is not provided
function whisper<T extends undefined>(audio: string, options: WhisperOptions<T>): Promise<AudioToTextFiles>;

// Function overload for when options are not provided
function whisper(audio: string): Promise<AudioToTextFiles>;

function whisper<T extends OutputFormat>(audio: string, options?: WhisperOptions<T>): Promise<AudioToTextFiles | { [K in T]: Proto }> {
  return new Promise((resolve, reject) => {
    const params = [audio, ...getParams(options)];
    if (options?.verbose) {
      // eslint-disable-next-line no-console
      console.log('command:', params);
    }
    const whisper = spawn('whisper', params);

    whisper.on('error', (error) => reject(error));

    whisper.stdout.on('data', (data) => {
      if (options?.verbose) {
        // eslint-disable-next-line no-console
        console.log('stdout:', data.toString());
      }
    });

    let error = '';

    whisper.stderr.on('data', (data) => {
      if (options?.verbose) {
        // eslint-disable-next-line no-console
        console.log('stderr:', data.toString());
      }
      error += data;
    });

    whisper.on('close', (code) => {
      if (code === null || code > 0) return reject(`Whisper error: ${error.toString()}, CODE: ${code}`);
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
        } as { [K in T]: Proto });
      }
    });
  });
}

whisper.readAllFiles = async (input: AudioToTextFiles) => {
  const output: Partial<AudioToText> = {};
  for (const [k, value] of Object.entries(input)) {
    const key = k as keyof AudioToTextFiles;
    const content = await fs.readFile(value.file, { encoding: 'utf8' });
    output[key] = key === 'json' ? JSON.parse(content) : content;
  }
  return output as AudioToText;
};

export default whisper;
