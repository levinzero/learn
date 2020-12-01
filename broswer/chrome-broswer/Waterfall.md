### Chrome Waterfall

> 浏览器根据http中外连资源出现的顺序，依次放入队列（Queue），根据优先级确定向服务器获取资源的顺序。同优先级的资源根据html中出现的线后顺序向服务器获取资源。

#### 优先等级

`Highest`  > `High ` > ` Medium`  > ` Low ` > ` Lowest `



#### 加载优先级

1. HTML、Css、Font这三类资源优先级最高
2. Preload资源`<link rel="preload"/>`、`script`、`xhr`请求
3. image、audio、video
4. Prefetch资源` <link rel="prefetch" />`



#### 资源优先级提升

1. XHR请求资源：将同步XHR请求的优先级调整为最高

2. 图片资源：默认为`low`，当图片处于首屏可见视图内的话，则提升为`High`

3. 脚本资源：浏览器会根据脚本所处的位置和属性标签分为三类，分别设置优先级：

   1. 对于添加 `defer` / `async` 属性标签的脚本优先级降为`low`

   2. 根据脚本在文档中位置是在浏览器展示的第一张图片之前还是之后再分为两类。

      之前：定为`High`优先级

      之后：定为`Medium`优先级

[实例Demo](http://test.wynneit.cn/priority/index.html)



#### Waterfall网络链路

![image-20201117150423119](https://wynne-typora.oss-cn-beijing.aliyuncs.com/typora/image-20201117150423119.png)

**Queueing：**出现下面的情况时，浏览器会把当前请求放入队列中进行排队

* 有更高优先级的请求时
* 和目标服务器已经建立了6个TCP链接（最多6个，适用于HTTP/1.0和HTTP/1.1）
* 浏览器正在硬盘缓存上简单的分配空间

**Stalled**： 请求会因为上面的任一个原因而阻塞

**Proxy negotiation**：浏览器正在与代理服务器协商请求

**DNS Lookup** ：浏览器正在解析IP地址

**Initial Connection** - 在浏览器发送请求之前, 必须建立TCP连接. 这个过程仅仅发生在瀑布图中的开头几行, 否则这就是个性能问题

**SSL/TLS Negotiation**： 如果你的页面是通过SSL/TLS这类安全协议加载资源, 这段时间就是浏览器建立安全连接的过程。

**Request sent**：正在发送请求

**Waiting (TTFB)**： TTFB 是浏览器请求发送到服务器的时间 + 服务器处理请求时间 + 响应报文的第一字节到达浏览器的时间， 我们用这个指标来判断你的web服务器是否性能不够， 或者说你是否需要使用CDN

**Content Download**： 这是浏览器用来下载资源所用的时间. 这段时间越长, 说明资源越大. 理想情况下, 你可以通过控制资源的大小来控制这段时间的长度.



**ServiceWorker Preparation**：浏览器正在启动Service worker

**Request to ServiceWorker**：发送请求到Sevice worker

**Receiving Push**： 浏览器正在接收 HTTP/2 服务端主动推送数据

**Reading Push**：浏览器读取先前接收到的本地数据



[示例Demo](http://test.wynneit.cn/stalled/index.html)



#### 瀑布图进行性能优化

那么我们如何是一个web页面加载的更快并且创造更好的用户体验呢? 

1. 首先, 减少所有资源的加载时间. 亦即减小瀑布图的宽度. 瀑布图越窄, 网站的访问速度越快。

2. 其次, 减少请求数量 也就是降低瀑布图的高度. 瀑布图越矮越好.

3. 最后, 通过优化资源请求顺序来加快渲染时间. 从图上看, 就是将绿色的"开始渲染"线向左移. 这条线向左移动的越远越好.










