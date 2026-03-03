<template>
  <div id="selectRoomModal">
    <a-modal v-model:open="modalOpen" title="查看入住信息" @ok="checkInOk" :zIndex="1050">
      <a-form>

      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
const modalOpen = defineModel('open');
const props = defineProps<{
  room: API.Room
}>();
const checkInOk = () => {
  modalOpen.value = false;
}

</script>


<style scoped>
#selectRoomModal{

}
</style>
