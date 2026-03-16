<template>
  <div id="selectShopModal">
    <a-modal
      v-model:open="modalOpen"
      title="选择商品入账"
      @ok="handleConfirm"
      :confirmLoading="confirmLoading"
      :zIndex="1150"
      width="85%"
      style="top: 20px"
      destroyOnClose
    >
      <div style="margin-bottom: 8px; color: #1890ff; font-weight: 500;">
        已选择 {{ selectedRowKeys.length }} 个商品，请设置入账数量
      </div>

      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="selectShopList"
        :scroll="{ y: 500 }"
        :custom-row="customRow"
        :pagination="false"
        :row-key="'id'"
        :loading="tableLoading"
        style="margin-bottom: 8px"
        bordered
      >
        <template #bodyCell="{ column, record, index }">
          <!-- 序号 -->
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>

          <!-- 价格 -->
          <template v-if="column.dataIndex === 'price'">
            <span style="color: #ff4d4f; font-weight: bold;">¥ {{ formatMoney(record.price) }}</span>
          </template>

          <!-- 原始库存列 (只读) -->
          <template v-if="column.dataIndex === 'stock'">
            <a-tag :color="record.stock > 10 ? 'green' : record.stock > 0 ? 'orange' : 'red'">
              {{ record.stock }}
            </a-tag>
          </template>

          <!-- 【新增】入账数量列 (可编辑) -->
          <template v-if="column.dataIndex === 'inputNum'">
            <a-input-number
              v-model:value="record.inputNum"
              :min="1"
              :max="record.stock"
              :step="1"
              style="width: 100%"
              placeholder="请输入数量"
            />
            <!--              :disabled="!selectedRowKeys.includes(record.id)"-->
          </template>

          <!-- 备注 -->
          <template v-if="column.dataIndex === 'info'">
            {{ record.info || '-' }}
          </template>
        </template>
      </a-table>

      <template #footer>
        <a-button @click="modalOpen = false" :disabled="confirmLoading">取消</a-button>
        <a-button
          type="primary"
          @click="handleConfirm"
          :loading="confirmLoading"
          :disabled="selectedRowKeys.length === 0"
        >
          确定入账 (共 {{ selectedRowKeys.length }} 项)
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { TableProps } from 'ant-design-vue'
import { message } from 'ant-design-vue'

// 1. 引入获取商品列表的接口 (正常使用)
import { listShopUsingPost } from '@/service/api/shopController.ts'
import { shopEnterOrderUsingPost } from '@/service/api/moneyInfoController.ts'
// 2. 入账接口先引入但暂时不调用 (后续开发时取消注释)
// import { addMoneyInfoUsingPost } from '@/service/api/moneyInfoController.ts'

const props = defineProps<{
  orderId: any;
}>()

// 在 script setup 顶部定义
interface ShopWithInput extends API.Shop {
  stock?: number;      // 备份的库存
  inputNum?: number;   // 用户输入的数量
}

const modalOpen = defineModel<boolean>('open');
const emit = defineEmits(['success']);

const selectShopList = ref<ShopWithInput[]>([]);
const tableLoading = ref(false);
const confirmLoading = ref(false);
const selectedRowKeys = ref<Key[]>([])

// 行选择配置
const rowSelection = computed<TableProps['rowSelection']>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[]) => {
    selectedRowKeys.value = keys;
    // 选中时自动初始化 inputNum 为 1
    keys.forEach(id => {
      const item = selectShopList.value.find(i => i.id === id);
      if (item && !item.inputNum) {
        item.inputNum = 1;
      }
    });
  },
}));

// 自定义行点击
const customRow = (record: ShopWithInput) => ({
  onClick: (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    // 点击输入框或复选框时不触发行选择
    if (target.closest('.ant-checkbox-input') || target.closest('.ant-table-row-select') || target.closest('.ant-input-number')) {
      return;
    }

    const index = selectedRowKeys.value.indexOf(record.id);
    if (index > -1) {
      selectedRowKeys.value = selectedRowKeys.value.filter(id => id !== record.id);
    } else {
      selectedRowKeys.value = [...selectedRowKeys.value, record.id];
      if (!record.inputNum) record.inputNum = 1;
    }
  },
  style: { cursor: 'pointer' }
})

// 获取商品列表 (调用真实接口)
const fetchData = async () => {
  tableLoading.value = true;
  try {
    // 调用真实接口
    const res = await listShopUsingPost();

    if (res.data.code === 0 && res.data.data) {
      // 处理数据：
      // 1. stock: 备份原始库存 (来自后端的 num)
      // 2. inputNum: 新增字段，默认 1，用于绑定输入框
      selectShopList.value = res.data.data
        .filter((item: API.Shop) => item.num && item.num > 0)
        .map(item => ({
          ...item,
          stock: item.num,      // 备份原始库存到 stock 字段用于显示和校验
          inputNum: 1           // 初始化入账数量为 1
        }));
    } else {
      message.error("获取商品列表失败：" + res.data.message);
      selectShopList.value = [];
    }
  } catch (error) {
    console.error(error);
    message.error("网络异常");
    selectShopList.value = [];
  } finally {
    tableLoading.value = false;
  }
}

// 监听弹窗打开
watch(() => modalOpen.value, (newValue) => {
  if (newValue) {
    fetchData();
    selectedRowKeys.value = [];
  }
})

// 确定入账 (逻辑暂空，仅打印数据)
const handleConfirm = async () => {
  if (selectedRowKeys.value.length === 0) return;

  confirmLoading.value = true;

  // 收集最终要提交的数据
  const submitData = selectShopList.value
    .filter(item => selectedRowKeys.value.includes(item.id))
    .map(item => ({
      shopId: item.id,
      shopName: item.name,
      price: item.price,
      num: item.inputNum || 1, // 用户输入的数量
      totalMoney: (item.price || 0) * (item.inputNum || 1),
    }));

  const shopList:API.Shop[] = submitData.map(item => ({
    id: item.shopId,
    name: item.shopName,
    price: item.price,
    num: item.num
  }));
  const res = await shopEnterOrderUsingPost({
    orderId: props.orderId,
    shopList: shopList
  });
  if (res.data.code === 0 && res.data.data) {
    message.success('入账成功');
    emit('success');
    modalOpen.value = false;
  }
  else {
    message.error("入账失败：" + res.data.message);
  }
  confirmLoading.value = false;
}

const columns = [
  { title: '序号', key: 'index', align: 'center', width: '60px' },
  {
    title: '商品名称',
    dataIndex: 'name',
    align: 'center',
    width: '200px',
    ellipsis: true,
    sorter: { compare: (a: any, b: any) => (a.name ?? '').localeCompare(b.name ?? '') }
  },
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
    width: '120px',
    sorter: { compare: (a: any, b: any) => (a.type ?? '').localeCompare(b.type ?? '') }
  },
  {
    title: '单价',
    dataIndex: 'price',
    align: 'center',
    width: '100px',
    sorter: { compare: (a: any, b: any) => (a.price ?? 0) - (b.price ?? 0) }
  },
  {
    title: '剩余库存',
    dataIndex: 'stock',
    align: 'center',
    width: '120px',
    sorter: { compare: (a: any, b: any) => (a.stock ?? 0) - (b.stock ?? 0) }
  },
  {
    title: '入账数量',
    dataIndex: 'inputNum',
    align: 'center',
    width: '150px'
  },
  { title: '备注', dataIndex: 'info', align: 'center', ellipsis: true }
];

const formatMoney = (val: any): string => {
  if (val === null || val === undefined || val === '') return '0.00';
  return Number(val).toFixed(2);
}
</script>

<style scoped>
:deep(.ant-table-tbody > tr.ant-table-row-selected) { background-color: #e6f7ff; }
:deep(.ant-table-tbody > tr:hover) { background-color: #fafafa; }
:deep(.ant-table-cell) { vertical-align: middle; }
</style>
