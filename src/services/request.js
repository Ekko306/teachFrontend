import qs from 'qs';
import {message} from 'antd';

const checkStatus = res => {
    if (200 <= res.status && res.status < 300) {
        return res;
    }
    message.error(`网络请求失败,${res.status}`);
    const error = new Error(res.statusText);
    error.response = res;
    throw error;
};

/**
 *  捕获成功登录过期状态码等
 * @param res
 * @returns {*}
 */
const judgeOkState = async res => {
    const cloneRes = await res.clone().json();
    // TODO:可以在这里管控全局请求
    if (cloneRes.code == -1) {
        message.error(`${cloneRes.msg}${cloneRes.code}`);
    }
    return res;
};

/**
 * 捕获失败
 * @param error
 */
const handleError = error => {
    if (error instanceof TypeError) {
        message.error(`网络请求失败啦！${error}`);
    }
    return {   //防止页面崩溃，因为每个接口都有判断res.code以及data
        code: -1,
        data: false,
    };
};

class http {
    /**
     *静态的fetch请求通用方法
     * @param url
     * @param options
     * @returns {Promise<unknown>}
     */
    static async staticFetch(url = '', options = {}) {

        const defaultOptions = { // 这里都可以自定义配置
            /*允许携带cookies*/
            credentials: 'include',
            /*允许跨域**/
            mode: 'cors',
            headers: {
                // token: null,
                // Authorization: null,
                // 当请求方法是POST，如果不指定content-type是其他类型的话，默认为如下↓，要求参数传递样式为 key1=value1&key2=value2，但实际场景以json为多
                // 'content-type': 'application/x-www-form-urlencoded',
            },
        };
        if (options.method === 'POST' || 'PUT') {
            defaultOptions.headers['Content-Type'] = 'application/json; charset=utf-8';
        }
        const newOptions = {...defaultOptions, ...options};
        return fetch(url, newOptions)
            .then(checkStatus)
            .then(judgeOkState)
            .then(res => res.json())
            .catch(handleError);
    }

    /**
     * get请求方式 这里可能有id传递参数 但我的项目没用parmas传递参数 为了完整还是保留
     * @param url
     * @param id
     * @param params
     * @param option
     */
    get(url, id = "", params = {}, option = {}) {
        // qs.stringify:
        // {a:1, b:2} => 'a=1&b=2'
        let urlWithParams = url

        if (id !== "") {
            urlWithParams = url + '/' + id
        }
        if (Object.keys({}).length !== 0) {
            urlWithParams = url + '?' + qs.stringify(params)
        }
        const options = Object.assign({method: 'GET'}, option);
        return http.staticFetch(urlWithParams, options);
    }

    /**
     *post请求方式
     * @param url
     * @param body
     * @param option
     * @returns {Promise<unknown>}
     */
    post(url, body = {}, option = {}) {
        const options = Object.assign({method: 'POST'}, option);
        //一般我们常用场景用的是json，所以需要在headers加Content-Type类型
        options.body = JSON.stringify(body);

        //可以是上传键值对形式，也可以是文件，使用append创造键值对数据 这下面是上传图片
        if (options.type === 'FormData' && options.body !== 'undefined') {
            let params = new FormData();
            for (let key of Object.keys(options.body)) {
                params.append(key, options.body[key]);
            }
            options.body = params;
        }
        return http.staticFetch(url, options); //类的静态方法只能通过类本身调用
    }

    /**
     * put方法
     * @param url
     * @param body
     * @param option
     * @returns {Promise<unknown>}
     */
    put(url, body = {}, option = {}) {
        const options = Object.assign({method: 'PUT'}, option);
        options.body = JSON.stringify(body);
        return http.staticFetch(url, options); //类的静态方法只能通过类本身调用
    }

    /**
     * DELETE方法  看你的后端delete的参数在url里还是在body里 相应的改
     * delete是JavaScript的关键字 函数名称改为deleteFunc
     * @param url
     * @param body
     * @param option
     * @returns {Promise<unknown>}
     */
    deleteFunc(url, body = {}, option = {}) {
        const options = Object.assign({method: 'DELETE'}, option);
        options.body = JSON.stringify(body);
        return http.staticFetch(url, options); //类的静态方法只能通过类本身调用
    }
}

const request = new http(); //new生成实例
export const {get, post, put, deleteFunc} = request;
export default request;