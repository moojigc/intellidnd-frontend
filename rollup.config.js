import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import {
	terser
} from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import fs from 'fs';
const production = !process.env.ROLLUP_WATCH;
let VERSION = Date.now();

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});
			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

function writeVersion(args) {

	VERSION = Date.now();
	function _write() {
		const _files = fs.readdirSync('public/build');

		let indexHtml = fs.readFileSync('src/index.html', { encoding: 'utf-8' });
		indexHtml = indexHtml.replace(/{version}/g, VERSION);
		fs.writeFileSync('public/index.html', indexHtml, { encoding: 'utf-8' });

		for (const f of _files) {
			if (/bundle/.test(f) && !f.match(VERSION)) {
				fs.unlink('public/build/' + f, () => void 0);
			}
		}
	};

	return {
		name: 'write-version',
		generateBundle: _write,
		load: _write
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle_' + VERSION + '.js'
	},
	plugins: [
		!production && writeVersion(),
		svelte({
			preprocess: sveltePreprocess({
				sourceMap: !production
			}),
			compilerOptions: {
				hydratable: true,
				// enable run-time checks when not in production
				dev: !production,
				css: css => {
					css.write('public/bundle_' + VERSION + '.css');
				}
			},
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({
			output: 'bundle_' + VERSION + '.css'
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
	],
	watch: {
		clearScreen: false
	}
};