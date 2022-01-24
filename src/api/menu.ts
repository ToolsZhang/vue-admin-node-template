
import * as http from "@/utils/https";
import AuthJwt from "@/utils/auth";

// 获取路由
export const getRouters = async () => {
  const url = `/api/admin/users?_filters=${JSON.stringify({
    active: true,
    menu_relation : 'parent'
  })}&_options=${JSON.stringify({
    limit: 1000,
    populate: [{
      path: 'children'
    }]
  })}`
  return await http.fetchPost('/api/admin/menu/getRouters', null, {
    Authorization: "Bearer " + AuthJwt.jwt
  });
}