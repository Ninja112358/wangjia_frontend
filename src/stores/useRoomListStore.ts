import { computed, type ComputedRef, ref } from 'vue'
import { defineStore } from 'pinia'
import { listRoomUsingPost } from '@/service/api/roomController.ts'
import { message } from 'ant-design-vue'

export const useRoomListStore = defineStore('roomList', () => {
  //房间列表
  const roomList = ref<API.Room[]>([]);
  //房间的显示(按照楼层显示,并且有过滤)
  const rooms: ComputedRef<Array<Array<API.Room>>> = computed(() => {
    return roomListToRoomFloor(filterRoomList(roomList.value));
  });

  const fetchRoomList = async () => {
    const res = await listRoomUsingPost();
    if(res.data.code === 0 && res.data.data){
      roomList.value = res.data.data;
      //对房间列表进行排序(字符串排序)
      roomList.value.sort((a,b) => {
        return (a.roomId??'').localeCompare(b.roomId??'');
      });
    }else
      message.error("获取房间列表失败:" + res.data.message)
  }

  //将roomList转换为每一层的形式
  const roomListToRoomFloor = (roomList: API.Room[]) => {
    let ans: Array<Array<API.Room>> = [];
    for(let item of roomList){
      let roomFloor:number = item.roomFloor??0;
      if(ans[roomFloor] === undefined)
        ans[roomFloor] = [];
      ans[roomFloor].push(item);
    }
    return ans;
  }


  /**********
   * 多选框  *
   **********/
    //房间状态的多选框
  const roomStateChecked = ref<Array<{name : string, checked:boolean}>>([
      {
        name:"空房",
        checked:false
      },{
        name:"脏房",
        checked:false
      },{
        name:"在住",
        checked:false
      },{
        name:"空脏",
        checked:false
      },{
        name:"空净",
        checked:false
      },{
        name:"维修",
        checked:false
      },{
        name:"锁房",
        checked:false
      },{
        name:"在住脏",
        checked:false
      },{
        name:"在住净",
        checked:false
      }
    ]);
  const roomTypeChecked = ref<Array<{name : string, checked:boolean}>>([]);
  //过滤房间列表
  const filterRoomList = (roomList: API.Room[]) => {
    //根据房间状态进行筛选
    for (let item of roomStateChecked.value) {
      if(item.checked){
        roomList = roomList.filter(roomItem => {
          if(roomStateChecked.value && roomStateChecked.value.length > 0){
            return  ((roomItem.roomState === 0 || roomItem.roomState === 3) && roomStateChecked.value[0].checked) ||
              ((roomItem.roomState === 3 || roomItem.roomState === 4) && roomStateChecked.value[1].checked) ||
              ((roomItem.roomState === 1 || roomItem.roomState === 4) && roomStateChecked.value[2].checked) ||
              (roomItem.roomState === 3 && roomStateChecked.value[3].checked) ||
              (roomItem.roomState === 0 && roomStateChecked.value[4].checked) ||
              (roomItem.roomState === 2 && roomStateChecked.value[5].checked) ||
              (roomItem.roomState === 5 && roomStateChecked.value[6].checked) ||
              (roomItem.roomState === 4 && roomStateChecked.value[7].checked) ||
              (roomItem.roomState === 1 && roomStateChecked.value[8].checked);
          }
        });
        break;
      }
    }
    //根据房间类型进行筛选
    for (let item of roomTypeChecked.value) {
      if(item.checked){
        roomList = roomList.filter(roomItem => {
          if(roomTypeChecked.value && roomTypeChecked.value.length > 0)
            return roomItem.roomType === item.name && item.checked;
        });
      }
    }
    return roomList;
  }

  return { roomList, fetchRoomList,rooms,roomTypeChecked,roomStateChecked }
})
