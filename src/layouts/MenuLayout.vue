<template>
  <div id="menu-layout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader/>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<style>
#menu-layout .header{
  padding-inline: 20px;
  background: #fff;
  color: unset;
  margin-bottom: 16px;
}
#menu-layout .content{
  min-width: 860px;
  padding: 20px;
  margin: 0 auto 28px;
  border-radius: 12px;
  background: #fff;
}
</style>
