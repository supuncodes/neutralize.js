
## What is Neutralize.JS

Neutralize.JS is a Functional Reactive Programming Framework which simplifies the developers to write business applications with Functional Reactive Programming (FRP).

FRP is a programming paradigm that enables the developers to reduce the complexity of asynchronous and event-driven programming and enables the developers to write more readable, and maintainable code. In other words asynchronous callbacks and events are represented as data streams and Functional Programming is used manipulate such streams. In Neutralize.JS such streams are known as Observables.



## Quick Overview of FRP for Absolute Beginners

In the early stages of JavaScript asynchronous programming, callbacks were used to asynchronously obtain the result of a function. However callbacks often reduce the maintainability and the readability of the code because of callback hells. To overcome this anti pattern methods such as promises, and libraries such as async were introduced. Also in ES 2017 new keywords are introduced such as “async” and “await”. FRP is another approach to deal with the complexities of asynchronous programming. In JavaScript FRP syntax is similar to a typical functional programming syntax. However behind the scenes everything happens asynchronously.

Some of the functional programming features include pure functions (variables outside of functions are not changed or used other than the input parameters of the function), higher order functions (functions can be passed as a parameters to another function), variables are immutable (cannot be changed once assigned), functions do not have side effects (any variable outside of a function is not changed), uses recursion instead of iteration. In JavaScript Developers use libraries such as underscore.js, and the recent versions of JavaScript includes functions such as map, filter, and reduce. To make the usage of higher order functions more simple ES6 introduced Arrow Functions.

Similar to functional programming FRP uses functional programming concepts such as pure functions, higher order functions, and immutable values inside asynchronous data streams (observables). Observables can be constructed by listening to various events (I.e. mouse clicks, key press events, incoming requests to a server), listening to callbacks or promises, or modifying an existing observable using operators.  In observables values are ordered in time in a first-come-first-served basis. Unlike a queue observables are asynchronous, to obtain a value one must subscribe to an observables to recieve each value. In FRP each operator has a unque behavior. To represent such a behavior Marble diagrams are used. You can visually view the behaviors of operators in [rxmarbles.com](http://rxmarbles.com/).

You can learn more about FRP in the following link;
https://gist.github.com/staltz/868e7e9bc2a7b8c1f754



## Neutralize.JS Overview

In popular FRP frameworks such as Rx.JS requires the developers to have an in-depth technical understanding of the framework to write new custom operators. Operators in FRP enables the developer to apply modifications (i.e. map, filter,etc..) to each item in a reactive stream. Operators can also be used to extend the Reactive Programming Framework and to reuse code in FRP.

In business application development focusing too much on unnecessary technical details rather than focusing on the actual functionality required for the business would make the application less effective in the business context. Also application development process becomes more difficult, time consuming and error prone. 

Neutralize.JS focuses more on simplifying the business application development process by enabling the developers to easily write their custom Obervables and Operators. 


## Building blocks of Neutralize.JS

In Neutralize.JS asynchronous data streams (Observables) are treated as first class citizens which means that the primary focus in Neutralize.JS are on Observables.
Observables have the following characteristics.

* Observables can be created - In Neutralize.JS listeners are used to create observables.
* Observables can be terminated - In Neutralize.JS terminators are used to subscribe to observables.
* Modifications of observables create new Observables - In Neutralize.JS operators are used to modify Observables.

## Available Features in Current versions
### Available Listeners
#### fromArray

Creates an observable using an array

Example;
```javascript
O_o
.Observable
.fromArray([1,2,3,4,5])
.subscribe(n=>console.log(n));
```

#### fromEvent

Creates a stream of events from a control

```javascript
O_o
.Observable
.fromEvent("#idButton", "click")
.subscribe(n=>console.log(n));
```

### Available Operators

#### map

Transforms an item emmited by an Observable to a new item in a new Observable. Map function should be included as a parameter.

```javascript
O_o
.Observable
.fromArray([1,2,3,4,5])
.map(x=> x*2 )
.subscribe(n=>console.log(n));
```

#### filter

Filters out items emmited by an Observable to a new Observable. Filter function should be included as a parameter.

```javascript
O_o
.Observable
.fromArray([1,2,3,4,5])
.filter(x=> x%2==0)
.subscribe(n=>console.log(n));
```

#### buffer

Gather items emitted by an Observable into bundles and emit those bundles into a new Observable. Bundle size should be included as a parameter.

```javascript
O_o
.Observable
.fromEvent("#idButton", "click")
.buffer(3)
.subscribe(n=>console.log(n));
```


#### bufferWithTime

Periodically gather items emitted by an Observable into bundles and emit those bundles into a new Observable. Time period should be included as a parameter.

```javascript
O_o
.Observable
.fromEvent("#idButton", "click")
.bufferWithTime(1000)
.subscribe(n=>console.log(n));
```


#### bufferWithTimeAndCount

Periodically gather items emitted by an Observable into bundles and emit those bundles into a new Observable. Time period and bundle size should be included as a parameter.

```javascript
O_o
.Observable
.fromEvent("#idButton", "click")
.bufferWithTimeAndCount(1000,3)
.subscribe(n=>console.log(n));
```

### Available Terminators

#### subscribe

Can be used to listen to an Observable. items emitted and errors can be identified in this function

```javascript
O_o
.Observable
.fromArray([1,2,3,4,5])
.subscribe(successItem=>console.log(successItem), errorItem=>console.log(errorItem), onComplete => console.log ("Observable Ended") );
```

## Writing Custom Listeners

Using the listener() function a new listener can be created. The first parameter of the function should be the name of the listener. The second parameter is a function that defines the logic of the listener which has its first parameter as the observer the developer could use to emit items and the rest of the parameters as the parameters that should be passed once the listener is being used by a developer.  

```javascript
O_o
.listener ("fromArray", function(observer,array){       
        for (i=0;i<array.length;i++)
            observer.push(array[i]);
});
```

## Writing Custom Operators

Using the operator() function a new listener can be created. The first parameter of the function should be the name of the operator. The second parameter is a function that defines the logic of the listener which has its first parameter as the observer the developer can use to listen for incoming items, and the next parameter is the next observer in the chain that the developer can send the items modified by the function, and the rest of the parameters defines the parameters the operator has.

```javascript
O_o
.operator ("map", function(thisObserver, nextObserver, func){
        thisObserver.onNext(function(item){
            nextObserver.push(func ? func(item): item);
        });
});

```

## Writing Custom Terminators

Using the terminator() function a new terminator can be created. The first parameter of the function should be the name of the terminator. The second parameter is a function that defines the logic of the listener which has its first parameter as the observer the developer can use to listen for incoming items, and the rest of the parameters defines the parameters the terminator has.

```javascript
O_o
.terminator ("subscribe", function(observer, nextFunc, errorFunc, completeFunc){
        
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
```