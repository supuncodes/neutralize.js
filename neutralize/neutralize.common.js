
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

})(O_o)
