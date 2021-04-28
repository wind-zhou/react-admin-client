// 包含应用中所有请求接口的模块
/* 
    根据接口文档定义接口请求函数
 */

import ajax from './ajax'
const BASE = 'http://120.55.193.14:5000'


//  登录  （使用朗科的接口文档）
// export const reqLogin = (username, password) => ajax('http://www.qhdlink-student.top/student/login.php', { username, userpwd: password, userclass: '64', type: '4' }, 'POST')
// export const reqLogin = (username, password) => ajax('http://www.qhdlink-student.top/student/login.php', `username=${username}&userpwd=${password}&userclass=64&type=4`, 'POST')

// export const reqLogin = (username, password) => ajax('http://www.qhdlink-student.top/student/login.php', { username, userpwd: password, userclass: '64', type: '4' }, 'POST')

export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')