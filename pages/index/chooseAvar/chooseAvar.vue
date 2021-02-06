<!-- 裁剪为正方形图片 -->
<template>
    <view class="content">
        <kps-image-cutter @ok="onok" @cancel="oncancle" :url="url" :fixed="false" :maxWidth="500" :minHeight="300"></kps-image-cutter>
    </view>
</template>

<script>
    import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
    //上传图片api
	import { uploadFile } from '@/service/uploadFile.js'
	export default {
        components: {kpsImageCutter},
        data() {
            return {
                url: "",
                path: ""
            }
        },
        onLoad(options) {
			this.url = options.url;
        },
        methods: {
            onok(ev) {
                this.path = ev.path;
				//上传图片
				let file = [{path: ev.path}];
				uploadFile(file).then(res => {
					//修改设置里的头像
					let pages = getCurrentPages(); // 页面栈
					let beforePage = pages[pages.length - 2]; // 前一个页面
					
					beforePage.$vm.avarImg =  res[0].path;
					uni.navigateBack({
						delta: 1
					})
				})
            },
            oncancle() {
                // url设置为空，隐藏控件
                this.url = "";
				uni.navigateBack({
					delta: 1
				})
            }
        }
    }

</script>
<style>
.image {
    width: 200px;
    height: 200px;
}
</style>