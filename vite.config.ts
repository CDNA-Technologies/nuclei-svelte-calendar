import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		target: ['es2015', 'safari11']
	},
	plugins: [sveltekit()],
	test: {
		mockReset: true,
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.test.{js,ts}'],
		setupFiles: 'src/setupTests.ts'
	}
};

export default config;
