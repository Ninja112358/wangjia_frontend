<template>
  <div id="contactRoomModal">
    <a-modal v-model:open="modalOpen" title="联房功能" @ok="checkInOk" :zIndex="1050" width="70%" style="top: 40px" destroyOnClose>
      <!-- 表格 -->
      <a-table :columns="orderGroupInfoColumns" :data-source="orderGroupInfo" :scroll="{ y: 300 }" :pagination="false" bordered>
        <template #bodyCell="{ column, text , record }">
          <template v-if="column.dataIndex === 'orderState'">
            <div v-if="record.orderState === 1">
              <a-tag color="green">已结</a-tag>
            </div>
            <div v-else-if="record.orderState === 0">
              <a-tag color="orange">未结</a-tag>
            </div>
            <div v-else>
              <a-tag color="gray">未知</a-tag>
            </div>
          </template>
          <template v-if="column.dataIndex === 'customType'">
            <div v-if="record.orderState === 1">
              <a-tag color="green">团队</a-tag>
            </div>
            <div v-else-if="record.orderState === 0">
              <a-tag color="orange">散客</a-tag>
            </div>
            <div v-else>
              <a-tag color="gray">未知</a-tag>
            </div>
          </template>

          <template v-if="column.dataIndex === 'startTime'">
            {{ dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </template>
      </a-table>
      <div style="display: flex;justify-content:end; margin: 16px 0;">
        <a-button type="primary" @click="addOrderModalOpen = true">选联房</a-button>
      </div>
      <AddOrderModal v-model:open="addOrderModalOpen" :order-id="props.room.orderId??0" @update="doAddOrderUpdate"/>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { listOrderGroupDataUsingPost } from '@/service/api/orderController.ts'
import { message } from 'ant-design-vue'
import AddOrderModal from '@/components/modal/order/AddOrderModal.vue'



const addOrderModalOpen = ref(false);
const modalOpen = defineModel('open');
const props = defineProps<{
  room: API.Room
}>()

const orderGroupInfo = ref<API.Order[]>([]);
const orderGroupInfoColumns = [
  {
    title: '房间号',
    dataIndex: 'roomId',
    align: 'center',
    width: '100px'
  },
  {
    title: '房间类型',
    dataIndex: 'roomType',
    align: 'center',
    width: '160px'
  },{
    title: '顾客名称',
    dataIndex: 'name',
    align: 'center',
    width: '120px'
  },
  {
    title: '顾客类型',
    dataIndex: 'customType',
    align: 'center',
    width: '120px'
  },
  {
    title: '订单状态',
    dataIndex: 'orderState',
    align: 'center',
    width: '120px'
  },
  {
    title: '入住时间',
    dataIndex: 'startTime',
    align: 'center',
    width: '160px'
  },
  {
    title: '订单组id',
    dataIndex: 'orderGroupId',
    align: 'center',
    width: '180px',
    ellipsis: true
  }
]





const doAddOrderUpdate = (orderGroupSelectInfoList:API.OrderGroupSelectInfoVO[]) => {
  console.log(orderGroupSelectInfoList)
}



//监听checkInModalOpen状态
watch(() => modalOpen.value, (newValue) => {
  if(newValue)
    fetchData();
})



const fetchData = async () => {
  await fetchOrderGroupInfo();
}
const fetchOrderGroupInfo = async () => {
//根据oderId查询订单组信息
  const res = await listOrderGroupDataUsingPost({orderId:props.room.orderId});
  if(res.data.code === 0 && res.data.data)
    orderGroupInfo.value = res.data.data;
  else
    message.error("获取订单信息失败" + res.data.message);
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
