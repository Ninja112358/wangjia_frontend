<template>
  <div id="roomPage">
    <!-- 表单 -->
    <a-form layout="inline" :model="addParams" @finish="doInsert" style="margin-bottom: 16px">
      <a-form-item label="房间号">
        <a-input v-model:value="addParams.roomId" placeholder="请输入房间号" @input="doRoomIdInput"/>
      </a-form-item>
      <a-form-item label="房间楼层">
        <a-input v-model:value="addParams.roomFloor" placeholder="请输入房间楼层" />
      </a-form-item>
      <a-form-item label="房间类型">
        <a-select
          v-model:value="addParams.roomType"
          :options="options"
          placeholder="请选择房间类型"
          @change="doRoomTypeChange"
        ></a-select>
      </a-form-item>
      <a-form-item label="房间人数">
        <a-input v-model:value="addParams.roomPeopleNum" placeholder="请输入房间人数" />
      </a-form-item>
      <a-form-item label="房间价格">
        <a-input v-model:value="addParams.roomPrice" placeholder="请输入房间价格" />
      </a-form-item>
      <a-form-item label="房间备注">
        <a-input v-model:value="addParams.roomInfo" placeholder="请输入房间备注" />
      </a-form-item>
      <a-form-item>
        <a-select
          v-model:value="addParams.isWindow"
          placeholder="有无窗"
        >
          <a-select-option value="有窗">有窗</a-select-option>
          <a-select-option value="无窗">无窗</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加</a-button>
      </a-form-item>
    </a-form>




    <a-table :columns="columns" :data-source="roomList" :pagination="pagination" @change="doTableChange" :scroll="{ y: 600 }">
      <template #bodyCell="{ column, text , record }">

        <template v-if="['roomId', 'roomPrice', 'roomPeopleNum', 'roomFloor','roomInfo'].includes(column.dataIndex)">
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
        <template v-if="column.dataIndex === 'roomType'">
          <div>
            <a-select
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              :options="options"
              style="margin: -5px 0"
              placeholder="请选择房间类型"
            ></a-select>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>

        <template v-if="column.dataIndex === 'isWindow'">
          <div>
            <a-select
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              placeholder="请选择房间窗户"
            >
              <a-select-option value="有窗">有窗</a-select-option>
              <a-select-option value="无窗">无窗</a-select-option>
            </a-select>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'roomState'">
          {{ getRoomStateStr(record.roomState) }}
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
  </div>
</template>

<script setup lang="ts">
import { computed, createVNode, onMounted, reactive, ref, type UnwrapRef } from 'vue'
import { message, Modal, type SelectProps } from 'ant-design-vue'
import dayjs from 'dayjs'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { addRoomUsingPost, deleteRoomUsingPost, listRoomByPageUsingPost, updateRoomUsingPost } from '@/service/api/roomController.ts'
import { listRoomTypeUsingPost } from '@/service/api/roomTypeController.ts'

const options = ref<SelectProps['options']>([]);
const roomTypeList = ref<API.RoomType[]>([]);
const roomList = ref<API.Room[]>([]);

const addParams = ref<API.RoomUpdateRequest>({
  isWindow: "有窗"
});
const searchParams = ref<API.RoomQueryRequest>({
  current: 1,
  pageSize: 10
});
const total = ref(0);

//分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: Number(total.value),
    showSizeChanger: true,
    showQuickJumper:true,
    position: ['bottomCenter'],
    pageSizeOptions: ['6', '10', '18','24','48','96'],
    showTotal: (total : string) => `共 ${total} 条`,
  }
});
//表格列
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
    width: '200px'
  },
  {
    title: '房间号',
    dataIndex: 'roomId',
    align: 'center',
    width: '100px',
    sorter: true
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
    align: 'center'
  },{
    title: '房间窗户',
    dataIndex: 'isWindow',
    align: 'center',
    width: '100px'
  },{
    title: '房间人数',
    dataIndex: 'roomPeopleNum',
    align: 'center',
    width: '100px'
  },{
    title: '房间价格',
    dataIndex: 'roomPrice',
    align: 'center',
    width: '100px'
  },{
    title: '房间备注',
    dataIndex: 'roomInfo',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    align: 'center'
  },
  {
    title: '房间状态',
    dataIndex: 'roomState',
    align: 'center',
    width: '100px'
  },{
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '200px',
  }
]

const fetchData = async () => {
  const res = await listRoomByPageUsingPost({ ...searchParams.value });
  if(res.data.code === 0 && res.data.data){
    roomList.value = res.data.data.records ?? [];
    total.value = res.data.data.total ?? 0;
  }else{
    message.error("房间类型获取失败:" + res.data.message);
  }

  const roomTypeRes = await listRoomTypeUsingPost();
  if(roomTypeRes.data.code === 0 && roomTypeRes.data.data){
    roomTypeList.value = roomTypeRes.data.data;
    options.value = roomTypeRes.data.data.map((item) => ({
      label: item.name,
      value: item.name
    }));
  }else{
    message.error("房间类型获取失败:" + roomTypeRes.data.message);
  }
}
//页面加载时获取数据,请求一次
onMounted(()=>{
  fetchData();
})

// 添加
const doInsert = async () => {
  const res = await addRoomUsingPost({ ...addParams.value });
  if(res.data.code === 0 && res.data.data)
    message.success('添加成功');
  else
    message.error('添加失败:' + res.data.message);
  await fetchData();
}
// 表格分页变化之后，重新获取数据
const doTableChange = (page: any,filter:any,sorter: any) => {
  searchParams.value.current = page.current;
  searchParams.value.pageSize = page.pageSize;
  searchParams.value.sortField = sorter.field;
  searchParams.value.sortOrder = sorter.order;
  fetchData();
}




// 编辑功能
const editableData: UnwrapRef<Record<string, API.RoomType[]>> = reactive({});
const doEdit = (id: string) => {
  editableData[id] = JSON.parse(JSON.stringify(roomList.value.filter(item => id === item.id?.toString())[0]));
};
const doEditSave = async (id: string) => {
  // Object.assign(dataList.value.filter(item => id === item.id?.toString())[0], editableData[id]);
  const res = await updateRoomUsingPost( editableData[id] );
  if(res.data.code === 0){
    message.success("编辑成功");
    await fetchData();
    delete editableData[id];
  }else{
    message.error("编辑失败:" + res.data.message);
  }
};
const doEditCancel = (id: string) => {
  delete editableData[id];
};
const doDelete = async (id: number) => {
  if(!id){
    message.error("删除失败:id不存在");
    return;
  }
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '你确定要删除该房间类型吗?',
    onOk: async () => {
      const res = await deleteRoomUsingPost({ id });
      if(res.data.code === 0){
        message.success("删除成功");
        await fetchData();
      }else{
        message.error("删除失败:" + res.data.message);
      }
    }
  })

}

const getRoomStateStr = (state:number) => {
  switch (state) {
    case 0:
      return '空净';
    case 1:
      return '在住';
    case 2:
      return '维修';
    case 3:
      return '空脏';
    case 4:
      return '在住脏';
    case 5:
      return '锁房';
    default:
      return '未知:' + state;
  }
}

const doRoomTypeChange = (value: string) => {
  //将RoomType对应value的属性给addParams
  console.log(value);
  roomTypeList.value.forEach((item) => {
    if(item.name === value){
      addParams.value.roomPrice = item.price;
      addParams.value.roomPeopleNum = item.peopleNum;
    }
  })
}
const doRoomIdInput = () => {
  //输入后自动填充房间楼层
  addParams.value.roomFloor = Math.floor(Number(addParams.value.roomId) / 100);
}
</script>

<style scoped>
#roomPage{

}
.editable-row-operations button {
  margin-right: 8px;
}


</style>
