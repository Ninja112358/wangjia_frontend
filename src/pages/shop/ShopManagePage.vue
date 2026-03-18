<template>
  <div id="shopManagePage">
    <!-- 表单 (添加 + 简单搜索) -->
    <a-form layout="inline" :model="addParams" @finish="doInsert" style="margin-bottom: 16px" v-if="loginUserStore.loginUser.userRole === 'admin'">
      <a-form-item label="商品名称">
        <a-input v-model:value="addParams.name" placeholder="请输入商品名称" />
      </a-form-item>
      <a-form-item label="商品价格">
        <a-input-number v-model:value="addParams.price" placeholder="0.00" :min="0" :step="0.01" style="width: 120px"/>
      </a-form-item>
      <a-form-item label="商品类型">
        <a-input v-model:value="addParams.type" placeholder="请输入类型" />
      </a-form-item>
      <a-form-item label="库存数量">
        <a-input-number v-model:value="addParams.num" placeholder="0" :min="0" :step="1" style="width: 100px"/>
      </a-form-item>
      <a-form-item label="备注">
        <a-input v-model:value="addParams.info" placeholder="选填" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">添加</a-button>
      </a-form-item>
    </a-form>

    <!-- 搜索栏 (仿照用户管理页风格，单独一行或合并在上，这里为了像 roomType 保持简洁，若需搜索可参考 userManagePage 拆分) -->
    <!-- 为了更像你的 roomTypePage，我将搜索功能简化，如果需要复杂搜索，可以参考 userManagePage 再加一个 form -->
    <!-- 这里为了功能完整，加一个简单的搜索条，风格保持一致 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch" style="margin-bottom: 16px">
      <a-form-item label="名称">
        <a-input v-model:value="searchParams.name" placeholder="搜索名称" />
      </a-form-item>
      <a-form-item label="类型">
        <a-input v-model:value="searchParams.type" placeholder="搜索类型" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
        <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
      </a-form-item>
    </a-form>

    <!-- 表格 -->
    <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange" :scroll="{ y: 580 }">
      <template #bodyCell="{ column, text , record }">

        <!-- 可编辑字段：名称、价格、类型、库存、备注 -->
        <template v-if="['name', 'price', 'type', 'num', 'info'].includes(column.dataIndex)">
          <div>
            <a-input
              v-if="editableData[record.id] && column.dataIndex !== 'price' && column.dataIndex !== 'num'"
              v-model:value="editableData[record.id][column.dataIndex]"
              style="margin: -5px 0"
            />
            <a-input-number
              v-else-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              :min="0"
              :step="column.dataIndex === 'price' ? 0.01 : 1"
              :precision="column.dataIndex === 'price' ? 2 : 0"
              style="margin: -5px 0; width: 100%"
            />
            <template v-else>
              <!-- 价格特殊显示 -->
              <span v-if="column.dataIndex === 'price'" style="color: #ff4d4f; font-weight: bold;">
                {{ formatMoney(text) }}
              </span>
              <span v-else>{{ text }}</span>
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
              <a-button @click="doCountShop(record.id)">入库</a-button>
              <a-button type="primary" @click="doEdit(record.id)" v-if="loginUserStore.loginUser.userRole === 'admin'">编辑</a-button>
              <a-button type="primary" danger @click="doDelete(record.id)" v-if="loginUserStore.loginUser.userRole === 'admin'">删除</a-button>
            </span>

          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed, createVNode, h, onMounted, reactive, ref, type UnwrapRef } from 'vue'
// 请确保路径正确，对应你的 shopController.ts
import {
  addShopUsingPost,
  deleteShopUsingPost, increaseShopNumUsingGet,
  listShopByPageUsingPost,
  updateShopUsingPost
} from '@/service/api/shopController.ts'
import { Input, message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'

// 定义数据
const addParams = ref<API.ShopAddRequest>({});
const searchParams = reactive<API.ShopQueryRequest>({
  current: 1,
  pageSize: 6,
  sortField: 'createTime',
  sortOrder: 'descend'
});
const total = ref(0);
const loginUserStore = useLoginUserStore();
const dataList = ref<API.Shop[]>([]);

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: Number(total.value),
    showSizeChanger: true,
    showQuickJumper: true,
    position: ['bottomCenter'],
    pageSizeOptions: ['6', '12', '18', '24'],
    showTotal: (total: string) => `共 ${total} 条`,
  }
});

// 表格列
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
    width: '200px',
    sorter: true
  },
  {
    title: '商品名字',
    dataIndex: 'name',
    align: 'center',
    width: '200px',
    sorter: true
  },
  {
    title: '商品价格',
    dataIndex: 'price',
    align: 'center',
    width: '120px',
    sorter: true
  },
  {
    title: '商品类型',
    dataIndex: 'type',
    align: 'center',
    width: '120px',
    sorter: true
  },
  {
    title: '库存数量',
    dataIndex: 'num',
    align: 'center',
    width: '120px',
    sorter: true
  },
  {
    title: '商品备注',
    dataIndex: 'info',
    align: 'center',
    ellipsis: true
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
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '260px',
  }
]

const fetchData = async () => {
  // 处理排序参数格式
  const paramsToSend = { ...searchParams };

  const res = await listShopByPageUsingPost(paramsToSend);
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? [];
    total.value = res.data.data.total ?? 0;
  } else {
    message.error("商品列表获取失败:" + res.data.message);
  }
}

// 页面加载时获取数据，请求一次
onMounted(async () => {
  await fetchData();
  await loginUserStore.fetchLoginUser();
})

// 添加
const doInsert = async () => {
  const res = await addShopUsingPost({ ...addParams.value });
  if (res.data.code === 0 && res.data.data) {
    message.success('添加成功');
    // 清空添加表单
    addParams.value = {};
    await fetchData();
  } else {
    message.error('添加失败:' + res.data.message);
  }
}

// 搜索
const doSearch = () => {
  searchParams.current = 1;
  fetchData();
}

const resetSearch = () => {
  searchParams.name = undefined;
  searchParams.type = undefined;
  searchParams.current = 1;
  fetchData();
}

// 表格分页/排序变化之后，重新获取数据
const doTableChange = (pagination: any, filters: any, sorter: any) => {
  searchParams.current = pagination.current;
  searchParams.pageSize = pagination.pageSize;

  if (sorter.field) {
    searchParams.sortField = sorter.field;
    searchParams.sortOrder = sorter.order;
    if (!sorter.order) {
      searchParams.sortField = undefined;
      searchParams.sortOrder = undefined;
    }
  }

  fetchData();
}

// 编辑功能
const editableData: UnwrapRef<Record<string, API.Shop>> = reactive({});
const doEdit = (id: string) => {
  editableData[id] = JSON.parse(JSON.stringify(dataList.value.filter(item => id === item.id?.toString())[0]));
};
const doEditSave = async (id: string) => {
  const res = await updateShopUsingPost(editableData[id]);
  if (res.data.code === 0) {
    message.success("编辑成功");
    await fetchData();
    delete editableData[id];
  } else {
    message.error("编辑失败:" + res.data.message);
  }
};
const doEditCancel = (id: string) => {
  delete editableData[id];
};

const doDelete = async (id: string) => {
  if (!id) {
    message.error("删除失败:id 不存在");
    return;
  }
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '你确定要删除该商品吗？',
    onOk: async () => {
      const res = await deleteShopUsingPost({ id });
      if (res.data.code === 0) {
        message.success("删除成功");
        await fetchData();
      } else {
        message.error("删除失败:" + res.data.message);
      }
    }
  })
}

const doCountShop = (shopId: number) => {
  const increaseShopNumParams = ref<{shopId:number,num:number}>({
    shopId,
    num:0
  })
  Modal.confirm({
    title: '商品入库',
    icon: null,
    content: h('div', {}, [
      h(Input, {
        defaultValue: increaseShopNumParams.value.num,
        'onUpdate:value': (val) => {
          increaseShopNumParams.value.num = Number(val);
        },
        placeholder: '请输入库数量',
        style: { width: '100%', margin: '10px 0' },
        addonBefore: '入库数量',
        type: 'number',
        size: 'large'
      })
    ]),
    zIndex: 1100,
    async onOk() {
      const res = await increaseShopNumUsingGet(increaseShopNumParams.value);
      if (res.data.code === 0 && res.data.data) {
        message.success("入库成功");
        await fetchData();
      } else {
        message.error("入库失败:" + res.data.message);
      }
    }
  });
}

// 金额格式化
const formatMoney = (val: any) => {
  if (val === null || val === undefined) return '0.00';
  return Number(val).toFixed(2);
}

</script>

<style scoped>
#shopManagePage {
  /* 保持和你原来的 roomTypePage 一样，留空或自定义 */
}
.editable-row-operations button {
  margin-right: 8px;
}
</style>
