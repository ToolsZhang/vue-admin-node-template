import { praseStrEmpty } from "@/utils/unique";
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询包联干部签到记录列表
export async function listSign(param: any) {
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    param_deepcopy['sort'] = '-createdAt';
    if(!!param_deepcopy.name) param_deepcopy.name = {$regex: param.name};
    param_deepcopy.populate = [{path: 'masses'}]
    let formatParams = http.formatParams(param_deepcopy);
    return await http.fetchGet('/api/signIn/signIns', null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询包联干部签到记录详细
export async function getSign(signId: any) { 
    return await http.fetchGet(`/api/signIn/signIns/` + praseStrEmpty(signId), null, {options: { populate : [{path:'roles'}] } }, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}


// 删除包联干部签到记录
export async function delSign(signId: any) {
    return await http.fetchDelete(`/api/signIn/signIns/${signId}`, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 导出包联干部签到记录
export async function exportSign(params: any) {
    return await http.fetchGet('/api/signIn/signIns/export', null, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}