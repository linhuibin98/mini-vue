// 定义类 Vue
class Vue {
  constructor(options = {}) {
    // 将根元素、data挂在到Vue实例上
    this.$el = options.el;
    this.$data = options.data;

    if (this.$el) {
      // Compile 负责解析模板, 替换数据
      // 需要传入模板和数据data
      new Compile(this.$el, this);
    }
  }
}

// 解析模板
class Compile {

}