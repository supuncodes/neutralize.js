/*
O_o
.Observable
.fromArray([1,2,3,4,5])
.map(x=>x*2)
.subscribe(n=>console.log(n));
*/

/*
O_o
.Observable
.fromArray([1,2,3,4,5])
.bufferWithTimeAndCount(10000,5)
.subscribe(n=>console.log(n));
*/

O_o
.Observable
.fromEvent("#idButton", "click")
.map(event=>event.type)
.bufferWithTimeAndCount(1000,3)
.subscribe(n=>console.log(n));