<template>
  <div id="selectRoomModal">
    <a-modal v-model:open="modalOpen" title="查看入住信息" :zIndex="1050" width="90%" style="top: 40px" :footer="null">
      <div class="select-room-button-group">
        <a-button type="primary" @click="doCheckOut">退房</a-button>
        <a-button type="primary" @click="doDeduct">房费</a-button>
        <a-button type="primary" @click="doPay">收款</a-button>
        <a-button type="primary" @click="doChangePrice">改房价</a-button>
        <a-button type="primary" @click="doChangeRoom">换房</a-button>
        <a-button type="primary" @click="doCheckInShop">小吧入账</a-button>
      </div>
      <div class="order-group-info">
        <h2 v-if="orderGroupInfo.totalRest >= 0">应退:{{orderGroupInfo.totalRest}}</h2>
        <h2 v-else>应收:{{-orderGroupInfo.totalRest}}</h2>

        <h2>收款合计:{{orderGroupInfo.pay}}</h2>
        <h2>总房费:{{orderGroupInfo.consume}}</h2>
        <h2>总小吧费:{{orderGroupInfo.shopConsume}}</h2>
        <h2>总消费:{{orderGroupInfo.shopConsume + orderGroupInfo.consume}}</h2>
        <h2>总房价:{{orderGroupInfo.roomPrice}}</h2>
      </div>
      <div class="order-info" v-if="selectedKey !== '0'">
        <h2>房间号:{{orderInfo.roomId}}</h2>
        <h2>房费:{{orderInfo.consume}}</h2>
        <h2>小吧费:{{orderInfo.shopConsume}}</h2>
        <h2>合计消费:{{(orderInfo.shopConsume??0) + (orderInfo.consume??0)}}</h2>
        <h2>房价:{{orderInfo.roomPrice}}</h2>
        <h2>收款合计:{{orderInfo.pay}}</h2>

        <h2 v-if="orderInfo.restMoney >= 0">应退:{{orderInfo.restMoney}}</h2>
        <h2 v-else>应收:{{-orderInfo.restMoney}}</h2>
      </div>
      <div class="order-content">
        <div class="order-sider">
          <SingleSelectTable
            :data="orderList"
            :columns="orderSelectColumns"
            row-key="id"
            :scroll="{ y: 430 }"
            :default-selected-key="selectedKey"
            display-field="roomId"
            @select="orderSelect"
          />
        </div>
        <div class="money-info">
          <a-table :columns="moneyInfoColumns" :data-source="moneyInfoList" :scroll="{ y: 430 }" :pagination="false">
            <template #bodyCell="{ column, text, record }">
              <!-- 营业项目 (收支类型) -->
              <template v-if="column.dataIndex === 'moneyType'">
                <a-tag :color=" getTagColor(record.moneyType)">
                  {{ text || '未知' }}
                </a-tag>
              </template>

              <!-- 金额 -->
              <template v-if="column.dataIndex === 'money'">
                  <span :style="{ color: record.moneyType === '扣费' ? 'red' : record.moneyType === '收款' ? 'green' : 'black' , fontWeight: 'bold' }">
                    {{ formatMoney(text) }}
                  </span>
              </template>
            </template>
          </a-table>
        </div>
      </div>
      <!-- 引入选择器组件 -->
      <ShopEnterOrderModal
        v-model:open="shopModalVisible"
        :orderId="selectedKey"
        @success="handleShopSuccess"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, createVNode, h, nextTick, onMounted, ref, watch } from 'vue'
import SingleSelectTable from '@/components/table/SingleSelectTable.vue'
import { changeRoomPriceUsingPost,
  changeRoomUsingPost, checkoutUsingPost, listOrderGroupDataUsingPost } from '@/service/api/orderController.ts'
import { DatePicker, Input, Key, message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { useRoomListStore } from '@/stores/useRoomListStore.ts'
import { deductUsingPost, listGroupMoneyInfoByOrderIdUsingPost, listMoneyInfoByOrderIdUsingPost,
  payUsingPost
} from '@/service/api/moneyInfoController.ts'
import dayjs from 'dayjs'
import ShopEnterOrderModal from '@/components/modal/room/ShopEnterOrderModal.vue'

const modalOpen = defineModel('open');
const props = defineProps<{
  orderId: number | any
}>();
const selectedKey = ref<Key | null>(null);
const roomListStore = useRoomListStore();

//订单和订单组顶部的展示信息
const orderGroupInfo = computed(() => {
  return {
    totalRest: orderList.value.reduce((acc, cur) => {
      if(cur.orderState == 0)
        return acc + (cur.restMoney??0);
      else
        return acc;
    }, 0),
    pay: orderList.value.reduce((acc, cur) => acc + (cur.pay??0), 0),
    consume: orderList.value.reduce((acc, cur) => acc + (cur.consume??0), 0),
    roomPrice: orderList.value.reduce((acc, cur) => acc + (cur.roomPrice??0), 0),
    shopConsume: orderList.value.reduce((acc, cur) => acc + (cur.shopConsume??0), 0)
  }
})
const orderInfo = ref<API.Order>({});


/**
 * 订单左侧sider的表格数据
 */
const orderList = ref<API.Order[]>([])
const orderSelectColumns = [
  {
    title: '',
    key: 'index',
    align: 'center',
    width: '50px'
  },{
    title: '房间号',
    dataIndex: 'roomId',
    key: 'roomId',
    align: 'center',
    width: '80px'
  },{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },{
    title: '入住日期',
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center',
    customRender: ({ text }: { text: string }) => {
      return formatDate(text)
    }
  }
]
/**
 * 订单右侧金额信息表格数据
 */
const moneyInfoList = ref<API.MoneyInfo[]>([])
const moneyInfoColumns = [
  {
    title: '消费时间',
    dataIndex: 'payTime',
    key: 'payTime',
    align: 'center',
    customRender: ({ text }: { text: string }) => {
      return formatDate(text)
    },
    sorter: {
      compare: (a:API.MoneyInfo, b:API.MoneyInfo) => (a.payTime??'').localeCompare(b.payTime??''),
    }
  },{
    title: '营业项目',
    dataIndex: 'moneyType',
    key: 'moneyType',
    align: 'center',
    sorter: {
      compare: (a:API.MoneyInfo, b:API.MoneyInfo) => (a.moneyType??'').localeCompare(b.moneyType??''),
    }
  },{
    title: '金额',
    dataIndex: 'money',
    key: 'money',
    width: '80px',
    align: 'center',
    sorter: {
      compare: (a:API.MoneyInfo, b:API.MoneyInfo) => (a.money??0) - (b.money??0),
    }
  },{
    title: '房号',
    dataIndex: 'roomId',
    key: 'roomId',
    width: '80px',
    align: 'center',
    sorter: {
      compare: (a:API.MoneyInfo, b:API.MoneyInfo) => (a.roomId??'').localeCompare(b.roomId??''),
    }
  },{
    title: '备注',
    dataIndex: 'payInfo',
    key: 'payInfo',
    align: 'center'
  }
]

//左侧sider选中的逻辑
const orderSelect = async (selected:any) => {
  // 处理选中逻辑
  orderInfo.value = selected;
  selectedKey.value = selected.id;
  if(selected.id === '0'){
    await fetchGroupMoneyInfo(props.orderId);
  }else{
    await fetchMoneyInfo(selected.id);
  }
}





/**
* 查询窗口顶部的那几个按钮的事件
* */

const shopModalVisible = ref(false);
const handleShopSuccess = async (data:any) => {
  await fetchMoneyInfo(selectedKey.value);
  const temp = selectedKey.value;
  selectedKey.value = null;
  await fetchData();
  await nextTick();
  selectedKey.value = temp;
}



const doCheckInShop = () => {
  shopModalVisible.value = true;
}


//换房
const doChangeRoom = () => {
  const changeRoomParams = ref<API.OrderChangeRoomRequest>({
    orderId: selectedKey.value,
    roomPrice: 0,
    payInfo: ''
  });

  // 使用 Modal 而不是 Modal.confirm
  Modal.confirm({
    title: '改房价',
    icon: null,
    content: () => h('div', {}, [
      // 1. 房间号输入框
      h(Input, {
        value: changeRoomParams.value.roomId,
        'onUpdate:value': (val) => {
          changeRoomParams.value.roomId = val
          //更新房价
          changeRoomParams.value.roomPrice = roomListStore.roomList.find(item => item.roomId === changeRoomParams.value.roomId)?.roomPrice??0;
        },
        placeholder: '请输入房间号',
        addonBefore: '房间号',
        style: { width: '100%', margin: '10px 0' },
        size: 'large'
      }),

      // 2. 房价输入框
      h(Input, {
        value: changeRoomParams.value.roomPrice,
        'onUpdate:value': (val) => {
          changeRoomParams.value.roomPrice = val;
        },
        placeholder: '请输入房价',
        addonBefore: '房价',
        type: 'number',
        size: 'large',
        style: { width: '100%', margin: '10px 0' }
      }),

      // 3. 信息备注输入框
      h(Input, {
        value: changeRoomParams.value.payInfo,
        'onUpdate:value': (val) => {
          changeRoomParams.value.payInfo = val
        },
        placeholder: '请输入信息备注',
        addonBefore: '信息备注',
        style: { width: '100%', margin: '10px 0' },
        size: 'large'
      })
    ]),
    zIndex: 1100,
    width: 500,
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      await changeRoom(changeRoomParams.value);
    }
  })
}
//改房价
const doChangePrice = () => {
  const changeRoomPriceParams = ref<API.OrderChangeRoomPriceRequest>({
    orderId: selectedKey.value,
    roomPrice: orderInfo.value.roomPrice,
    payInfo: ''
  });
  Modal.confirm({
    title: '改房价',
    icon: null,
    content: h('div', {}, [
      h(Input, {
        defaultValue: changeRoomPriceParams.value.roomPrice,
        'onUpdate:value': (val) => {
          changeRoomPriceParams.value.roomPrice = val;
        },
        placeholder: '请输入房价',
        style: { width: '100%', margin: '10px 0' },
        addonBefore: '房价',
        type: 'number',
        size: 'large'
      }),
      h(Input, {
        defaultValue: changeRoomPriceParams.value.payInfo,
        'onUpdate:value': (val) => {
          changeRoomPriceParams.value.payInfo = val
        },
        placeholder: '请输入信息备注',
        addonBefore: '信息备注',
        style: { width: '100%', margin: '10px 0' },
        size: 'large'
      })
    ]),
    zIndex: 1100,
    async onOk() {
      await changeRoomPrice(changeRoomPriceParams.value)
    }
  });
}


//收款
const doPay = () => {
  const moneyInfoFeeParams = ref<API.MoneyInfoFeeRequest>({
    orderId: selectedKey.value,
    money: 0,
    payInfo: ''
  });
  Modal.confirm({
    title: '收款',
    icon: null,
    content: h('div', {}, [
      // 1. 房费输入框 (保持原样，数字输入通常不受中文输入法影响)
      h(Input, {
        defaultValue: moneyInfoFeeParams.value.money,
        'onUpdate:value': (val) => {
          moneyInfoFeeParams.value.money = val
        },
        placeholder: '请输入金额',
        style: { width: '100%', margin: '10px 0' },
        addonBefore: '收款金额',
        type: 'number',
        size: 'large'
      }),

      // 2. 信息备注输入框 (保持 defaultValue 以避免中文输入问题)
      h(Input, {
        defaultValue: moneyInfoFeeParams.value.payInfo,
        'onUpdate:value': (val) => {
          moneyInfoFeeParams.value.payInfo = val
        },
        placeholder: '请输入信息备注',
        addonBefore: '信息备注',
        style: { width: '100%', margin: '10px 0' },
        size: 'large'
      }),

      // 3. 支付时间选择器 (模拟 addonBefore 样式)
      h('div', {
        style: {
          display: 'flex',
          width: '100%',
          margin: '10px 0',
          alignItems: 'center'
        }
      }, [
        // 模拟 addonBefore 的标签
        h('span', {
          style: {
            display: 'inline-block',
            background: '#fafafa',
            color: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid #d9d9d9',
            borderRight: '0',
            borderRadius: '4px 0 0 4px',
            padding: '0 11px',
            height: '37px', // large size 的高度
            lineHeight: '35px',
            textAlign: 'center',
            width: '100px',
            fontSize: '14px' // large size 的字体
          }
        }, '支付时间'),

        // DatePicker 组件
        h(DatePicker, {
          disabledDate: (current) => {
            const now = dayjs();
            const tenMinutesAgo = now.subtract(10, 'minute');
            if (!current) return false
            // 早于 10 分钟前的日期，禁用
            if (current.isBefore(tenMinutesAgo, 'day')) return true
            // 晚于今天的日期，禁用
            return !!current.isAfter(now, 'day');

          },
          // 精确禁用范围外的时间（修复跨天和不跨天场景）
          disabledTime: (current) => {
            if (!current) return {}
            const now = dayjs();
            const tenMinutesAgo = now.subtract(10, 'minute');
            const currentDay = current.startOf('day')
            const minDay = tenMinutesAgo.startOf('day')
            const maxDay = now.startOf('day')

            const minHour = tenMinutesAgo.hour()
            const minMinute = tenMinutesAgo.minute()
            const maxHour = now.hour()
            const maxMinute = now.minute()

            // 场景 1：同一天（不跨天，如 13:30-13:40）
            if (currentDay.isSame(minDay, 'day') && currentDay.isSame(maxDay, 'day')) {
              return {
                disabledHours: () => {
                  // 禁用早于 minHour 或晚于 maxHour 的小时
                  return Array.from({ length: 24 }, (_, h) => h).filter(h => h < minHour || h > maxHour)
                },
                disabledMinutes: (selectedHour) => {
                  if (selectedHour === minHour && selectedHour === maxHour) {
                    // 同一小时，禁用早于 minMinute 和晚于 maxMinute 的分钟
                    return Array.from({ length: 60 }, (_, m) => m).filter(m => m < minMinute || m > maxMinute)
                  } else if (selectedHour === minHour) {
                    // 最小小时，禁用早于 minMinute 的分钟
                    return Array.from({ length: minMinute }, (_, m) => m)
                  } else if (selectedHour === maxHour) {
                    // 最大小时，禁用晚于 maxMinute 的分钟
                    return Array.from({ length: 60 }, (_, m) => m).filter(m => m > maxMinute)
                  }
                  return []
                },
                disabledSeconds: () => []
              }
            }

            // 场景 2：最小日期（跨天时的昨天，如 23:55-23:59）
            if (currentDay.isSame(minDay, 'day')) {
              return {
                disabledHours: () => {
                  // 禁用早于 minHour 的所有小时
                  return Array.from({ length: minHour }, (_, h) => h)
                },
                disabledMinutes: (selectedHour) => {
                  if (selectedHour === minHour) {
                    // 在最小小时，禁用早于 minMinute 的分钟
                    return Array.from({ length: minMinute }, (_, m) => m)
                  }
                  // 其他小时允许所有分钟（如 23:56-23:59）
                  return []
                },
                disabledSeconds: () => []
              }
            }

            // 场景 3：最大日期（跨天时的今天，如 00:00-00:05）
            if (currentDay.isSame(maxDay, 'day')) {
              return {
                disabledHours: () => {
                  // 禁用晚于 maxHour 的所有小时
                  return Array.from({ length: 24 }, (_, h) => h).filter(h => h > maxHour)
                },
                disabledMinutes: (selectedHour) => {
                  if (selectedHour === maxHour) {
                    // 在最大小时，禁用晚于 maxMinute 的分钟
                    return Array.from({ length: 60 }, (_, m) => m).filter(m => m > maxMinute)
                  }
                  // 其他小时允许所有分钟（如 00:00-00:04）
                  return []
                },
                disabledSeconds: () => []
              }
            }

            return {}
          },
          defaultValue: moneyInfoFeeParams.value.payTime, // 绑定时间对象 (dayjs/moment)
          'onUpdate:value': (val) => {
            moneyInfoFeeParams.value.payTime = val
          },
          showTime: true,             // 是否显示时间选择
          format: 'YYYY-MM-DD HH:mm:ss', // 显示格式
          placeholder: '请选择支付时间',
          size: 'large',
          style: {
            width: '100%',
            borderRadius: '0 4px 4px 0' // 左侧圆角设为 0 以贴合标签
          },
        })
      ])
    ]),
    zIndex: 1100,
    onOk() {
      return new Promise(async (resolve, reject) => {
        let res = await pay(moneyInfoFeeParams.value);
        if(!res)
          reject();
        else
          resolve(true);
        return;
      })
    }
  });
}

//扣费
const doDeduct = () => {
  const moneyInfoFeeParams = ref<API.MoneyInfoFeeRequest>({
    orderId: selectedKey.value,
    money: orderInfo.value.roomPrice,
    payInfo: ''
  });
  Modal.confirm({
    title: '房费',
    icon: null,
    content: h('div', {}, [
      // 1. 房费输入框 (保持原样，数字输入通常不受中文输入法影响)
      h(Input, {
        defaultValue: moneyInfoFeeParams.value.money,
        'onUpdate:value': (val) => {
          moneyInfoFeeParams.value.money = val;
        },
        placeholder: '请输入房费',
        style: { width: '100%', margin: '10px 0' },
        addonBefore: '房费',
        type: 'number',
        size: 'large'
      }),

      // 2. 信息备注输入框 (保持 defaultValue 以避免中文输入问题)
      h(Input, {
        defaultValue: moneyInfoFeeParams.value.payInfo,
        'onUpdate:value': (val) => {
          moneyInfoFeeParams.value.payInfo = val
        },
        placeholder: '请输入信息备注',
        addonBefore: '信息备注',
        style: { width: '100%', margin: '10px 0' },
        size: 'large'
      }),

      // 3. 支付时间选择器 (模拟 addonBefore 样式)
      h('div', {
        style: {
          display: 'flex',
          width: '100%',
          margin: '10px 0',
          alignItems: 'center'
        }
      }, [
        // 模拟 addonBefore 的标签
        h('span', {
          style: {
            display: 'inline-block',
            background: '#fafafa',
            color: 'rgba(0, 0, 0, 0.85)',
            border: '1px solid #d9d9d9',
            borderRight: '0',
            borderRadius: '4px 0 0 4px',
            padding: '0 11px',
            height: '37px', // large size 的高度
            lineHeight: '35px',
            textAlign: 'center',
            width: '100px',
            fontSize: '14px' // large size 的字体
          }
        }, '支付时间'),

        // DatePicker 组件
        h(DatePicker, {
          disabledDate: (current) => {
            const now = dayjs();
            const tenMinutesAgo = now.subtract(10, 'minute');
            if (!current) return false
            // 早于 10 分钟前的日期，禁用
            if (current.isBefore(tenMinutesAgo, 'day')) return true
            // 晚于今天的日期，禁用
            return !!current.isAfter(now, 'day');

          },
          // 精确禁用范围外的时间（修复跨天和不跨天场景）
          disabledTime: (current) => {
            if (!current) return {}
            const now = dayjs();
            const tenMinutesAgo = now.subtract(10, 'minute');
            const currentDay = current.startOf('day')
            const minDay = tenMinutesAgo.startOf('day')
            const maxDay = now.startOf('day')

            const minHour = tenMinutesAgo.hour()
            const minMinute = tenMinutesAgo.minute()
            const maxHour = now.hour()
            const maxMinute = now.minute()

            // 场景 1：同一天（不跨天，如 13:30-13:40）
            if (currentDay.isSame(minDay, 'day') && currentDay.isSame(maxDay, 'day')) {
              return {
                disabledHours: () => {
                  // 禁用早于 minHour 或晚于 maxHour 的小时
                  return Array.from({ length: 24 }, (_, h) => h).filter(h => h < minHour || h > maxHour)
                },
                disabledMinutes: (selectedHour) => {
                  if (selectedHour === minHour && selectedHour === maxHour) {
                    // 同一小时，禁用早于 minMinute 和晚于 maxMinute 的分钟
                    return Array.from({ length: 60 }, (_, m) => m).filter(m => m < minMinute || m > maxMinute)
                  } else if (selectedHour === minHour) {
                    // 最小小时，禁用早于 minMinute 的分钟
                    return Array.from({ length: minMinute }, (_, m) => m)
                  } else if (selectedHour === maxHour) {
                    // 最大小时，禁用晚于 maxMinute 的分钟
                    return Array.from({ length: 60 }, (_, m) => m).filter(m => m > maxMinute)
                  }
                  return []
                },
                disabledSeconds: () => []
              }
            }

            // 场景 2：最小日期（跨天时的昨天，如 23:55-23:59）
            if (currentDay.isSame(minDay, 'day')) {
              return {
                disabledHours: () => {
                  // 禁用早于 minHour 的所有小时
                  return Array.from({ length: minHour }, (_, h) => h)
                },
                disabledMinutes: (selectedHour) => {
                  if (selectedHour === minHour) {
                    // 在最小小时，禁用早于 minMinute 的分钟
                    return Array.from({ length: minMinute }, (_, m) => m)
                  }
                  // 其他小时允许所有分钟（如 23:56-23:59）
                  return []
                },
                disabledSeconds: () => []
              }
            }

            // 场景 3：最大日期（跨天时的今天，如 00:00-00:05）
            if (currentDay.isSame(maxDay, 'day')) {
              return {
                disabledHours: () => {
                  // 禁用晚于 maxHour 的所有小时
                  return Array.from({ length: 24 }, (_, h) => h).filter(h => h > maxHour)
                },
                disabledMinutes: (selectedHour) => {
                  if (selectedHour === maxHour) {
                    // 在最大小时，禁用晚于 maxMinute 的分钟
                    return Array.from({ length: 60 }, (_, m) => m).filter(m => m > maxMinute)
                  }
                  // 其他小时允许所有分钟（如 00:00-00:04）
                  return []
                },
                disabledSeconds: () => []
              }
            }

            return {}
          },
          defaultValue: moneyInfoFeeParams.value.payTime, // 绑定时间对象 (dayjs/moment)
          'onUpdate:value': (val) => {
            moneyInfoFeeParams.value.payTime = val
          },
          showTime: true,             // 是否显示时间选择
          format: 'YYYY-MM-DD HH:mm:ss', // 显示格式
          placeholder: '请选择支付时间',
          size: 'large',
          style: {
            width: '100%',
            borderRadius: '0 4px 4px 0' // 左侧圆角设为 0 以贴合标签
          },
        })
      ])
    ]),
    zIndex: 1100,
    onOk() {
      return new Promise(async (resolve, reject) => {
        let res = await deduct(moneyInfoFeeParams.value);
        if(!res)
          reject();
        else
          resolve(true);
        return;
      })
    }
  });
}



//退房
const doCheckOut = () => {
  //您确定要退房,请收款:896, 是否继续?
  let restMoney = orderInfo.value.restMoney??0;
  if(String(orderInfo.value.id) === '0')
    restMoney = orderGroupInfo.value.totalRest??0;
  const moneyText = restMoney >= 0 ? `退款:${restMoney}` : `收款:${-restMoney}`;
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: `您确定要退房吗,请${moneyText},是否继续?`,
    zIndex: 2000,
    onOk: async () => {
      const orderId = selectedKey.value;
      if(orderId === '0'){
        //这里要把所有订单组的订单全部退房
        for (let i = 0; i < orderList.value.length; i++){
          if(orderList.value[i].id && String(orderList.value[i].id) !== '0'){
            console.log(orderList.value[i]);
            const res = await checkoutUsingPost({ orderId: orderList.value[i].id });
            if(res.data.code === 0){
              message.success(`房间${orderList.value[i].roomId}退房成功`);
            }else
              message.error(`房间${orderList.value[i].roomId}退房失败:${res.data.message}`)
          }
        }
        await fetchData();
        await roomListStore.fetchRoomList();
        modalOpen.value = false;
      }else{
        const res = await checkoutUsingPost({ orderId });
          if(res.data.code === 0){
            message.success(`退房成功`);
            await fetchData();
            await roomListStore.fetchRoomList();
            modalOpen.value = false;
          }else
            message.error(`退房失败:${res.data.message}`)
        }
      }

  })
}






/**
 * 数据获取
 * */
const fetchData = async () => {
  //获取所有订单组的数据
  //选择的房间的订单id是props.orderId,可以根据查到的订单组去定位
  await fetchOrderGroupData(props.orderId);
  //获取右边金额信息的数据
}

//根据订单id查询订单组的所有订单
const fetchOrderGroupData = async (orderId: number | any) => {
  const res = await listOrderGroupDataUsingPost({orderId});
  if(res.data.code === 0 && res.data.data){
    orderList.value = [{
      id: '0',
      roomId: '',
      name: '全部订单',
      startTime: ''
    }];
    //这里先插入未结的订单
    orderList.value.push(...res.data.data.filter(item => item.orderState === 0));
    //已结的订单需要在姓名后面做一个标注
    orderList.value.push(...res.data.data.filter(item => item.orderState === 1).map(item => {item.name += '(已退)'; return item}))
  }else{
    message.error("获取订单数据失败:" + res.data.message);
  }
}

const fetchMoneyInfo = async (orderId: number | any) => {
  const res = await listMoneyInfoByOrderIdUsingPost({orderId});
  if(res.data.code === 0 && res.data.data){
    moneyInfoList.value = res.data.data;
    //获取之后对金额信息排序，按照支付时间降序
    moneyInfoList.value.sort((a, b) => {
      return (b.payTime??'').localeCompare(a.payTime??'');
    });
  }else{
    message.error("获取金额信息失败:" + res.data.message);
  }
}
const fetchGroupMoneyInfo = async (orderId: number | any) => {
  const res = await listGroupMoneyInfoByOrderIdUsingPost({orderId});
  if(res.data.code === 0 && res.data.data){
    moneyInfoList.value = res.data.data;
    moneyInfoList.value.sort((a, b) => {
      return (b.payTime??'').localeCompare(a.payTime??'');
    });
  }else{
    message.error("获取金额信息失败:" + res.data.message);
  }
}



const deduct = async (params: API.MoneyInfoFeeRequest) => {
  const res = await deductUsingPost(params);
  if(res.data.code === 0 && res.data.data){
    message.success("房费扣除成功");
    await fetchMoneyInfo(selectedKey.value);
    selectedKey.value = null;
    await fetchData();
    await nextTick();
    selectedKey.value = params.orderId;
    return true;
  }else{
    message.error("房费扣除失败:" + res.data.message);
    return false;
  }
}
const pay = async (params: API.MoneyInfoFeeRequest) => {
  const res = await payUsingPost(params);
  if(res.data.code === 0 && res.data.data){
    message.success("收款成功");
    await fetchMoneyInfo(selectedKey.value);
    selectedKey.value = null;
    await fetchData();
    await nextTick();
    selectedKey.value = params.orderId;
    return true;
  }else{
    message.error("收款失败:" + res.data.message);
    return false;
  }
}

const changeRoomPrice = async (params:API.OrderChangeRoomPriceRequest) => {
  const res = await changeRoomPriceUsingPost(params);
  if(res.data.code === 0 && res.data.data){
    message.success("修改成功");
    selectedKey.value = null;
    await fetchData();
    await nextTick();
    selectedKey.value = params.orderId;
    return true;
  }else{
    message.error("修改失败:" + res.data.message);
    return false;
  }

}


const changeRoom = async (params:API.OrderChangeRoomRequest) => {
  const res = await changeRoomUsingPost(params);
  if(res.data.code === 0 && res.data.data){
    message.success("修改成功");
    selectedKey.value = null;
    await fetchData();
    await nextTick();
    selectedKey.value = params.orderId;
    await roomListStore.fetchRoomList();
    return true;
  }else{
    message.error("修改失败:" + res.data.message);
    return false;
  }

}

/**
 * 监听事件
 * */

// 监听 modal 打开
watch(() => modalOpen.value, async (newValue) => {
  if (newValue) {
    selectedKey.value = null;
    await fetchData();
    await nextTick();
    selectedKey.value = props.orderId;
  }
})






/**
 * 功能函数
 * */
// ============ 日期格式化函数 ============
const formatDate = (date: string | number | Date) => {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = String(d.getFullYear()).slice(-2)  // 取后两位 2026 -> 26
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return `${year}/${month}/${day} ${hours}:${minutes}`
}

// 金额格式化
const formatMoney = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null || value === '') return '0.00';
  return Number(value).toFixed(2);
}
const getTagColor = (type: string) => {
  if(type === '小吧入账')
    return 'cyan';
  return type === '收款' ? 'green' : type === '扣费' ? 'red' : type === '换房' ? 'orange' : type === '改价' ? 'blue' : 'default';
}


</script>


<style scoped>
#selectRoomModal{

}
.select-room-button-group button{
  margin-right: 8px;
}
.order-group-info{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.order-group-info h2{
  font-size: 28px;
  color: red;
  margin: 0 20px 0 0;
  font-weight: bold;
}
.order-info{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.order-info h2{
  font-size: 28px;
  color: #606266;
  margin: 0 20px 0 0;
  font-weight: bold;
}
.order-content{
  display: flex;
  padding: 20px;
}
.order-sider{
  padding: 10px;
  width: 30%;
}
.money-info{
  padding: 10px;
  width: 70%;
}
</style>
