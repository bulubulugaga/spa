//上传图片
import { baseURL } from './config.js'
export function uploadFile(data) {
	//data传数组
	return new Promise((resolve, reject) => {
		let images = [];
		let i = 1;
		data.forEach(item => {
			//循环数组
			uni.uploadFile({
				url: baseURL + 'Common/uploads',
				filePath: item.path,
				name: 'file',
				success(res) {
					images.push({path: JSON.parse(res.data).data.url});
					//上传完后才返回
					if(i == data.length) 
						resolve(images);
				},
				fail(err) {
					console.log(err);
				},
				complete() {
					i++;
				}
			});
		})
	})
}