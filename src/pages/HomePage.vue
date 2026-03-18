<template>
  <div id="home-page">
    <a-layout>
      <a-layout-sider class="sider">
        <h2>房态</h2>
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">
          <a-checkbox class="checkbox" v-for="item in roomListStore.roomStateChecked" :key="item.name" v-model:checked="item.checked" @change="doCheckedChange">{{item.name}}</a-checkbox>
        </div>
        <h2>房间类型</h2>
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">
          <a-checkbox class="checkbox" v-for="item in roomListStore.roomTypeChecked" :key="item.name" v-model:checked="item.checked" @change="doCheckedChange">{{item.name}}</a-checkbox>
        </div>
        <div class="button-group">
          <a-button type="primary" class="button" @click="doRoomClearAll">置净所有空脏</a-button>
          <a-button type="primary" class="button" @click="doRoomInsideClearAll">置净所有在住脏</a-button>
          <a-button danger type="primary" class="button" @click="doRoomDirtyAll">置脏所有空房</a-button>
          <a-button danger type="primary" class="button" @click="doRoomInsideDirtyAll">置脏所有在住</a-button>
        </div>
      </a-layout-sider>
      <a-layout>
        <!--主页面-->
        <a-layout-content class="main">
          <a-collapse v-model:activeKey="activeKey" ghost expandIconPosition="end">
            <a-collapse-panel class="room-panel" v-for="(items,index) in roomListStore.rooms" v-show="items !== undefined" :key="index" :header="'第' + index + '层'">
              <RoomCard :room="item"  v-for="item in items"></RoomCard>
            </a-collapse-panel>
          </a-collapse>
        </a-layout-content>

        <a-layout-footer class="footer">
          <RoomFooter :roomList="roomListStore.roomList??[]"></RoomFooter>
        </a-layout-footer>
      </a-layout>


    </a-layout>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RoomCard from '@/components/RoomCard.vue'
import { useRoomListStore } from '@/stores/useRoomListStore.ts'
import RoomFooter from '@/components/RoomFooter.vue'
import { useRoomTypeListStore } from '@/stores/useRoomTypeListStore.ts'
import { setRoomStateUsingPost } from '@/service/api/roomController.ts'
import { message } from 'ant-design-vue'

//将pinia的数据导入
const roomListStore = useRoomListStore();
const roomTypeListStore = useRoomTypeListStore();
const activeKey = ref<string[]>([]);

const fetchData = async () => {
  await roomListStore.fetchRoomList();
}

//页面加载时执行
onMounted(async () => {
  await roomTypeListStore.fetchRoomTypeList();
  roomListStore.roomTypeChecked = roomTypeListStore.roomTypeList.map(item => {
    return {
      name:item.name??'',
      checked:false
    }
  });
  await fetchData();
  for (let key in roomListStore.rooms)
    activeKey.value.push(key);
});

/*
* 监听函数
* */
//多选框改变时执行的事件
const doCheckedChange = () => {
  fetchData();
}
const doRoomClearAll = () => {
  roomListStore.rooms.forEach(async (items,index) => {
    if(items !== undefined)
      for (let item of items)
        if(item.roomState === 3)
          await setRoomState(item,0);
  });
}
const doRoomInsideClearAll = () => {
  roomListStore.rooms.forEach(async (items,index) => {
    if(items !== undefined)
      for (let item of items)
        if(item.roomState === 4)
          await setRoomState(item,1);
  });
}
const doRoomDirtyAll = () => {
  roomListStore.rooms.forEach(async (items,index) => {
    if(items !== undefined)
      for (let item of items)
        if(item.roomState === 0)
          await setRoomState(item,3);
  });
}
const doRoomInsideDirtyAll = () => {
  roomListStore.rooms.forEach(async (items,index) => {
    if(items !== undefined)
      for (let item of items)
        if(item.roomState === 1)
          await setRoomState(item,4);
  });
}

//设置房间状态
const setRoomState = async (room: API.Room,roomState: number) => {
  let id = room.id;
  const res = await setRoomStateUsingPost({id,roomState});
  if(res.data.code === 0){
    message.success("设置房间状态成功");
    room.roomState = roomState;
  }else
    message.error("设置房间状态失败:" + res.data.message)
}



</script>

<style>
#home-page{
  margin: -36px -20px -20px;
  width: calc(100vw - 20px);
}
#home-page .sider{
  position:fixed;
  max-width: 250px !important;
  width: 250px !important;
  height: 100vh;
  padding: 20px;
  background: #f6f6f6;
}
#home-page .main{
  background: #fff;
  padding: 20px;
  width: calc(100% - 250px);
  margin-left: 250px;
}
#home-page .footer{
  background: #dedede;
  position: fixed;
  bottom: 0;
  z-index: 1000;
  padding: 0 20px;
  line-height: 40px;
  width: calc(100vw - 250px);
  height: 40px;
  margin-left: 250px;
}
#home-page .footer .footer-info-text{
  display: inline-block;
  margin-right: 20px;
  font-size:16px;
  font-weight: bolder;
  color: #1677ff;
}
#home-page .checkbox{
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  margin-right: 30px;
}
#home-page .room-panel{
  font-weight: bolder;
  font-size: 18px;
}
#home-page .button-group .button{
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
