## BFC

### 什么是BFC
* BFC Block-Formate-Context 块状格式上下文
* 具有BFC特性的元素可以看作是隔离了的独立容器，内部的元素在布局上不会影响到外部元素的布局（通俗一点就是BFC的元素像一个封闭的箱子，内部如何翻江倒海，也不会影响到外部的其他元素）

### 触发BFC条件的标准
* html根元素
* `overflow`不为`visible`的元素。如(`hidden`,`auto`,`srcoll`)
* `float`不为`none`的元素
* display为`absolute`,`fix`,`flex`的元素
* display为`inline-block`、`table-cells`

