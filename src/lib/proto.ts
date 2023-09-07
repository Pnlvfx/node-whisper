import { OutputFormat } from '../types/options.js';
import { Proto } from '../types/output.js';
import { promises as fs } from 'node:fs';

export const getProto = (key: OutputFormat, value: string): Proto => {
  return {
    file: value,
    getContent: async () => {
      const content = await fs.readFile(value);
      if (key === 'json') return JSON.parse(content.toString());
      return content.toString();
    },
  };
};
