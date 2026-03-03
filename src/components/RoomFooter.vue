<template>
  <div id="roomFooter">
    <div class="footer-info-text">全部:{{footerInfo.allNum}}</div>
    <div class="footer-info-text">空房:{{footerInfo.emptyNum}}</div>
    <div class="footer-info-text">在住:{{footerInfo.insideNum}}</div>
    <div class="footer-info-text">维修:{{footerInfo.repairNum}}</div>
    <div class="footer-info-text">锁房:{{footerInfo.lockNum}}</div>
    <div class="footer-info-text">入住率:{{footerInfo.insidePercent}}%</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  roomList: API.Room[]
}>();

const footerInfo = computed(() => {
  return {
    allNum: props.roomList?.length??0,
    emptyNum: props.roomList?.filter(item => item.roomState === 0 || item.roomState === 3).length??0,
    insideNum: props.roomList?.filter(item => item.roomState === 1 || item.roomState === 4).length??0,
    repairNum: props.roomList?.filter(item => item.roomState === 2).length??0,
    lockNum: props.roomList?.filter(item => item.roomState === 5).length??0,
    insidePercent: Math.round(props.roomList?.filter(item => item.roomState === 1 || item.roomState === 4).length??0 / (props.roomList?.length??1) * 100)
  }
});

</script>

<style scoped>

</style>
