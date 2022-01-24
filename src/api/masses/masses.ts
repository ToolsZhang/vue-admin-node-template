import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/unique";
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询用户列表
export async function listMasses(param: any) {
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    param_deepcopy['sort'] = '-createdAt';
    let formatParams = http.formatParams(param_deepcopy);
    return await http.fetchGet('/api/masses', null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询用户详情详细
export async function getMasses(massesId: any) { 
    return await http.fetchGet(`/api/masses/` + praseStrEmpty(massesId), null, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 修改用户详情
export async function updateMasses(params: any) {
    // params['update_by'] = AuthJwt.info?._id;
    // params['update_time'] = new Date();
    return await http.fetchPatch(`/api/masses/${params._id}`, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 删除用户详情
export async function delMasses(massesId: any) {
    return await http.fetchDelete(`/api/masses/${massesId}`, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 导出用户详情
export async function exportMasses(params: any) {
    return await http.fetchGet('/api/masses/export', null, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}




// 下载用户详情导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
