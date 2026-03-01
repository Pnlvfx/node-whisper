import { nodeConfigs } from '@goatjs/node-eslint';
import { defineConfig, globalIgnores } from '@eslint/config-helpers';

export default defineConfig([globalIgnores(['dist', '.yarn', 'coverage']), ...nodeConfigs({ tsconfigRootDir: import.meta.dirname })]);
