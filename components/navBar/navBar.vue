<template>
    <view class="prohibition" :style="'background:' + bgColor ">
        <view class="demo phone" :style="'height:' +  demo.height + 'px;' + 'padding-top:' + demo.top + 'px;padding-bottom:8px'
			+ ';size:' + size + ';color:' + color">
            <view class="left" :style="'top:' + demo.top + 'px'" @click="leftFun">
                <van-icon :name="leftIcon" :size="iconSize" :color="iconColor" />
            </view>
            {{ title }}
        </view>
		<!-- 占位 -->
		<view :style="'height:' +  demo.height + 'px;' + 'padding-top:' + demo.top + 'px;padding-bottom:8px'"></view>
    </view>
</template>

<script>
    export default {
		props: {
			title: {  //导航标题
				type: String,
				default: ''
			},
			color: {  //字体颜色
				type: String
			},
			size: {  //字体大小
				type: String,
				default: '30rpx'
			},
			leftIcon: {  //左侧按钮图标
				type: String,
				default: 'arrow-left'
			},
			iconSize: {  //左侧图标大小 px
				type: Number | String,
				default: '44rpx'
			},
			iconColor: {  //左侧图标颜色
				type: String
			},
			isDefaultFun: {  //是否使用默认左侧按钮方法
				// 布尔值传参，父组件必须用v-bind，否则会被当字符串处理
				type: Boolean,
				default: true
			},
			bgColor: {
				type: String,
				default: 'white'
			}
		},
        data () {
            return {
                demo: {}  //根据胶囊位置获取信息
            }
        },
        created () {
            this.demo = uni.getMenuButtonBoundingClientRect()            
        },
		methods: {
			leftFun() {
				if(this.isDefaultFun) {
					//左侧按钮默认返回
					uni.navigateBack({
						delta: 1
					})
				}
				else {
					//自定义方法
					//只有传值isDefaulFun为false才生效
					this.$emit('leftFun','自定义方法');
				}
			}
		}
    }
</script>

<style lang="scss">
    .demo{
        position: fixed;
		width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
		z-index: 999999;
        .left{
            float: left;
            position: absolute;
            width: max-content;
            height: max-content;
            top: 0;
            bottom: 0;
            left: 0;
            margin: auto;
			padding: 16rpx;
        }
    }
</style>
