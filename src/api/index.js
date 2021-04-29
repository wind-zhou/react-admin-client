// 包含应用中所有请求接口的模块
/* 
    根据接口文档定义接口请求函数
 */



import ajax from './ajax'

const BASE = 'http://120.55.193.14:5000'


//  登录  （使用朗科的接口文档）
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
    // 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')
    // 查询ip的归属地
export const reqIpAddress = () => ajax(`pacific/ipJson.jsp?json=true`)
    // 查询归属地放入天气
export const reqWeather = (city) => ajax(
    'https://restapi.amap.com/v3/weather/weatherInfo', {
        city,
        'parameters?output': 'JSON',
        key: 'a83818082a16f559193ea520d68dca3d'
    },
    'GET')