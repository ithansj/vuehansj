import request from "@/utils/request";

export default {
    searchStaff(page, size, searchMap) {
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        });
    },
    addStaff(staff) {
        return request({
            url: `/staff`,
            method: 'post',
            data: staff
        });
    },
    updateStaff(staff) {
        return request({
            url: `/staff/${staff.id}`,
            method: 'put',
            data: staff
        });
    },
    getStaffById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'get'
        });
    },
    deleteStaffById(id){
        return request({
            url: `/staff/${id}`,
            method: 'delete'
        });
    }
}