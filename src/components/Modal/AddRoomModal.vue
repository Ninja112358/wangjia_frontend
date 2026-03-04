<template>
  <div id="addRoomModal">
    <a-modal v-model:open="modalOpen" title="选房" @ok="checkInOk" :zIndex="1150" width="80%" style="top: 20px" destroyOnClose>
      <a-table :row-selection="rowSelection" :columns="columns" :data-source="selectRoomList" :scroll="{ y: 680 }" :custom-row="customRow" :pagination="false" style="margin-bottom: 8px">
        <template #bodyCell="{ column, record, index }">
          <!-- 索引列 -->
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { useRoomListStore } from '@/stores/useRoomListStore.ts'
import { onMounted, reactive, ref, watch } from 'vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { TableProps } from 'ant-design-vue'

const modalOpen = defineModel('open');
const emit = defineEmits(['update']);
const props = defineProps<{
  selectedRoomList: API.Room[]
}>();

const roomListStore = useRoomListStore();
const selectRoomList = ref<API.Room[]>([]);

const selectedRowKeys = ref<Key[]>([])
const selectedRows = ref<API.Room[]>([])

const customRow = (record : any) => ({
  onClick: () => {
    const index = selectedRowKeys.value.findIndex(key => key === record.id)
    if (index > -1) {
      selectedRowKeys.value.splice(index, 1)
      selectedRows.value.splice(index, 1)
    } else {
      selectedRowKeys.value.push(record.id)
      selectedRows.value.push(record)
    }
  },
  style: { cursor: 'pointer' }
})

const rowSelection: TableProps['rowSelection'] = {
  onChange: (keys: Key[], rows: API.Room[]) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  },
};

//监听对话框的状态
watch(() => modalOpen.value, (newValue) => {
  //打开对话框的时候刷新数据
  if(newValue)
    fetchData();
})

onMounted(() => {
  fetchData();
})

const fetchData = () => {
  //已经选择过的不能选,已经住人的不能选,维修和锁房的不能选
  selectRoomList.value = roomListStore.roomList.filter(item => {
    for (let i = 0; i < props.selectedRoomList.length; i++)
      if (item.id === props.selectedRoomList[i].id)
        return false;
    return !(item.roomState === 1 || item.roomState === 4 || item.roomState === 2 || item.roomState === 5);
  })
  //将所有的列表增加一个属性key
  selectRoomList.value.forEach((item, index) => {
    item.key = item.id;
  })
}

//表格列
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
      compare: (a:API.Room, b:API.Room) => (a.roomId??'').localeCompare(b.roomId??''),
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
      compare: (a:API.Room, b:API.Room) => (a.roomType??'').localeCompare(b.roomType??''),
    }
  },{
    title: '房间窗户',
    dataIndex: 'isWindow',
    align: 'center',
    width: '110px',
    sorter: {
      compare: (a:API.Room, b:API.Room) => (a.isWindow??'').localeCompare(b.isWindow??''),
    }
  },{
    title: '房间人数',
    dataIndex: 'roomPeopleNum',
    align: 'center',
    width: '110px',
    sorter: {
      compare: (a:API.Room, b:API.Room) => a.roomPeopleNum??0 - (b.roomPeopleNum??0),
    }
  },{
    title: '房间价格',
    dataIndex: 'roomPrice',
    align: 'center',
    width: '110px',
    sorter: {
      compare: (a:API.Room, b:API.Room) => a.roomPrice??0 - (b.roomPrice??0),
    }
  },{
    title: '房间备注',
    dataIndex: 'roomInfo',
    align: 'center',
  }
];
const checkInOk = () => {
  emit('update', selectedRows.value);
  console.log(selectedRows.value)
  modalOpen.value = false;
}

</script>


<style scoped>
#addRoomModal{

}
</style>
