import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/unique";
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询群众列表
export async function listMasses(param: any) {
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    param_deepcopy['sort'] = '-createdAt';
    if(!!param_deepcopy.name) param_deepcopy.name = {$regex: param.name};
    if(!!param_deepcopy.habitation_list){
        param_deepcopy.habitation = param_deepcopy.habitation_list;
        delete param_deepcopy.habitation_list;
    }else if (!!param_deepcopy.habitation){
        param_deepcopy.habitation={$in:[param_deepcopy.habitation]}
    }
    let formatParams = http.formatParams(param_deepcopy);
    
    return await http.fetchGet('/api/massesMappings', null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询群众详情详细
export async function getMasses(massesId: any) { 
    return await http.fetchGet(`/api/massesMappings/` + praseStrEmpty(massesId), null, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 修改群众详情
export async function updateMasses(params: any) {
    params['update_by'] = AuthJwt.info?._id;
    params['update_time'] = new Date();
    return await http.fetchPatch(`/api/massesMappings/${params._id}`, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 删除群众详情
export async function delMasses(massesId: any) {
    return await http.fetchDelete(`/api/massesMappings/${massesId}`, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 导出群众详情
export async function exportMasses(params: any) {
    return await http.fetchGet('/api/massesMappings/export', null, params, {
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
