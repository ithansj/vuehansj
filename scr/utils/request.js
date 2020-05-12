import axios from "axios"; //导入axios模块

const request = axios.create({
    // baseURL: '/',  //基础路径
    baseURL:process.env.VUE_APP_BASE_API,
    timeout: 5000  //超时时间设置
});

export default request;  //导出封装好的请求对象