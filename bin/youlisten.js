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

var dir, id = process.argv[2];

if (id.length > 11) {
  dir = process.argv[3] || 'downloads';
  youlisten.downloadPlaylist(id, path.join(process.cwd(), dir), function(error, location) {
    console.log((t.margin(' ', 4)) + ' LOCATION: ' + location);
    return process.exit();
  });
} else if (id.length === 11) {
  dir = (process.argv[3] ? process.argv[3] : 'downloads/_videos');
  youlisten.downloadVideo(id, path.join(process.cwd(), dir), function(error, location) {
    if (error) {
      console.error(error);
    } else {
      console.log((t.margin(' ', 4)) + ' LOCATION: ' + location);
    }
    return process.exit();
  });
} else {
  console.log('# arg1 is required');
  console.log('# arg1 = video/playlist ID');
  console.log('# arg2 = downlaod location ');
  console.log('$ youlisten arg1 [arg2]');
}
