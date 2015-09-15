var easyimg = require('easyimage'),
    path = require('path'),
    jsonfile = require('jsonfile'),
    util = require('util'),
    fs = require('fs'),
    cheerio = require("cheerio");

var httpHelper = require("./httpHelper");

var downloadsPath = path.join(__dirname, 'data');
var booksPath = path.join(__dirname, 'books');

var bookDetails = function(urls, callback){
  if(!urls.length){
    callback();
    return;
  }
  console.log('>>> remaining books length: '+urls.length);
  var bookURL = urls.pop();//remove, and get the last one...
  httpHelper.get(bookURL, 30000, function(err, data){
    var $ = cheerio.load(data);
    var article = $('td[align=center].shanglan');
    var rawImgURL = article.find('img').attr('src');
    if(rawImgURL){
      var rawImgPath = rawImgURL.split('/');
      var imgName = rawImgPath[rawImgPath.length-1];
      article.find('img').attr('src', 'thumbnails/'+imgName);//replace remote url to local 
    }
    //console.log(article.html());
    var bookPath = bookURL.split('/');
    var bookPage = bookPath[bookPath.length-1];
    fs.writeFile(booksPath+'/'+bookPage, article.html(), function (err) {
      if (err) throw err ;
      console.log("File Saved !"); //文件被保存
    }) ;
    
    bookDetails(urls, callback);//continue downloading book..
  }, 'gb2312');
};

var file = downloadsPath+'/2.json';
jsonfile.readFile(file, function(err, obj) {
  var thumbObjs = JSON.parse(obj);
  var urls = [];
  for(var i in thumbObjs){
    urls.push(thumbObjs[i]['href']);
  }
  bookDetails(urls, function(){
    console.log('>>> all book details downloaded!');
  });
})
