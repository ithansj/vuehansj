import Vue from "vue";
import Router from "vue-router";
import Login from "@/view/login";
import Layout from "@/components/Layout";
import Member from "@/view/member";
import Goods from "@/view/goods";
import Home from "@/view/home";
import Staff from "@/view/staff";
import Supplier from "@/view/supplier";

Vue.use(Router);

export default new Router({
  routes: [
    //登录页login
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    //基础布局
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/home',//重定向到子路由
      children: [
        {
          path: '/home',
          component: Home,
          meta: { title: '首页' }
        }
      ]
    },
    {
      path:'/member',
      component:Layout,
      children:[
        {
          path:'/',
          component:Member,
          meta: { title: '会员管理' }
        }
      ]
    },
    {
      path:'/goods',
      component:Layout,
      children:[
        {
          path:'/',
          component:Goods,
          meta: { title: '商品管理' }
        }
      ]
    },
    {
      path:'/staff',
      component:Layout,
      children:[
        {
          path:'/',
          component:Staff,
          meta: { title: '员工管理' }
        }
      ]
    },
    {
      path:'/supplier',
      component:Layout,
      children:[
        {
          path:'/',
          component:Supplier,
          meta: { title: '供应商管理' }
        }
      ]
    }
  ]
});
