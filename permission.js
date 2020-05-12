// 这里要做路由的权限设置，在未登录之前，不允许访问之后的内容，先去登录
// 采用路由的前置钩子函数



import router from "@/router"; //导入需要控制的路由
import { getUserInfo } from "@/api/login"; //导入getUserInfo方法

// 前置路有钩子函数beforeEach()
//参数：to，即将进入的目标路由
//from ,即将离开的路由
//next,进入路由目标

router.beforeEach((to, from, next) => {
    //获取token
    let token = localStorage.getItem('hanshijiang-cms-token');
    //没有token
    if (!token) {
        //即将要进入的不是登录页
        if (to.path !== '/login') {
            //去登录页
            next({ path: '/login' });
        } else {
            next();
        }
    } else {
        //获取到了token
        if (to.path == '/login') {
            next();
        } else {
            //获取用户信息
            let userInfo = localStorage.getItem('hanshijiang-cms-user');
            if (userInfo) {
                next();
            } else {
                //未获取到用户信息,需要获取到用户信息
                getUserInfo(token).then(response => {
                    let resp = response.data;
                    //获取到了用户信息之后，存入本地
                    if (resp.flag) {
                        localStorage.setItem('hanshijiang-cms-user', JSON.stringify(resp.data));
                        next();
                    } else {
                        next({ path: '/login' });
                    }
                });
            }
        }
    }
});