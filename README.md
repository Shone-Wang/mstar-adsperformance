# Morningstar Ads Performance

[Website](https://www.morningstar.com)

## Welcome to morningstar ads performance tool!

**mstar-adsperformance is a *complete web performance tool* that helps you measure the ads performance of morningstar website.**

 ## Lets try it out

 ```bash
npm install mstar-adsperformance -g
mstar-ads ${url} -n=${nubmers} -o="${output result file path}"
 ```

 Or clone the repo and test the latest changes:

 ```bash
 $ git clone https://github.com/Shone-Wang/mstar-adsperformance.git
 $ cd mstar-adsperformance
 $ npm install
 $ npm run build
 $ node dist/index.js -n=5 http://www.morningstar.com http://www.morningstar.com/markets.html -o="${your file path}"
 ```