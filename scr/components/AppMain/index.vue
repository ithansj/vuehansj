<template>
  <!-- 左侧导航区域 -->
  <div class="main">
    <!-- 除了首页之外显示这个指示组件 -->
    <app-link v-show="$route.path!=='/home'"></app-link>
    <!-- 子路由渲染出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
import AppLink from "@/components/AppMain/Link.vue";
export default {
  components: {
    AppLink
  }
};
</script>

