import request from "@/utils/request"; //导入封装好的ajax请求

export default {
    getMemberList() {
        //获取会员列表
        //返回的是一个promise对象
        return request({
            url: '/member/list',
            method: 'get'
        });
    },
    //分页查询的接口处理,page当前页，size每页大小，searchMap查询条件
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            // 需要提交的查询条件
            data: searchMap
        });
    },
    //增加会员api
    addMember(member) {
        return request({
            url: "/member",
            method: "post",
            data: member
        });
    },
    //根据id获取会员
    getById(id) {
        return request({
            url: `/member/${id}`,
            method: 'get'
        });
    },
    //修改会员
    updateMember(member) {
        return request({
            url: `/member/${member.id}`,
            method: 'put',
            data: member
        });
    },
    //删除会员
    deleteMemberById(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete',
        });
    }
}