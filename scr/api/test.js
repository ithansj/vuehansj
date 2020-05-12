import request from "@/utils/request";  //导入等装好的axios请求对象 @代表src

const BASE_URL = "http://localhost:8888";


request.get(BASE_URL+"/db.json").then(response => {
    console.log("get1", response.data);
}).catch(error => {
    console.log(error);
});

request({
    url:BASE_URL+'/db.json',
    method:"get"
}).then(response=>{
    console.log("get2",response.data);
}).catch(error => {
    console.log(error);
});

export default {
    getList() {
        const req = request({
            url: BASE_URL + '/db.json',
            method: "get"
        });
        return req;  //返回的是一个promise对象
    }
}