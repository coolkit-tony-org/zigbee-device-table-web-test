<template>
    <div class="home-page">
        <div class="header-wrapper">Zigbee Bridge-U 设备支持清单</div>
        <div class="content-wrapper">
            <HomeContent />
        </div>
    </div>
</template>
<script lang="ts" setup>
import HomeContent from './components/HomeContent.vue';
</script>
<style scoped lang="scss">
.home-page {
    width: 100%;
    height: 100%;
    background: url('@/assets/img/background.png');
    display: flex;
    flex-direction: column;

    .header-wrapper {
        font-weight: 600;
        font-size: 32px;
        color: #424242;
        text-align: center;
        padding: 56px 0 24px;
    }

    .content-wrapper {
        flex: 1;
        min-height: 0;
    }
}
</style>
