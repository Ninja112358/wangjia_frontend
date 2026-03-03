<template>
  <div id="checkInModal">
    <a-modal v-model:open="checkInModalOpen" title="入住信息登记" @ok="checkInOk" :zIndex="1050" width="55%">
      <a-form layout="inline" :model="checkInParams" @finish="doCheckIn" style="margin-bottom: 16px">
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.name" placeholder="请输入姓名" addon-before="姓名" size="large"/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.phone" placeholder="请输入电话" addon-before="电话"  size="large"/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.cardType" placeholder="请输入证件类型" addon-before="证件类型"  size="large"/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.idCard" placeholder="请输入证件号" addon-before="证件号"  size="large"/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.orderInfo" placeholder="请输入订单备注" addon-before="订单备注"  size="large"/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.customType" placeholder="请输入顾客类型" addon-before="顾客类型"  size="large"/>
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { checkInUsingPost } from '@/service/api/orderController.ts'
import { message } from 'ant-design-vue'
import { useRoomListStore } from '@/stores/useRoomListStore.ts'

const roomListStore = useRoomListStore();

const checkInModalOpen = defineModel('open');
const props = defineProps<{
  room: API.Room
}>();

const checkInParams = ref<API.OrderCheckInRequest>({
  roomId: props.room.roomId,
  roomType: props.room.roomType,
  roomPrice: props.room.roomPrice,
  pay: 0,
});

const doCheckIn = async () => {
  console.log(checkInParams.value);
  const res = await checkInUsingPost({ ...checkInParams.value });
  if(res.data.code === 0 && res.data.data){
    message.success("入住成功");
    await roomListStore.fetchRoomList();
    checkInModalOpen.value = false;
  }else
    message.error("入住失败:" + res.data.message)
}


const checkInOk = () => {
  doCheckIn();
}

</script>


<style scoped>
#checkInModal{

}
.ant-input-lg{
  font-size: 14px;
}
.form-item{
  font-size: 14px;
  margin: 10px;
}
</style>
