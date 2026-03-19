<template>

</template>

<script setup lang="ts">
//直接跳转到主页
import router from '@/router'
import { onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { setFingerPrintUsingGet } from '@/service/api/fingerPrintController.ts'

// 使用官方库的版本 (更推荐)
import FingerprintJS from '@fingerprintjs/fingerprintjs'

async function getProFingerprint() {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId // 这是一个经过稳定性处理的 ID
}

//将浏览器指纹保存在服务器中
onMounted(async () => {
  const fingerPrint = await getProFingerprint();
  const res = await setFingerPrintUsingGet({ fingerPrint });
  // if(res.data.code === 0 && res.data.data){
  //   message.success('保存成功');
  // }else{
  //   message.error(res.data.message);
  // }
})


router.push({
  path: '/'
})
</script>

<style scoped>

</style>
