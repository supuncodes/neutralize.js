
(function(n){

    n.listener ("fromArray", function(observer,array){       
        for (i=0;i<array.length;i++)
            observer.push(array[i]);
    });

    n.listener ("fromEvent", function(observer,selector,event){
        
        document.addEventListener("DOMContentLoaded", function() { 
            var element;
            if (typeof selector === "string") element = document.querySelector(selector);
            else element = selector;

            if (event)
            element.addEventListener(event, function(ev) {
                observer.push(ev);
            });
        });

    });

    n.operator ("map", function(prevObs, newObs, func){
        prevObs.onNext(function(item){
            newObs.push(func ? func(item): item);
        });
    });

    n.operator ("filter", function(prevObs, newObs, func){
        prevObs.onNext(function(item){
            if (func)
            if (func(item))
                newObs.push(item);
        });
    });

    n.operator ("test", function(prevObs, newObs, func){

    });

    n.operator ("reactiveReduce", function(prevObs, newObs, func){
        var acc;
        prevObs.onNext(function(item){            
            if (func){
                if (!acc) acc = 0;
                acc = func(acc, item);
                newObs.push(acc);
            }
        });
    });

    n.operator ("reactiveCount", function(prevObs, newObs, func){
        var count=0;
        prevObs.onNext(function(item){ 
            count++;           
            newObs.push(count);
        });
    });


    n.operator ("join", function(prevObs, newObs){
        var args = [];
        if (arguments.length > 2){
            for (var i=0;i<arguments.length;i++)
            if (i!=1)
                args.push(arguments[i]);
        }
        
        var nextFunc = function(item){
            newObs.push(item);
        };

        for (var i=0;i<args.length; i++)
            args[i].onNext(nextFunc);   
    });

    n.operator ("zip", function(prevObs, newObs, nextObs){

        var valArray1 = [];
        var valArray2 = [];
        
        function evaluate(){
            var v1,v2;
            if (valArray1.length > 0)
                v1 = valArray1[0];
            
            if (valArray2.length > 0)
                v2 = valArray2[0];

            if (v1 && v2){
                valArray1.splice (0,1);
                valArray2.splice (0,1);
                newObs.onNext ([v1,v2]);
            }
        }
        
        prevObs.onNext(function(item){            
            valArray1.push(item);
            evaluate();
        });
        
        nextObs.onNext(function(item){            
            valArray2.push(item);
            evaluate();
        });

    });

    n.operator ("reactiveSum", function(prevObs, newObs, nextObs, func){

        var valueObj = {1:0,2:0};
       
        function evaluate(item,index){
            valueObj[index] = item;
            var v1 = valueObj["1"];
            var v2 = valueObj["2"];

            if (v1 && v2){
                if (func)
                    newObs.push (func(v1, v2));
                else 
                    newObs.push (v1 + v2);
            }
        }
 
        prevObs.onNext(function(item){         
            evaluate(item,"1");
        });
        
        nextObs.onNext(function(item){            
            evaluate(item,"2");
        });

    });

    n.operator ("buffer", function(prevObs, newObs, size){
        newObs.bufferReleaseWhen (buffer => buffer.length == size);
        newObs.bufferClearWhen (buffer => buffer.length == size);

        prevObs.onNext(function(item){
            newObs.bufferItem(item);
        });
    });

    n.operator ("bufferWithTime", function(prevObs, newObs, interval){
        newObs.bufferReleaseWhen ( (buffer,timer) => timer.every(interval));
        newObs.bufferClearWhen ( (buffer,timer) => timer.every(interval));

        prevObs.onNext(function(item){
            newObs.bufferItem(item);
        });
    });

    n.operator ("bufferWithTimeAndCount", function(prevObs, newObs, interval, size){
        newObs.bufferReleaseWhen ( (buffer, timer) => timer.every(interval) && buffer.length == size);
        newObs.bufferClearWhen ( (buffer, timer) => timer.every(interval) );

        prevObs.onNext(function(item){
            newObs.bufferItem(item);
        });
    });

    n.terminator ("subscribe", function(observer, nextFunc, errorFunc, completeFunc){
        
        if (nextFunc)
        observer.onNext(function(item){
            nextFunc(item);
        });
        
        if (errorFunc)
        observer.onError(function(item){
            errorFunc(item);
        });

        if (completeFunc)
        observer.onComplete(function(item){
            completeFunc(item);
        });
    });

    n.terminator ("fork", function(observer, names){
        var retObs = {};
        for (var i=0;i<names.length; i++){
            retObs[names[i]] = Nx.newObservable();
        }

        observer.onNext(function(item){
            for (var k in retObs)
                retObs[k].push(item);
        });
        
        observer.onError(function(item){
            for (var k in retObs)
                retObs[k].pushError(item);
        });

        observer.onComplete(function(item){
            for (var k in retObs)
                retObs[k].complete(item);
        });

        return retObs;
    });

})(Nx)
