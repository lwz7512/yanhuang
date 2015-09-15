var http = require("http");
var cheerio = require("cheerio");
var fs = require('fs');
var path = require('path');
var jsonfile = require('jsonfile');

var httpHelper = require("./httpHelper");

var url = "http://www.yhcqw.com";
var storeURL = "http://www.yhcqw.com/mall/yhts/index.html";
var downloadsPath = path.join(__dirname, 'data');

function htmlRequestHandler(err, data, headers){
  if(err){
    console.log(err);
    return;
  }
  
  var $ = cheerio.load(data);
  var books = [];
  $('td[height=814] table[height=248]').each(function(i, e){
    var item = {};
    var row = $(e).find('tr').eq(1);
    var img = row.find('td').eq(0).find('img').attr('src');
    console.log(url+img);
//    item.img = url+img;//完整地址
    var imgPath = img.split('/');
    item.img = 'books/thumbnails/'+imgPath[imgPath.length-1];
    
    var title = row.find('td').eq(1).find('a').eq(0).attr('title');
    console.log(title);
    item.title = title;
    
    var href = row.find('td').eq(1).find('a').eq(0).attr('href');
    console.log(href);
//    item.href = url+href;//完整地址
    var bookPath = href.split('/');
    item.href = 'books/'+bookPath[bookPath.length-1];
    
    var intro = row.find('td').eq(1).find('p').text().replace('<P>','')
    .replace('<STRONG>','').replace('</STRONG>','').replace('<FONTsize=2>','').replace('<FONTsize=3>','')
    .replace('<Pstyle="TEXT-INDENT:2em">','');
    intro = intro.split('.')[0]+'...';
    console.log(intro);
    item.intro = intro;
    
    books.push(item);
    console.log("==========================>"+i);
  });
  
  writeJSONFile(downloadsPath+'/'+'store.json', books);
  
}

function writeJSONFile(savedJsonPath, result){
  jsonfile.writeFile(savedJsonPath, JSON.stringify(result), function(err) {//can write object
    if (err) {
      console.log(err);
    }else{
      console.log('successful write json file: '+savedJsonPath);
    }
  });
}


httpHelper.get(storeURL, 30000, htmlRequestHandler, 'gb2312');