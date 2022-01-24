import { praseStrEmpty } from "@/utils/unique";
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询包联干部工作日志列表
export async function listLog(param: any) {
    let param_deepcopy = JSON.parse(JSON.stringify(param));
    param_deepcopy['sort'] = '-createdAt';
    if(!!param_deepcopy.name) param_deepcopy.name = {$regex: param.name};
    let formatParams = http.formatParams(param_deepcopy);
    return await http.fetchGet('/api/reports', null, formatParams, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 查询包联干部工作日志详细
export async function getLog(logId: any) { 
    return await http.fetchGet(`/api/reports/` + praseStrEmpty(logId), null, {options: { populate : [{path:'roles'}] } }, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}


// 删除包联干部工作日志
export async function delLog(logId: any) {
    return await http.fetchDelete(`/api/reports/${logId}`, null, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}

// 导出包联干部工作日志
export async function exportLog(params: any) {
    return await http.fetchGet('/api/reports/export', null, params, {
        Authorization: "Bearer " + AuthJwt.jwt
    });
}