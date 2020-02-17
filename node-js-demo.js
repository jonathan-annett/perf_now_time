try {
    var 
    express=require("express"),
    app=express();
    
    require("./index.js").express(express,app);
    
    require('get-localhost-hostname/start-browser.js')(app,0,"/perf_now_time");
    
} catch(e) {
    if (e.code==='MODULE_NOT_FOUND') { 
        console.log("do 'npm install' first");
    } else {
        throw e ;
    }
}