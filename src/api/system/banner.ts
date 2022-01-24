
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";

// 查询轮播图列表
export async function listBanner(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  param_deepcopy['sort'] = '-createdAt';
  if(!!param_deepcopy.name) param_deepcopy.name = {$regex: param.name};
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/banners', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询轮播图详细
export async function getBanner(bannerId: any) { 
  return await http.fetchGet(`/api/banners/${bannerId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增轮播图
export async function addBanner(params: any) {
  params['__auth'] = AuthJwt.info?._id;
  return await http.fetchPost('/api/banners', params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改轮播图
export async function updateBanner(params: any) {
  return await http.fetchPatch(`/api/banners/${params._id}`, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 轮播图状态修改
export async function changeBannerStatus(bannerId: any, status: any) {
  const data = {
    bannerId,
    status
  }
  return await http.fetchPut(`/api/banners/changeStatus`, data, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除轮播图
export async function delBanner(bannerId: any) {
  return await http.fetchDelete(`/api/banners/${bannerId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}
