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

  }

  // 核心方法: 创建fragment
  node2fragment(node) {
    let fragment = document.createDocumentFragment();

    // 将
  }


}