'use strict';

import puppeteer from 'puppeteer';
import DataCenter from './DataCenter'
import AdTypes from './AdType'
import RenderResult from './RenderResult'

class AdPerformance {

    constructor(config={}) {        
        this.config = config;        
    }
    run() {
        // TODO check es6 how to assign object value
        const {urlArray, numbers} = this.config;
        // const numbers = this.config.numbers;
        const dataCenter = new DataCenter();

        puppeteer.launch().then(async browser => {
            for (var url of urlArray) {
                dataCenter.addUrls(url);

                console.log('Start rendering page: ' + url);

                for (var i = 0; i < numbers; i++) {
                    console.log('Loading times: ' + (i + 1));
                    let browserPage = await browser.newPage();
                    await browserPage.setViewport({
                        width: 1201,
                        height: 3000
                    });
                    await browserPage.goto(url, {
                        waitUntil: 'load'
                    });

                    let adTypes = AdTypes.getInstance().getAdTypes();
                    for (var type of adTypes) {
                        await this.collectDataForSpecificAd(browserPage, type, dataCenter, url);
                    }
                }
            }
            await browser.close();
        }).then(() => {            
            new RenderResult(dataCenter.calculateData(), this.config);
        });        
    }

    async collectDataForSpecificAd(browserPage, type, dataCenter, url) {
        try {
            const adDataObject = await browserPage.$$eval('div[data-mod="' + type + '"]', divs => {
                return divs.map((div) => {
                    return {
                        id: div.getAttribute('id'),
                        dest: div.getAttribute('data-dest'),
                        size: div.getAttribute('data-size'),
                        position: div.getAttribute('data-pos'),
                        generatetime: Number(div.getAttribute('data-generatetime')),
                        setuptime: Number(div.getAttribute('data-setuptime')),
                        rendertime: Number(div.getAttribute('data-rendertime')),
                        renderadcontentstart: Number(div.getAttribute('data-renderadcontentstart')),
                        renderadcontentend: Number(div.getAttribute('data-renderadcontentend'))
                    };
                });
            });

            await dataCenter.pushData(url, type, adDataObject);
        } catch (e) {
            console.log(e);
        }
    }
}

export default AdPerformance;