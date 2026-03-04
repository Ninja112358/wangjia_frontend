<template>
  <div id="checkInModal">
    <a-modal v-model:open="checkInModalOpen" title="入住信息登记" @ok="checkInOk" :zIndex="1050" width="70%" style="top: 40px">
      <a-form layout="inline" :model="checkInParams" @finish="doCheckIn">
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.name" placeholder="请输入姓名" addon-before="姓名" size="large" allow-clear/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.phone" placeholder="请输入电话" addon-before="电话"  size="large" allow-clear/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.cardType" placeholder="请输入证件类型" addon-before="证件类型"  size="large" allow-clear/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.idCard" placeholder="请输入证件号" addon-before="证件号"  size="large" allow-clear/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.orderInfo" placeholder="请输入订单备注" addon-before="订单备注"  size="large" allow-clear/>
        </a-form-item>
        <a-form-item class="form-item">
          <a-input v-model:value="checkInParams.customType" placeholder="请输入顾客类型" addon-before="顾客类型"  size="large" allow-clear/>
        </a-form-item>
      </a-form>
      <h2 style="font-weight: bolder">房间列表：</h2>

      <a-table :columns="columns" :data-source="roomList" :scroll="{ y: 450 }" :pagination="false" style="margin-bottom: 8px">
        <template #bodyCell="{ column, text , record,index }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
          <template v-if="['roomPrice', 'roomPeopleNum','roomInfo'].includes(column.dataIndex)">
            <div>
              <a-input
                v-if="editableData[record.id]"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="margin: -5px 0"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'action'">
            <div class="editable-row-operations">
                <span v-if="editableData[record.id]">
                  <a-button @click="doEditCancel(record.id)">取消</a-button>
                  <a-button type="primary" @click="doEditSave(record.id)">保存</a-button>
                </span>
              <span v-else>
                  <a-button type="primary" @click="doEdit(record.id)">编辑</a-button>
                  <a-button type="primary" danger @click="doDelete(record.id)">删除</a-button>
                </span>

            </div>
          </template>
        </template>
      </a-table>
      <a-button type="primary" @click="addRoomModalOpen = true">添加房间</a-button>
      <AddRoomModal @update="doAddRoomUpdate" v-model:open="addRoomModalOpen"  :selected-room-list="roomList"></AddRoomModal>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { createVNode, h, onMounted, reactive, ref, type UnwrapRef, watch } from 'vue'
import { checkInUsingPost } from '@/service/api/orderController.ts'
import { Input, message, Modal } from 'ant-design-vue'
import { useRoomListStore } from '@/stores/useRoomListStore.ts'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import AddRoomModal from '@/components/Modal/AddRoomModal.vue'

const roomListStore = useRoomListStore();
const roomList = ref<API.Room[]>([]);
const addRoomModalOpen = ref(false);

const checkInModalOpen = defineModel('open');
const props = defineProps<{
  room: API.Room
}>();

const doAddRoomUpdate = (selectedRoomList: API.Room[]) => {
  for (let i = 0; i < selectedRoomList.length; i++){
    //已经存在的不能插入
    if (roomList.value.filter(item => item.roomId === selectedRoomList[i].roomId).length > 0)
      return;
    roomList.value.push(selectedRoomList[i]);
  }
}

//监听checkInModalOpen状态
watch(() => checkInModalOpen.value, (newValue) => {
  if(newValue)
    fetchData();
})

onMounted(() => {
  fetchData();
})

const fetchData = () => {
  roomList.value = [];
  roomList.value.push(props.room)
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
  },{
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '200px',
  }
];


// 编辑功能
const editableData: UnwrapRef<Record<string, API.RoomType[]>> = reactive({});
const doEdit = (id: string) => {
  editableData[id] = JSON.parse(JSON.stringify(roomList.value.filter(item => id === item.id?.toString())[0]));
};
const doEditSave = async (id: string) => {
  Object.assign(roomList.value.filter(item => id === item.id?.toString())[0], editableData[id]);
  delete editableData[id];
};
const doEditCancel = (id: string) => {
  delete editableData[id];
};
const doDelete = async (id: number) => {
  if(!id){
    message.error("删除失败:id不存在");
    return;
  }
  roomList.value = roomList.value.filter(item => item.id !== id);
}


const checkInParams = ref<API.OrderCheckInRequest>({
  pay: 0,
  roomList:[]
});


const checkInOk = () => {
  const inputValue = ref('0');
  Modal.confirm({
    title: '您确定要进行入住吗',
    icon: createVNode(ExclamationCircleOutlined),
    content: h('div', {}, [
      h('span', { style: { color: '#666', marginBottom: '10px' } }, '请收顾客住宿费'),
      h(Input, {
        value: inputValue.value,
        'onUpdate:value': (val) => {
          inputValue.value = val.replace(/\D/g, '')
        },
        placeholder: '请输入押金',
        style: { width: '100%' },
        type: 'number'
      })
    ]),
    zIndex: 1100,
    onOk() {
      checkInParams.value.pay = Number(inputValue.value);
      checkInParams.value.roomList = roomList.value;
      doCheckIn();
    },
    onCancel() {
      console.log('Cancel');
    }
  });
}
/*
* 需要后端发请求的方法
* */
// 入住
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

</script>


<style scoped>
#checkInModal{

}
.editable-row-operations button{
  margin-right: 8px;
}
.form-item{
  font-size: 14px;
  margin: 10px;
}
</style>
