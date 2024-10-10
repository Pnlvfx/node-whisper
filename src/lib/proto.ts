import type { AllOutputFormats } from '../types/options.js';
import type { Proto } from '../types/output.js';
import fs from 'node:fs/promises';

export const getProto = <K extends AllOutputFormats>(key: K, value: string): Proto<K> => {
  return {
    file: value,
    getContent: async () => {
      const content = await fs.readFile(value, { encoding: 'utf8' });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (key === 'json') return JSON.parse(content);
      return content;
    },
  };
};
