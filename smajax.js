var http=require("http");  
var querystring=require("querystring"); 
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');


var contents=querystring.stringify({  
    CookieDate:0,  
    id:"****",  
    mode:0,       
    passwd:"-----"  
});  
  

var options={  
    host:"www.yhcqw.com",  
    path:"/showContent.asp?no-cache=0.7901887928601354&NewsId=H3E1A86525HE2F6&PageBound=0&_=",  
    method:"get",  
    headers:{  
        "Accept":"*/*",  
        "Accept-Encoding":"gzip, deflate, sdch", 
        "Accept-Language":"en-US,en;q=0.8,de;q=0.6,pt;q=0.4,zh-CN;q=0.2,zh-TW;q=0.2",  
        "Cache-Control":"max-age=0",  
        "Connection":"Keep-Alive", 
        "Cookie":"ASPSESSIONIDAAQDTBDR=KKHFEIDAPLKMLEIBNFOLPBNF",
        "Host":"www.yhcqw.com",  
        "Referer":"http://www.yhcqw.com/html/wenzjc/2015/110/A85K.html",  
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36",  
        "X-Prototype-Version":"1.4.0",
        "X-Requested-With":"XMLHttpRequest"  
    }  
};  
  
var req = http.request(options,function(res){
  var bufferHelper = new BufferHelper();
    res.on("data",function(data){  
      bufferHelper.concat(data);
    }).on('end', function(){
        var _data = iconv.decode(bufferHelper.toBuffer(),'gb2312');
        console.log(_data);
    });  
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});

    
//req.write(contents);  
req.end();  