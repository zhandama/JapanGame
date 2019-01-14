<template>
<div>
  <input type="file" name="imageFile" accept="image/jpeg,image/png" @change="fileChange" multiple class="upload">
   <div class="progress" v-if="supportProgress && percent > 0">
    <span :style="{width:percent+'%'}"></span>
    <em class="pa">{{percent}}%</em>
  </div>
</div>
</template>

<script>
 import {photoCompress, convertBase64UrlToBlob} from '@/components/photoCompress.js'
export default {
  name: 'Upload',
  props: {
    initImages: {
      default: ''
    },
    maxLength: {
      default: 10 // 最大上传张数限制
    }
  },
  data () {
    return {
      list: [], // 图片列表
      accepts: "", // 放入input中的属性值
      ext: 'jpg,png', // 允许上传的图片类型
      mimes: { // 类型对应列表
        "jpg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif"
      },
      limit: 2 * 1024 * 1024, // 图片大小限制2M
      supportProgress: false,
      percent: 0 ,// 上传进度
    }
  },
  mounted () {
    console.log('上传插件调用')
  },
  methods:{
    delImg (index) {
      this.list = this.list.filter((x,idx)=>idx!=index)
    },
    getFiles(e) {
      e.stopPropagation();
      e.preventDefault();
      let files = _turn(e.target.files)
      let _exts = this.ext.split(",")
      let _mimes = []
      if (_exts.length > 0) {
        _exts.forEach(v => {
          if (this.mimes[v] !== undefined) {
            _mimes.push(this.mimes[v])
          }
        })
      }
      function _turn(files) {
        let newFiles = []
        for (let i = 0, file; file = files[i]; i++) {
          newFiles.push(file)
        }
        return newFiles
      }

      return files
    },
    fileChange(e) {
      this.input = e.target
      this.files = this.getFiles(e)
      if(this.files.length + this.list.length > this.maxLength) {
        this.$toast('画像は' + this.maxLength + '枚まで追加できます')
        this.files = []
        return
      }
      this.uploadFiles()
    },
    /* 上传文件到服务器 */
    uploadFiles() {
      if (this.files.length === 0) return false;
      let params = {
        loadedAll: [],
        totalAll: [],
        dataPercent: 0,
        numberPercent: 0
      }
      /* 一个是数据上传的比例，另一个是响应的个数  相加为100 */
      let vm = this
      this.files.forEach((file, index) => {
        let formData = new FormData();
        if (file.size > this.limit) {
          photoCompress(file,{quality: 0.9,width:1500,height:1500},function(base64Codes){
            var bl = convertBase64UrlToBlob(base64Codes);
            formData.append("file", bl, "file_"+Date.parse(new Date())+".jpg");
            vm.uploadApi(formData,index,params,file)
          })
        } else {
          formData.append('file', file)
          vm.uploadApi(formData,index,params,file)
        }
      })
    },
    uploadApi (formData,index,params,file) {
      this.$http.post('/api/picture/upload', formData, {
        progress: (event) => {
          // 标记是否支持progress监听事件，iphone Uc、QQ等，不支持该监听
          if (!this.supportProgress) this.supportProgress = true
          params.loadedAll[index] = event.loaded
          params.totalAll[index] = event.total
          params.dataPercent = Math.floor(_sum(params.loadedAll) / _sum(params.totalAll) * (100 - this.files.length))
          if (this.percent !== 100) { // 躲异常异步
            this.percent = params.dataPercent + params.numberPercent
          }
        }
      }).then(res => {
        if (res.code==='00') {
          params.numberPercent++
          if (this.percent !== 100) { // 躲异常异步
            this.percent = params.dataPercent + params.numberPercent
          }
          let path = res.data
          this.list.push(path)
          this.$emit('addImg', path)
        } else {
          this.$toast('画像のアップロードに失敗しました。')
        }
      }, err => {
      })
    },
  }
}
</script>
<style>
.upload .progress em {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: .8rem;
  line-height: 100%;
  color: #fff;
}
</style>
