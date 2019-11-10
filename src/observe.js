// observe 用于监听data中的数据获取和设置

class Observe {
  constructor(data) {
    this.data = data;

    this.walk(data);
  }

  // 遍历data中的数据, 添加getter和setter方法
  walk (data) {
    if (!data || typeof data !== 'object') return;

    Object.keys(data).forEach(key => {
      let value = data[key];
      // 劫持
      this.defineReactive(data, key, value);
      // 递归劫持data中的对象
      this.walk(value);
    });
  }

  // 数据劫持
  defineReactive (obj, key, value) {
    let self = this;
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        return value;
      },
      set (newVal) {
        if (value === newVal) return;
        value = newVal;

        // 若果newVal是一个对象, 也需要进行劫持
        self.walk(newVal);
      }
    })
  }
}