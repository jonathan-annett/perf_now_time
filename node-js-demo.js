try {
    var 
    express=require("express"),
    app=express(),
    hostname=require('get-localhost-hostname');
    require("./index.js").express(express,app);
    var listener = app.listen(0,function(){
        var url="http://"+hostname+":"+listener.address().port+"/perf_now_time"
        console.log("goto to "+url);
        require("child_process").spawn("xdg-open",[url]);
    });

} catch(e) {
    if (e.code==='MODULE_NOT_FOUND') { 
        console.log("do 'npm install' first");
    } else {
        throw e ;
    }
}