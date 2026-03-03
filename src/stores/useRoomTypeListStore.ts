import { computed, type ComputedRef, ref } from 'vue'
import { defineStore } from 'pinia'
import { listRoomUsingPost } from '@/service/api/roomController.ts'
import { message } from 'ant-design-vue'
import { listRoomTypeUsingPost } from '@/service/api/roomTypeController.ts'

export const useRoomTypeListStore = defineStore('roomTypeList', () => {
  const roomTypeList = ref<API.RoomType[]>([]);

  //获取房间类型列表
  const fetchRoomTypeList = async () => {
    const res = await listRoomTypeUsingPost();
    if(res.data.code === 0 && res.data.data){
      roomTypeList.value = res.data.data;
    }else
      message.error("获取房间类型列表失败:" + res.data.message)
  }

  return { roomTypeList,fetchRoomTypeList }
})
