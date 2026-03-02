<template>
  <div id="home-page">
    <a-layout>
      <a-layout-sider class="sider">
        <h2>房态</h2>
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">
          <a-checkbox class="checkbox" v-for="item in roomStateChecked" :key="item.name" v-model:checked="item.checked">{{item.name}}</a-checkbox>
        </div>
        <h2>房间类型</h2>
        <div style="font-size: 28px; font-weight: bold; margin-bottom: 16px;">
          <a-checkbox class="checkbox" v-for="item in roomTypeChecked" :key="item.name" v-model:checked="item.checked">{{item.name}}</a-checkbox>
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-content class="main">
          <a-collapse v-model:activeKey="activeKey" ghost expandIconPosition="end">
            <a-collapse-panel class="room-panel" v-for="(items,index) in rooms" :key="index" :header="'第' + index + '层'">

              <div style="display: inline-block" v-for="item in items">
                <a-popover placement="bottom" trigger="click">
                  <template #title>
                    <!--空房:空脏和空净-->
                    <a-space wrap v-if="item.state === 0 || item.state === 3">
                      <a-button type="primary">入住</a-button>
                      <a-button type="primary" @click="item.state = item.state === 0 ? 3 : 0">{{item.state === 0 ? '置脏' : '置净'}}</a-button>
                      <a-button type="primary" @click="item.state = 2">维修</a-button>
                      <a-button type="primary" @click="item.state = 5">锁房</a-button>
                    </a-space>
                    <!--在住:在住脏和在住净,包括联房和团队-->
                    <a-space wrap v-else-if="item.state === 1 || item.state === 4">
                      <a-button type="primary">查看</a-button>
                      <a-button type="primary" @click="item.state = item.state === 1 ? 4 : 1">{{item.state === 1 ? '置脏' : '置净'}}</a-button>
                    </a-space>
                    <!--维修-->
                    <a-space wrap v-else-if="item.state === 2">
                      <a-button type="primary" @click="item.state = 0">维修完成</a-button>
                      <a-button type="primary" @click="item.state = 5">锁房</a-button>
                    </a-space>
                    <!--锁房-->
                    <a-space wrap v-else-if="item.state === 5">
                      <a-button type="primary" @click="item.state = 2">维修</a-button>
                      <a-button type="primary" @click="item.state = 0">开启房间</a-button>
                    </a-space>
                  </template>
                  <template #content>
                    <div>
                      <span style="font-weight: bolder">房间备注:</span>{{item.info??'无'}}
                    </div>
                    <div v-if="item.state === 1 || item.state === 4" >
                      <span style="font-weight: bolder">订单备注:</span>{{item.order_info??'无'}}
                    </div>
                  </template>



                  <!--空房:空脏和空净-->
                  <div class="room" v-if="item.state === 0 || item.state === 3" style="background: #cd2626">
                    <span style="font-weight: normal;font-size: 14px">{{item.room_id}} {{item.room_name}}</span>
                    <div class="room-state-image" v-if="item.state === 3">
                      <img src="@/assets/images/clean.png" width="50px" alt="clean"/>
                    </div>
                  </div>
                  <!--在住:在住脏和在住净,包括联房和团队-->
                  <div class="room" v-if="item.state === 1 || item.state === 4" :style="item.state === 1 ? {'background': '#4e6ef2'} : {'background': '#203f74'}">
                    <span style="font-weight: normal;font-size: 14px">{{item.room_id}} {{item.room_name}} <span v-if="item.state === 4">(需打扫)</span></span>
                    <div class="room-state-image">
                      <img v-if="item.isTeam" src="@/assets/images/team.png" width="50px" alt="clean"/>
                      <img v-else-if="item.isContact" src="@/assets/images/contactRoom.png" width="50px" alt="clean"/>
                      <img v-else src="@/assets/images/custom.png" width="50px" alt="clean"/>
                      <h4>{{item.room_custom}}</h4>
                    </div>
                  </div>
                  <!--维修-->
                  <div class="room" v-if="item.state === 2" style="background: #66cccc">
                    <span style="font-weight: normal;font-size: 14px">{{item.room_id}} {{item.room_name}}</span>
                    <div class="room-state-image">
                      <img src="@/assets/images/repair.png" width="50px" alt="repair"/>
                    </div>
                  </div>
                  <!--锁房-->
                  <div class="room" v-if="item.state === 5" style="background: #008000">
                    <span style="font-weight: normal;font-size: 14px">{{item.room_id}} {{item.room_name}}</span>
                    <div class="room-state-image">
                      <img src="@/assets/images/lock.png" width="50px" alt="lock"/>
                    </div>
                  </div>

                </a-popover>










              </div>

            </a-collapse-panel>
          </a-collapse>
        </a-layout-content>
        <a-layout-footer class="footer">
          <div class="footer-info-text">全部:{{footerInfo.allNum}}</div>
          <div class="footer-info-text">空房:{{footerInfo.emptyNum}}</div>
          <div class="footer-info-text">在住:{{footerInfo.insideNum}}</div>
          <div class="footer-info-text">维修:{{footerInfo.repairNum}}</div>
          <div class="footer-info-text">锁房:{{footerInfo.lockNum}}</div>
          <div class="footer-info-text">入住率:{{footerInfo.insidePercent}}%</div>
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'

const footerInfo = ref();
const roomStateChecked = ref();
const roomTypeChecked = ref();
const roomList = ref<Object[]>();
const activeKey = ref<string[]>([]);

/*
* 将roomList转换为每一层的形式
* */
function roomListToRoomFloor(roomList: Object[]){
  //roomList.roomFloor;
  let ans = {};
  for(let i = 0;i < roomList.length;i++){
    let roomFloor = roomList[i].room_floor;
    if(ans[roomFloor] === undefined)
      ans[roomFloor] = [];
    ans[roomFloor].push(roomList[i]);
  }
  return ans;
}


//模拟数据
roomStateChecked.value = [
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
    name:"在住脏",
    checked:false
  },{
    name:"在住净",
    checked:false
  }
];


roomTypeChecked.value = [{
  name:"标准间",
  checked:false
},{
  name:"大床房",
  checked:false
},{
  name:"三人间",
  checked:false
},{
  name:"家庭三人房",
  checked:false
},{
  name:"三人间套房",
  checked:false
},{
  name:"四人间套房",
  checked:false
}];

footerInfo.value = {
  allNum:61,
  emptyNum:51,
  insideNum:2,
  repairNum:8,
  lockNum:0,
  insidePercent:3.77
};

roomList.value = [
  {
    "id": 25493,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "201",
    "room_name": "三人间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T10:59:24",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26119,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "202",
    "room_name": "三人间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T10:59:32",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26033,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "203",
    "room_name": "大床房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T10:59:58",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26158,
    "state": 3,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "204",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:00:22",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26151,
    "state": 4,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": 5379,
    "order_group_id": 3124,
    "room_id": "205",
    "room_name": "大床房",
    "room_custom": "娄雅馨",
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:00:37",
    "delete_time": null,
    "isUsed": true,
    "order_info": "美团"
  },
  {
    "id": 26035,
    "state": 5,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "206",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:01:02",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26152,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "207",
    "room_name": "大床房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:01:32",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26036,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "208",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，一张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:02:03",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25698,
    "state": 2,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "210",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，一张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:02:31",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26000,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "211",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:03:30",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25984,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "212",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:03:38",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25985,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "213",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:03:50",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26123,
    "state": 1,
    "room_floor": 2,
    "isTeam": false,
    "isContact": true,
    "order_id": 5367,
    "order_group_id": 3120,
    "room_id": "214",
    "room_name": "大床房",
    "room_custom": "张虹悦",
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:04:08",
    "delete_time": null,
    "isUsed": true,
    "order_info": ""
  },
  {
    "id": 26159,
    "state": 3,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "215",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:04:30",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26143,
    "state": 2,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "216",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:04:37",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26144,
    "state": 2,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "217",
    "room_name": "三人间",
    "room_custom": null,
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 128,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:04:51",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26145,
    "state": 2,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "218",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:05:05",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26146,
    "state": 1,
    "room_floor": 2,
    "isTeam": true,
    "isContact": true,
    "order_id": null,
    "order_group_id": null,
    "room_id": "219",
    "room_name": "大床房",
    "room_custom": "啊哈哈",
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:05:21",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26147,
    "state": 2,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "220",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:05:36",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26148,
    "state": 2,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "221",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:05:47",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26090,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "222",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:05:52",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26067,
    "state": 0,
    "room_floor": 2,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "223",
    "room_name": "大床房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:06:07",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25992,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "301",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:09:17",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 23571,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "302",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:09:29",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25993,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "303A",
    "room_name": "三人间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:09:48",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25994,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "303B",
    "room_name": "三人间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:09:54",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25995,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "304",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:11:20",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25996,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "306",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "4张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:11:39",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26040,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "307",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:12:12",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26071,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "308",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:12:43",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26072,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "309",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:12:48",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26073,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "310",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:12:55",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26068,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "311",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:13:06",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26069,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "312",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:13:21",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26070,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "313",
    "room_name": "三人间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:13:40",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26042,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "314",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:13:47",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26115,
    "state": 2,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "315",
    "room_name": "三人间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:14:35",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25997,
    "state": 0,
    "room_floor": 3,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "316",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:14:47",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26076,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "401",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:15:04",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26075,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "402",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:15:21",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26074,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "403",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:15:25",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26087,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "405",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:15:57",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26086,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "406",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:15:43",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 25951,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "409",
    "room_name": "大床房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:16:10",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26085,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "410",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:16:23",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 22421,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "411",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:16:32",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 23909,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "412",
    "room_name": "大床房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:16:47",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 21370,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "413",
    "room_name": "三人间",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:16:58",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 23241,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "415",
    "room_name": "标准间",
    "room_custom": null,
    "room_window": "无窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 80,
    "info": "2张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:17:11",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26077,
    "state": 0,
    "room_floor": 4,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "416",
    "room_name": "家庭三人房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "1张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:17:46",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26084,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "501",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:18:01",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26083,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "502",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:18:14",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26082,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "503",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:18:19",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26081,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "504",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:18:22",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26099,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "505",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "3张小床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:19:18",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26100,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "506",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:18:34",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26101,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "507",
    "room_name": "四人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 198,
    "info": "3张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:18:37",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 22431,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "508",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:19:32",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 23237,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "509",
    "room_name": "大床房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 100,
    "info": "1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:20:11",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 22354,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "510",
    "room_name": "三人间套房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "2张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:20:21",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  },
  {
    "id": 26102,
    "state": 0,
    "room_floor": 5,
    "isTeam": false,
    "isContact": false,
    "order_id": null,
    "order_group_id": null,
    "room_id": "511",
    "room_name": "家庭三人房",
    "room_custom": null,
    "room_window": "有窗",
    "room_team": null,
    "room_desposit": 0,
    "room_peoplenum": 5,
    "room_price": 158,
    "info": "1张小床，1张大床",
    "start_time": null,
    "end_time": null,
    "create_time": "2024-07-17T11:20:31",
    "delete_time": null,
    "isUsed": true,
    "order_info": "无"
  }
]


const rooms = roomListToRoomFloor(roomList.value);
for (let key in rooms)
  activeKey.value.push(key);

</script>

<style>
#home-page{
  margin: -36px -20px -20px;
  width: 100vw;
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
  width: calc(100vw - 250px);
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
#home-page .room-panel .room{
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
#home-page .room-panel .room-state-image{
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 176px;
  height: 80px;
}
</style>
