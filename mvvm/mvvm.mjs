function Mvvm(options = {}) {
    this.$options = options;
    let data = this._data = this.$options.data; 
    //数据劫持
    observe(data);

    

    //数据代理
    for(let key in data) {
        //这里完成的代理 this的定义
        Object.defineProperty(this, key, {
            configurable: true,
            set(val) {
                this._data[key] = val;
            },
            get() {
                return this._data[key];
            }
        })
    }

    // 编译
    new Compile(options.el, this);
}

function Observe(data) {
    let dep = new Dep();
    for(let key in data) {
        let val = data[key];
        observe(val);
        Object.defineProperty(data, key, {
            set(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                observe(newVal);
                dep.notify();
            },
            get() {
                Dep.target && dep.addSub(Dep.target);
                return val;
            }
        })
    }
}

function observe(data) {
    if (!data || typeof data !== 'object') return;
    return new Observe(data);
}

// 创建Compile构造函数
function Compile(el, vm) {
    // 将el挂载到实例上方便调用
    vm.$el = document.querySelector(el);
    // 在el范围里将内容都拿到，当然不能一个一个的拿
    // 可以选择移到内存中去然后放入文档碎片中，节省开销
    let fragment = document.createDocumentFragment();
    while (child = vm.$el.firstChild) {
        fragment.appendChild(child);    // 此时将el中的内容放入内存中
    }
    // 对el里面的内容进行替换
    function replace(frag) {
        Array.from(frag.childNodes).forEach(node => {
            let txt = node.textContent;
            let reg = /\{\{(.*?)\}\}/g;   // 正则匹配{{}}
            
            if (node.nodeType === 3 && reg.test(txt)) { // 即是文本节点又有大括号的情况{{}}
                function replaceTxt() {
                    node.textContent = txt.replace(reg, (matched, placeholder) => {
                        console.log(placeholder); // 匹配到的分组 如：song, album.name, singer...
                        new Watcher(vm, placeholder, replaceTxt); // 监听变化，进行匹配替换内容

                        return placeholder.split('.').reduce((val, key) => {
                            return val[key];
                        }, vm);
                    });
                };
                // 替换
                replaceTxt();
            }
            if (node.nodeType === 1) {  // 元素节点
                let nodeAttr = node.attributes; // 获取dom上的所有属性,是个类数组
                Array.from(nodeAttr).forEach(attr => {
                    let name = attr.name;   // v-model  type
                    let exp = attr.value;   // c        text
                    if (name.includes('v-')){
                        node.value = vm[exp];   // this.c 为 2
                    }
                    // 监听变化
                    new Watcher(vm, exp, function(newVal) {
                        node.value = newVal;   // 当watcher触发时会自动将内容放进输入框中
                    });
                    
                    node.addEventListener('input', e => {
                        let newVal = e.target.value;
                        // 相当于给this.c赋了一个新值
                        // 而值的改变会调用set，set中又会调用notify，notify中调用watcher的update方法实现了更新
                        vm[exp] = newVal;   
                    });
                });
            }
            // 如果还有子节点，继续递归replace
            if (node.childNodes && node.childNodes.length) {
                replace(node);
            }
        });
    }
    replace(fragment);  // 替换内容
    vm.$el.appendChild(fragment);   // 再将文档碎片放入el中
}

//订阅事件池
function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSub(sub) {
        this.subs.push(sub);
    },
    notify() {
        this.subs.forEach((fn) => fn.update());
    }
}

// 监听函数
function Watcher(vm, exp, fn) {
    this.fn = fn;
    this.vm = vm;
    this.exp = exp;

    Dep.target = this;
    let arr = exp.split('.');
    let val = vm;
    arr.forEach((key) => {
        val = val[key];
    });
    
    Dep.target = null;
}

Watcher.prototype.update = function() {
    let arr = this.exp.split('.');
    let val = this.vm;
    arr.forEach(key => {
        val = val[key];
    });
    this.fn(val);
}



