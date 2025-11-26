<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
</script>

<template>
    <ConfigProvider :locale="enUS">
        <router-view></router-view>
    </ConfigProvider>
</template>

<style scoped></style>
