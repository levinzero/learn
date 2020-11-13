function Node(val, left, right) {
  this.val = val;
  this.left = left;
  this.right = right;
}

Node.prototype.show = function() {
  console.log(this.val);
}

function Tree() {
  this.root = null;
}

Tree.prototype = {
  insert: function(val) {
    var node = new Node(val, null, null);
    if(!this.root) {
      this.root = node;
      return;
    }
    var current = this.root;
    var parent = null;
    while(current) {
      parent = current;
      if(val < parent.val) {
        current = current.left;
        if(!current) {
          parent.left = node;
          return;
        }
      } else {
        current = current.right;
        if(!current) {  
          parent.right = node;
        }
      }
    }
  },
  // 前序遍历
  preOrder: function(root) {
    if(!root) {
      return;
    }
    root.show();
    this.preOrder(root.left);
    this.preOrder(root.right);
  },
  // 中序遍历
  middleOrder: function(root) {
    if(root) {
      this.middleOrder(root.left);
      root.show();
      this.middleOrder(root.right);
    }
  },
  // 后序遍历
  lastOrder: function(root) {
    if(root) {
      this.lastOrder(root.left);
      this.lastOrder(root.right);
      root.show();
    }
  },
  // 树的查找
  getNode: function(value, root) {
    if(root) {
      if(value === root.val) {
        return root;
      } else if(value < root.val) {
        return this.getNode(value, root.left);
      } else {
        return this.getNode(value, root.right);
      }
    } else {
      return null;
    }
  },
  getDeep: function(deep, root) {
    deep = deep || 0;
    if(root) {
      deep = deep++;
      var leftDeep = this.getDeep(deep, root.left);
      var rightDeep = this.getDeep(deep, root.right);
      return Math.max(leftDeep, rightDeep);
    } else {
      return deep;
    }
  }
}

var t = new Tree();
t.insert(3);
t.insert(8);
t.insert(1);
t.insert(2);
t.insert(5);
t.insert(7);
t.insert(6);
t.insert(0);
var root = t.root;
t.preOrder(root);
console.log(JSON.stringify(t));