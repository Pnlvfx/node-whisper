/* eslint-disable no-unused-vars */
import { OutputFormat } from './options.js';

export interface Proto {
  file: string;
  getContent: () => Promise<string>;
}

export type AudioToTextFilesrr = {
  [format in OutputFormat]: Proto;
};

export type AudioToTextFiles = Omit<AudioToTextFilesrr, 'all'>;

export interface AudioToText extends Omit<AudioToTextFiles, 'json'> {
  json: AudioToTextJSON;
}

export interface AudioToTextJSON {
  text: string;
  segments: Segment[];
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
