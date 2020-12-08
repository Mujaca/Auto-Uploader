const fs = require('fs');
const {upload} = require('./functions/uploader')
var hosters = require('./hoster.json')
var currentUploads = [];
var watchDir = '';
var rateLimit = 1;
var args = process.argv.slice(2);
if (args.length > 0) {
  if (fs.existsSync(args[0])) {
    if(args[0].endsWith('/') == false) args[0] = args[0]+'/'
    watchDir = args[0]
  }else{
    watchDir = './'
  }
}else{
  watchDir = './'
}

if (require('./config.json').ratelimit !== undefined  && require('./config.json').ratelimit !== null && !isNaN(require('./config.json').ratelimit)) {
  rateLimit = require('./config.json').ratelimit;
}else{
  rateLimit = 10;
}

if (fs.existsSync(watchDir + 'results/') == false) {
  fs.mkdir(watchDir+'results/', (err) => {
    if(err) console.error(err)
  })
}

 console.log('Start watching: ' + watchDir)
 console.log('max Uploads: ' + rateLimit)

main();

async function main(){
  console.log("Everything loaded")
  setInterval(() => {
    fs.readdir(watchDir, async (err, files) => {
      if(err) console.error(err);
      var video = []
      files.forEach((file) => {
        if(file.endsWith('.mp4') || file.endsWith('.mkv'))video.push(file)
      })
      if (video.length > 0) {
        fileupload(video); 
      }
    })
  }, 1000);
}

async function fileupload(videos){
  videos.forEach((video) => {
    if(currentUploads.includes(video) == false && currentUploads.length < rateLimit){
     console.log("Uploading:", video)
    currentUploads.push(video);
    new upload(watchDir+video, true).init().then((data) => {
      currentUploads.forEach((singleupload, index) => {
        if(singleupload === video){
          currentUploads.splice(index, 1);
          var err = 0;
          data.forEach((link) => {
            if (link === 'err') {
              err++;
            }
          })
          if (err < data.length / 2) {
            fs.unlink(watchDir+video, (err) => {
              saveLinks(video, data);
            }) 
          }
        }
      })
    });
  }
  })
}

function saveLinks(video, data){
  var filename = video.split('.mp4')[0]
  fs.writeFile(watchDir + 'results/' + filename + '.json', JSON.stringify(data), (err) => {
    if(err) console.error(err);
  });
  var senpai = orderLinks(data)
  fs.writeFile(watchDir + 'results/' + filename + '-senpai.txt', senpai, (err) => {
    if(err) console.error(err);
  });
}

function orderLinks(links){
  const hoster = require('./functions/config').getConfig('hoster')
  var orderedLinks = '';
  var orderedHoster = [];
  var maxpreffered = 0;
  hoster.forEach((hoster) => {
    if (hoster.preferred !== undefined && hoster.preferred !== null && !isNaN(hoster.preferred) && hoster.preferred > maxpreffered) {maxpreffered = hoster.preferred;}
  })
  for (let index = maxpreffered; index > 0; index--) {
    const element = hoster.find(element => element.preferred === index);
    if(element !== undefined && element !== null)orderedHoster.push(element)
  }
  hoster.forEach((singlehoster) => {
    if (!orderedHoster.includes(singlehoster)) {
      orderedHoster.push(singlehoster);
    }
  })
  var senpai = '';
  orderedHoster.forEach((singleHoster) => {
    links.forEach((link) => {
      if (link.startsWith(hosters[singleHoster.name])) {
        if (singleHoster.name == 'vivo') {
          link.replace('https://vivo.sx/', 'https://vivo.sx/embed/');
        }
        senpai = senpai + `[tab:${singleHoster.name.toUpperCase()}]<iframe width="100%" height="100%" src="${link}" frameborder="0" allowfullscreen="true"></iframe>\n`
      }
    })
  })
  senpai = senpai + '[tab:END]'
  return senpai;
}

if (!args.includes("develop")) {
  var autoupdate = require('./functions/autoupdate').updater(args); 
}