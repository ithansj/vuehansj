import request from "@/utils/request";

export default {
    //分页查询supplier列表
    searchGoods(page, size, searchMap) {
        return request({
            url: `/goods/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        });
    },
    addGoods(goods) {
        return request({
            url: '/goods',
            method: 'post',
            data: goods
        });
    },
    getGoodsById(id) {
        return request({
            url: `/goods/${id}`,
            method: 'get',
        });
    },
    updateGoods(goods) {
        return request({
            url: `/goods/${goods.id}`,
            method: 'put',
            data: goods
        });
    },
    deleteGoodsById(id){
        return request({
            url: `/goods/${id}`,
            method: 'delete'
        });
    }
}