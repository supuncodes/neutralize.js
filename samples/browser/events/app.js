/*
Nx
.Observable
.fromArray([1,2,3,4,5])
.map(x=>x*2)
.subscribe(n=>console.log(n));
*/


var one = Nx.Observable.fromArray([1,2,3,4,5]);
var two = Nx.Observable.fromArray([6,7,8,9,10]);
var three = Nx.Observable.fromEvent("#idButton", "click");
var four = Nx.Observable.fromEvent("#idButton2", "click");

one.reactiveSum(two).subscribe(v=>console.log(v));
//two.subscribe(v=>console.log(v));
//one.subscribe(v=>console.log(v));

//var five = three.reactiveCount();
//var six = four.reactiveCount();

//five.join(six).reactiveReduce((a,b)=> a+b).subscribe(v=>console.log(v));

/*
var fork = Nx
.Observable
.fromEvent("#idButton", "click")
.map(event=>event.type)
.fork(["one","two"]);

var one = fork.one.test();
fork.two.buffer(3).join(one).subscribe(n=>console.log(n));
*/