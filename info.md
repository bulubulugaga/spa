###简述
* 该小程序使用uniapp开发
* 该小程序用于SPA上门服务，从2020/11/09开始指定需求，2020/11/24出设计图，2020/11/25开始编写前端代码
* 用户端和技师端差距不大，所以共用一套代码，在进入时判断用户类型并存入本地中后续功能判断皆用此字段跟进判断
* 用户端和技师端tabBar不一样，目前官方没有隐藏某个item的方法，故用自定义tabBar
* 用自定义组件在切换tabbar时，出现闪烁情况，所以将其他页面内容以组件形式引入
* 页面跳转时如果需要跳转到tabBar最好用reLaunch
* 部分vant weapp组件在页面以组件形式引入，获取不到点击事件，故放入pages全局组件
* 开发期间有其他项目共同进行，中间可能有所搁置
* 由于用户信息存放在本地，所以有支付、提现修改最好再次修改本地
* 注意：图片是拼接实现的，如果图片路径修改之后van>uploader里的路径也要修改

###已实现页面
* 进入页面
* tabbar
	* home      首页
	* category  产品 分服务和技师   技师端无此页  
	* bill      订单               
	* user      我的
	
* 下级页面
	

###模板说明
> * 主要根据设计图编写，部分地方使用了uniapp中的商城模板，引用了vant weapp组件



###版本记录
-------------
* 2020-11-25
	* 1. 创建项目
	* 2. 增加进入页面
* 2020-11-26
	* 1. 首页
* 2020-11-27
	* 1. 产品服务页
* 2020-11-30
	* 1. 产品技师页
* 2020-12-03
	* 1. 我的
	* 2. 订单
	* 3. 预约下单
	* 4. 切换地区
* 2020-12-07
	* 1. 登录注册
* 2020-12-08
	* 1. 封装获取地区信息
* 2020-12-09
	* 1. 服务详情
	* 2. 技师详情
	* 3. 常见问题
	* 4. 意见反馈
	* 5. 关于我们
	* 6. 用户协议
	* 7. 平台声明
	* 8. 消息列表
* 2020-12-10
	* 1. 消息详情
	* 2. 我的地址
	* 3. 编辑地址
	* 4. 评价
	* 5. 邀请有奖
	* 6. 收藏
* 2020-12-11
	* 1. 商城入驻
	* 2. 订单详情
	* 3. 钱包
	* 4. 流水明细
	* 5. 充值
	* 6. 提现
	* 7. 技师端修改信息
	* 8. 技师端法律声明
	* 9. 客服
	* 10. 邀请记录
* 2020-12-15
	* 对接口


* 经历了更换后端导致大部分接口重写修改后，2020-12-31终于暂时完结撒花啦，留着商家入驻等待客户确认功能。