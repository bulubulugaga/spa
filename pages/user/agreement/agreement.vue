<!-- y用户协议 -->
<template>
	<view class="content phone">
		<rich-text :nodes="agreenment"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agreenment: `<p style="font-size: 13px; color: #aaa;line-height: 26px;">本软件许可使用协议（以下称"本协议"）由您与无锡雅蔓健康管理有限公司（以下称雅蔓）共同签署。 
					在使用“往约”软件（以下称许可软件）之前，请仔细阅读本协议。一旦您下载安装使用许可软件，即表示您同意接受本协议所有条款和条件的约束。
					如您不同意本协议条款和条件，请勿使用许可软件，并请销毁所有许可软件副本。往约有权随时修改本协议，并以在往约网站公示的方式通知您，无需单独通知您。
					修改后的协议于公示时生效。协议条款修改后，您继续使用许可软件的，即视为您已阅读并接受修改后的协议。</p>
					<p style="font-size: 15px;line-height: 50px;">定义</p>
					<p style="font-size: 15px;line-height: 26px;">许可软件：是指由雅蔓开发的，供您下载，并仅限在手持移动终端（以下称手持终端）中安装、使用的软件系统。</p>
					<p style="font-size: 15px;line-height: 26px;">往约服务：由无锡雅蔓健康管理有限公司为您提供的服务。您可以通过许可软件在手持移动终端使用往约软件服务。</p>
					<p style="font-size: 15px;line-height: 50px;">授权范围</p>
					<p style="font-size: 15px;line-height: 26px;">您仅可在手持移动终端中使用许可软件。未经往约书面同意，您不得将许可软件安装在其他终端设备上，该等设备包括但不限于台式电脑、手提电脑。</p>
					<p style="font-size: 15px;line-height: 26px;">安装本软件后不得对许可软件或者许可软件运行过程中释放在任何手持终端中的数据及许可软件运行过程中手持终端与服务器端的交互数据进行复制、更改、修改、
					挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经授权的第三方工具/服务接入许可软件和相关系统。</p>`
			}
		}
	}
</script>

<style>
	page {
		background: white;
	}
	.content {
		padding: 20rpx 4%;
	}
</style>
