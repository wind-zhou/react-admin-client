import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import LocalUser from './utils/localStorage'
import memoryUser from './utils/memoryUser'


//每次刷新， 在入口文件处读取本地的值
const user= LocalUser.getUser()

console.log(user)
// 将读取的数据存到内存
memoryUser.user=user



ReactDOM.render( < App /> ,
    document.getElementById("root")
)
