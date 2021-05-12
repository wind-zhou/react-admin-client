# react 的后台管理系统

```

├─ .vscode
│  └─ settings.json
├─ config
│  ├─ env.js
│  ├─ getHttpsConfig.js
│  ├─ jest
│  │  ├─ babelTransform.js
│  │  ├─ cssTransform.js
│  │  └─ fileTransform.js
│  ├─ modules.js
│  ├─ paths.js
│  ├─ pnpTs.js
│  ├─ webpack.config.js
│  └─ webpackDevServer.config.js
├─ config-overrides.js
├─ package-lock.json
├─ package.json
├─ public
│  ├─ index.html
│  └─ reset.css
├─ README.md
├─ scripts
│  ├─ start.js
│  └─ test.js
├─ src
│  ├─ api
│  │  ├─ ajax.js
│  │  └─ index.js
│  ├─ App.jsx
│  ├─ assets
│  │  └─ logo.png
│  ├─ components
│  │  ├─ header
│  │  │  ├─ header.css
│  │  │  └─ header.jsx
│  │  ├─ left-nav
│  │  │  ├─ index.css
│  │  │  └─ index.jsx
│  │  └─ link-button
│  │     ├─ index.css
│  │     └─ index.jsx
│  ├─ config
│  │  └─ menuConfig.js
│  ├─ index.js
│  ├─ pages
│  │  ├─ admin
│  │  │  └─ admin.jsx
│  │  ├─ category
│  │  │  ├─ category.css
│  │  │  └─ category.jsx
│  │  ├─ charts
│  │  │  ├─ bar.jsx
│  │  │  ├─ line.jsx
│  │  │  └─ pie.jsx
│  │  ├─ home
│  │  │  ├─ home.css
│  │  │  └─ home.jsx
│  │  ├─ login
│  │  │  ├─ images
│  │  │  │  └─ bg.jpg
│  │  │  ├─ login.css
│  │  │  └─ login.jsx
│  │  ├─ product
│  │  │  └─ product.jsx
│  │  ├─ role
│  │  │  └─ role.jsx
│  │  └─ user
│  │     └─ user.jsx
│  ├─ setupProxy.js
│  └─ utils
│     ├─ dateProcess.js
│     ├─ localStorage.js
│     └─ memoryUser.js
└─ yarn.lock

```

# react 后台管理项目总结

## 路由跳转

在回调函数中：` this.props.history.replace("/");`

在render函数中： `return <Redirect to="/login" />;`



##  请求回来数据后的数据存储

两种存储方案搭配：

- memory 将数据存储在内存中（就是使用一个变量对象存起来）
- localstory 将数据存储在本地 ，这样刷新不丢失

两者使用时机：

localStory 在请求回数据时存储在本地，然后在react入口文件除读取，然后将其存在memory中，

接下来其他组件都在memory中读取，这样速度更快。、



> 使用localstorage存储时可能会有兼容性问题，我们可以使用一个第三方的库 `store`
>
> https://github.com/marcuswestin/store.js

![mark](http://qiniu.wind-zhou.com/blog/210424/mdAgeH2Fe1.png?imageslim)



## 登录状态维持

维持登录：将数据存储在本地即可

自动登录：每次在login内渲染重新组件时，都在内存中再次取数据，如果有则跳转admin页面

## 静态页面搭建

使用antd的 menu组件



## 路由注册

在 admin的content组件里使用router注册路由



##  菜单的动态生成

为了后期得出维护，菜单向不能写死，**因此要将数据抽象成一个js得出配置文件，以数组的形式存储起来**

这里经常会到递归的方法。

```react
  getMenuFromList = menuList => {
    return menuList.map(item => {
      if (!item.children) {  //没有二级项
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        );
      } else {  //有二级项
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
          {this.getMenuFromList(item.children)}  
          {/* 使用递归进行遍历 */}
          </SubMenu>
        );
      }
    });
  };
```





## 菜单项的点击选中

antd的menu的组件中，有两个属性负责根据当前的key选中当前的项。

![mark](http://qiniu.wind-zhou.com/blog/210426/IKdL1lkc06.png?imageslim)

<img src="http://qiniu.wind-zhou.com/blog/210426/k6L0D54EEH.png?imageslim" alt="mark" style="zoom:25%;" />



这两个参数的语法是根据当前属性设置的参数，来激活对应key的菜单项，因此必须有一个唯一的标识来标识标识每个菜单项，并且切换到相应路由时，可以获取到当前的标识，并将该标识赋值给这个selectedLeys属性。

问题来了：

**使用什么作为唯一的key呢？** 

使用数据项里带的id？还是时间戳？貌似都可以。

其实这两个怎样倒是好说。

但还有一个问题，怎样在切换路由时，**可以在相应页面拿到该值呢？**

这就涉及到了跨页面传值，**使用什么跨页面呢？**hash？search？localstory？貌似都可以，具体过程就是（1）先给每个link标记绑定个事件，点击时，拿到当前的id，存储到localstory中（2）然后跳转过去后，在当前页面读取，然后将id对应的值去出，存到selectedLeys中。

**那么如何知道是读取那个id呢**？

这又是个问题，貌似可以用当前的路由路径（因为这个是唯一的）。

这样理论上可以实现，但饶了一个大圈，如果直接就把路由的路径设为key，那不都解决了？

这样问题就只有一个了，**就是如何获取当前的路由路径**？

很显然要操作BOM的location的api，这个api其实在路由admin组件里有，但是当前的leftNav不是有个路由组件，里面也就没有props，又卡住了，怎么办？

这个问题其实有两种方法（1）使用组件间传值 ---父传子；（2）使用高阶组件---widthRouter

上面说了一大堆，最终的解决方案可以化为最简：（1）路由作为key（2）使用widthRouter获取key



>widthRouter 知识补充：
>
>作用：让一般组件也可以使用路由组件的api。 
>
>加工一般组件，时一般组件可以带有路由组件的api（高阶组件）

>**bug 总结：** defaultSelectKeys与selectedLeys
>
>defaultSelectKeys激活的值只有第一次改变时的值，那么本例中，如果直接访问localhost：3000，则会直接跳转到home界面，那么这时defaultSelectKeys的值不变，会导致首页这和菜单栏不被激活，解决方案就是使用selectedLeys替代，这个属性会实时的回去当前的值。



## componentWilMount 声明周期

在将要render之前，准备一些数据。



这和东西快被废弃掉了。

## 关于跨域的几点新get

常用的几种跨域的方法：

- jsonp
- cors
- 代理

对于跨域在开发环境中可以使用的代理，需要在package.json里进行简单配置。

**例如：**

```json
"proxy":"http://172.19.5.35:9536",
```

不过这种形式只能配置一个。

多个代理配置：

当前版本的react配置多个代理需要在src文件夹下新建setupProxy.js文件

```js
const { createProxyMiddleware } = require(`http-proxy-middleware`)


module.exports = function(app) {
    // 配置多个代理
    app.use("/pacific", createProxyMiddleware({
        target: 'http://whois.pconline.com.cn',
        changeOrigin: true,
        pathRewrite: {
            // 对路径进行重定向，因为代理的匹配规则是：但检测到路径的pacific时，会在路径前面添加http://whois.pconline.com.cn，
            // 但是我们这个pacific只是用来进行代理识别的，真实url中并没有这个字段，因此我们要将其重定向，检测到pacific时，替换成'/'
            "^/pacific": ""
        }
    }))

}
```

>原理：
>
>为代理的匹配规则是：但检测到路径的`/pacific`时，会在路径前面添加http://whois.pconline.com.cn，
>
>pathRewrite字段的作用：  我们这个pacific只是用来进行代理识别的，真实url中并没有这个字段，因此我们要将其重定向，检测到pacific时，替换成'/'，否则在请求的url中就会对个`/pacific`



jsonp的原理：

- jsonp只能处理get请求
- jsonp不是ajajx请求，只是普通的http请求

>跨域是针对于ajax请求来说的，他使用的xmlRequestHTTP对象进行异步通信，并且他不是http协议的一部分，
>
>是浏览器基于安全考虑的一种同源策略的限制。
>
>普通的http没有这种限制（我们使用postman测试时从来没有跨域的问题）

jsonp的原理是通过src属性的可以跨域的属性，基本过程：先创建一个script标签发送请求，里面的地址中附带一个回到函数拼接，服务器在接收到请求后会将请求的数据给我们拼接在这个回调函数中，并返回。

axios并没有封装jsonp请求，因此我们需要在github上找个第三方的库。

>https://github.com/webmodules/jsonp

使用方法：![mark](http://qiniu.wind-zhou.com/blog/210429/EGajI94j2a.png?imageslim)



返回的数据我们可以使用一个promise对象进行封装。



>深入理解：
>
>jsonp的实现需要前后的配合，就是说后端要有处理jsonp请求的程序。
>
>jsonp的本质 其实就是一个使用script的资源的下载，他和下载css，js文件本质上没区别，下载过来之后在进行处理。
>
>由于是`<script>`标签，不能像`AJAX`一样读取到精确的状态码，不能获取响应头参数，只知道成功和失败

cors也是解决跨域的一种方法，不过喝的中心在后端，后端可以帮我们设置access-control-allow-origin字段后我们才能跨域

>注意：cros跨域时，其实后端已经把资源返回来了，只是浏览器给我们拦下来了，不让我们使用。

## async的使用

当多个异步请求时密切多个异步请求有依赖关系，我们可以使用async函数操作（promise的then也可以，但是差点意思）

```js
  // 获取天气
  getWeather = async () => {
    const cityObj = await reqIpAddress();
    const weatherInfo = await reqWeather(cityObj.cityCode);
    const { province, weather, winddirection, city } = weatherInfo.lives[0];
    this.setState({ province, weather, winddirection, city });
  };

```

> await时then的语法糖，返回的是构面promise里的内容



## 显示当前组件的标题

首先先拿到当前地址栏的路由地址，因为特能唯一标识我们当前的路由组件，根据当前的pathname去遍历所有的menu配置对象，找出对应的title

>拿到当前的pathname也需要用到withRouter处理一下

## 退出登录

使用antd的Modal插件

```js
  // 点击退出
  louOut = () => {
    Modal.confirm({
      content: "确定要退出吗？",
      onOk: () => {
        console.log("OK");

        // 1、清空memory和localstorage
        LocalUser.removeUser();
        memoryList.user = {};
        // 2、跳转路由至登录页面

        this.props.history.replace("/login");
      }
    });
  };

```

但点击成功时，（1）清空localstory和memory（2）跳转到登录界面

## 关于计数器

计时器的开启一般在componnetdidmount中即可(这是个异步操作)，关闭一般在componentWillUNMount中。

## 关于a标签的封装

主要的一点就是props的Childen属性的使用

```js
import './index.css'
function LinkButton(props) {
    return (
       <button {...props} className='linkButton'></button>
    )
}

export default LinkButton
```



## 品类管理（category）

>主要涉及信息的**增删改查**

### 查（展示信息）

**展示主要分为了两部分**：（1）一级品类的展示（2）子级品类展示

> **table组件的简单使用：**
>
> 使用到了ant design的Table组件。
>
> 使用方法：主要是初始化table的colum参数（title，name字段），和请求数据填充到date中区。
>
> 初始化列应该放到componentWillMount中，用作为第一次render做准备。
>
> 请求数据的ajax放到componentDidMount中，请求回来数据后存储到state中。

**基本工作流程：**

（1）组件渲染前初始化table的列（在componentWillMount中）

（2）渲染虚拟dom

（3）发送ajax请求数据  （在componentDidMount中）

（5）拿到数据存储到state中

（6）显示信息

这里有几个难点：

- 如果请求一级一级信息和二级信息

- 如何区分显示一级信息还是显示二级信息
- 一级信息和二级信息怎样存储（放在一起还是存储两份？）
- 如何从自己再返回父级列表



挨个解决：

- 请求接口中有可以通过传入的parentId字段来判断请求几级列表

- 这里要有一个条件判断，通过parentID，点击显示子选项按钮时秒回触发一个事件，该事件会传入有个当前的category对象（这个对象通过列渲染时，render的参数传入），事件函数中，修改parentId，然后发送请求

- 因为两个数据我们都会用到，例如点击回到一级列表时。

  如果不使用两个数据存储，我们要怎样处理？

  （如果将子类的列表也放到categorys里存储，那么请求子列表时就会将其覆盖掉，因为 显示子类和父类的列表结构不太一样，所以要有两种情况，这就需要组件的条件渲染，我们还需要在state中存储一个状态<上面的parentID就是这个作用>。当点击会父级时，再次请求，同时将前面的状态取反，这样理论上也可以实现，不过貌似多增加了一次ajax请求，增加了开销。）

- 返回父级列表，只需将parentId设为0即可



### 修改列表

**基本流程：**

当点击修改按钮时，会弹出一个对话框（modal组件），里面有用于修改信息的一个form组件。对会话框弹出后，里面的input会默认有当前的名称值。点击确认按钮后，会发送一个ajax请求去修改当前项，最后修改完之后再次发一个ajax去调用显示信息的列表，最后隐藏modal。

**技术难点：**

（1）**如何让点击修改按钮后，知道修改的哪一个？**

在每个修改按钮都绑定了一个事件，该事件绑定了一个回调函数（高阶函数），当点击时，会事件传入当前修改项的数据对象，里面有name和id值（name值用于input的默认显示，id用于发现ajax请求）。

那么这个对象怎么获取呢？这里我们使用的是table组件，table组件在列渲染的时候 ，有一个render字段，里面的形参是当前行的值，当前行数据，行索引，因此我们可以在这里拿到。

如果不使用table组件，那就更好说了。

（2）**如何弹出modal后，input里出现默认值？**

在点击修改后，将传入的category对象存到实例中，然后这个值会通过props传递给更新的子组件

在子组件中接收传过来的属性值，接着我将这个值放在state中，之前将input和state进行了双向绑定（手动）。

>这里需要注意的是，需要在componentWillMount和componentWillReceiveProps里都要执行setState操作

（3）**如何在发更新的ajax时拿到updata子组件表单的输入项？**

这里涉及到了组件间的传值（子----父），现在父组件里定义一个回调函数，通过props传入子组件，然后再子组件调用。这里就有一个问题，**这个回调函数要在子组件的什么地方调用呢？**答案是在input的onchange事件中，因为input的每次改变都要传递给父组件，在onchange时间里，先完成setState的操作（双向绑定），然后在setState的第二个参数里调用该函数。

另外这个ajax时点击”确认更新“按钮之后出发的，他还传给一个category的id值（因为ajajx请求需要），因为直接从之前挂载到组件上字段取就可以。

>就是说，当点击添加时，做了一项很重要的工作，就是将当前行的对象挂在到了组件实例上，这个在后面两个地方用到了：（1）input需要显示默认值时（2）但真正触发ajax请求时

>这里input框经常遇到的问题是，可能修改完一项后，再次修改别的项时，input里的值是上一次填写的值，这是因为 组件在重新渲染时，diff算法会进行对比，react处于性能的原因，会对相同key值的组件进行复用，但是里面的值仍然保留，这个问题也很好解决们可以直接认为价格key，可以是时间戳。
>
>如果手动进行了双向绑定，应该也可以。只不过还要在两次钩子中都setState。



### 增加

**基本工作流程：**

当点击添加按钮时，会弹出一个对话框，该对话框的结构还是Modal组件里面有一个 Form子组件，用于输入添加的信息，然后点击"确认添加按钮"，点击后，发送ajajx请求，关闭modal对话框，最后再次发送请求ajax，重新展示列表。

需求 ：但在一级的列表点击添加时就添加在一级里，如果进入二级之后，点击添加就添加在二级里。

**难点**：

（1）**如何实现在一级里点击添加一级项，在二级里店家添加二级项？**

如果实现这个功能就需要有一个判断一级还是二级的标识，正好我们又这么一个标识，就是state里的parentID（这个parentId但在一级项里时为0，但点击查看子列表进入二级项后，会变为当前子列表的id）

接下来就好说了，这个id我们就解决了。

（2）**如何获取子组件 form里输入的值？**

这个问题其实和之前修改时一样，都涉及到一个问题就是父子组件之间传值，毫无疑问还是使用一个回调函数，然后再子组件表单发生变化是调用该函数，将form对象传递过来，挂载到父组件上。

（3）如何清空每次的input

这个只需要在发送完ajjax

>这里因为使用的是antd的form组件，因此可以将其form对象传过来，然后再子组件中拿到其字段值。
>
>基本过程：
>
>1. 使用类似组件的话，先创建一个ref，将form对象挂载到ref上
>2. 当表单发生变化后，在form的onFieldsChange回回调里将form传给父组件
>3. 在父组件确认添加时，读取form的字段，发送ajajx
>
>FAQ：
>
>如何读取form的字段？
>
>首先要先给每个Form-item 加一个name，这样他里面的组件都变成了受控号组件（受form对象控制了），然后可以使用getFiledValue回去字段值
>
>注：每个Form-item，都必须直接直接包裹input，否则会报错，并且name无法使用。



### 两个modal框dev显示隐藏 

首先当点击增加时，需要弹出个对话框，里面有一个form表单，供用户填写数据。

我们可以使用antd的Modal模块（对话框），那么问题来了，**如何将“添加”按钮和modal组件关联呢？**

可以通过点击触发事件来控制state里字段的状态，该字段的状态控制着Modal的显示隐藏，由此便建立了联系。

之前退出登录也是用了Modal，但当时为什么没有进行关联呢？因为当时使用的是`Modal.confirm()` 语法糖方法。这个函数在点击“退出”的按钮事件函数中调用，因此就默认自动关联了。



**但这里使用了两个modal，为什么不使用两个状态进行控制而是使用一个字段设置了三个状态？**

这里主要是为了排他性，一个组件显示，另一个组件必须隐藏，当然这里需要配合三目运算符。

如果使用两个状态控制，则会有四种组合情况，这样会出现两个Modal同时显示的尴尬情况。



modal里点击‘x’，‘cancal’和modal外区域，都会触发同一个oncancal回调函数。

###关于setState



![mark](http://qiniu.wind-zhou.com/blog/210430/lJDI9f4k0C.png?imageslim)

setState的同步异步问题

本身是同步的，但react中使用时可能会体现为异步，例如在钩子函数中调用多个setState会产生异步。

**具体体现**：使用完setState后，不能立马取到新设置的state的值。

**原因**：react为了性能的优化，会将多个setState合并行处理（类似object的assign方法），这是他们会进入一个异步队列。并不会立马更新state的值

**解决办法**：但是如果我有的一个需求是取得设置完后最新的state值要怎么办? 这时可以使用setState的第二个参数---一个				回调函数，调用时机是在状态更新结束后（或render之后调动）。





## 产品管理（product）

###页面构成：

- home界面
- 产品详情界面
- 更新商品界面（添加、修改）

三个界面使用路由进行跳转 home--->详情；home---->增加界面

这里使用的编程式路由，点击按钮后通过`this.props.history.push()`跳转



### 页面搭建

静态页面的搭建使用的是antd的组件有：

- Card, 
- Table  （数据的显示）, 
- Select  （搜索类型）, 
- Input  （搜索内容）, 
- Button  （添加按钮）, 
- message 

### 主要功能

- 页面显示（后台分页功能）
- 搜索功能
- 商品详情
- 上架，下架功能
- 添加商品功能

### 具体实现



#### 后台分页的实现

之前做的品类管理时，都是一些子把收据全都请求到前台，直接塞到table组件的dataSource中，然后这是pagination里面的defaultPageSize属性就可以实现分页，但这又个缺点就是一次性的全部请求会收据，有点吃资源。

所以这里采用后台的分页，每次点击页面时则请求固定数量的收据。

**怎么实现呢？**

这需要前后台的配合，后台加入有1500条数据。我们在每次请求的接口中可以**设置每次请求的数量**和**请求的页数**，

后台在接收到当前接口的数据后，会按照pageSize对后台进行分页，然后返回请求页数pageNum的数据。

> 这里有一个难点：就是尽管我们每次都请求指定数量的数据，但是前台一定要显示全部页码，这需要传入pagination一个total参数，他会自动给我们显示全部的页码(要是没有组件，我们就需要自己手动的去做除法)

数据请求回来后在前台进行显示，然后我们在每次点击不同的页码时，会触发onchange回调，onchange事件参数会获取当前的页码数，然后将其作为pageNum参数，发起一次ajajx，请求数据后，将其存放在state中。然后渲染界面。



#### 搜索功能

搜索功能可以按两种模式进行模糊搜索：**按描述搜索、按名称搜索**

**基本构成：**

使用一个antd的select组件来设置搜索模式；

使用一个input框来这只搜索内容

使用一个button按钮来发送ajajx



但点击搜索按钮时，去state中取出搜索类型（searchType）和搜索内容（searchName），然后将其作为参数，发送一个ajax请求，请求回来后进行显示

#### 上架下架

首先在设计数据结构时，规定好一个字段代表上架或下架。

前后根据这个字段进行条件渲染 ，根据这个状态显示相应控件。

在上下架的按钮上绑定一个点击事件。点击时首先拿到当前操作的商品对象（这个在table组件的column初始化时，里面有一个render函数，可以在他的形参里拿到），然后结构出当前对象的id和当前的状态status，然后作为参数传入到触发的事件中，然后调用上架/下架的接口，修改成功后，再次请求数据列表并显示。

>这里还有个小问题，就是我们修改的数据在第几页，但修改完重新显示的显示的时候，也再次显示改页，这就需要我们知道当前所在的 页码，这个我们可以在点击页码pagination时就将其存起来



#### 商品详情



这个功能主要的技术点是组件和路由间的传值。

当点击详情按钮时，通过路由的state传值的方式，将当前的数据对象传递过去，跳转过去后在  

 ` const { pCategoryId, categoryId } = this.props.location.state;`中接收，并将相应数据显示到该组件的相应位置



#### 修改更新

点击修改时，跳转到修改的路由界面，传递当前的数据对象。

该界面因为涉及到提交信息，因此里面的主体结构时一个form表单，跳转过来时，现将传递过来的对象解构，然后填写到相应位置作为默认的参数。在里面修改完成之后，点击提交，首先进行表单验证，当输入的内容都经过表单验证之后，会触发form组件的onfish回调，这个函数可以拿到搜索表单传入的数据，然后将数据作为参数，请求响应的接口。成功后跳转到home界面，并做数据的显示。



增加商品同理。

>难点：
>
>在修改时有一个难点，就是级联显示的功能，使用的是Cascader组件，因为我做的这个模块的商品分不同种类，有一级分类和二级分类，首先第一次加载时请求会以及数据，然后点击在Cascader中点击一级项时，触发loadData回调，在里面发送ajax请求请求二级项，请求回来后关联到一级的数据上（添加到children字段）。
>
>
>
>我这里为了减少代码量，将更新组件和增加组件进行了复用，因为他们的结构都是一样的，也就收获在点击修改按钮和添加按钮时，要跳转到相同的路由，在修改时需要显示先显示当前商品默认的信息，但增加时则不需要显示，这就要想办法区分两种跳转，这里因为添加跳转时要使用state传入一个对象参数，因此可以通过判断是否传入参数来进行区分。
>
>这个问题就解决了，然后还有一个就是如果是修改时，要在Cascader中显示当前对象所属的一级列表和二级列表，，但这里遇到了一个问题就是，虽然我把一二级列表的id都传到了Cascader的value中，但是却只显示一个一级项，找了半天后才发现时是由于跳转过来后，之请求了一级的数据，并没与二级的数据，因此二级项并不显示，找到问题就可以解决了，就是在componentdidmount中第一次请求时，不光请求一级的数据，还要请求二级的数据，，这就解决了。





## 用户权限管理

### 需求描述

权限管理就是不同的用户登录时，可以操作该管理系统的不同功能。

例如管理员可以zhixin.g所有的操作：商品添的增删改查，用户的添加等。

普通用户只能操作部分功能，例如普通的用户只能查看搜索商品信息，而不能管理用户。

### 具体实现

所谓的犬只管理，在这个单页面的spa应用中就是说，不同权限的影虎可以访问 不同的页面。

同时不同的界面可以由不同的路由路径唯一标识，因此权限管理的本质也就是不同的用户可以访问不同的路由组件。

这个在设计用户的数据结构时们可以在里面加一个可以访问的菜单集合，里面存放该用户可以访问的路由路径。

我做的这个功能，总体分为了两个部分：用户管理和角色管理。

**角色管理：**

是大的分类，里面说，管理员，普通户游客，vip用户等。

里面可以有角色显示，添加角色，修改权限等。

权限是和角色绑定在一起的，修改权限时，管理员可以设置角色的权限（这里常用到antd里的tree组件），发送后台后，后台更新角色的权限。

**用户管理：**

用户管理是负责用户的提那家删除等，用户是和角色绑定放一起的，也就是说用户的数据结构里偶遇一个字段是对应的相应的角色，这样用户也就有了不同的权限。

**具体流程：**

当用户登录时，发送login的ajajx后，后台会拿到当前用户的id，然后会根据我的id查询出当前用户对应的角色，在将角色的可以访问的路径传值前台，这时候前台拿到一个路径列表后，会将可以访问的路径组件渲染到界面上。

>我记得我当时做项目时，管理平台的菜单有一个数据结构，我根据菜单的数据对象，渲染menu、菜单
>
>这个可以和后台协商，如果菜单是在前台处理还是在后台处理。



## 工作

- 总体路由的搭建
- 登录退出注册功能
- 接口请求函数的封装
- 天气显示功能
- 品类管理功能
- 产品管理功能
- 用户权限管理





























