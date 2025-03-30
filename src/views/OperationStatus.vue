<template>
    <div>
      <h1>操作确认状态</h1>
      <p v-if="isConfirmed">操作已确认</p>
      <p v-else>操作未确认</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const isConfirmed = ref(false);
  
  onMounted(() => {
    // 根据路由参数中的 confirmed 字段判断操作是否已确认
    const { confirmed } = route.query;
    isConfirmed.value = confirmed === 'true';
  });
  </script>
  
  <style scoped>
  /* 可以添加样式 */
  </style>