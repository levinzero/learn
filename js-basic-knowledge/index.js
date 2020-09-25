function Parent() {
    this.name = 'yuan';
}

Parent.prototype.sayName = function() {
    console.log(this.name);
}

function Child() {
    Parent.call(this);
    this.name = 'yuanhyuan';
}


function inherite(child, parent) {
    function F() {};
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.contructor = child;
}

inherite(Child, Parent);

console.log(new Child());
console.log(Child.prototype);


