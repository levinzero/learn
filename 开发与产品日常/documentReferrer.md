# 来，产品老哥，您要的Url来源，给！

##### 场景概要

前端开发小哥阿宇加班加点完成的一套付费活动抽奖页面在昨晚凌晨终于上线了，这个城市里又少了一位忙碌的人，却多了一个空虚寂寞的叹息者。早上，阿宇来到工位，正准备享受产品对他的奖励--咖啡，头脑还在幻想着喝咖啡糖放多了的场景，结果却是迎来了产品的黑脸。产品阿伟质问道：阿宇，为啥没有来源链接上报，我怎么去分析相关的页面转化呀？阿宇顿时不乐意了，怎么没有了，我明明是用`document.referrer`给你上报了啊，来来来，我给你看看，打开浏览器，`F12`，一顿操作，诶？emmmmmmmm，稍等，我马上改！

##### 为什么`document.referrer`没有获取到来源url?
>返回的是一个 URI, 当前页面就是从这个 URI 所代表的页面 跳转或打开的.

以上是来源于`MDN`关于`document.referrer`的解释，其次在 MDN 上，浏览器的兼容性也没太大问题，基本上已经是一个通用的东西了。那为什么阿宇使用了这个方式去获取来源URI，却失败了呢？

先别着急，在此之前，先来看看 `Referrer` 是个什么东西

###### *Referrer*

用户点击链接时，会产生一个HTTP请求，用于获取新的页面内容，在此请求的请求头中，会有一个`Referrer`字段，用于记录该新页面是由什么页面跳转过来的，常被用于分析用户来源等信息。但是这样会导致一个安全性问题，比如有些网站直接将 `sessionid` 或是 `token` 放在url，这样会导致第三方网站其通过 Referrer 报头的内容获取到对应的 `sessionId` 以及 `token` 。

为了防止这些信息被第三方网站获取到，因此具有了 `Referrer Policy` 这个头部字段去控制 `Referrer` 显示与否，如何显示，显示什么。

###### *Referrer-Policy*

| Policy      | Document | Navigation to | Referrer |
| ----------- | ----------- | ----------- | ----------- |
| no-referrer | https://example.com/page.html	| any domain or path | no referrer|
| no-referrer-when-downgrade | https://example.com/page.html | https://example.com/otherpage.html | https://example.com/page.html|
| strict-origin-when-cross-origin | https://example.com/page.html | 	http://example.org | 	no referrer |
| unsafe-url | https://example.com/page.html | any domain or path | https://example.com/page.html |
表格数据来源于[MDN Referrer-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Referrer-Policy "Referrer-Policy")

以上是常用的几种 `Referrer-Policy`，其中一般来说 `strict-origin-when-cross-origin` 企业的生产环境都是用的这种策略，在这种情况下，通过 `document.referrer` 获取到的 `Referrer` 肯定是空啦。

##### 粗暴的解决办法

阿宇终于找到了问题所在，原来是 `strict-origin-when-cross-origin` 导致拿不到 `Referrer` 呀，那简单，修改掉这个策略就好，既然咱跳转过来的运营页面都是一些不带重要数据的页面 `A` ，那么可以用 `unsafe-url` 粗暴解决就好啦，于是，在 `index.html` 文件中集成了这么一句代码 `<meta name="referrer" content="unsafe-url">` 搞定收工，能拿到对应的referrer了，于是叫阿伟去验收，果不其然，迎来了阿伟的一顿夸，针不戳，阿宇就是厉害~。

##### *Referrer* 又丢失了，拿到了一串WX域名的url

解决了 `Referrer` 这个问题的这几天中，阿宇还沉浸在自己又解决了一个问题的氛围中不能自拔，公司内部沟通软件弹出了来自产品阿伟的一条信息：阿宇啊，为什么有些链接不是咱们投放的页面 `A` , `B` , `C` 啊，而是一堆什么关于wx的链接啊？ 这次阿宇倒是没有一脸懵状，他想起来了咱们付费活动页是集成在wx项目里面，具有获取wx授权功能的，自然会跳转到wx平台，当然获取到的 `Referrer` 是关于wx的，于是，阿宇流下了悔恨的泪水...

##### 那有没有不通过 *Referrer* 能够获取到来源Url呢?

原来当初阿宇就是为了省事，使用的 `document.referrer` 去获取来源url，却没有对它的局限性进行过多的考虑。现在，自己埋下的雷，终究是自己踩了。所幸，思考一会阿宇就有了相关的解决方案。既然如此，那就放弃 `document.referrer` 这种局限性较大的方案，使用 `url query` 参数的方式进行解决吧。 阿宇找到了之前 `A` `B` `C` 页面中的公共跳转按钮组件

`
<LinkButton targetUrl={D}>
`

继而进行修改，使其变成了

`
<LinkButton targetUrl={D?fromUrl=encodeURIComponent(location.href)&...otherQueryParams}>
`

并且在 `D` 页面上通过 `queryParamParse(url)` 方法解析到 `fromUrl` 的参数，这次无论如何跳转，只要链接上的 `fromUrl` 查询参数不丢失，那么都能获取到其来源 `url` 啦！

果不其然，上线之后，产品阿伟终于再也没来找过阿宇了，阿宇又将精力投入到了 `划水` 项目中。

### 总结

要获取来源url可以使用以下两种简单方法
* document.referrer
* url上的查询参数

1. `document.referrer` 需要考虑 `Referrer-Policy` 以及是否有 `中间页` 的跳转
2. `url` 上的查询参数没有啥太大的局限性，但是相对而言，代码量稍微比较大一丶丶。
