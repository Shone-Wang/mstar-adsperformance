'use strict';

import AdTypes from './AdType'

class DataCenter {
	constructor () {
		this.pageUrls = {};
		this.resultUrls = {};
	}
	addUrls (url) {
		if (typeof this.pageUrls[url] === 'undefined') {
			this.pageUrls[url] = {}
			let adTypes = AdTypes.getInstance().getAdTypes();
			for (var type of adTypes) {
				this.pageUrls[url][type] = [];
			}
		}
	}
	pushData (url, type, dataObject) {
		if (typeof this.pageUrls[url] === 'undefined') {
			return;
		}

		if (Array.isArray(this.pageUrls[url][type]) === false ) {
			return;
		}

		this.pageUrls[url][type].push(dataObject);
	}
	calculateData () {
		Object.keys(this.pageUrls).forEach((key) => {
			let obj = this.pageUrls[key];
			let adTypes = AdTypes.getInstance().getAdTypes();
			this.resultUrls[key] = {};
			for (let type of adTypes) {
				let urlResultByAdType = this.calculateDataForSpecificUrl(obj, type);					
				this.resultUrls[key][type] = urlResultByAdType;
			}			
		});

		return this.resultUrls;
	}
	calculateDataForSpecificUrl (page, type) {		
		if (page[type] === null || typeof page[type] === 'undefined') {
			return;
		}

		let adArray = page[type];
		let resultArray = [];
		let len = adArray.length;
		if (len === 0) {
			return;
		}

		resultArray = adArray[0];

		for (var i = 1; i < len; i++) {			
			for (var j = 0; j < adArray[i].length; j++) {
				resultArray[j] = this.assignObjectValue (resultArray[j], adArray[i][j]);
			}
		}

		resultArray.map((itemAd)=>{
			itemAd.generatetime = (itemAd.generatetime/len).toFixed(3);
			itemAd.setuptime = (itemAd.setuptime/len).toFixed(3);
			itemAd.rendertime = (itemAd.rendertime/len).toFixed(3);
			itemAd.renderadcontentstart = (itemAd.renderadcontentstart/len).toFixed(3);
			itemAd.renderadcontentend = (itemAd.renderadcontentend/len).toFixed(3);
		})
		
		return resultArray;		
	}
	assignObjectValue(targetObj, newObj) {		
        // TODO make sure the instance will be order
        if(targetObj.dest === newObj.dest) {
        	targetObj.generatetime += newObj.generatetime;
        	targetObj.setuptime += newObj.setuptime;
        	targetObj.rendertime += newObj.rendertime;
        	targetObj.renderadcontentstart += newObj.renderadcontentstart;
        	targetObj.renderadcontentend += newObj.renderadcontentend;
        } else {
        	console.log("Ad object value is not match, check page source with Shone");
        }

        return targetObj;
	}

}

export default DataCenter;