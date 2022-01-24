import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/unique";
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";


// 查询用户列表
export async function listUser(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  param_deepcopy['del_flag'] = '0';
  if(!!param_deepcopy.user_name) param_deepcopy.user_name = {$regex: param.user_name};
  if(!!param_deepcopy.phonenumber) param_deepcopy.phonenumber = {$regex: param.phonenumber};  
  // param_deepcopy.populate = [{path: 'dept'}]
  let formatParams = http.formatParams(param_deepcopy);
  
  return await http.fetchGet('/api/admin/users', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询用户详细
export async function getUser(userId: any) { 

  return await http.fetchGet(`/api/admin/users/` + praseStrEmpty(userId), null, {options: { populate : [{path:'roles'}] } }, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增用户
export async function addUser(params: any) {
  params['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/admin/users', params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改用户
export async function updateUser(params: any) {
  params['update_by'] = AuthJwt.info?._id;
  params['update_time'] = new Date();
  return await http.fetchPatch(`/api/admin/users/${params._id}`, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除用户
export async function delUser(userId: any) {
  return await http.fetchDelete(`/api/admin/users/${userId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 导出用户
export async function exportUser(params: any) {
  return await http.fetchGet('/api/admin/users/export', null, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 用户密码重置
export async function resetUserPwd(userId: any, password: any) {
  const data = {
    userId,
    password
  }
  return await http.fetchPatch(`/api/admin/users/resetPwd`, data, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 用户状态修改
export async function changeUserStatus(userId: any, status: any) {
  return await http.fetchPatch(`/api/admin/users/changeStatus/${userId}`, {status:status}, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询用户个人信息
export async function getUserProfile() {
  return await http.fetchGet(`/api/admin/users/profile`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改用户个人信息
export function updateUserProfile(data: any) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword: any, newPassword: any) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data: any) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
// 根据当前账户查找对应部门
export async function getDeptIdByUser() {
  return await http.fetchGet('/api/admin/users/getDeptId', null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}


// 根据当前账户查找对应地址
export async function getAddressIdByUser() {
  if(AuthJwt.hasRoles('super') || AuthJwt.hasRoles('admin_county') ) return undefined;
  return await http.fetchGet('/api/admin/users/getAddressId', null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}