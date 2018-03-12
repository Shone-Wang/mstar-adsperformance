'use strict';

import fs from 'fs';
import cheerio from 'cheerio';
import handlebars from 'handlebars';
import AdTypes from './AdType'
import path from 'path';

class RenderResult {
	constructor (data, config) {
		this.data = data;
		this.config = config;
		this.render();
	}

	render() {
		let source = fs.readFileSync(path.join(__dirname, '/html/result.html'), 'utf8');
		const $ = cheerio.load(source);

		this.addMDSStyle($);

		// foreach Url
		Object.keys(this.data).forEach((key) => {
			this.addPageHead($, key);
			this.addPageTables($, this.data[key]);
		});

		this.writeResult($);
		return this;
	}
	addMDSStyle($) {
		$('html >head').append(`<link rel="stylesheet" type="text/css" href="${process.env.INIT_CWD}/dist/css/mds_doc_library.css">`);
	}

	addPageHead($, title) {
		$('.col-md-12').append(`<section class="title">${title}</section>`);
	}

	addTableHead($, title) {
		$('.col-md-12').append(`<h1 class="title">${title}</h1>`);
	}

	addPageTables($, dataObject) {
		let tableSource = fs.readFileSync(path.join(__dirname, '/html/table.html'), 'utf8');
		this.registerHandlebarsHelper();
		let template = handlebars.compile(tableSource);

		let adTypes = AdTypes.getInstance().getAdTypes();
		for(let type of adTypes) {
			let data = dataObject[type];
			let resultTableHtml = template(data);
			this.addTableHead($, type.toUpperCase() + ' Result')
			$('.col-md-12').append(resultTableHtml);			
		}
	}

	registerHandlebarsHelper() {
		handlebars.registerHelper('isNumber', function (value, options) {
			if (typeof value === 'number') {
				return options.fn(this);
			} else if (typeof value === 'string' && (value.match(/^-{0,1}\d+$/) || value.match(/^\d+\.\d+$/))) {
				return options.fn(this);
			}
			return options.inverse(this);
		});
	}
	writeResult($) {
		var outFileName = process.env.HOME + '/Documents/performance.html';
		if (this.config.outfile !== null && this.config.outfile !== '') {
			outFileName = path.resolve(this.config.outfile);
		}
		fs.writeFile(outFileName, $.html(), 'utf8', function (err) {
			if (err) {
				console.log(err);
				throw err
			}
		});
	}
}

export default RenderResult;