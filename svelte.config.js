import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: node(),
		version: {
			name: '1.2',
			pollInterval: 10000
		},
		paths: {
			base: ''
		}
	},
	package: {
		exports: (filepath) => {
			return filepath.endsWith('index.js');
		},
		files: (filepath) => {
			return filepath.indexOf('test') == -1 ? true : false;
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
