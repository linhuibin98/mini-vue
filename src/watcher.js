// Warcher 用于将compile与observe模块关联起来, 收集依赖

class Watcher {
  /**
   *Creates an instance of Warcher.
   * @param {*} vm Vue实例
   * @param {*} expression 用户获取数据的变量或表达式
   * @param {*} cb 监听数据改变之后,调用cb 
   * @memberof Warcher
   */
  constructor (vm, expression, cb) {
    this.vm = vm;
    this.expression = expression;
    this.cb = cb;

    // 储存Watcher实例到Dev.target上
    Dep.target = this;

    // 存储expression在data中的旧值
    this.oldValue = this.getVMValue(vm ,expression);
    Dep.target = null;
  }

  update () {
    let oldValue = this.oldValue;
    let newValue = this.getVMValue(this.vm, this.expression);
    if (oldValue !== newValue) {
      this.cb(newValue, oldValue);
      this.oldValue = newValue;
    }
  }

  getVMValue (vm, expression) {
    // expression的形式可能是 name、o.name、o['name']、true || name、的形式

    let data = vm.$data;

    // 处理o['name']形式取值
    let reg = /(.+)\[.{1}(.+).{1}\]/g;

    if (reg.test(expression)) { // 处理o['name']形式取值
      expression = `${RegExp.$1}.${RegExp.$2}`;
    }
    expression.split('.').forEach(key => {
      
      data = data[key];
    });

    return data;
  }
}

class Dep {
  constructor () {
    // 存储订阅者
    this.subs = [];
  }

  // 添加订阅者
  addSub (warcher) {
    this.subs.push(warcher);
  }

  // 通知
  notify () {
    this.subs.forEach(watcher => {
      // 更新数据
      watcher.update();
    });
  }
}