'use strict';

import yargs from 'yargs';
import fs from 'fs';
import path from 'path';

class ParseCommands {

	constructor () {		
		this.config = {
            urlArray: [],
            browser: 'chrome',
            numbers: 3,
            outfile: 'adperformance.html'
        } 
		this.initYargsOptions();
	}

	initYargsOptions () {
		let parsed = yargs
			.env('mstarads')
			.option('browser', {
				alias: 'b',
				default: 'chrome',
				describe: 'Choose which Browser to use when you test.',
				choices: ['chrome', 'firefox']				
			})
			.option('numbers', {
				alias: 'n',
				default: 5,
				describe: 'How many times you want to test each page'
			})
			.option('outfile', {
				alias: 'o',
				default: 'adperformance.html',
				describe: 'Output files for result'
			});

		let argv = parsed.argv;
		if (argv.browser !== null) {
			this.config.browser = argv.browser;
		}

		if (argv.numbers !== null) {
			this.config.numbers = argv.numbers;
		}

		if (argv.outfile !== null) {
			this.config.outfile = argv.outfile;
		}

		this.config.urlArray = this.getURLs(argv._);		
	}

	getConfig () {
		return this.config;
	}

	getURLs(urls) {
		const allUrls = [];

		for (let url of urls) {
			if (url.startsWith('http')) {
				allUrls.push(url);
			} else {
				const filePath = path.resolve(url);
				try {
					const lines = fs
						.readFileSync(filePath)
						.toString()
						.split('\n');
					for (let line of lines) {
						if (line.trim().length > 0) {
							let lineArray = line.split(' ', 2);
							let url = lineArray[0].trim();
							if (url) {
								allUrls.push(url);
							}
						}
					}
				} catch (e) {
					if (e.code === 'ENOENT') {
						throw new Error(`Couldn't find url file at ${filePath}`);
					}
					throw e;
				}
			}
		}
		return allUrls;
	}
}

export default ParseCommands;