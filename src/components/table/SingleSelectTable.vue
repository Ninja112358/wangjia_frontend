<template>
  <div class="single-select-table-container">
    <!-- 表格 -->
    <a-table
      :columns="columns"
      :data-source="data"
      :row-key="rowKey"
      :custom-row="customRow"
      :scroll="scroll"
      :pagination="pagination"
      class="clickable-table"
    >
      <template #bodyCell="slotProps">
        <slot name="bodyCell" v-bind="slotProps">
          <template v-if="slotProps.column.key === 'index'">
            <span v-if="slotProps.index > 0">
              {{ slotProps.index }}
            </span>
          </template>
        </slot>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Key, TableProps } from 'ant-design-vue'
import dayjs from 'dayjs'

// ============ Props ============
interface Props {
  data: any[]                    // 表格数据
  columns: any                   // 列配置
  rowKey?: string                // 行唯一标识，默认 'id'
  scroll?: { y?: number }        // 滚动配置
  pagination?: boolean           // 分页，默认 false
  defaultSelectedKey?: Key | null // ✅ 新增：默认选中的行 ID
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  scroll: () => ({}),
  pagination: false,
  defaultSelectedKey: null,      // ✅ 默认不选中
})

// ============ Emits ============
const emit = defineEmits<{
  select: [data: any]       // 选中变化事件
}>()

// ============ 状态 ============
const selectedRowKey = ref<Key | null>(null)

// 选中的完整数据
const selectedRow = computed(() => {
  if (!selectedRowKey.value) return null
  return props.data.find(item => item[props.rowKey] === selectedRowKey.value) || null
})

// ============ 行点击事件 ============
const customRow = (record: any) => ({
  onClick: () => {
    selectedRowKey.value = record[props.rowKey]
    emit('select', selectedRow.value)
  },
  style: { cursor: 'pointer' },
  class: selectedRowKey.value === record[props.rowKey] ? 'selected-row' : ''
})

// ============ 外部方法：重置选中 ============
const resetSelection = () => {
  selectedRowKey.value = null
}

// ✅ 新增：设置选中项
const setSelectedKey = (key: Key | null) => {
  selectedRowKey.value = key
}

// 暴露给父组件的方法
defineExpose({
  resetSelection,
  setSelectedKey,
  selectedRow,
  selectedRowKey
})

// ============ 监听数据变化，重置选中 ============
watch(() => props.data, () => {
  selectedRowKey.value = null
}, { deep: true })

// ============ ✅ 监听默认选中值变化 ============
watch(() => props.defaultSelectedKey, (newKey) => {
  if (newKey !== null && newKey !== undefined) {
    selectedRowKey.value = newKey
    emit('select', selectedRow.value)
  }
}, { immediate: true })
</script>

<style scoped>
.single-select-table-container {
  width: 100%;
}

/* ============ 表格样式 ============ */

/* 选中行高亮 */
:deep(.clickable-table .ant-table-tbody > tr.selected-row),
:deep(.clickable-table .ant-table-tbody > tr.selected-row:hover),
:deep(.clickable-table .ant-table-tbody > tr.selected-row.ant-table-row),
:deep(.clickable-table .ant-table-tbody > tr.selected-row.ant-table-row:hover) {
  background-color: #e6f7ff !important;
}

/* 选中行的单元格 */
:deep(.clickable-table .ant-table-tbody > tr.selected-row td),
:deep(.clickable-table .ant-table-tbody > tr.selected-row:hover td),
:deep(.clickable-table .ant-table-tbody > tr.selected-row td.ant-table-cell),
:deep(.clickable-table .ant-table-tbody > tr.selected-row:hover td.ant-table-cell) {
  background-color: #e6f7ff !important;
  transition: none !important;
}

/* 普通行 hover */
:deep(.clickable-table .ant-table-tbody > tr:hover) {
  background-color: #fafafa !important;
}

/* 鼠标指针 */
:deep(.clickable-table .ant-table-tbody > tr) {
  cursor: pointer;
}
</style>
