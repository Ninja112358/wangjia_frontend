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
        :data-source="selectRoomList"
        :scroll="{ y: 680 }"
        :custom-row="customRow"
        :pagination="false"
        :row-key="'id'"
        style="margin-bottom: 8px"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
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
import { useRoomListStore } from '@/stores/useRoomListStore.ts'
import { onMounted, ref, watch, computed } from 'vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { TableProps } from 'ant-design-vue'

const modalOpen = defineModel<boolean>('open');
const emit = defineEmits(['update']);
const props = defineProps<{
  selectedRoomList: API.Room[]
}>();

const roomListStore = useRoomListStore();
const selectRoomList = ref<API.Room[]>([]);

// 选中的行 ID 集合
const selectedRowKeys = ref<Key[]>([])

// 修复：使用 computed 返回 rowSelection，确保响应式更新
const rowSelection = computed<TableProps['rowSelection']>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[]) => {
    selectedRowKeys.value = keys;
  },
}));

// 自定义行点击事件
const customRow = (record: API.Room) => ({
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
  },
  style: { cursor: 'pointer' }
})

// 计算属性：获取选中的完整数据对象
const selectedRows = computed<API.Room[]>(() => {
  return selectRoomList.value.filter(item => selectedRowKeys.value.includes(item.id));
});

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

const fetchData = () => {
  selectRoomList.value = roomListStore.roomList.filter(item => {
    for (let i = 0; i < props.selectedRoomList.length; i++) {
      if (item.id === props.selectedRoomList[i].id) {
        return false;
      }
    }
    return !(item.roomState === 1 || item.roomState === 2 || item.roomState === 3 || item.roomState === 4 || item.roomState === 5);
  })
}

const columns = [
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: '60px'
  },
  {
    title: '房间号',
    dataIndex: 'roomId',
    align: 'center',
    width: '100px',
    sorter: {
      compare: (a: API.Room, b: API.Room) => (a.roomId ?? '').localeCompare(b.roomId ?? ''),
    }
  },
  {
    title: '房间楼层',
    dataIndex: 'roomFloor',
    align: 'center',
    width: '100px'
  },
  {
    title: '房间类型',
    dataIndex: 'roomType',
    align: 'center',
    sorter: {
      compare: (a: API.Room, b: API.Room) => (a.roomType ?? '').localeCompare(b.roomType ?? ''),
    }
  },
  {
    title: '房间窗户',
    dataIndex: 'isWindow',
    align: 'center',
    width: '110px',
    sorter: {
      compare: (a: API.Room, b: API.Room) => (a.isWindow ?? '').localeCompare(b.isWindow ?? ''),
    }
  },
  {
    title: '房间人数',
    dataIndex: 'roomPeopleNum',
    align: 'center',
    width: '110px',
    sorter: {
      compare: (a: API.Room, b: API.Room) => (a.roomPeopleNum ?? 0) - (b.roomPeopleNum ?? 0),
    }
  },
  {
    title: '房间价格',
    dataIndex: 'roomPrice',
    align: 'center',
    width: '110px',
    sorter: {
      compare: (a: API.Room, b: API.Room) => (a.roomPrice ?? 0) - (b.roomPrice ?? 0),
    }
  },
  {
    title: '房间备注',
    dataIndex: 'roomInfo',
    align: 'center',
  }
];

const checkInOk = () => {
  if (selectedRowKeys.value.length === 0) {
    return;
  }
  emit('update', selectedRows.value);
  modalOpen.value = false;
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
