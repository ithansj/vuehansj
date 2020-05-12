import Vue from "vue"; //引入vue模块
import ElementUi from "element-ui"; //导入element-ui组件库
import "element-ui/lib/theme-chalk/index.css"; //引入样式
import App from "./App.vue"; //引入App组件
import router from "./router"; //引入路由组件


Vue.use(ElementUi); //使用element-ui组件


//消息提示的环境配置，是否为生产环境
//false为开发环境：vue会提供很多警告用来方便调试代码
//true为生产环境，警告没有用，会增加应用的体积
Vue.config.productionTip = process.env.NODE_ENV === "production";

//全局的权限拦截
import "@/permission";

//创建vue实例
new Vue({
  router,  //将路由加载到vue中
  render: h => h(App)  //将App组件加载到render函数中，直接进行渲染
}).$mount("#app");  //挂载到#app节点处
