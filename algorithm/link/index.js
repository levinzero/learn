function ListNode(val) {
  this.val = val;
  this.next = null;
}

function listFactory(data) {
  let list = new ListNode();
  list.next = new ListNode(data[0])
  for (var i = 1; i < data.length; i++) {
    const node = new ListNode(data[i]);
    const deepNode = deep(list.next);
    deepNode.next = node;
  }
  return list.next;
}

function deep(node) {
  if(node.next) {
    return deep(node.next);
  } else {
    return node;
  }
}

const list = listFactory([1,2,3,4,5]);

//翻转区间链表 1->2->3->4->5->Null ---> 1->4->3->2->5->Null;
function reverseListBetweenMN(head, m, n) {
  const count = n - m;
  let p = dummyHead = new ListNode();
  p.next = head;
  for(let i = 0; i < m - 1; i++) {
    p = p.next;
  }

  let pre, tail, cur, front;
  front = p;
  pre = tail = p.next;
  cur = pre.next;
  for(let j = 0; j < count; j++) {
    let next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }

  front.next = pre;
  tail.next = cur;
  return dummyHead.next;
}

const result = reverseListBetweenMN(list, 2, 4);
console.log(result);

