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
  } else if(!!(dir = url) && fs.existsSync(path.join(process.cwd(),dir,'listen.json'))){
    var links = JSON.parse(fs.readFileSync(path.join(process.cwd(),dir,'listen.json')));
    download(links.shift(),dir,function next() {
      if (links.length)
        download(links.shift(),dir,next);
    })
  } else {
    console.log('$ youlisten <url> [dir]');
    console.log('# url          video or playlist URL');
    console.log('# dir          downlod directory');
    console.log('----');
    console.log('youlisten <dir>');
    console.log('# dir          directory where urls from <dir>/listen.json will be downloaded');
  }

}

download(typeof process.argv[2] == 'string' ? process.argv[2] : '', process.argv[3]);
