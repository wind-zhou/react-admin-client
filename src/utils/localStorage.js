/* 

封装几个本地存储的方法
1、set
2、get
3、remove
*/
import store from 'store'
const USER_KEY = 'user_key'


export default {
    // 存储用户信息
    setUser(user) {
        store.set(USER_KEY, user) //这个库可以将参数写成对象的形式，他会激动换成字符串
    },


    // 读取用户信息
    getUser() {
        return (store.get(USER_KEY) || {})

    },

    // 移除用户信息
    removeUser() {
        store.remove(USER_KEY)
    }


}