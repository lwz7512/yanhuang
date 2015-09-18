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
    //FIX, remove the width so display rightly in ionic, @2015/09/19
    article.find('table[width=600]').removeAttr('width');
    article.find('img').remove();//delete image for content display elegant;
    
    // var rawImgURL = article.find('img').attr('src');
    // if(rawImgURL){
    //   var rawImgPath = rawImgURL.split('/');
    //   var imgName = rawImgPath[rawImgPath.length-1];
    //   article.find('img').attr('src', 'books/thumbnails/'+imgName);//replace remote url to local
    // }

    var bookPath = bookURL.split('/');
    var bookPage = bookPath[bookPath.length-1];
    fs.writeFile(booksPath+'/'+bookPage, article.html(), function (err) {
      if (err) throw err ;
      console.log("File Saved: "+bookPage); //文件被保存
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

  // bookDetails(['http://www.yhcqw.com/Mall/jptj/2010-12/2/yh2742_151.html'], function(){
  bookDetails(urls, function(){
    console.log('>>> all book details downloaded!');
  });
})
