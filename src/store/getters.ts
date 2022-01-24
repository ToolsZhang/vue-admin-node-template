const getters = {
  sidebar: (state: any) => state.app.sidebar,
  size: (state: any) => state.app.size,
  device: (state: any) => state.app.device,
  visitedViews: (state: any) => state.tagsView.visitedViews,
  cachedViews: (state: any) => state.tagsView.cachedViews,
  token: (state: any) => state.user.token,
  avatar: (state: any) => state.user.avatar,
  name: (state: any) => state.user.name,
  dept: (state: any) => state.user.dept,
  introduction: (state: any) => state.user.introduction,
  roles: (state: any) => state.user.roles,
  permissions: (state: any) => state.user.permissions,
  permission_routes: (state: any) => state.permission.routes,
  handlecount: (state: any) => state.permission.handlecount,
  debtcount: (state: any) => state.permission.debtcount,
  sidebarRouters:(state: any) => state.permission.sidebarRouters,
}
export default getters
