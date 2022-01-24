import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";
import store from '@/store'


// 查询地址列表
export async function listAddress(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  if(!!param_deepcopy.address_name) param_deepcopy.address_name = {$regex: param.address_name};
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/admin/address/selectAddressList', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询地址列表 (表结构)
export async function tableAddress(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  if(!!param_deepcopy.address_name) param_deepcopy.address_name = {$regex: param.address_name};
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/admin/address', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询地址列表（排除节点）
export async function listAddressExcludeChild(addressId: any) {
  return await http.fetchGet('/api/admin/address/exclude/' + addressId, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询地址详细
export async function getAddress(addressId: any) {
  return await http.fetchGet(`/api/admin/address/${addressId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询地址下拉树结构
export async function treeselect() {
  return await http.fetchPost('/api/admin/address/treeselect', null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}



// 根据角色ID查询地址树结构
export async function roleAddressTreeselect(roleId: any) {
  return await http.fetchGet(`/api/admin/address/selectMenuListByRole/${roleId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增地址
export async function addAddress(params: any) {
  let  cloneParams = JSON.parse(JSON.stringify(params));
  if ( cloneParams.parent  == 0 ) 
  delete cloneParams.parent;
  cloneParams['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/admin/address', cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改地址
export async function updateAddress(params: any) {
  let  cloneParams = JSON.parse(JSON.stringify(params));
  if ( cloneParams.parent  == 0 ) 
  delete cloneParams.parent;
  return await http.fetchPatch(`/api/admin/address/${cloneParams._id}`, cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除地址
export async function delAddress(addressId: any) {
  return await http.fetchDelete(`/api/admin/address/${addressId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}