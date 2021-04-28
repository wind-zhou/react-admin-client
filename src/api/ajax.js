import axios from 'axios'

import { message } from 'antd'

// 封装axois

/* 
1、优化统一处理请求异常

    在外层包一个promise对象
    请求出错时，不去reject(error).而是
*/

export default function ajax(url, data = {}, type = 'GET') { //封装一个ajax

    return new Promise((resolve, reject) => {
            // 1、执行ajax请求
            let promise;

            if (type === 'GET') { //get
                promise = axios.get(url, { //接收一下promise
                    params: data
                })
            } else { //post
                promise = axios.post(url, data)
            }

            // 2、成功后，调用reslove
            promise.then((response) => {
                resolve(response.data)

            }).catch((error) => { //请求出错也不reject，而是现实错误提示
                message.error('请求出错', error.message)

            })
        })
        // 这里新建返回了一个promise，在promise对象内内时另外一个promise（ajajx返回得出）对象返回的内容

}

// 请求登录的接口