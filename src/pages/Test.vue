<template>
{{ testStore.loginUser }}

</template>


<script setup lang="ts">

import { useTestStore } from '@/stores/useTestStore.ts'
import { getLoginUserUsingGet } from '@/service/api/userController.ts'

const testStore = useTestStore();
const res = await getLoginUserUsingGet()
console.log(res)

</script>
