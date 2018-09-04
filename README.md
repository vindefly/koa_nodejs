### 基于Nodejs的前后端分离
===================================

#### 依赖
* nodejs@^8.1.0
* gulp@github:gulpjs/gulp#3.9.1

#### 基本思路
`nodejs` 负责 **全部页面路由的转发**、**XSS的防护**、以及前端的辅助开发(Swig, data, cross domain)
`Java` 负责数据的获取，支持接口：student, teacherapi。 
* www.17xueba.com/m/indexlist.vpage >>>>  $.post("/m/indexlist.vpage")  学生的接口直接获取;
* teacher.17xueba.com/napi/captcha/imgtoken.vpage >>>> www.17xueba.com/teacherapi/napi/captcha/imgtoken.vpage
* $.post("/teacherapi/napi/captcha/imgtoken.vpage")

#### 基本文件夹功能
```
	config                     ---- nodejs 配置层
		ssl
	controller                        ---- 页面逻辑
	
	views                             ---- 展示层
		html 						  ---- html 逻辑

	static                            ---- 静态资源文件
		resources                     ---- js,sass,img,res 预编译
		utils                         ---- es6 js 共用类
		
	app.js                         	 ---- nodejs 启动
	gulpfile.js              		  ---- build tool
```
#### 本地开发
```	
	1 >> cnpm install 本地只需安装一次，除非有更新;

	2 >> npm start 自动编译 watch 监听html, js, css
```

#### Questions
===========================================
* 为什么只更新静态也需要重启nodejs服务?
	首先了解:
	- jenkins 服务器跟 nodejs服务器 以及 静态文件 都是三个**独立的服务器**。
	- jenkins 构建是把整理好的文件，分布放到node svn 与 静态svn
	- 重启nodejs 与 更新静态文件 都是通过在本地通过svn up来获取最新代码
	- deployer test : http://deployer.office.17zuoye.net/Deployer/FrontEnd/Show?stage=test&app_project=xue-frontend
	- deployer staging or release : http://deployer.dc.17zuoye.net/Deployer/FrontEnd/Show?stage=staging&app_project=xue-frontend
	- 发布只需要等待 building 》 build-done 然后点击【update-all】 按钮即可。