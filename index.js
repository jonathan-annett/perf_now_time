var performance_now = get_perf_now(typeof require==='function' && typeof require.resolve==='function' && typeof process==='object' && typeof module==='object');

function get_perf_now(nodeJs) {
    var res = function (iterative) {
        var mod= iterative!==false ? performance_now_iterative(nodeJs) : performance_now_map_reduce(nodeJs);
        if (nodeJs) {
            mod.express=function(express,app) {
               app.use("/perf_now_time.js",express.static(__filename));  
               app.use("/perf_now_time",express.static(__dirname));  
            };
        }
        return mod;
    };
    if (nodeJs) {
        module.exports=res;
    }
    return res;
    
    function performance_now_map_reduce(nodeJs) {
        
        var 
        perf = nodeJs ? require('perf_hooks').performance :  window.performance,
        now=perf.now.bind(perf),
        addEmUp=function(n1,n0){return n1+n0;};
        
            
        function perf_now(sample_size) {
            sample_size=sample_size||1000;
            var base=Array.from({length:sample_size});
            return monkeyPatch(function performance_now() { 
                return base.map(now).reduce(addEmUp,0)/sample_size; 
            });
        }
        
        if (nodeJs) module.exports=perf_now ;
        return perf_now;
    }
    
    function performance_now_iterative(nodeJs) {
        
        var 
        perf = nodeJs ? require('perf_hooks').performance :  window.performance,
        now=perf.now.bind(perf);
    
        function perf_now(sample_size) {
            var n=sample_size||1000;
            return monkeyPatch(function performance_now() { 
                var t=0,i;
                for (i=0;i<n;i++)t+=now();
                return t/n; 
            });
        }
        
        if (nodeJs) module.exports=perf_now ;
        return perf_now;
    }
    
    function monkeyPatch(now) {
        now.quiet=false;
        now.off=false;
        now.time = function(name,task) {
            var args=[].slice.call(arguments,2);
            if (now.off) return task.apply(this,args);
            
            var start=now(),result=task.apply(this,args),end=now();
            if (!now.quiet) console.log("timing[",name,"took",end-start,"msec]--->",result);
            return result;
        }
        
        now.time_cb = function(name,task) {
            var 
            args=[].slice.call(arguments,2);
            if (now.off) return task.apply(this,args);
            
            var cb=args.pop(),start,result,end;
    
            args.push(function(){
                var end2=now(),args=[].slice.call(arguments);
                if (!now.quiet) console.log("timing-cb[",name,"took",end2-start,"msec]--->",args);
                cb.apply(this,args);
            });
            start=now();
            result=task.apply(this,args),
            end=now();
            if (result) {
                if (!now.quiet) console.log("timing[",name,"took",end-start,"msec]--->",result);
                return result;
            } 
        }
        
        return now;
    }

}


