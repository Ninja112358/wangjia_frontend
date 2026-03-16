<template>
  <div id="orderManagePage">
    <!-- 表单 -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="订单 id" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.id" placeholder="请输入订单 id" />
      </a-form-item>
      <a-form-item label="顾客名称" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.name" placeholder="请输入顾客名称" />
      </a-form-item>
      <a-form-item label="联系电话" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.phone" placeholder="请输入联系电话" />
      </a-form-item>
      <a-form-item label="身份证号" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.idCard" placeholder="请输入身份证号" />
      </a-form-item>
      <a-form-item label="房间号" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.roomId" placeholder="请输入房间号" />
      </a-form-item>
      <a-form-item label="房间类型" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.roomType" placeholder="请输入房间类型" />
      </a-form-item>
      <a-form-item label="订单组id" style="margin-bottom: 16px">
        <a-input v-model:value="searchParams.orderGroupId" placeholder="请输入订单组id" />
      </a-form-item>
      <a-form-item label="订单状态" style="margin-bottom: 16px">
        <a-select
          ref="select"
          v-model:value="searchParams.orderState"
          style="width: 100px"
        >
          <a-select-option :value="2">全部</a-select-option>
          <a-select-option :value="0">未结</a-select-option>
          <a-select-option :value="1">已结</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="顾客类型" style="margin-bottom: 16px">
        <a-select
          ref="select"
          v-model:value="searchParams.customType"
          style="width: 100px"
        >
          <a-select-option :value="2">全部</a-select-option>
          <a-select-option :value="0">散客</a-select-option>
          <a-select-option :value="1">团队</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item style="margin-bottom: 16px">
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>


    <!-- 表格 -->
    <a-table :columns="columns" :data-source="dataList" :pagination="pagination" @change="doTableChange" :scroll="{ x: 1800, y: 550 }">
      <template #bodyCell="{ column, text , record }">
        <template v-if="column.dataIndex === 'orderState'">
          <div>
            <template v-if="editableData[record.id]">
              <a-select
                ref="select"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="width: 100px"
              >
                <a-select-option :value="0">未结</a-select-option>
                <a-select-option :value="1">已结</a-select-option>
              </a-select>
            </template>
            <template v-else>
              <div v-if="record.orderState === 1">
                <a-tag color="green">已结</a-tag>
              </div>
              <div v-else-if="record.orderState === 0">
                <a-tag color="orange">未结</a-tag>
              </div>
              <div v-else>
                <a-tag color="gray">未知</a-tag>
              </div>
            </template>
          </div>
        </template>

        <template v-if="column.dataIndex === 'customType'">
          <div>
            <template v-if="editableData[record.id]">
              <a-select
                ref="select"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="width: 100px"
              >
                <a-select-option :value="0">散客</a-select-option>
                <a-select-option :value="1">团队</a-select-option>
              </a-select>
            </template>
            <template v-else>
              <div v-if="record.customType === 1">
                <a-tag color="blue">团队</a-tag>
              </div>
              <div v-else-if="record.customType === 0">
                <a-tag color="green">散客</a-tag>
              </div>
              <div v-else>
                <a-tag color="gray">未知</a-tag>
              </div>
            </template>
          </div>
        </template>

        <template v-if="['name', 'phone', 'idCard', 'cardType', 'roomId', 'roomType', 'orderInfo'].includes(column.dataIndex)">
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

        <template v-if="['pay', 'restMoney', 'consume', 'shopConsume', 'roomPrice'].includes(column.dataIndex)">
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
              {{ formatMoney(text) }}
            </template>
          </div>
        </template>

        <template v-if="column.dataIndex === 'startTime'">
          {{ record.startTime ? dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
        </template>
        <template v-if="column.dataIndex === 'endTime'">
          {{ record.endTime ? dayjs(record.endTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          {{ record.updateTime ? dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-' }}
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.id]">
              <a-button @click="doEditCancel(record.id)">取消</a-button>
              <a-button type="primary" @click="doEditSave(record.id)">保存</a-button>
            </span>
            <span v-else>
              <a-button type="primary" @click="doLook(record)">查看</a-button>
              <a-button type="primary" v-if="loginUserStore.loginUser.userRole === 'admin'" @click="doEdit(record.id)">编辑</a-button>
              <a-button
                v-if="record.orderState === 0"
                type="dashed"
                @click="doSettle(record)"
              >
                结账
              </a-button>
            </span>

          </div>
        </template>
      </template>
    </a-table>
    <SelectRoomModal v-model:open="selectRoomModalOpen" :order-id="lookOrderId"></SelectRoomModal>
  </div>
</template>
<script lang="ts" setup>
import { computed, createVNode, onMounted, reactive, ref } from 'vue'
import {
  checkoutUsingPost,
  listOrderByPageUsingPost, updateOrderUsingPost,
} from '@/service/api/orderController.ts'
import { message, Modal } from 'ant-design-vue'
import type { UnwrapRef } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { deductUsingPost } from '@/service/api/moneyInfoController.ts'
import SelectRoomModal from '@/components/modal/room/SelectRoomModal.vue'

const loginUserStore = useLoginUserStore();

const selectRoomModalOpen = ref(false);
const lookOrderId = ref(0);

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    align: 'center',
    width: '180px'
  },
  {
    title: '顾客名称',
    dataIndex: 'name',
    align: 'center',
    width: '120px'
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    align: 'center',
    width: '160px'
  },
  {
    title: '身份证号',
    dataIndex: 'idCard',
    align: 'center',
    width: '200px'
  },
  {
    title: '证件类型',
    dataIndex: 'cardType',
    align: 'center',
    width: '100px'
  },
  {
    title: '房间号',
    dataIndex: 'roomId',
    align: 'center',
    width: '100px'
  },
  {
    title: '房间类型',
    dataIndex: 'roomType',
    align: 'center',
    width: '160px'
  },
  {
    title: '顾客类型',
    dataIndex: 'customType',
    align: 'center',
    width: '120px'
  },
  {
    title: '订单状态',
    dataIndex: 'orderState',
    align: 'center',
    width: '120px'
  },
  {
    title: '房间价格',
    dataIndex: 'roomPrice',
    align: 'center',
    width: '120px'
  },
  {
    title: '付款金额',
    dataIndex: 'pay',
    align: 'center',
    width: '120px'
  },
  {
    title: '剩余金额',
    dataIndex: 'restMoney',
    align: 'center',
    width: '120px'
  },
  {
    title: '房间消费',
    dataIndex: 'consume',
    align: 'center',
    width: '120px'
  },
  {
    title: '商品消费',
    dataIndex: 'shopConsume',
    align: 'center',
    width: '120px'
  },
  {
    title: '入住时间',
    dataIndex: 'startTime',
    align: 'center',
    width: '160px'
  },
  {
    title: '退房时间',
    dataIndex: 'endTime',
    align: 'center',
    width: '160px'
  },
  {
    title: '订单备注',
    dataIndex: 'orderInfo',
    align: 'center',
    width: '150px',
    ellipsis: true
  },
  {
    title: '订单组id',
    dataIndex: 'orderGroupId',
    align: 'center',
    width: '180px',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
    width: '160px'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    align: 'center',
    width: '160px'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: '260px',
    fixed: 'right',
  },
]

// 定义数据
const dataList = ref<API.Order[]>([]);
const total = ref<number>(0);

// 搜索条件
const searchParams = reactive<API.OrderQueryRequest>(
  {
    current: 1,
    pageSize: 6,
    sortField: 'orderState',
    sortOrder: 'ascend',
    orderState:2,
    customType:2
  }
);

const fetchData = async () => {
  const res = await listOrderByPageUsingPost({
    ...searchParams
  });
  if(res.data.code === 0 && res.data.data){
    dataList.value = res.data.data.records ?? [];
    total.value = res.data.data.total ?? 0;
  }else{
    message.error("数据获取失败:" + res.data.message);
  }
}

// 页面加载时获取数据，请求一次
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

// 表格分页变化之后，重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current;
  searchParams.pageSize = page.pageSize;
  fetchData();
}

// 搜索点击事件
const doSearch = () => {
  searchParams.current = 1;
  fetchData();
}

// 编辑功能
const editableData: UnwrapRef<Record<string, API.Order>> = reactive({});
const doEdit = (id: string) => {
  editableData[id] = JSON.parse(JSON.stringify(dataList.value.filter(item => id === item.id?.toString())[0]));
};
const doEditSave = async (id: string) => {
  const res = await updateOrderUsingPost( editableData[id] );
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

// 结账功能
const doSettle = async (record: API.Order) => {
  const moneyText = (record.restMoney??0) >= 0 ? `退款:${record.restMoney}` : `收款:${-(record.restMoney??0)}`;
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: `您确定要退房吗,请${moneyText},是否继续?`,
    zIndex: 2000,
    onOk: async () => {
      const orderId = record.id;
      const res = await checkoutUsingPost({ orderId });
      if(res.data.code === 0){
        message.success(`退房成功`);
        await fetchData();
      }else
        message.error(`退房失败:${res.data.message}`)
    }

  })
}
const doLook = (record: API.Order) => {
  lookOrderId.value = record.id??0;
  selectRoomModalOpen.value = true;
}

// 金额格式化
const formatMoney = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '0.00';
  return Number(value).toFixed(2);
}

</script>
<style scoped>
.editable-row-operations button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
