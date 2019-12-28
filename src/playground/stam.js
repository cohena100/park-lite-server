let reverse = (s) => {
  if (s.length == 1) return s
  return reverse(s.substr(1)) + s.charAt(0)
}
console.log(reverse('abcde'))
//-----------------------------------------------
//-----------------------------------------------
const isPalindrome = (s, start, end) => {
  const helper = (s, start, end) => {
    if (end - start === 0) return true
    if (end - start === 1) return s.charAt(start) === s.charAt(end)
    if (s.charAt(start) !== s.charAt(end)) return false
    return helper(s, start + 1, end - 1)
  }
  return helper(s, 0, s.length - 1)
}
console.log(isPalindrome('abdfefdba'))
//-----------------------------------------------
//-----------------------------------------------
const reverseInt = (num) => {
  const helper = (num) => {
    if (num < 10) return [num, 10];
    const q = Math.floor(num / 10)
    const r = num % 10
    const [rev, pos] = helper(q)
    return [r * pos + rev, pos * 10]
  }
  return n < 0 ? -helper(-num)[0] : helper(num)[0]
}
console.log(reverseInt(12344400))
console.log(reverseInt(-12344400))
//-----------------------------------------------
//-----------------------------------------------
const maxChar = (s) => {
  const helper = (s, start, end) => {
    const c = s[start]
    if (start === end) return {
      [c]: 1
    }
    const o = helper(s, start + 1, end)
    if (c in o) {
      o[c] += 1
    } else {
      o[c] = 1
    }
    return o
  }
  const o = helper(s, 0, s.length - 1)
  return Object.entries(o)
    .reduce(([cMax, countMax], [c, count]) => countMax > count ? [cMax, countMax] : [c, count])[0]
}
console.log(maxChar('aabaccbccbbccbbb'))
//-----------------------------------------------
//-----------------------------------------------
const fizzBuzz = (n) => {
  const helper = (start, end, fb, f, b) => {
    if (start > end) return []
    let c = ''
    if (f === 0) {
      c = 'fizz'
      f = 3
    }
    if (b === 0) {
      c = 'buzz'
      b = 5
    }
    if (fb === 0) {
      c = 'fizzbuzz'
      fb = 15
    }
    if (!c) {
      c = '' + start
    }
    return [c, ...helper(start + 1, end, fb - 1, f - 1, b - 1)]
  }
  helper(1, n, 14, 2, 4).forEach(e => console.log(e))
}
fizzBuzz(20)
//-----------------------------------------------
//-----------------------------------------------
const chunk = (arr, size) => {
  const helper = (arr, start, end) => {
    if (start === end) return [
      [arr[start]]
    ]
    const lefts = helper(arr, start, end - 1)
    const right = lefts[lefts.length - 1]
    if (right.length < size) {
      right.push(arr[end])
    } else {
      lefts.push([arr[end]])
    }
    return lefts
  }
  return helper(arr, 0, arr.length - 1)
}
console.log(chunk([1, 2, 3, 4, 5], 3))
//-----------------------------------------------
//-----------------------------------------------
const anagrams = (s1, s2) => {
  const build = (s, start, end) => {
    const c = s[start]
    if (start === end) return {
      [c]: 1
    }
    const o = build(s, start + 1, end)
    if (c in o) {
      o[c] += 1
    } else {
      o[c] = 1
    }
    return o
  }
  const compare = (o1, o2) => {
    for (const p in o1) {
      if (o1[p] !== o2[p]) return false
    }
    for (const p in o2) {
      if (o1[p] !== o2[p]) return false
    }
    return true
  }
  const regExp = /\W/g
  const s11 = s1.replace(regExp, '').toLowerCase()
  const s22 = s2.replace(regExp, '').toLowerCase()
  const o1 = build(s11, 0, s11.length - 1)
  const o2 = build(s22, 0, s22.length - 1)
  return compare(o1, o2)
}
console.log(anagrams('Rail safety', 'Fairy tales'))
//-----------------------------------------------
//-----------------------------------------------
const lower = 'look, it is working!'
const cap = lower.replace(/\w+/g, w => w.charAt(0).toUpperCase() + w.slice(1))
console.log(cap)
//-----------------------------------------------
//-----------------------------------------------
const steps = (n) => {
  let step = ''
  for (i = 0; i < n; i++) {
    step += '*'
    console.log(step)
  }
}
steps(5)
//-----------------------------------------------
//-----------------------------------------------
const pyramid = (n) => {
  let hashes = '#'
  let spaces = ''
  for (i = 0; i < n - 1; i++) {
    spaces += ' '
  }
  for (i = 0; i < n; i++) {
    console.log(spaces + hashes + spaces)
    spaces = spaces.slice(0, -1);
    hashes += '##'
  }
}
pyramid(6)
//-----------------------------------------------
//-----------------------------------------------
const vowels = (s) => {
  return s.match(/[aeiou]/g).length
}
console.log(vowels('ae foo iou'))
//-----------------------------------------------
//-----------------------------------------------
const spiralMatrix = (n) => {
  const m = [...Array(n)].map(x => Array(n).fill(0));
  let d = 'r'
  let x = 0;
  let y = 0;
  let val = 1;
  for (i = 0; i < n ** 2; i++) {
    m[y][x] = val
    if (d === 'r') {
      if (x < n - 1 && m[y][x + 1] === 0) {
        x += 1
      } else {
        d = 'd'
        y += 1
      }
    } else if (d === 'd') {
      if (y < n - 1 && m[y + 1][x] === 0) {
        y += 1
      } else {
        d = 'l'
        x -= 1
      }
    } else if (d === 'l') {
      if (x > 0 && m[y][x - 1] === 0) {
        x -= 1
      } else {
        d = 'u'
        y -= 1
      }
    } else if (d === 'u') {
      if (y > 0 && m[y - 1][x] === 0) {
        y -= 1;
      } else {
        d = 'r';
        x += 1;
      }
    }
    val++
  }
  return m
}
spiralMatrix(3).forEach(r => console.log(r))
//-----------------------------------------------
//-----------------------------------------------
const memoize = (f) => {
  const cache = {}
  return (...args) => {
    const val = cache[args]
    if (val) return val
    const result = f.apply(this, args)
    cache[args] = result
    return result
  }
}

const fib = (n) => {
  if (n < 2) return n
  return fib(n - 2) + fib(n - 1)
}
console.log(fib(6))
console.log(memoize(fib)(6))
//-----------------------------------------------
//-----------------------------------------------
class Queue {
  constructor() {
    this.data = []
  }
  add(record) {
    this.data.unshift(record)
  }
  remove() {
    return this.data.pop()
  }
  peek() {
    const l = this.data.length
    if (!l) return null
    return this.data[l - 1]
  }
}
const weave = (q1, q2) => {
  let r = new Queue()
  let curr = '1'
  while (q1.peek() || q2.peek()) {
    if (q1.peek()) {
      if (!q2.peek()) {
        r.add(q1.remove())
      } else {
        if (curr === '1') {
          r.add(q1.remove())
          curr = '2'
        } else {
          r.add(q2.remove())
          curr = '1'
        }
      }
    } else {
      r.add(q2.remove())
    }
  }
  return r
}
const q1 = new Queue()
const q2 = new Queue()
q1.add(1)
q1.add(2)
q2.add('a')
q2.add('b')
q2.add('c')
q2.add('d')
console.log(weave(q2, q1).data)
//-----------------------------------------------
//-----------------------------------------------
class Stack {
  constructor() {
    this.data = []
  }
  push(record) {
    this.data.push(record)
  }
  pop() {
    return this.data.pop()
  }
  peek() {
    const l = this.data.length
    if (!l) return null
    return this.data[l - 1]
  }
}
//-----------------------------------------------
//-----------------------------------------------
class QueueUsingStack {
  constructor() {
    this.q1 = new Stack()
    this.q2 = new Stack()
  }
  add(record) {
    this.q1.push(record)
  }
  remove() {
    if (this.q2.peek()) return this.q2.pop()
    while (this.q1.peek()) {
      this.q2.push(this.q1.pop())
    }
    return this.q2.pop()
  }
  peek() {
    if (this.q2.peek()) return this.q2.peek()
    while (this.q1.peek()) {
      this.q2.push(this.q1.pop())
    }
    return this.q2.peek()
  }
}
const q3 = new QueueUsingStack()
q3.add(1)
q3.add(2)
q3.add(3)
q3.add(4)
q3.add(5)
q3.remove()
q3.add(6)
q3.add(7)
console.log(q3.q1.data)
console.log(q3.q2.data)
//-----------------------------------------------
//-----------------------------------------------
class LinkedListNode {
  constructor(data, next = null) {
    this.next = next
    this.data = data
  }
}
class LinkedList {
  constructor() {
    this.head = null
  }
  insertFirst(data) {
    const node = new LinkedListNode(data, this.head)
    this.head = node
  }
  size() {
    let counter = 0
    let next = this.head
    while (next) {
      counter++
      next = next.next
    }
    return counter
  }
  getFirst() {
    return this.head
  }
  getLast() {
    if (this.head == null) return null
    let next = this.head
    while (next.next != null) {
      next = next.next
    }
    return next
  }
  clear() {
    this.head = null
  }
  removeFirst() {
    const node = this.head
    if (node) this.head = this.head.next
  }
  removeLast() {
    let node = this.head
    if (!node) return
    if (!node.next) {
      this.head = null
    }
    while (node.next.next) {
      node = node.next
    }
    const nextNode = node.next
    node.next = null
  }
  insertLast(data) {
    const node = new LinkedListNode(data)
    const last = this.getLast()
    if (!last) {
      this.head = node
    } else {
      last.next = node
    }
  }
  getAt(index) {
    if (index === 0) return this.head
    let counter = 0
    let node = this.head
    while (counter < index && node.next) {
      counter++
      node = node.next
    }
    if (counter === index) {
      return node
    }
    return null
  }
  removeAt(index) {
    if (!this.head) return
    if (index === 0) {
      this.head = this.head.next
      return
    }
    const prev = this.getAt(index - 1)
    if (!prev || !prev.next) return
    prev.next = prev.next.next
  }
  insertAt(data, index) {
    if (index === 0) {
      const node = this.head
      if (node) this.head = this.head.next
      return
    }
    const prev = this.getAt(index - 1)
    if (!prev) return
    if (!prev.next) {
      prev.next = new LinkedListNode(data)
      return
    }
    const node = new LinkedListNode(data, prev.next)
    prev.next = node
  }
// *[Symbol.iterator]() {
//     let node = this.head
//     while (node) {
//      yield node
//       node = node.next
//     }
//   }
}
const list = new LinkedList()
list.insertLast(1)
list.insertLast(2)
list.insertLast(3)
list.insertLast(4)
//-----------------------------------------------
//-----------------------------------------------
const midpoint = (l) => {
  let slow = l.getFirst()
  let fast = l.getFirst()
  while(fast && fast.next && fast.next.next) {
    slow = slow.next
    fast = fast.next.next
  }
  return slow
}
//-----------------------------------------------
//-----------------------------------------------
const circular = (l) => {
  let slow = l.getFirst()
  let fast = l.getFirst()
  while(fast && fast.next && fast.next.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      return true
    }
  }
  return false
}
//-----------------------------------------------
//-----------------------------------------------
const fromLast = (list, n) => {
  let prev = list.getFirst()
  let last = list.getAt(n)
  while (last.next) {
    prev = prev.next
    last = last.next
  }
  return prev
}
//-----------------------------------------------
//-----------------------------------------------
class TreeNode {
  constructor(data) {
    this.data = data
    this.children = []
  }
  add(data) {
    this.children.push(new TreeNode(data))
  }
  remove(data) {
    this.children = this.children.filter(node => node.data !== data)
  }
}
class Tree {
  constructor() {
    this.root = null
  }
  traverseBF(f) {
    const helper = (node, f) => {
      if (!node) return
      f(node)
      this.children.forEach(node => helper(node, f))
    }
    if (!this.root) return
    helper(this.root, f)
  }
}
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
