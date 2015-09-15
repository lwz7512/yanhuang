var http = require("http");
var cheerio = require("cheerio");

var httpHelper = require("./httpHelper");
var pageContent = require("./smajax");

//================ 下载文章详情页 ====================
var url = "http://www.yhcqw.com";
var article = {
  download: function(pageURL, completeHandler){
    var result = {};
    httpHelper.get(pageURL, 30000, function(err, data){
      console.log('>>> page loaded!');
      var $ = cheerio.load(data);

      var titleTable = $('body > table').find('table').eq(4);
      var title = titleTable.find('strong').text();
      console.log('title: '+title);
      titleTable.find('p').each(function(i, e){
        if(i==0){//author
          //console.log('author: '+$(e).text());
          result.author = $(e).text();
        }
        if(i==1){//source
          //console.log('source: '+$(e).text());
          result.source = $(e).text();
        }
      });

      $('script').each(function(i, e){
        var script = $(e).text();
        if(i==2){
          //console.log(script);
          var start = script.indexOf('{');
          var end = script.indexOf('}');
          var objstr = script.substring(start, end+1);
          var replaced = objstr.replace("method", "'method'").replace("parameters", "'parameters'");
          
          var obj = eval('('+replaced+')');
          //console.log(obj);
          //console.log(obj.method);
          //console.log(obj.parameters);
          var path = '/showContent.asp?no-cache='+Math.random()+'&'+obj.parameters+'&_=';
          result.path = path;
        }
      });
      //get ajax page content...
      pageContent.get(result.path, pageURL, function(content){
        
        //page content loaded!
        result.content = content;
        
        completeHandler(result);//notify main loop...
      });
      
    }, 'gb2312');

  }
};

module.exports = article;
