import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/unique";
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询诉求列表
export async function listAppeal(param: any) {

    // 根据用户所在部门查询诉求信息
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    param_deepcopy['sort'] = '-createdAt';
    let formatParams = http.formatParams(param_deepcopy);
    return await http.fetchGet('/api/appeals', null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询需处理诉求列表
export async function handleListAppeal(param: any) {
    // 根据用户所在部门查询诉求信息
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    if(!param_deepcopy.classes || param_deepcopy.classes == undefined)
        param_deepcopy.classes = {$ne: "debt"};
    param_deepcopy['sort'] = '-createdAt';
    param_deepcopy.state = { $in:[ 'submitted', 'processing', 'partiallyCompleted']};
    const formatParams = http.formatParams(param_deepcopy);
    return await http.fetchGet('/api/appeals/handleList', null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询需处理债务诉求列表
export async function handleListDebtAppeal(param: any) {
    // 根据用户所在部门查询诉求信息
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    param_deepcopy.classes = "debt";
    param_deepcopy['sort'] = '-createdAt';
    param_deepcopy.state = { $in:[ 'submitted', 'processing', 'partiallyCompleted']};
    const formatParams = http.formatParams(param_deepcopy);
    return await http.fetchGet('/api/appeals/handleList', null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询诉求详细
export async function listAppealProcess(param: any) { 
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    let formatParams = http.formatParams(param_deepcopy);
    
    return await http.fetchGet(`/api/appealProcesses/`, null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}


// 查询诉求进度详细
export async function getAppeal(appealId: any) { 
    return await http.fetchGet(`/api/appeals/` + praseStrEmpty(appealId), null, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询当前用户未处理的诉求数量
export async function getAppealCount() { 
    return await http.fetchGet(`/api/appeals/appealCount`, null, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}
// // 新增诉求
// export async function addAppeal(params: any) {
//   params['__auth'] = AuthJwt.info?._id;
//   return await http.fetchPost('/api/appeals', params, {
//     Authorization: "Bearer " + AuthJwt.jwt
//   });
// }


// 处理诉求
export async function handleAppealById(appealId: any) {
    return await http.fetchPost('/api/appeals/handleAppealById', { appealId: appealId }, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 诉求提交上级
export async function superiorAppeal(params: any) {
    return await http.fetchPost('/api/appeals/superiorAppeal', params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 诉求部分完成
export async function partAppeal(params: any) {
    return await http.fetchPost('/api/appeals/partAppeal', params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}
// 诉求全部完成
export async function finishAppeal(params: any) {
    return await http.fetchPost('/api/appeals/finishAppeal', params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 诉求提交相关部门
export async function departmentAppeal(params: any) {
    return await http.fetchPost('/api/appeals/departmentAppeal', params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 修改诉求
export async function updateAppeal(params: any) {
    params['update_by'] = AuthJwt.info?._id;
    params['update_time'] = new Date();
    return await http.fetchPatch(`/api/appeals/${params._id}`, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 删除诉求
export async function delAppeal(appealId: any) {
    return await http.fetchDelete(`/api/appeals/${appealId}`, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 导出诉求
export async function exportAppeal(params: any) {
    return await http.fetchGet('/api/appeals/export', null, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}


// 诉求状态修改
export async function changeAppealStatus(appealId: any, status: any) {
    return await http.fetchPatch(`/api/appeals/changeStatus/${appealId}`, {status:status}, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}


// 下载诉求导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
