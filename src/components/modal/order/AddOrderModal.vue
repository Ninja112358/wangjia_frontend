<template>
  <div id="addRoomModal">
    <a-modal v-model:open="modalOpen" title="选房" @ok="checkInOk" :zIndex="1150" width="80%" style="top: 20px" destroyOnClose>
      <!-- 选中信息提示 -->
      <div style="margin-bottom: 8px; color: #1890ff;">
        已选择 {{ selectedRowKeys.length }} 个房间
      </div>

      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="selectOrderGroupList"
        :scroll="{ y: 680 }"
        :custom-row="customRow"
        :pagination="false"
        :row-key="'id'"
        style="margin-bottom: 8px"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
          <template v-if="column.dataIndex === 'orderGroupInfo'">{{ findOrderGroupInfoStr(record.orderList) }}</template>
          <template v-if="column.dataIndex === 'orderNum'">{{ record.orderList.length }}</template>
        </template>
      </a-table>

      <template #footer>
        <a-button @click="modalOpen = false">取消</a-button>
        <a-button type="primary" @click="checkInOk" :disabled="selectedRowKeys.length === 0">
          确定 (已选 {{ selectedRowKeys.length }})
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import { message, type TableProps } from 'ant-design-vue'
import { listOrderGroupSelectInfoUsingPost } from '@/service/api/orderGroupController.ts'

const modalOpen = defineModel<boolean>('open');
const emit = defineEmits(['update']);
const props = defineProps<{
  orderId: number | string
}>();

const selectOrderGroupList = ref<API.OrderGroupSelectInfoVO[]>([]);

// 选中的行 ID 集合
const selectedRowKeys = ref<Key[]>([])

// 计算属性：获取选中的完整数据对象
const selectedRows = computed<API.OrderGroupSelectInfoVO[]>(() => {
  return selectOrderGroupList.value.filter(item => selectedRowKeys.value.includes(item.id));
});

const fetchData = async () => {
  const res = await listOrderGroupSelectInfoUsingPost({ orderId: props.orderId })
  if (res.data.code === 0 && res.data.data) {
    selectOrderGroupList.value = res.data.data;
  } else {
    message.error("获取订单组信息失败：" + res.data.message);
  }
}

const columns = [
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: '60px'
  },
  {
    title: '订单组信息',
    dataIndex: 'orderGroupInfo',
    align: 'center',
    width: '100px'
  },
  {
    title: '订单数量',
    dataIndex: 'orderNum',
    align: 'center',
    width: '100px'
  }
];

// 监听对话框的状态
watch(() => modalOpen.value, (newValue) => {
  if (newValue) {
    fetchData();
    // 重置选中状态
    selectedRowKeys.value = [];
  }
})

onMounted(() => {
  fetchData();
})

const checkInOk = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请至少选择一个订单组');
    return;
  }
  emit('update', selectedRows.value);
  modalOpen.value = false;
}

// 修复：使用 computed 返回 rowSelection，确保响应式更新
const rowSelection = computed<TableProps['rowSelection']>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[]) => {
    selectedRowKeys.value = keys;
  },
}));

// 修复：customRow 参数类型改为 OrderGroupSelectInfoVO，不要修改 rowSelection
const customRow = (record: API.OrderGroupSelectInfoVO) => ({
  onClick: (event: MouseEvent) => {
    // 如果点击的是复选框区域，不触发行点击逻辑
    const target = event.target as HTMLElement;
    if (target.closest('.ant-checkbox-input') || target.closest('.ant-table-row-select')) {
      return;
    }

    // 切换选中状态
    const index = selectedRowKeys.value.indexOf(record.id);
    if (index > -1) {
      selectedRowKeys.value = selectedRowKeys.value.filter(id => id !== record.id);
    } else {
      selectedRowKeys.value = [...selectedRowKeys.value, record.id];
    }
    // 不需要修改 rowSelection，computed 会自动更新
  },
  style: { cursor: 'pointer' }
});

const findOrderGroupInfoStr = (orderList: API.Order[]) => {
  // 根据 orderList 找到 orderGroupInfo 例如：张三 (201,202), 王五 (203), 赵六 (207,208)
  const orderListObj: Record<string, string[]> = {};
  for (const item of orderList) {
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
:deep(.ant-table-tbody > tr.ant-table-row-selected) {
  background-color: #e6f7ff;
}

:deep(.ant-table-tbody > tr:hover) {
  background-color: #fafafa;
}
</style>
