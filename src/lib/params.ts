import { AudioToTextOptions } from '../types/options.js';

export const getParams = (options?: AudioToTextOptions) => {
  const params: string[] = [];
  if (options) {
    for (const [k, value] of Object.entries(options)) {
      const key = k as keyof AudioToTextOptions;
      if (value === undefined) continue;
      if (typeof value === 'boolean') {
        params.push(`--${key}`, value ? 'True' : 'False');
      } else {
        params.push(`--${key}`, value);
      }
    }
  }
  return params;
};
