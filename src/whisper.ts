import type { AudioToTextOptions, AllOutputFormats, StringOutputFormat } from './types/options.js';
import type { AudioToTextFiles, AudioToTextJSON, Proto } from './types/output.js';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getProto } from './lib/proto.js';
import { getParams } from './lib/params.js';
import { languages } from './types/language.js';

type WhisperOptions<T extends AllOutputFormats | undefined> = AudioToTextOptions & { output_format?: T };

// Function overload for when there are options, but the output_format is not provided
function whisper<T extends undefined>(audio: string, options: WhisperOptions<T>): Promise<AudioToTextFiles>;

// Function overload for when output_format is provided
function whisper<T extends AllOutputFormats>(
  audio: string,
  options: WhisperOptions<T>,
): Promise<T extends 'all' ? AudioToTextFiles : { [K in T]: Proto<K> }>;

// Function overload for when options are not provided
function whisper(audio: string): Promise<AudioToTextFiles>;

function whisper<T extends AllOutputFormats>(audio: string, options: WhisperOptions<T> = {}): Promise<AudioToTextFiles | { [K in T]: Proto<K> }> {
  return new Promise((resolve, reject) => {
    const params = [audio, ...getParams(options)];
    if (options.verbose) {
      // eslint-disable-next-line no-console
      console.log('command:', params);
    }
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const whisper = spawn('whisper', params);

    whisper.on('error', reject);

    whisper.stdout.on('data', (data: Buffer) => {
      if (options.verbose) {
        // eslint-disable-next-line no-console
        console.log('stdout:', data.toString());
      }
    });

    let error = '';

    whisper.stderr.on('data', (data: Buffer) => {
      if (options.verbose) {
        // eslint-disable-next-line no-console
        console.log('stderr:', data.toString());
      }
      error += data.toString();
    });

    whisper.on('close', (code) => {
      if (options.verbose) {
        // eslint-disable-next-line no-console
        console.log('Whisper process exit with code:', code);
      }
      if (code === null || code > 0) {
        reject(new Error(`Whisper error: ${error.toString()}, CODE: ${code?.toString() ?? ''}`));
        return;
      }
      const folder = options.output_dir ?? '.';
      const name = path.basename(audio).replace(path.extname(audio), '');
      if (!options.output_format || options.output_format === 'all') {
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
        } as unknown as { [K in T]: Proto<K> });
      }
    });
  });
}

type ReadedAudio = Record<StringOutputFormat, string>;

whisper.languages = languages;
whisper.readAllFiles = async (input: AudioToTextFiles) => {
  const output: Partial<ReadedAudio & { json?: AudioToTextJSON }> = {};
  for (const [k, value] of Object.entries(input)) {
    const key = k as keyof typeof input;
    const content = await fs.readFile(value.file, { encoding: 'utf8' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    output[key] = key === 'json' ? JSON.parse(content) : content;
  }
  return output as ReadedAudio & { json: AudioToTextJSON };
};

export default whisper;

export type { Language } from './types/language.js';
export type { WhisperModel, OutputFormat } from './types/options.js';
