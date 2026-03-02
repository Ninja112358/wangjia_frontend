<template>
  <div id="content-layout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">

      </a-layout-header>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="#" target="_blank">旺家宾馆专用管理系统 by ninja</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style scoped>
#content-layout .header{
  height: 200px;
  background: #fff;
}
#content-layout .content{
  padding: 20px;
  margin-bottom: 28px;
  background: linear-gradient(to right,#fefefe,#fff);
}
#content-layout .footer{
  background-color: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
