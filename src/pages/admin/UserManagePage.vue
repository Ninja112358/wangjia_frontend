<template>
  <div id="userManagePage">
    <!-- 表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 16px">
      <a-form-item label="用户 id">
        <a-input v-model:value="searchParams.id" placeholder="请输入用户 id" />
      </a-form-item>
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="用户简介">
        <a-input v-model:value="searchParams.userProfile" placeholder="请输入用户简介" />
      </a-form-item>
      <a-form-item label="用户角色">
        <a-select
          ref="select"
          v-model:value="searchParams.userRole"
          style="width: 100px"
        >
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="user">用户</a-select-option>
          <a-select-option value="admin">管理员</a-select-option>
          <a-select-option value="fuck">未知</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>


    <!-- 表格 -->
    <!-- 注意：@change 现在会接收 pagination, filters, sorter 三个参数 -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
      :scroll="{ y: 630 }"
    >
      <template #bodyCell="{ column, text , record }">
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="70" :height="70"></a-image>
        </template>
        <template v-if="column.dataIndex === 'userRole'">
          <div>
            <template v-if="editableData[record.id]">
              <a-select
                ref="select"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="width: 100px"
              >
                <a-select-option value="user">用户</a-select-option>
                <a-select-option value="admin">管理员</a-select-option>
              </a-select>
            </template>
            <template v-else>
              <div v-if="record.userRole === 'admin'">
                <a-tag color="gold">管理员</a-tag>
              </div>
              <div v-else-if="record.userRole === 'user'">
                <a-tag color="blue">用户</a-tag>
              </div>
              <div v-else>
                <a-tag color="gray">未知</a-tag>
              </div>
            </template>
          </div>
        </template>

        <template v-if="['userAccount', 'userName', 'userProfile'].includes(column.dataIndex)">
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

<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
import { computed, createVNode, onMounted, reactive, ref } from 'vue'
import {
  deleteUserUsingPost,
  listUserVoByPageUsingPost,
  updateUserUsingPost
} from '@/service/api/userController.ts'
import { message, Modal } from 'ant-design-vue'
import type { UnwrapRef } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

// 定义列，添加 sorter: true 以显示排序图标
// 注意：这里只是 UI 展示，实际排序逻辑由 doTableChange 处理并传给后端
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
    width: '180px',
    sorter: true // 启用排序 UI
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    align: 'center',
    sorter: true
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    align: 'center',
    sorter: true
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
    align: 'center'
  },
  {
    title: '用户简介',
    dataIndex: 'userProfile',
    align: 'center',
    width: '400px',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
    align: 'center',
    sorter: true
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
    align: 'center',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '200px',
  },
]

// 定义数据
const dataList = ref<API.UserVO[]>([]);
const total = ref<number>(0);

// 搜索条件
// 修改点：增加了 sortField 和 sortOrder
const searchParams = reactive<API.UserQueryRequest>(
  {
    current: 1,
    pageSize: 6,
    userRole: 'all',
  }
);

const fetchData = async () => {
  // 构造请求参数，确保排序参数被传递
  const res = await listUserVoByPageUsingPost({
    ...searchParams
  });
  if(res.data.code === 0 && res.data.data){
    dataList.value = res.data.data.records ?? [];
    total.value = res.data.data.total ?? 0;
  }else{
    message.error("数据获取失败:" + res.data.message);
  }
}

// 页面加载时获取数据
onMounted(()=>{
  fetchData();
})

// 分页参数
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

// 表格变化事件 (分页、排序、筛选)
// 修改点：接收 sorter 参数
const doTableChange = (pagination: any, filters: any, sorter: any) => {
  // 1. 处理分页
  searchParams.current = pagination.current;
  searchParams.pageSize = pagination.pageSize;

  // 2. 处理排序 (核心修改)
  if (sorter.field) {
    // 更新排序字段
    searchParams.sortField = sorter.field;
    searchParams.sortOrder = sorter.order;

    if (!sorter.order) {
      // 如果取消了排序 (order 为 null)，可以选择不传或传默认值
      searchParams.sortOrder = undefined;
      searchParams.sortField = undefined;
    }
  }

  // 3. 重新获取数据
  fetchData();
}

// 搜索点击事件
const doSearch = () => {
  searchParams.current = 1;
  // 搜索时也可以重置排序，或者保留当前排序，视需求而定
  // searchParams.sortField = 'createTime';
  // searchParams.sortOrder = 'desc';
  fetchData();
}

// 编辑功能
const editableData: UnwrapRef<Record<string, API.UserVO[]>> = reactive({});
const doEdit = (id: string) => {
  editableData[id] = JSON.parse(JSON.stringify(dataList.value.filter(item => id === item.id?.toString())[0]));
};
const doEditSave = async (id: string) => {
  const res = await updateUserUsingPost( editableData[id] );
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
    message.error("删除失败:id 不存在");
    return;
  }
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '你确定要删除该用户吗？',
    onOk: async () => {
      const res = await deleteUserUsingPost({ id });
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
.editable-row-operations button {
  margin-right: 8px;
}
</style>
