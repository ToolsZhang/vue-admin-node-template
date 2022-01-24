import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/unique";
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询群众详情列表
export async function listMassesInfo(param: any) {

    // 根据群众所在部门查询群众详情信息
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    param_deepcopy['sort'] = '-createdAt';
    //   if(!!param_deepcopy.user_name) param_deepcopy.user_name = {$regex: param.user_name};
    //   if(!!param_deepcopy.phonenumber) param_deepcopy.phonenumber = {$regex: param.phonenumber};  
    // param_deepcopy.populate = [{path: 'dept'}]
    let formatParams = http.formatParams(param_deepcopy);
    
    return await http.fetchGet('/api/massesInfos', null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询群众详情详细
export async function getMassesInfo(appealId: any) { 
    return await http.fetchGet(`/api/massesInfos/` + praseStrEmpty(appealId), null, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// // 新增群众详情
// export async function addAppeal(params: any) {
//   params['__auth'] = AuthJwt.info?._id;
//   return await http.fetchPost('/api/appeals', params, {
//     Authorization: "Bearer " + AuthJwt.jwt
//   });
// }

// 修改群众详情
export async function updateMassesInfo(params: any) {
    // params['update_by'] = AuthJwt.info?._id;
    // params['update_time'] = new Date();
    return await http.fetchPatch(`/api/massesInfos/${params._id}`, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 删除群众详情
export async function delMassesInfo(appealId: any) {
    return await http.fetchDelete(`/api/massesInfos/${appealId}`, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 导出群众详情
export async function exportMassesInfo(params: any) {
    return await http.fetchGet('/api/massesInfos/export', null, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}


// 群众详情状态修改
export async function changeMassesInfoStatus(appealId: any, status: any) {
    return await http.fetchPatch(`/api/massesInfos/changeStatus/${appealId}`, {status:status}, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}


// 下载群众详情导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
