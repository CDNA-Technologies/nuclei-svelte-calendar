// import adapter from '@sveltejs/adapter-auto';
import node from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: node(),
		alias: {
			$calendar: 'src/routes/'
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
