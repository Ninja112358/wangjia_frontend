<template>
  <div id="contactRoomModal">
    <a-modal v-model:open="modalOpen" title="联房功能" @ok="checkInOk" :zIndex="1050" width="70%" style="top: 40px" destroyOnClose>
      test
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

const modalOpen = defineModel('open');
const props = defineProps<{
  room: API.Room
}>();

//监听checkInModalOpen状态
watch(() => modalOpen.value, (newValue) => {
  if(newValue)
    fetchData();
})

onMounted(() => {
  fetchData();
})

const fetchData = () => {

}


const checkInOk = () => {
  console.log("test")
  modalOpen.value = false
}

</script>


<style scoped>
#contactRoomModal{

}
.editable-row-operations button{
  margin-right: 8px;
}
.form-item{
  font-size: 14px;
  margin: 10px;
}

.custom-select {
  position: relative;
}
.addon-before {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px; /* 根据需要调整 */
  z-index: 1; /* 确保图标在 Select 输入框之上 */
}
.ant-select {
  padding-left: 30px; /* 根据图标宽度调整 */
}
</style>
