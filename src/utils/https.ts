import { Notification, MessageBox, Message } from 'element-ui';
import store from '@/store'
import errorCode from '@/utils/errorCode';
import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 5000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
//配置请求头
axios.defaults.baseURL = 'http://39.105.75.113:8001'; //配置接口地址
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if (config.method === 'post' && config.url !== '/fileuploads/banners' && config.url !== '/fileuploads/images') {
        config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    let code = res.data.code || 200;
    // 获取错误信息
    let msg: string;
    switch (code) {
        case '401':
            msg = errorCode['401'];
            MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }
            ).then(() => {
                console.log('output');
                
                // store.dispatch('LogOut').then(() => {
                //     location.href = '/index';
                // })
            });
            break;
        case '403':
            msg = errorCode['403']
            console.log(1212);
            
            Message({
                message: res.data.message,
                type: 'error',
                duration: 5 * 1000
            })
            break;
        case '404':
            msg = errorCode['404']
            break;
        default:
            msg = res.data.msg || errorCode['default'];
            break;
    }
    if (code === 500) {
        Message({
            message: msg,
            type: 'error'
        })
        return Promise.reject(new Error(msg))
    } else if (code !== 200 && code !== 201) {
        Notification.error(msg)
        return Promise.reject('error')
    } else {
        return res.data
    }
},
    error => {
        console.log(error);
        
        let  code  = error.message;
        let message = error.response.data.message
        if (code.substr(code.length - 3) === '401') {
            return MessageBox.confirm('登录状态已过期，请重新登录!', '系统提示', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('LogOut').then(() => {
                    location.href = '/index';
                })
            });
        }
        if (code == "Network Error") {
            code = "后端接口连接异常";
        }
        else if (code.includes("timeout")) {
            code = "系统接口请求超时";
        }
        else if (code.includes("Request failed with status code")) {
            code = "系统接口" + code.substr(code.length - 3) + "异常";
        }
        Message({
            message: code+ ' : '+ message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
    );

//返回一个Promise(发送post请求)
export function fetchPost(url: string, params?: any, header?: any) {
    return new Promise((resolve, reject) => {
        let postheader = axios.defaults.headers.post;
        if (header) 
            postheader['Authorization'] = header.Authorization
        axios.post(url, params, { headers:  postheader })
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//返回一个Promise(发送post请求)
export function fetchFileUpload(url: string, params?: any, header?: any) {
    // delete axios.defaults.headers.post['Content-Type'];
    return new Promise((resolve, reject) => {
        if (header) 
            axios.defaults.headers.post['Authorization'] = header.Authorization
        header = axios.defaults.headers.post;
        axios({
                url: url,
                method: 'POST',
                headers: header,
                data: params
            }).then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url: string, param?: any, params?: any, header?: any) {
    return new Promise((resolve, reject) => {
        if (params && params.filters) {
            url = url + `?_filters=${JSON.stringify(params.filters)}`;
            if (params.options)
                url = url + `&_options=${JSON.stringify(params.options)}`;
        } else if (params && !params.filters && params.options) {
            url = url + `?_options=${JSON.stringify(params.options)}`;
        }
        
        axios.get(url, { params: param, headers: header })
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送put请求)
export function fetchPut(url: string, params?: any, header?: any) {
    return new Promise((resolve, reject) => {
        axios.put(url, params, { headers: header })
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}



export function fetchPatch(url: string, params?: any, header?: any) {
    return new Promise((resolve, reject) => {
        axios.patch(url, params, { headers: header })
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export function fetchDelete(url: string, params?: any, header?: any) {
    return new Promise((resolve, reject) => {
        axios.delete(url, { params: params, headers: header })
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            });
    })
}
export function formatParams(param: any) {
    if(!!param['dateRange']) param['createdAt'] = param['dateRange'];
    else delete param['createdAt'];
    delete param['dateRange'];
    const optionSelect = ['total','page','pages','page','sort', 'limit','offset','populate'];
    let options = {};
    let filters = {};
    for(let key  in param){
        if ( optionSelect.indexOf(key) >= 0 ) {
            options[key] = param[key];
            continue;
        }
        if (key && !!param[key] && key !== 'dateRange'){
            filters[key] = param[key];
        }
    }
    return {options,filters};
}
export interface RequestParams {
    url : string,
    params?: any,
    param?: any,
    header?: any
}
export default {
    fetchPost,
    fetchGet,
    fetchPut,
    fetchPatch,
    fetchDelete,
    fetchFileUpload
}