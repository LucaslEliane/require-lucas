## 一个乱七八糟的RequireJS的实现

基本逻辑：

首先初始化两个Map，分别为moduleMap和TaskMap用来保存模块以及require的任务。

然后初始化上下文对象，分解data-main，获取入口文件以及项目的基本目录，并且加载入口文件。


执行入口文件，如果首先遇到require的话，那么新建一个Task对象，将这个Task对象置入到map中。