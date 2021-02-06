<!-- 钱包明细 -->
<template>
	<view class="content w-con">
		<!-- 时间 -->
		<!-- <view class="time f28 gray">
			<view class="flex-middle" @click="this.timeShow = true">{{ time }}<van-icon name="arrow-down" /></view>
			<view class="f24 mt10">支出：{{ expenditure | FixTwo }} 收入：{{ income | FixTwo }}</view>
		</view> -->
		<!-- 明细 -->
		<!-- <view class="row bg-white border-ra-16 mt20" v-for="(item, index) in list" :key="index">
			<view class="flex-cover f30">
				<view>{{ item.type }}</view>
				<view class="mt10" :class="{red: item.type == '支付订单', green: item.type != '支付订单'}">
					<text v-if="item.type == '支付订单'"> - </text>
					<text v-else> + </text>
					{{ item.bill | FixTwo }}
				</view>
			</view>
			<view class="flex-cover f26 gray">
				<view>{{ item.time }}</view>
				<view class="mt10">{{ item.after | FixTwo }}</view>
			</view>
		</view> -->
		<view class="row bg-white border-ra-16 mt20" v-for="(item, index) in list" :key="index">
			<view class="flex-cover f30">
				<view>
					<view>{{ item.type }}</view>
					<view class="time f26 gray">{{ item.createtime }}</view>
				</view>
				<view class="mt10" :class="{red: item.class == 'red', green: item.class == 'green'}">
					{{ item.money }}
				</view>
			</view>
		</view>
		
		<!-- 时间选择 -->
		<van-popup :show="timeShow" position="bottom" custom-style="height: 320px;" @close="this.timeShow = false" >
			<van-datetime-picker
			  type="year-month"
			  :value="currentDate"
			  :min-date="minDate"
			  :max-date="currentDate"
			  :formatter="formatter"
			  @confirm="chooseTime"
			  @cancel="this.timeShow = false"
			/>
		</van-popup>
		
	</view>
</template>

<script>
	import { getWalletDetail, getWalletDeT } from '@/service/user.js'
	//时间转换函数
	import { transeTime } from '@/common/utils.js'
	export default {
		data() {
			return {
				time: '2019年01月',
				
				timeShow: false,  //时间选择器
				currentDate: 0,  //显示的最大时间
				minDate: 0,  //显示的最小时间
				
				expenditure: 10000,  //支出
				income: 100,  //收入
				list: [],
				
				page: 1
			}
		},
		computed: {
			miniType() {
				return this.$store.state.userType;
			}
		},
		onLoad() {
			this.getTime();
			this._getWalletDetail();
		},
		methods: {
			getTime() { 
				let oDate = new Date();
				//获取默认时间
				let year = oDate.getFullYear();
				let month = oDate.getMonth() + 1;
				this.time = year + '年' + month + '月';
				//设置时间选择器时间
				this.currentDate = oDate.getTime();
				this.minDate = new Date('2019-01-01').getTime();
			},
			formatter(type, value) {
				//时间选择器格式化函数
			    if (type === 'year') {
			        return `${value}年`;
			    } else if (type === 'month') {
			        return `${value}月`;
			    }
			    return value;
			},
			chooseTime(e) {
				//确认选择时间 重新调用接口获取流水
				let data = transeTime(e.detail);
				this.time = data.year + '年' + data.month + '月';
				this.timeShow = false;
			},
			
			
			_getWalletDetail() {
				let data = {
					page: this.page
				};
				if(this.miniType == 'user') {
					getWalletDetail(data).then(res => {
						let list = res.data.data;
						list.forEach(item => {
							item.createtime = transeTime(item.createtime * 1000, 'Y-M-D H:M:S');
							switch(item.status) {
								case '1': 
									item['type'] = '微信充值';
									item['money'] = '+' + item.money;
									item['class'] = 'green';
									break;
								case '2':
									item['type'] = '佣金提现';
									item['money'] = '-' + item.money;
									item['class'] = 'red';
									break;
								case '3':
									item['type'] = '佣金获得';
									item['money'] = '+' + item.money;
									item['class'] = 'green';
									break;
								case '4':
									item['type'] = '微信支付';
									item['money'] = '-' + item.money;
									item['class'] = 'red';
									break;
								case '5':
									item['type'] = '钱包支付';
									item['money'] = '-' + item.money;
									item['class'] = 'red';
									break;
								case '6':
									item['type'] = '钱包退款';
									item['money'] = '+' + item.money;
									item['class'] = 'green';
									break;
							}
						})
						this.list = this.list.concat(list);
					})
				}
				else {
					getWalletDeT(data).then(res => {
						let list = res.data.data;
						list.forEach(item => {
							item.createtime = transeTime(item.createtime * 1000, 'Y-M-D H:M:S');
							switch(item.status) {
								case 1: 
									item['type'] = '服务收入';
									item['money'] = '+' + item.money;
									item['class'] = 'green';
									break;
								case 2:
									item['type'] = '佣金收入';
									item['money'] = '+' + item.money;
									item['class'] = 'green';
									break;
								case 3:
									item['type'] = '钱包提现';
									item['money'] = '-' + item.money;
									item['class'] = 'red';
									break;
							}
						})
						this.list = this.list.concat(list);
					})
				}
			}
		},
		//上拉加载，需要自己在page.json文件中配置"onReachBottomDistance"
		onReachBottom() {
			this.page++;
			this._getWalletDetail();
		},
		filters: {
			FixTwo(num) {
				return Number(num).toFixed(2);
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-bottom: 20rpx;
	}
	.time {
		margin-top: 30rpx;
	}
	.row {
		padding: 20rpx;
		.red {
			color: red;
		}
		.green {
			color: green;
		}
	}
</style>
