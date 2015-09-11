/**
 * 炎黄春秋(http://www.yhcqw.com)网站文章列表抓取脚本
 * @2015/09/09
 */

var http = require("http");
var cheerio = require("cheerio");
var fs = require('fs');
var path = require('path');
var jsonfile = require('jsonfile');
var events = require('events');

var httpHelper = require("./httpHelper");

var url = "http://www.yhcqw.com";
var downloadsPath = path.join(__dirname, 'downloads');
var emitter = new events.EventEmitter();

if(emitter){
  console.log('emitter available...');
}else{
  console.log('emitter inavailable...');
}

emitter.on('firstRoundComplete', function(){
  console.log('<<<<<<<<<< to download remaining page....');
});

function htmlRequestHandler(err, data){
  if(err){
    console.log(err);
    return;
  }
  
  //console.log(data);
  var $ = cheerio.load(data);
  var tasks = [];
  $('.quanlankuang').each(function(i, e){
    var articles = [];
    $(e).find('td.shangxialan table a').each(function(j, link){
      var title = $(link).attr("title");
      var href = $(link).attr("href");
      var pagePath = href.split('/');
      var pageName = pagePath[pagePath.length-1];
      articles.push({title: title, href: url+href});
      tasks.push(url+href);
    });
    
    if(i==0){
      writeJSONFile(downloadsPath+'/0.json', articles);
    }
    
    if(i==1){
      writeJSONFile(downloadsPath+'/1.json', articles);
    }
    
  });
  
  //loadArticles(tasks);
  
  console.log('======= end of editor picked articles ===========');
}

/**
 * 递归调用此方法，下载首页文章
 */
function loadArticles(urls){
  if(!urls.length) {
    emitter.emit('firstRoundComplete');
    console.log(">>>>>> end of first round article download...");
    return;
  }
  
  console.log('>>> remaining: '+urls.length);
  var article = urls[urls.length-1];
  
  httpHelper.get(article, 30000, function(err, data){
    console.log('>>> loaded: '+ article);
    
    urls.pop();//finish one...
    
    loadArticles(urls);//call self to continue...
  }, 'gb2312');
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

//================ downloads directory create =======================
fs.exists(downloadsPath, function (exists) {
  // util.debug(exists ? "it's there" : "no downloads directory!");
  if (exists) return;

  fs.mkdir(downloadsPath, '0750', function(err){
    if (err) {console.log(err);};
  });
});//end of exist check

//================ request website homepath ==========================
httpHelper.get(url, 30000, htmlRequestHandler, 'gb2312');

console.log('loading...');


