
## What is Neutralize.JS

Neutralize.JS is a Functional Reactive Programming Framework which simplifies the developers to write business applications with Functional Reactive Programming (FRP).

FRP is a programming paradigm that enables the developers to reduce the complexity of asynchronous and event-driven programming and enables the developers to write more readable, and maintainable code. In other words asynchronous callbacks and events are represented as data streams and Functional Programming is used manipulate such streams.



## Quick Overview of FRP for Absolute Beginners

In the early stages of JavaScript asynchronous programming, callbacks were used to asynchronously obtain the result of a function. However callbacks often reduce the maintainability and the readability of the code because of callback hells. To overcome this anti pattern methods such as promises, and libraries such as async were introduced. Also in ES 2017 new keywords are introduced such as “async” and “await”. FRP is another approach to deal with the complexities of asynchronous programming. In JavaScript FRP syntax is similar to a typical functional programming syntax. However behind the scenes everything happens asynchronously.

Some of the functional programming features include pure functions (variables outside of functions are not changed or used other than the input parameters of the function), higher order functions (functions can be passed as a parameters to another function), variables are immutable (cannot be changed once assigned), functions do not have side effects (any variable outside of a function is not changed), uses recursion instead of iteration. In JavaScript Developers use libraries such as underscore.js, and the recent versions of JavaScript includes functions such as map, filter, and reduce. To make the usage of higher order functions more simple ES6 introduced Arrow Functions.

Similar to functional programming FRP uses functional programming concepts such as pure functions, higher order functions, and immutable values inside asynchronous data streams. Asynchronous data streams can be constructed by listening to various events (I.e. mouse clicks, key press events, incoming requests to a server), listening to callbacks or promises, or modifying an existing asynchronous stream using operators. You can learn more about FRP in the following link;

https://gist.github.com/staltz/868e7e9bc2a7b8c1f754



## Neutralize.JS Overview

In popular FRP frameworks such as Rx.JS requires the developers to have an in-depth technical understanding of the framework to write new custom operators. Operators in FRP enables the developer to apply modifications (i.e. map, filter,etc..) to each item in a reactive stream. Operators can also be used to extend the Reactive Programming Framework and to reuse code in FRP.

In business application development focusing too much on unnecessary technical details rather than focusing on the actual functionality required for the business would make the application less effective in the business context. Also application development process becomes more difficult, time consuming and error prone. 

Neutralize.JS focuses more on simplifying the business application development process by enabling the developers to write their custom components easily.
