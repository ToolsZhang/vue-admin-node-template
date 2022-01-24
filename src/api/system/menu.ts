
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";
import store from '@/store'
// 查询菜单列表
export async function listMenu(params: any) {
  return await http.fetchGet('/api/admin/menu/selectMenuList', null, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询菜单详细
export async function getMenu(menuId: any) {
  return await http.fetchGet(`/api/admin/menu/${menuId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询菜单下拉树结构
export async function treeselect() {
  return await http.fetchPost('/api/admin/menu/treeselect', null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 根据角色ID查询菜单下拉树结构
export async function roleMenuTreeselect(roleId: any) {
  return await http.fetchGet(`/api/admin/menu/selectMenuListByRole/${roleId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增菜单
export async function addMenu(params: any) {
  if ( params.parent  == 0 || params.parent  == null) {
    params.parent = null ;
    params.menu_relation = 'base';
  }else{
    params.menu_relation = 'child';
  }
  params['__auth'] = AuthJwt.info?._id;  
  params['roles'] = []
  for (const role of store.getters.roles) {
    params['roles'].push(role._id);
  }
  return await http.fetchPost('/api/admin/menu', params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改菜单
export async function updateMenu(params: any) {
  console.log(params.parent);
  if ( params.parent  == 0 || params.parent  == null) {
    params.parent = null ;
    params.menu_relation = 'base';
  }else{
    params.menu_relation = 'child';
  }
  return await http.fetchPatch(`/api/admin/menu/${params._id}`, params, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除菜单
export async function delMenu(menuId: any) {
  return await http.fetchDelete(`/api/admin/menu/${menuId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}