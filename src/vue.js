// 定义类 Vue
class Vue {
  constructor(options = {}) {
    // 将根元素、data挂在到Vue实例上
    this.$el = options.el;
    this.$data = options.data;
    this.$methods = options.methods;

    // 将data中属性代理到vm实例上
    this.proxy(this.$data);
    this.proxy(this.$methods);

    // 监视data中的数据
    new Observe(this.$data);

    if (this.$el) {
      // Compile 负责解析模板内容, 替换数据
      // 需要传入模板和数据data
      new Compile(this.$el, this);
    }
  }

  // 
  proxy (data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get () {
          return data[key];
        },
        set (newVal) {
          if (data[key] === newVal) return;
          data[key] = newVal;
        }
      });
    })
  }
}