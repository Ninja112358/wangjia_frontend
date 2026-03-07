<template>
  <SingleSelectTable
    :data="roomList"
    :columns="columns"
    row-key="id"
    display-field="roomId"
    :default-selected-key="'2asdasd'"
    @select="handleSelect"
  />
</template>

<script setup lang="ts">

import SingleSelectTable from '@/components/table/SingleSelectTable.vue'
import { ref } from 'vue'

const roomList = ref([
  { id: 1, roomId: '101', roomType: '标准间', roomPrice: 200 },
  { id: '2asdasd', roomId: '102', roomType: '大床房', roomPrice: 250 },
  { id: 3, roomId: '201', roomType: '套房', roomPrice: 400 },
])

const columns = [
  { title: '房间号', dataIndex: 'roomId', key: 'roomId', width: 100 },
  { title: '房间类型', dataIndex: 'roomType', key: 'roomType' },
  { title: '价格', dataIndex: 'roomPrice', key: 'roomPrice', width: 100 },
]

const handleSelect = (selected) => {
  console.log('选中的房间:', selected)
  // 处理提交逻辑
}
</script>
