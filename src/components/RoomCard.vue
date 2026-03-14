<template>
  <div id="roomCard">
    <!--空房:空脏和空净-->
    <a-popover placement="bottom" trigger="click">
      <template #title>
        <!--空房:空脏和空净-->
        <a-space wrap v-if="room.roomState === 0 || room.roomState === 3">
          <a-button type="primary" @click="doCheckIn(room)">入住</a-button>
          <a-button type="primary" @click="setRoomState(room,room.roomState === 0 ? 3 : 0)">{{room.roomState === 0 ? '置脏' : '置净'}}</a-button>
          <a-button type="primary" @click="setRoomState(room,2)">维修</a-button>
          <a-button type="primary" @click="setRoomState(room,5)">锁房</a-button>
        </a-space>
        <!--在住:在住脏和在住净,包括联房和团队-->
        <a-space wrap v-else-if="room.roomState === 1 || room.roomState === 4">
          <a-button type="primary" @click="doSelectRoom(room)">查看</a-button>
          <a-button type="primary" @click="setRoomState(room,room.roomState === 1 ? 4 : 1)">{{room.roomState === 1 ? '置脏' : '置净'}}</a-button>
          <a-button type="primary" @click="doContactRoom(room)">联房</a-button>
        </a-space>
        <!--维修-->
        <a-space wrap v-else-if="room.roomState === 2">
          <a-button type="primary" @click="setRoomState(room,0)">维修完成</a-button>
          <a-button type="primary" @click="setRoomState(room,5)">锁房</a-button>
        </a-space>
        <!--锁房-->
        <a-space wrap v-else-if="room.roomState === 5">
          <a-button type="primary" @click="setRoomState(room,2)">维修</a-button>
          <a-button type="primary" @click="setRoomState(room,0)">开启房间</a-button>
        </a-space>
      </template>
      <template #content>
        <div>
          <span style="font-weight: bolder">房间备注:</span>{{room.roomInfo??'无'}}
        </div>
        <div v-if="room.roomState === 1 || room.roomState === 4" >
          <span style="font-weight: bolder">订单备注:</span>{{findOrderInfoById(room.orderId)}}
        </div>
      </template>



      <!--空房:空脏和空净-->
      <div class="room" v-if="room.roomState === 0 || room.roomState === 3" style="background: #cd2626">
        <span style="font-weight: normal;font-size: 14px">{{room.roomId}} {{room.roomType}}</span>
        <div class="room-state-image" v-if="room.roomState === 3">
          <img src="@/assets/images/clean.png" width="50px" alt="clean"/>
        </div>
      </div>
      <!--在住:在住脏和在住净,包括联房和团队-->
      <div class="room" v-if="room.roomState === 1 || room.roomState === 4" :style="room.roomState === 1 ? {'background': '#4e6ef2'} : {'background': '#203f74'}">
        <span style="font-weight: normal;font-size: 14px">{{room.roomId}} {{room.roomType}} <span v-if="room.roomState === 4">(需打扫)</span></span>
        <div class="room-state-image">
          <img v-if="room.isTeam" src="@/assets/images/team.png" width="50px" alt="clean"/>
          <img v-else-if="room.isContact" src="@/assets/images/contactRoom.png" width="50px" alt="clean"/>
          <img v-else src="@/assets/images/custom.png" width="50px" alt="clean"/>
          <h4>{{room.roomCustom}}</h4>
        </div>
      </div>
      <!--维修-->
      <div class="room" v-if="room.roomState === 2" style="background: #66cccc">
        <span style="font-weight: normal;font-size: 14px">{{room.roomId}} {{room.roomType}}</span>
        <div class="room-state-image">
          <img src="@/assets/images/repair.png" width="50px" alt="repair"/>
        </div>
      </div>
      <!--锁房-->
      <div class="room" v-if="room.roomState === 5" style="background: #008000">
        <span style="font-weight: normal;font-size: 14px">{{room.roomId}} {{room.roomType}}</span>
        <div class="room-state-image">
          <img src="@/assets/images/lock.png" width="50px" alt="lock"/>
        </div>
      </div>
    </a-popover>
    <SelectRoomModal v-model:open="selectRoomModalOpen" :room="room"></SelectRoomModal>
    <CheckInModal v-model:open="checkInModalOpen" :room="room"></CheckInModal>
    <ContactRoomModal v-model:open="contactRoomModalOpen" :room="room"></ContactRoomModal>
  </div>
</template>

<script setup lang="ts">
import { message, Modal } from 'ant-design-vue'
import { createVNode, ref } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { setRoomStateUsingPost } from '@/service/api/roomController.ts'
import CheckInModal from '@/components/modal/room/CheckInModal.vue'
import SelectRoomModal from '@/components/modal/room/SelectRoomModal.vue'
import ContactRoomModal from '@/components/modal/room/ContactRoomModal.vue'

const checkInModalOpen = ref<boolean>(false);
const selectRoomModalOpen = ref<boolean>(false);
const contactRoomModalOpen = ref<boolean>(false);

defineProps<{
  room: API.Room
}>();

//设置房间状态
const setRoomState = async (room: API.Room,roomState: number) => {
  let id = room.id;
  if(roomState === 2){
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '你确定要维修该房间吗',
      onOk: async () => {
        const res = await setRoomStateUsingPost({id,roomState});
        if(res.data.code === 0){
          message.success("设置房间状态成功");
          room.roomState = roomState;
        }else
          message.error("设置房间状态失败:" + res.data.message)
      }
    })
  }
  else if(roomState === 5){
    Modal.confirm({
      title: '提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: '你确定要锁该房间吗',
      onOk: async () => {
        const res = await setRoomStateUsingPost({id,roomState});
        if(res.data.code === 0){
          message.success("设置房间状态成功");
          room.roomState = roomState;
        }else
          message.error("设置房间状态失败:" + res.data.message)
      }
    })
  }
  else{
    const res = await setRoomStateUsingPost({id,roomState});
    if(res.data.code === 0){
      message.success("设置房间状态成功");
      room.roomState = roomState;
    }else
      message.error("设置房间状态失败:" + res.data.message)
  }
}


/*
* 监听函数
* */

//入住按钮的监听事件
const doCheckIn = async (room: API.Room) => {
  if(room.roomState !== 0){
    message.error("该房间不能入住");
    return;
  }
  checkInModalOpen.value = true;
}
//查看按钮的监听事件
const doSelectRoom = async (room: API.Room) => {
  selectRoomModalOpen.value = true;
}
//联房按钮的监听事件
const doContactRoom = async (room: API.Room) => {
  contactRoomModalOpen.value = true;
}


//根据id查询订单信息:待做
const findOrderInfoById = (id: number | undefined) => {
  if(id){
    return "啊哈哈"
  }
  return "无"
}


</script>

<style scoped>
#roomCard{
  display: inline-block;
}
#roomCard .room{
  display: inline-block;
  cursor: pointer;
  width: 196px;
  height: 130px;
  background-color: rgb(205, 38, 38);
  color: #fff;
  padding: 10px;
  font-size: 14px;
  margin-right: 5px;
  margin-top: 5px;
}
#roomCard .room-state-image{
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 176px;
  height: 80px;
}
</style>
