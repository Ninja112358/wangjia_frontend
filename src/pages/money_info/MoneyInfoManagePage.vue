<template>
  <div id="moneyInfoManagePage">
    <!-- 表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="订单 id" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.orderId" placeholder="请输入订单 id" />
      </a-form-item>
      <a-form-item label="房间 id" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.roomId" placeholder="请输入房间 id" />
      </a-form-item>
      <a-form-item label="操作员" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.operator" placeholder="请输入操作员" />
      </a-form-item>
      <a-form-item label="支付信息" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.payInfo" placeholder="请输入支付信息" />
      </a-form-item>
      <a-form-item label="营业项目" style="margin-bottom: 16px">
        <a-select
          ref="select"
          v-model:value="searchParams.moneyType"
          style="width: 100px"
        >
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="收款">收款</a-select-option>
          <a-select-option value="扣费">扣费</a-select-option>
          <a-select-option value="换房">换房</a-select-option>
          <a-select-option value="改价">改价</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item style="margin-bottom: 16px">
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 表格 -->
    <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange" :scroll="{ x: 1500, y: 550 }">
      <template #bodyCell="{ column, text, record }">
        <!-- 营业项目 (收支类型) -->
        <template v-if="column.dataIndex === 'moneyType'">
          <div>
            <template v-if="editableData[record.id]">
              <a-select
                ref="select"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="width: 100px"
              >
                <a-select-option value="收款">收款</a-select-option>
                <a-select-option value="扣费">扣费</a-select-option>
                <a-select-option value="换房">换房</a-select-option>
                <a-select-option value="改价">改价</a-select-option>
              </a-select>
            </template>
            <template v-else>
              <a-tag :color=" getTagColor(record.moneyType)">
                {{ text || '未知' }}
              </a-tag>
            </template>
          </div>
        </template>

        <!-- 金额 -->
        <template v-if="column.dataIndex === 'money'">
          <div>
            <a-input
              type="number"
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              :min="0"
              :step="0.01"
              :precision="2"
              style="margin: -5px 0; width: 100px"
            />
            <template v-else>
              <span :style="{ color: record.moneyType === '扣费' ? 'red' : record.moneyType === '收款' ? 'green' : 'black' , fontWeight: 'bold' }">
                {{ formatMoney(text) }}
              </span>
            </template>
          </div>
        </template>

        <!-- 文本输入框字段 (操作员，支付信息，房间 id) -->
        <template v-if="['payInfo'].includes(column.dataIndex)">
          <div>
            <a-input
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text || '-' }}
            </template>
          </div>
        </template>

        <!-- 时间字段 (支持编辑) -->
        <template v-if="['payTime'].includes(column.dataIndex)">
          <div>
            <template v-if="editableData[record.id]">
              <a-date-picker
                v-model:value="editableData[record.id][column.dataIndex]"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 180px"
                placeholder="选择时间"
              />
            </template>
            <template v-else>
              {{ text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-' }}
            </template>
          </div>
        </template>

        <!-- 时间字段 (只读) -->
        <template v-if="['createTime', 'updateTime'].includes(column.dataIndex)">
          {{ text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-' }}
        </template>

        <!-- 操作列 -->
        <template v-else-if="column.dataIndex === 'action'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.id]">
              <a-button @click="doEditCancel(record.id)">取消</a-button>
              <a-button type="primary" @click="doEditSave(record.id)">保存</a-button>
            </span>
            <span v-else>
              <a-button
                type="primary"
                @click="doLook(record.orderId)"
              >
                查看
              </a-button>
              <a-button
                type="primary"
                v-if="loginUserStore.loginUser.userRole === 'admin'"
                @click="doEdit(record.id)"
              >
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除这条记录吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="doDelete(record.id)"
              >
                <a-button v-if="loginUserStore.loginUser.userRole === 'admin'" type="dashed" danger>删除</a-button>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </template>
    </a-table>
    <SelectRoomModal v-model:open="selectRoomModalOpen" :order-id="lookOrderId"></SelectRoomModal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
// 请根据实际项目路径调整 API 导入
import {
  listMoneyInfoByPageUsingPost,
  updateMoneyInfoUsingPost,
  deleteMoneyInfoUsingPost,
} from '@/service/api/moneyInfoController.ts'
import { message } from 'ant-design-vue'
import type { UnwrapRef } from 'vue';
import dayjs from 'dayjs'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import SelectRoomModal from '@/components/modal/room/SelectRoomModal.vue'

const loginUserStore = useLoginUserStore();

// 【修改点 1】在需要排序的列添加 sorter: true
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
    width: '180px',
    ellipsis: true,
    sorter: true
  },
  {
    title: '订单 id',
    dataIndex: 'orderId',
    align: 'center',
    width: '180px',
    ellipsis: true,
    sorter: true
  },
  {
    title: '房间 id',
    dataIndex: 'roomId',
    align: 'center',
    width: '120px',
    ellipsis: true,
    sorter: true
  },
  {
    title: '营业项目',
    dataIndex: 'moneyType',
    align: 'center',
    width: '120px',
    sorter: true,
  },
  {
    title: '金额',
    dataIndex: 'money',
    align: 'center',
    width: '120px',
    sorter: true,
  },
  {
    title: '操作员',
    dataIndex: 'operator',
    align: 'center',
    width: '120px',
    ellipsis: true,
    sorter: true
  },
  {
    title: '支付信息',
    dataIndex: 'payInfo',
    align: 'center',
    ellipsis: true,
    sorter: true
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    align: 'center',
    width: '200px',
    sorter: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    width: '160px',
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    align: 'center',
    width: '160px',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '250px',
    fixed: 'right',
  },
]

// 定义数据
const dataList = ref<API.MoneyInfo[]>([]);
const total = ref<number>(0);
const lookOrderId = ref(0);
const selectRoomModalOpen = ref(false);

// 搜索条件
const searchParams = reactive<API.MoneyInfoQueryRequest>(
  {
    current: 1,
    pageSize: 6,
    sortField: 'createTime',
    sortOrder: 'descend',
    moneyType: 'all'
  }
);

const fetchData = async () => {
  const res = await listMoneyInfoByPageUsingPost({
    ...searchParams
  });
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? [];
    total.value = res.data.data.total ?? 0;
  } else {
    message.error("数据获取失败:" + res.data.message);
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: Number(total.value),
    showSizeChanger: true,
    showQuickJumper: true,
    position: ['bottomCenter'],
    pageSizeOptions: ['6', '12', '18', '24', '100000'],
    showTotal: (total: string) => `共 ${total} 条`,
  }
});

// 【修改点 2】修改 doTableChange 接收 sorter 参数并处理排序逻辑
const doTableChange = (pagination: any, filters: any, sorter: any) => {
  // 更新分页
  searchParams.current = pagination.current;
  searchParams.pageSize = pagination.pageSize;

  // 更新排序
  if (sorter.field) {
    searchParams.sortField = sorter.field;
    searchParams.sortOrder = sorter.order;

    // 将 antd 的 ascend/descend 转换为后端通常需要的 asc/desc
    if (!sorter.order) {
      // 取消排序
      searchParams.sortField = undefined;
      searchParams.sortOrder = undefined;
    }

  }

  fetchData();
}

// 搜索点击事件
const doSearch = () => {
  searchParams.current = 1;
  fetchData();
}

// 编辑功能
const editableData: UnwrapRef<Record<string, API.MoneyInfo>> = reactive({});

// 【修复点】进入编辑时，将时间字符串转换为 dayjs 对象
const doEdit = (id: string) => {
  const record = dataList.value.find(item => item.id?.toString() === id);
  if (record) {
    // 深拷贝
    const clone = JSON.parse(JSON.stringify(record));

    // 关键：将后端返回的时间字符串转为 dayjs 对象，否则 DatePicker 无法显示
    if (clone.payTime) {
      clone.payTime = dayjs(clone.payTime);
    }

    editableData[id] = clone;
  }
};

// 【修复点】保存时，将 dayjs 对象转回字符串
const doEditSave = async (id: string) => {
  const dataToSubmit = { ...editableData[id] };



  const res = await updateMoneyInfoUsingPost(dataToSubmit);
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

// 删除功能
const doDelete = async (id: string) => {
  const res = await deleteMoneyInfoUsingPost({ id });
  if (res.data.code === 0) {
    message.success("删除成功");
    await fetchData();
  } else {
    message.error("删除失败:" + res.data.message);
  }
}

const doLook = (orderId: number) => {
  lookOrderId.value = orderId;
  selectRoomModalOpen.value = true;
}

// 金额格式化
const formatMoney = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '0.00';
  return Number(value).toFixed(2);
}
// 设置标签颜色
const getTagColor = (type: string) => {
  return type === '收款' ? 'green' : type === '扣费' ? 'red' : type === '换房' ? 'orange' : type === '改价' ? 'blue' : 'default';
}

</script>

<style scoped>
.editable-row-operations button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
