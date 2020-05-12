import request from "@/utils/request";

export default {
    //查询部分
    //获取列表
    getSupplierList() {
        return request({
            url: '/supplier/list',
            method: 'get'
        });
    },
    //分页查询supplier列表
    searchSupplier(page, size, searchMap) {
        return request({
            url: `/supplier/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        });
    },
    //新增供应商
    addSupplier(supplier) {
        return request({
            url: '/supplier',
            method: 'post',
            data: supplier
        });
    },
    //根据id查询数据
    getSupplierById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'get',
        });
    },
    //更新数据
    updateSupplier(supplier) {
        return request({
            url: `/supplier/${supplier.id}`,
            method: 'put',
            data: supplier
        });
    },
    //删除
    deleteById(id) {
        return request({
            url: `/supplier/${id}`,
            method: 'delete'
        });
    }
    
}