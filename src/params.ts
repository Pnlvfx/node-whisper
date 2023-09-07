import { AudioToTextOptions } from './types/options.js';

export const getParams = (options?: AudioToTextOptions) => {
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
