(function(){
    var env, base;
    
    if (typeof module !== 'undefined' && module.exports){base = global;env = "node";} 
	else {
		base = window;
		if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1)  env = "web";
		else env = "cordova";
	}

    var components = {
        listeners:{},
        operators:{},
        terminators:{}
    };

    var helpers = {
        argsWithObservable: function (obs, argus){
            var args = Array.isArray(obs) ? obs : [obs];
                                  
            for (i=0;i<argus.length;i++)
                args.push(argus[i]);
            return args;
        },
        createDefaultCallbacks: function(prevObs, newObs){
            if (!prevObs.hasNextCallback())
            prevObs.onNext(function (item){
                newObs.push(item);
            });

            if (!prevObs.hasErrorCallback())
            prevObs.onError(function (item){
                newObs.pushError(item);
            });

            if (!prevObs.hasCompleteCallback())
            prevObs.onComplete(function (item){
                newObs.complete(item);
            });
        }
    }


    function ObservableItem(item){ //make sure this is immutable!!!
        var ts =111;

        return {
            timeStamp: ts,
            item: i,
            isObservable: true
        }
    }

    function ObservableStream(){
        var iss = false;
        var scb;
        return {
            isSubscribed: function(v){
                if (v){
                    iss = v;
                    if (scb)
                        scb();
                }
                else
                    return iss;
            },
            onSubscribed: function(cb){
                scb = cb;
            }
        }
    }

    function BufferTimer(){
        var oef;
        var isStarted = false;
        var isEvaluated = false;

        function every(){
            isEvaluated = true;
            if (oef)
                oef();
        }

        return {
            every: function(interval){
                if (!isStarted){
                    isStarted = true;
                    setInterval(every, interval);
                }
                return isEvaluated;
            },
            onEvaluate: function(f){
                oef = f;
            }
        }
    }

    function ObservableBuffer(obs){
        var brw, bcw, brhow;
        var items = [];
        var timers = {};
        var evaluators = {}

        function buffer(item){
            items.push(item);
            evaluate ("release");
            evaluate ("clear");
        }

        function initTimer(func, what){
            if (func.length < 2) return;

            timers[what] = new BufferTimer();
            timers[what].onEvaluate(function(){
                evaluate(what);
            });
            evaluate(what);
        }

        function evaluate(what){
            var result = evaluators[what](items, timers[what]);

            if (result){
                if (what === "clear"){
                    for (var i = items.length; i > 0; i--) 
                        items.pop();
                }else{
                    var tForm = brhow ? brhow(items) : items;
                    obs.push(tForm);
                }
            }
        }

        return {
            releaseWhen: function(f){evaluators["release"] = f;  initTimer(f, "release");},
            clearWhen: function(f){evaluators["clear"] = f; initTimer(f, "clear");},
            releaseHow: function(f){brhow = f},
            buffer: buffer
        }
    }

    var oid=0;
    function Observable(isTerminator){
        oid++;
        var events = {
            trigger: function(event,data){
                if (this[event])
                    this[event](data);
            }
        };

        var _isSubscribed = false;
        var _cbSubscribed;
        var buffer;

        var outObj = {
            isSubscribed: function(v){
                if (v)
                    _isSubscribed = v;
                else
                    return _isSubscribed;
            },
            onSubscribed: function(f){
                _cbSubscribed = f;
            },
            onNext: function(f){
                events.onNext = f;
                if (_cbSubscribed)
                    _cbSubscribed();
            },
            onError: function(f){
                events.onError = f;
            },
            onComplete: function(f){
                events.onComplete = f;
            },
            hasNextCallback: function(){
                return events.onNext;
            },
            hasErrorCallback: function(){
                return events.onError;
            },
            hasCompleteCallback: function(){
                return events.onComplete;
            },
            bufferItem: function(item){
                if (!buffer)
                    buffer = new ObservableBuffer(this);
                buffer.buffer(item);
            },
            push: function(item){
                events.trigger("onNext",item);
            },
            pushError: function(item){
                events.trigger("onError",item);
            },
            complete: function(item){
                events.trigger("onComplete",item);
            },
            bufferReleaseWhen: function(f){
                if (!buffer)
                    buffer = new ObservableBuffer(this);
                buffer.releaseWhen(f);
            },
            bufferClearWhen: function(f){
                if (!buffer)
                    buffer = new ObservableBuffer(this);
                buffer.clearWhen(f);
            },
            bufferReleaseHow: function(f){
                if (!buffer)
                    buffer = new ObservableBuffer(this);
                buffer.releaseHow(f);
            }
        }

        function injectMethod(pObj,key, func,type){
            
            pObj[key] = function(){
                var args,obs;
                var observables;
                if (type === "OPERATOR"){
                    obs = new Observable();
                    observables = [pObj, obs];
                } 
                else 
                    observables = pObj;

                args = helpers.argsWithObservable(observables, arguments);
 
                if (!obs){
                    return func.apply(this,args);
                }else{
                    obs.onSubscribed(function(){
                        func.apply(this,args);
                        helpers.createDefaultCallbacks(pObj, obs);
                    });
                    
                    return obs;
                }
            }
        }

        for (ok in components.operators)
            injectMethod(outObj, ok, components.operators[ok],"OPERATOR");

        for (ok in components.terminators)
            injectMethod(outObj, ok, components.terminators[ok], "TERMINATOR");


        return outObj;
    }

    var nuObj = {
        listener: function(name, func){
            components.listeners[name] = function(){
                var obs = new Observable();
                args = helpers.argsWithObservable(obs, arguments);                
                
                var evalStr = "var newFunc = func.bind(this";
                for (var i=0;i<args.length;i++)
                evalStr += ",args[" + i +"]";
                eval(evalStr + ")");

                obs.onSubscribed(function(){
                    newFunc.apply();
                });

                return obs;
            }
        },
        terminator: function(name, func){
            components.terminators[name] = func;
        },
        operator: function(name, func){
            components.operators[name] = func;
        },
        Observable: components.listeners,
        newObservable: function(){
            return new Observable();
        }
        
    }

    base.Nx = nuObj;
})()