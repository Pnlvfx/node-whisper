import { spawn } from 'node:child_process';
import { AudioToTextOptions, OutputFormat } from './types/options.js';
import path from 'node:path';
import { AudioToTextFiles, Proto } from './types/output.js';
import { promises as fs } from 'node:fs';
//READ TODO ON THE OUTPUT.TS FILE

type OutputTypeMap = {
  txt: Proto;
  vtt: Proto;
  srt: Proto;
  tsv: Proto;
  json: Proto;
};

const whisper = (audio: string, options?: AudioToTextOptions) => {
  return new Promise<AudioToTextOptions['output_format'] extends 'all' ? AudioToTextFiles : { [K in AudioToTextOptions['output_format']]: Proto }>(
    (resolve, reject) => {
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
        const outFormat = options?.output_format || 'all';
        if (outFormat === 'all') {
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
          const custom = `${folder}/${name}/${outFormat}`;
          resolve({
            [outFormat]: custom,
          });
        }
      });
    },
  );
};

const getProto = (key: OutputFormat, value: string): Proto => {
  return {
    file: value,
    getContent: async () => {
      const content = await fs.readFile(value);
      if (key === 'json') return JSON.parse(content.toString());
      return content.toString();
    },
  };
};

const getParams = (options?: AudioToTextOptions) => {
  const params = [];
  if (options) {
    for (const [k, value] of Object.entries(options)) {
      const key = k as keyof AudioToTextOptions;
      if (value === undefined) continue;
      if (typeof key === 'boolean') {
        const val = value ? 'True' : 'False';
        params.push(`--${key}`, val);
      } else {
        params.push(`--${key}`, value);
      }
    }
  }
  return params;
};

export default whisper;

const audio = path.join('media', 'audio.mp3');
const data = await whisper(audio, { output_format: 'srt' });
console.log(await data.json.getContent());
