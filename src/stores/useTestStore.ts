import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserUsingGet } from '@/service/api/userController.ts'

/*
 * 存储登录用户信息的状态
 */
export const useTestStore = defineStore('test', () => {
  const loginUser = ref<API.LoginUserVO>({})
  async function fetchLoginUser() {
    const res = await getLoginUserUsingGet();
    if(res.data.code === 0 && res.data.data){
      loginUser.value = res.data.data
    }
  }
  return { loginUser,fetchLoginUser };
})
