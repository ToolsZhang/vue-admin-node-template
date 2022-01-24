import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";
import store from '@/store'


// 查询部门列表
export async function listDept(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  if(!!param_deepcopy.dept_name) param_deepcopy.dept_name = {$regex: param.dept_name};
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/admin/dept/selectDeptList', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询部门列表 (表结构)
export async function tableDept(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  if (AuthJwt.hasRoles('admin_county') && param_deepcopy.is_deal_appeal == "0")
    delete param_deepcopy.is_deal_appeal;
  if(!!param_deepcopy.dept_name) param_deepcopy.dept_name = {$regex: param.dept_name};
  let formatParams = http.formatParams(param_deepcopy);
  
  return await http.fetchGet('/api/admin/dept', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}
// 查询部门列表 (表结构) 去除模糊查询
export async function tableHandleDept(param: any) {
  let param_deepcopy = JSON.parse(JSON.stringify(param));
  let formatParams = http.formatParams(param_deepcopy);
  return await http.fetchGet('/api/admin/dept', null, formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}
// 查询部门列表（排除节点）
export async function listDeptExcludeChild(deptId: any) {
  return await http.fetchGet('/api/admin/dept/exclude/' + deptId, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询部门详细
export async function getDept(deptId: any) {
  return await http.fetchGet(`/api/admin/dept/${deptId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 查询部门下拉树结构
export async function treeselect(params?: any) {
  let formatParams = {};
  if(params) formatParams = http.formatParams(params);
  return await http.fetchPost('/api/admin/dept/treeselect', formatParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}


// 根据角色ID查询部门树结构
export async function roleDeptTreeselect(roleId: any) {
  return await http.fetchGet(`/api/admin/dept/selectMenuListByRole/${roleId}`, null, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 新增部门
export async function addDept(params: any) {
  let  cloneParams = JSON.parse(JSON.stringify(params));
  if ( cloneParams.parent  == 0 ) 
  delete cloneParams.parent;
  cloneParams['__auth'] = AuthJwt.info?._id;  
  cloneParams['roles'] = []
  for (const role of store.getters.roles) {
    cloneParams['roles'].push(role._id);
  }
  return await http.fetchPost('/api/admin/dept', cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 修改部门
export async function updateDept(params: any) {
  let  cloneParams = JSON.parse(JSON.stringify(params));
  if ( cloneParams.parent  == 0 ) 
  delete cloneParams.parent;
  return await http.fetchPatch(`/api/admin/dept/${cloneParams._id}`, cloneParams, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}

// 删除部门
export async function delDept(deptId: any) {
  return await http.fetchDelete(`/api/admin/dept/${deptId}`, null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}