<template>
  <div id="roomTypePage">
    <!-- 表单 -->
    <a-form layout="inline" :model="addParams" @finish="doInsert" style="margin-bottom: 16px">
      <a-form-item label="类型名称">
        <a-input v-model:value="addParams.name" placeholder="请输入类型名称" />
      </a-form-item>
      <a-form-item label="类型价格">
        <a-input v-model:value="addParams.price" placeholder="请输入类型价格" />
      </a-form-item>
      <a-form-item label="类型人数">
        <a-input v-model:value="addParams.peopleNum" placeholder="请输入类型人数" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">添加</a-button>
      </a-form-item>
    </a-form>




    <a-table :columns="columns" :data-source="roomTypeList" :pagination="pagination" @change="doTableChange" :scroll="{ y: 630 }">
      <template #bodyCell="{ column, text , record }">

        <template v-if="['name', 'price', 'peopleNum'].includes(column.dataIndex)">
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

        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
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
import { addRoomTypeUsingPost,
  deleteRoomTypeUsingPost,
  listRoomTypeByPageUsingPost, updateRoomTypeUsingPost } from '@/service/api/roomTypeController.ts'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { deleteUserUsingPost } from '@/service/api/userController.ts'

const addParams = ref<API.RoomTypeUpdateRequest>({});
const searchParams = ref<API.RoomTypeQueryRequest>({

});
const total = ref(0);

const roomTypeList = ref<API.RoomType[]>([]);
//分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: Number(total.value),
    showSizeChanger: true,
    showQuickJumper:true,
    position: ['bottomCenter'],
    pageSizeOptions: ['6', '12', '18','24'],
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
    title: '类型名称',
    dataIndex: 'name',
    align: 'center',
    width: '200px'
  },
  {
    title: '类型价格',
    dataIndex: 'price',
    align: 'center',
    width: '100px'
  },
  {
    title: '类型人数',
    dataIndex: 'peopleNum',
    align: 'center',
    width: '100px'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    align: 'center'
  },{
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '200px',
  }
]

const fetchData = async () => {
  const res = await listRoomTypeByPageUsingPost({ ...searchParams.value });
  if(res.data.code === 0 && res.data.data){
    roomTypeList.value = res.data.data.records ?? [];
    total.value = res.data.data.total ?? 0;
  }else{
    message.error("房间类型获取失败:" + res.data.message);
  }
}
//页面加载时获取数据,请求一次
onMounted(()=>{
  fetchData();
})

// 添加
const doInsert = async () => {
  const res = await addRoomTypeUsingPost({ ...addParams.value });
  if(res.data.code === 0 && res.data.data)
    message.success('添加成功');
  else
    message.error('添加失败:' + res.data.message);
  await fetchData();
}
// 表格分页变化之后，重新获取数据
const doTableChange = (page: any) => {
  searchParams.value.current = page.current;
  searchParams.value.pageSize = page.pageSize;
  fetchData();
}




// 编辑功能
const editableData: UnwrapRef<Record<string, API.RoomType[]>> = reactive({});
const doEdit = (id: string) => {
  editableData[id] = JSON.parse(JSON.stringify(roomTypeList.value.filter(item => id === item.id?.toString())[0]));
};
const doEditSave = async (id: string) => {
  // Object.assign(dataList.value.filter(item => id === item.id?.toString())[0], editableData[id]);
  const res = await updateRoomTypeUsingPost( editableData[id] );
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
const doDelete = async (id: string) => {
  if(!id){
    message.error("删除失败:id不存在");
    return;
  }
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '你确定要删除该房间类型吗?',
    onOk: async () => {
      const res = await deleteRoomTypeUsingPost({ id });
      if(res.data.code === 0){
        message.success("删除成功");
        await fetchData();
      }else{
        message.error("删除失败:" + res.data.message);
      }
    }
  })

}

</script>

<style scoped>
#roomTypePage{

}
.editable-row-operations button {
  margin-right: 8px;
}
</style>
