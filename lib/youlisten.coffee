ffmpeg    = require 'fluent-ffmpeg'
ytdl      = require 'ytdl'
path      = require 'path'
fs        = require 'fs'
sanit     = require 'sanitize-filename'
jsdom     = require 'jsdom'
mkdirp    = require 'mkdirp'
dateDelta = require './datedelta'
t         = require './t'

onEnd = (done,itemDuration,fileName)->
  process.stdout.clearLine()
  console.log "#{t.margin(' ',11)}SAVED IN: #{itemDuration()}"
  done(null,fileName)
onError = (done,error)->
  console.log t.center("FFMPEG ERROR",' ')
  console.error error
  done(error)
onProgress = (length,itemDuration,extraInfo,progress)->
  p = progress.timemark.split('.')[0].split(':').map(Number);
  p = p[2] + p[1]*60 + p[0]*60*60;
  percent = (p/length).toFixed(3)
  percent =t.length "#{percent}%", 5
  log  ="#{t.margin(' ',10)}CONVERTED: #{percent}"
  log +="#{t.margin(' ',4)}DURATION: #{itemDuration()}"
  log += "#{t.margin(' ',4)}#{extraInfo()}"  if extraInfo
  process.stdout.write("#{log}\r")   
downloadVideo = (id, dir, done,extraInfo) ->
  mkdirp dir, (err) ->
    return console.error 'mkdirp', err if err
  url = "http://www.youtube.com/watch?v=#{id}"
  ytdl.getInfo url, (err, info) ->
    if err?
      console.log "#{t.margin(' ',10)}  YT-EROR: #{err.message}"
      done(err);
      return
      
    outFile = path.join( dir, sanit("#{info.title}.mp3"))
    console.log "#{t.margin(' ',16)}URL: #{url}"
    console.log "#{t.margin(' ',14)}TITLE: #{info.title}"
    if fs.existsSync(outFile)
      console.log t.center("ALREADY DOWNLOADED",' ')
      done(null,outFile)
      return
    outStream = fs.createWriteStream(outFile);
    itemDuration = dateDelta()
    new ffmpeg({ source: ytdl(url), nolog: true })
      .withAudioCodec('libmp3lame')
      .toFormat('mp3')
      .on 'progress', onProgress.bind(undefined,info.length_seconds,itemDuration,extraInfo)
      .on 'error', onError.bind(undefined,done)
      .on 'end', onEnd.bind(undefined,done,itemDuration)
      .writeToStream outStream, end: true
downloadPlaylist = (id,dir,done)->
  wholeDuration = dateDelta()
  jsdom.env
    url: "https://www.youtube.com/playlist?list=#{id}"
    done: (errors, window) ->
      return done(errors) if errors
      get = window.document.getElementsByClassName.bind window.document
      playlistName = get('pl-header-title')[0].textContent.trim();
      videoIdRegEx =/(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/
      videoIds = [].map.call get('pl-video-thumb'), (l) ->
        videoIdRegEx.exec(l.href).pop();
      window.close()
      t.header(['STARTING PLAYLIST DOWNLOAD',playlistName])
      dir = path.join( dir, sanit(playlistName))
      
      extraInfo = () ->
        "LEFT: #{t.length(videoIds.length,4)}"
      requre = (error,fileName) ->
        if videoIds.length < 1
          console.log t.center("WHOLE DURATION #{wholeDuration()}",' ')
          done(null,dir)
          return
        console.log t.margin("=")
        downloadVideo videoIds.shift(), dir, requre, extraInfo
      downloadVideo videoIds.shift(), dir, requre, extraInfo

module.exports.downloadVideo = downloadVideo
module.exports.downloadPlaylist = downloadPlaylist