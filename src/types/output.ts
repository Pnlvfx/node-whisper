import type { OutputFormat } from './options.js';

export interface Proto<K> {
  file: string;
  getContent: () => Promise<'json' extends K ? AudioToTextJSON : string>;
}

export type AudioToTextFilesrr = {
  [format in OutputFormat]: Proto<format>;
};

export type AudioToTextFiles = Omit<AudioToTextFilesrr, 'all'>;

export interface AudioToTextJSON {
  text: string;
  segments: Segment[];
  language: string;
}

export interface Segment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}
