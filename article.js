var http = require("http");
var cheerio = require("cheerio");

var httpHelper = require("./httpHelper");

//================ 测试下载文章详情页 ====================
var url = "http://www.yhcqw.com";
httpHelper.get('http://www.yhcqw.com/html/wenzjc/2015/110/A85K.html', 30000, function(err, data){
  console.log('>>> page loaded!');
  
  var $ = cheerio.load(data);
  
  var titleTable = $('body > table').find('table').eq(4);
  var title = titleTable.find('strong').text();
  console.log('title: '+title);
  titleTable.find('p').each(function(i, e){
    if(i==0){//author
      console.log('author: '+$(e).text());
    }
    if(i==1){//source
      console.log('source: '+$(e).text());
    }
  });
  
  $('script').each(function(i, e){
    
    console.log('>>> script: '+i);
    //console.log($(e).html());
    var script = $(e).text();
    if(i==2){
      console.log(script);
      var start = script.indexOf('{');
      var end = script.indexOf('}');
      var objstr = script.substring(start, end+1);
      var replaced = objstr.replace("method", "'method'").replace("parameters", "'parameters'");
      console.log(replaced);
      var obj = eval('('+replaced+')');
      //console.log(obj);
      //console.log(obj.method);
      //console.log(obj.parameters);
      var ajaxURL = url+'/showContent.asp?no-cache='+Math.random()+'&'+obj.parameters+'&_=';
      console.log(ajaxURL);
      
    }
  });
  
}, 'gb2312');

console.log('loading...');
