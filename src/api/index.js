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

// 查询商品种类（一级列表或二级列表）
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })


// 增加商品种类
export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', { parentId, categoryName }, 'POST')

// 更新（修改）商品种类

export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

// 点击请求产品信息

export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

// 搜索商品  productName/productDesc  两种所搜方式  
export const reqSearch = (pageNum, pageSize, srarchName, searchType) => (
    ajax(BASE + '/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: srarchName
    })
)

// 查询产品分类

export const reqProductCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })


// 下架商家商品

export const reqUpdataStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'PSOT')


// 过去roles列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加role

export const reqAddRoles = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')