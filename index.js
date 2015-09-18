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
var article = require("./article");

var url = "http://www.yhcqw.com";
var downloadsPath = path.join(__dirname, 'data');
var articlesPath = path.join(__dirname, 'articles');
var emitter = new events.EventEmitter();


emitter.on('firstRoundComplete', function(){
  console.log('<<<<<<<<<< to download remaining page....');
});

function htmlRequestHandler(err, data, headers){
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
    
    if(i==0){//文章精粹
      writeJSONFile(downloadsPath+'/home_best.json', articles);
    }
    
    if(i==1){//文章排行榜
      writeJSONFile(downloadsPath+'/home_rank.json', articles);
    }
    
  });
  
  loadArticles(tasks);
  
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
  
  var pageURL = urls[urls.length-1];
  article.download(pageURL, function(result){
    //console.log(result);
    var filePath = pageURL.split('/');
    var fileName = filePath[filePath.length-1];
    writeJSONFile(articlesPath+'/'+fileName+'.json', result);
    
    urls.pop();//finish one...
    
    loadArticles(urls);//call self to continue...
  });
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


