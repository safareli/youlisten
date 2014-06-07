margin = (seperator,length = 70) ->
  new Array(~~length+1).join(seperator)

center = (text,seperator,max = 70) ->
  marginL = ~~((max - text.length)/2)
  marginR = max - text.length - marginL
  line = new Array(max).join('+')
  margin(seperator,marginL)
    .concat(text)
    .concat(margin(seperator,marginR))  

length = (text,l,seperator = ' ')->
  m = l - text.length
  "#{text}#{margin(seperator,m)}"
header = (headings)->
  console.log margin(' ')
  headings.forEach (text)->
    console.log center(text,' ')
  console.log margin(' ')
module.exports.margin = margin
module.exports.center = center
module.exports.header = header
module.exports.length = length