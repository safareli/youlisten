#!/usr/bin/env node

/*
 * youlisten
 * https://github.com/safareli/youlisten
 *
 * Copyright (c) 2014 Irakli Safareli
 * Licensed under the MIT license.
 */
var path      = require('path');
require('coffee-script/register');
var youlisten = require('../lib/youlisten');
var t         = require('../lib/t');

var dir, url = process.argv[2];

if (url.indexOf('list=')) {
  dir = process.argv[3] || 'downloads';
  youlisten.downloadPlaylist(url, path.join(process.cwd(), dir), function(error, location) {
    console.log((t.margin(' ', 4)) + ' LOCATION: ' + location);
    return process.exit();
  });
} else if (url.indexOf('v=')) {
  dir = (process.argv[3] ? process.argv[3] : 'downloads/_videos');
  youlisten.downloadVideo(url, path.join(process.cwd(), dir), function(error, location) {
    if (error) {
      console.error(error);
    } else {
      console.log((t.margin(' ', 4)) + ' LOCATION: ' + location);
    }
    return process.exit();
  });
} else {
  console.log('$ youlisten <id> [directory]');
  console.log('# id         video or playlist ID');
  console.log('# directory  download location');
}
