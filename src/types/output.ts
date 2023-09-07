/* eslint-disable no-unused-vars */
import { OutputFormat } from './options.js';

export interface Proto {
  file: string;
  getContent: () => Promise<string>;
}

export type AudioToTextFiles = {
  // todo: implement a way to recognize which format is available on the output and remove undefined
  [format in OutputFormat]: Proto;
};

export interface AudioToText extends Omit<AudioToTextFiles, 'json'> {
  json: AudioToTextJSON;
}

export interface AudioToTextJSON {
  text: string;
  segments: Segment[];
}

interface Segment {
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
