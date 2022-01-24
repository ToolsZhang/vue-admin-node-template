
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";

// 查询公告列表
export async function listMessage(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  param_deepcopy['sort'] = '-createdAt';
  if(!!param_deepcopy.title) param_deepcopy.title = {$regex: param.title};
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/messages', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询公告详细
export async function getMessage(messageId: any) { 
  return await http.fetchGet(`/api/messages/${messageId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增公告
export async function addMessage(params: any) {
  params['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/messages', params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改公告
export async function updateMessage(params: any) {
  return await http.fetchPatch(`/api/messages/${params._id}`, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 公告状态修改
export async function changeMessageStatus(messageId: any, status: any) {
  const data = {
    messageId,
    status
  }
  return await http.fetchPut(`/api/messages/changeStatus`, data, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除公告
export async function delMessage(messageId: any) {
  return await http.fetchDelete(`/api/messages/${messageId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}
