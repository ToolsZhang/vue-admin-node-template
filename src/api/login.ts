import * as https from '@/utils/https'

// 登录方法
export function login(username: any, password: any, code?: any, uuid?: any) {
  const data = {
    username,
    password,
    code: !!code ? code : null,
    uuid: !!uuid ? uuid : null,
  }
  return https.fetchPost('/api/admin/users/login', data);
}

// 获取用户详细信息
export function getInfo(header: any) {
  const url = `/api/admin/users/getInfo`;
  return https.fetchPost(url,null,header);
}

// 退出方法
export function logout(header: any) {
  return https.fetchPost('/api/admin/users/logout', header);
}

// 获取验证码
export function getCodeImg() {
  return https.fetchGet('/api/admin/captchas/captchaImage');
}