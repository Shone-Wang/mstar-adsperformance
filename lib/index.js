#!/usr/bin/env node
'use strict';

import AdPerformance from './AdPerformance';
import PaseCommands from './ParseCommands';

process.setMaxListeners(Infinity);

const parseCommands = new PaseCommands();
const config = parseCommands.getConfig();

const myTest = new AdPerformance(config);
myTest.run();
