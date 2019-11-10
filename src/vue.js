// 定义类 Vue
class Vue {
  constructor(options = {}) {
    // 将根元素、data挂在到Vue实例上
    this.$el = options.el;
    this.$data = options.data;

    if (this.$el) {
      // Compile 负责解析模板内容, 替换数据
      // 需要传入模板和数据data
      new Compile(this.$el, this);
    }
  }
}

// 解析模板
class Compile {
  constructor(el, vm) {
    // el, new Vue传入的选择器, 也可以直接是dom元素
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    // vm, Vue的实例
    this.vm = vm;

    // 解析编译
    if (this.el) {
      // 1.将el中所有的子节点放入内存,即文档碎片中
      let fragment = this.node2fragment(this.el);
      
      // 2. 在内存中解析fragment
      this.compile(fragment);

      // 3. 将编译后的fragment添加到页面
      this.el.appendChild(fragment);
    }
  }

  // 创建fragment
  node2fragment(node) {
    let fragment = document.createDocumentFragment();

    let childNodes = node.childNodes;

    // 将el中所有的子节点放入fragment中
    this.toArray(childNodes).forEach(node => {
      fragment.appendChild(node);
    });
    return fragment;
  }

  // 编译fragment
  compile (fragment) {
    let childNodes = fragment.childNodes;

    this.toArray(childNodes).forEach(node => {
      // 编译子节点

      // 若是元素节点, 则需要编译指令, 像v-bind、v-text、v-html
      if (this.isElementNode(node)) {
        this.compileElement(node);
      }

      // 文本节点
      if (this.isTextNode(node)) {
        // 空节点不编译, 压缩文件不需要这步
        if (node.textContent.trim()) {
          this.compileText(node);
        }
      };

      // 如果当前节点还存在子节点, 递归编译
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 编译元素节点
  compileElement (node) {
    // 获取元素上所有的属性
    let attributes = node.attributes;

    this.toArray(attributes).forEach(attr => {
      let attrName = attr.name;

      // 判断是否是指令
      if (this.isDirective(attrName)) {
        // 解析指令, 值可能表示变量, 也可能是有返回值的表达式
        let type = attrName.slice(2); // 例如: v-html取html
        let expression = attr.value;

        // 是否为绑定事件
        if (this.isEventDirective(type)) {
          //
        } else {
          CompileUtil[type] && CompileUtil[type](node, expression, this.vm);
        }
      }
    })
  }

  // 编译文本节点
  compileText (node) {
    CompileUtil.mustache(node, this.vm);
  }

  // 工具方法

  // 将类数组转为数组
  toArray (likeArray) {
    return Array.prototype.slice.call(likeArray);
  }

  // 是否为元素节点
  isElementNode (node) {
    return node.nodeType === 1;
  }

  // 是否为文本节点
  isTextNode (node) {
    return node.nodeType === 3;
  }
  
  // 判断标签上的属性是否是Vue指令, 即以 'v-'开头的属性
  isDirective (attrName) {
    return attrName.startsWith('v-'); 
  }

  // 是否是v-on绑定的事件
  isEventDirective (type) {
    // 例如, type = on:input
    return type.split(':')[0] === 'on';
  }
}


let CompileUtil = {
  // 解析文本节点大胡子语法：{{title}}
  mustache (node, vm) {
    let text = node.textContent;

    let reg = /\{\{(.+?)\}\}/g;

    if (reg.test(text)) {
      // 编译
      node.textContent = text.replace(reg, (match, p1) => {
        return this.getVMValue(vm, p1);
      });
    }
  },
  text (node, expression, vm) {
    node.textContent = this.getVMValue(vm, expression);
  },

  html (node, expression, vm) {
    node.innerHTML = this.getVMValue(vm, expression);
  },
  // 用于获取vm $data中的数据
  getVMValue (vm, expression) {
    // expression的形式可能是 name、o.name、o['name']、true || name、的形式

    let data = vm.$data;

    // 处理o['name']形式取值
    let reg = /(.+)\[.{1}(.+).{1}\]/g;

    if (reg.test(expression)) { // 处理o['name']形式取值
      expression = `${RegExp.$1}.${RegExp.$2}`;
    }

    expression.split('.').forEach(key => {
      // console.log(key);
      data = data[key];
    });

    return data;
  }
}