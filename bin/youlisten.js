#!/usr/bin/env node

/*
 * youlisten
 * https://github.com/safareli/youlisten
 *
 * Copyright (c) 2014 Irakli Safareli
 * Licensed under the MIT license.
 */
require('coffee-script/register');
var path      = require('path');
var fs        = require('fs');
var youlisten = require('../lib/youlisten');
var t         = require('../lib/t');

function download (url,dir,done){
 if (url.indexOf('list=') > -1) {
    dir = dir || 'downloads';
    youlisten.downloadPlaylist(url, path.join(process.cwd(), dir), function(error, location) {
      console.log((t.margin(' ', 4)) + ' LOCATION: ' + location);
      if(done) done();
      else process.exit();
    });
  } else if (url.indexOf('v=') > -1) {
    dir = dir || 'downloads/_videos';
    youlisten.downloadVideo(url, path.join(process.cwd(), dir), function(error, location) {
      if (error) {
        console.error(error);
      } else {
        console.log((t.margin(' ', 4)) + ' LOCATION: ' + location);
      }
      if(done) done();
      else process.exit();
    });
  } else if(fs.existsSync(path.join(process.cwd(),process.argv[2],'listen.json'))){
    var links = JSON.parse(fs.readFileSync(path.join(process.cwd(),process.argv[2],'listen.json')));
    download(links.shift(),process.argv[2],function next() {
      if (links.length)
        download(links.shift(),process.argv[2],next);
    })
  }else {
    console.log('$ youlisten <id> [directory]');
    console.log('# id         video or playlist ID');
    console.log('# directory  download location');
  }

}

  download(process.argv[2],process.argv[3]);
