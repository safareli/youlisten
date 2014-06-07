module.exports = () ->
  now = +new Date
  () ->
    delta = (+new Date - now)
    delta =~~(delta/1000)
    sec = delta%60
    min = (delta-sec)%(60*60)
    hour = (delta-sec-min*60)%(60*60*60)
    hour = (if hour < 10 then "0#{hour}" else hour)
    min = (if min < 10 then "0#{min}" else min)
    sec = (if sec < 10 then "0#{sec}" else sec)
    "#{hour}:#{min}:#{sec}"