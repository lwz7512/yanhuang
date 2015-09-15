var easyimg = require('easyimage'),
    path = require('path'),
    jsonfile = require('jsonfile'),
    util = require('util'),
    fs = require('fs'),
    request = require('request');

var downloadsPath = path.join(__dirname, 'data');
var thumbnailsPath = path.join(__dirname, 'thumbnails');

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

//console.log(getFiles('/Users/liwenzhi/Downloads/books'));

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
//    console.log('content-type:', res.headers['content-type']);
//    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var downloadImgs = function(urls, destdir, callback){
  if(!urls.length){
    callback();
    return;
  }
  console.log('>>> remaining image download queue length: '+urls.length);
  var url = urls.pop();
  var imgPath = url.split('/');
  var imgFile = imgPath[imgPath.length-1];
  download(url, destdir+'/'+imgFile, function(){
    downloadImgs(urls, destdir, callback);
  });
};

var file = downloadsPath+'/2.json';
//jsonfile.readFile(file, function(err, obj) {
//  var thumbObjs = JSON.parse(obj);
//  var urls = [];
//  for(var i in thumbObjs){
//    urls.push(thumbObjs[i]['img']);
//  }
//  downloadImgs(urls, '/Users/liwenzhi/Downloads/books', function(){
//    console.log(">>> all the books cover downloaded!");
//  });
//})

//fs.exists(thumbnailsPath, function (exists) {
//  // util.debug(exists ? "it's there" : "no downloads directory!");
//  if (exists) return;
//
//  fs.mkdir(thumbnailsPath, '0750', function(err){
//    if (err) {console.log(err);};
//  });
//});//end of exist check

var resizeToThumbnail = function(rawImgFiles){
  if(!rawImgFiles.length){
    console.log(">>> thumbnails create completed!");
    return;
  }
  var eachImg = rawImgFiles.pop();
  var filePath = eachImg.split('/');
  var fileName = filePath[filePath.length-1];
  console.log('>>> continue resize image: '+rawImgFiles.length);
  
  easyimg.resize({
    src: eachImg,
    dst: thumbnailsPath+'/'+fileName,
    width: '100', height: '200',
  }).then(function(image){//on success
    resizeToThumbnail(rawImgFiles);//continue to resize...
  }, function(){//on error
    console.log(err);
  });

};

var rawImages = getFiles('/Users/liwenzhi/Downloads/books');
resizeToThumbnail(rawImages);