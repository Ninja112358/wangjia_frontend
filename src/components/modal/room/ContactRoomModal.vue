<template>
  <div id="contactRoomModal">
    <a-modal v-model:open="modalOpen" title="联房功能" @ok="checkInOk" :zIndex="1050" width="70%" style="top: 40px" destroyOnClose>
      <!-- 现有订单组表格 -->
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
            <div v-if="record.customType === 1">
              <a-tag color="blue">团队</a-tag>
            </div>
            <div v-else-if="record.customType === 0">
              <a-tag color="green">散客</a-tag>
            </div>
            <div v-else>
              <a-tag color="gray">未知</a-tag>
            </div>
          </template>

          <template v-if="column.dataIndex === 'startTime'">
            {{ dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="primary" danger @click="doRemoveOrderGroup(record)">移除</a-button>
          </template>
        </template>
      </a-table>

      <!-- 选联房按钮 -->
      <div style="display: flex; justify-content: end; margin: 16px 0;">
        <a-button type="primary" @click="addOrderModalOpen = true">选联房</a-button>
      </div>

      <!-- 已选中的订单组表格 -->
      <div style="margin-top: 16px;">
        <a-divider>已选择的联房</a-divider>
        <a-table
          :columns="selectedOrderGroupColumns"
          :data-source="selectedOrderGroupList"
          :scroll="{ y: 200 }"
          :pagination="false"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'orderState'">
              <a-tag :color="record.orderState === 1 ? 'green' : 'orange'">
                {{ record.orderState === 1 ? '已结' : '未结' }}
              </a-tag>
            </template>
            <template v-if="column.dataIndex === 'customType'">
              <a-tag :color="record.customType === 1 ? 'blue' : 'green'">
                {{ record.customType === 1 ? '团队' : '散客' }}
              </a-tag>
            </template>
            <template v-if="column.dataIndex === 'startTime'">
              {{ dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template v-if="column.dataIndex === 'action'">
              <a-button type="primary" danger @click="doRemoveOrderGroup(record)">移除</a-button>
            </template>
          </template>
        </a-table>
      </div>

      <!-- 选房模态框 -->
      <AddOrderModal
        v-model:open="addOrderModalOpen"
        :selected-order-group-list="selectedOrderGroupList"
        :order-id="props.room.orderId??0"
        @update="doAddOrderUpdate"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { contactOrderUsingPost, listOrderGroupDataUsingPost } from '@/service/api/orderController.ts'
import { message, Modal } from 'ant-design-vue'
import AddOrderModal from '@/components/modal/order/AddOrderModal.vue'
import { useRoomListStore } from '@/stores/useRoomListStore.ts'

const addOrderModalOpen = ref(false);
const modalOpen = defineModel('open');
const props = defineProps<{
  room: API.Room
}>()

const orderGroupInfo = ref<API.Order[]>([]);
// 已选中的订单组列表
const selectedOrderGroupList = ref<API.OrderGroupSelectInfoVO[]>([]);

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
  },
  {
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
    title: '订单组 id',
    dataIndex: 'orderGroupId',
    align: 'center',
    width: '180px',
    ellipsis: true
  }
]

// 已选订单组表格列
const selectedOrderGroupColumns = [
  {
    title: '订单组信息',
    dataIndex: 'orderGroupInfo',
    align: 'center',
    width: '200px',
    customRender: ({ record }: any) => {
      return findOrderGroupInfoStr(record.orderList);
    }
  },
  {
    title: '订单数量',
    dataIndex: 'orderNum',
    align: 'center',
    width: '100px',
    customRender: ({ record }: any) => record.orderList?.length || 0
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '100px'
  }
]

// 监听 checkInModalOpen 状态
watch(() => modalOpen.value, (newValue) => {
  if (newValue) {
    fetchData();
    selectedOrderGroupList.value = [];
  }
})



const fetchData = async () => {
  await fetchOrderGroupInfo();
}

const fetchOrderGroupInfo = async () => {
  // 根据 orderId 查询订单组信息
  const res = await listOrderGroupDataUsingPost({ orderId: props.room.orderId });
  if (res.data.code === 0 && res.data.data)
    orderGroupInfo.value = res.data.data;
  else
    message.error("获取订单信息失败：" + res.data.message);
}

// 添加订单组
const doAddOrderUpdate = (orderGroupSelectInfoList: API.OrderGroupSelectInfoVO[]) => {
  // 将选中的订单组添加到已选列表
  orderGroupSelectInfoList.forEach(item => {
    // 避免重复添加
    const exists = selectedOrderGroupList.value.find(selected => selected.id === item.id);
    if (!exists) {
      selectedOrderGroupList.value.push(item);
    }
  });
  message.success(`已添加 ${orderGroupSelectInfoList.length} 个订单组`);
}

// 移除订单组
const doRemoveOrderGroup = (record: API.OrderGroupSelectInfoVO | API.Order) => {
  Modal.confirm({
    title: '提示',
    content: '确定要移除该订单组吗？',
    zIndex: 1150,
    onOk: () => {
      const index = selectedOrderGroupList.value.findIndex(item => item.id === record.id);
      if (index > -1) {
        selectedOrderGroupList.value.splice(index, 1);
        message.success('移除成功');
      }
    }
  })
}

const checkInOk = async () => {
  if (selectedOrderGroupList.value.length === 0) {
    message.warning('请至少选择一个联房订单组');
    return;
  }
  //这里开始联房
  //确定要联房
  Modal.confirm({
    title: '提示',
    content: '确定要联房吗？',
    zIndex: 1150,
    onOk: async () => {
      await contactOrder({
        orderGroupId: orderGroupInfo.value[0].orderGroupId,
        orderGroupSelectInfoList: selectedOrderGroupList.value,
      });
      modalOpen.value = false
    }
  })


}
const contactOrder = async (orderContactRequest :API.OrderContactRequest) => {
  const res = await contactOrderUsingPost(orderContactRequest);
  if (res.data.code === 0 && res.data.data) {
    message.success('联房成功');
    //这里需要更新一下结果哦
    await useRoomListStore().fetchRoomList();
  } else {
    message.error("联房失败：" + res.data.message);
  }
}


const findOrderGroupInfoStr = (orderList: API.Order[]) => {
  // 根据 orderList 找到 orderGroupInfo 例如：张三 (201,202), 王五 (203), 赵六 (207,208)
  const orderListObj: Record<string, string[]> = {};
  for (const item of orderList || []) {
    if (item.name) {
      if (orderListObj[item.name]) {
        orderListObj[item.name].push(item.roomId);
      } else {
        orderListObj[item.name] = [item.roomId];
      }
    }
  }
  return Object.keys(orderListObj).map(item => {
    return item + "(" + orderListObj[item].join(",") + ")";
  }).join(",");
}
</script>

<style scoped>
#contactRoomModal {
}

.editable-row-operations button {
  margin-right: 8px;
}

.form-item {
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
  left: 10px;
  z-index: 1;
}

.ant-select {
  padding-left: 30px;
}
</style>
