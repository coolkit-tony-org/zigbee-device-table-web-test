<script setup lang="ts">
import { computed, toRefs } from 'vue';
import type { CSSProperties } from 'vue';
import { Table } from 'ant-design-vue';
import type { TableProps } from 'ant-design-vue';
import { useVirtualList } from '@vueuse/core';

/** 虚拟滚动配置 */
interface VirtualScrollOptions {
    /** 单行高度（px） */
    itemHeight?: number;
    /** 可视区域高度（px），实际就是滚动容器高度 */
    height?: number;
}

/** 直接继承 antd Table 的所有 props，再加一个 virtualScroll */
interface VirtualTableProps<RecordType = any> extends TableProps<RecordType> {
    /** 仅在 pagination === false 时生效 */
    virtualScroll?: VirtualScrollOptions;
}

const props = withDefaults(defineProps<VirtualTableProps>(), {
    virtualScroll: () => ({
        itemHeight: 40,
        height: 400,
    }),
});

const emit = defineEmits<{
    (e: 'change', ...args: any[]): void;
    (e: 'expand', ...args: any[]): void;
    (e: 'expandedRowsChange', keys: (string | number)[]): void;
    (e: 'update:expandedRowKeys', keys: (string | number)[]): void;
}>();

const { pagination, dataSource, virtualScroll } = toRefs(props);

/** 是否启用虚拟列表：只在 pagination === false 时开启 */
const enableVirtual = computed(() => pagination.value === false);

/** 源数据（保证是数组） */
const source = computed(() => (dataSource.value ?? []) as any[]);

/** 用于真正喂给 a-table 的 props，去掉 virtualScroll，避免多余属性落到 DOM 上 */
const tableProps = computed<TableProps<any>>(() => {
    const { virtualScroll: _vs, ...rest } = props;
    return rest;
});

/** useVirtualList 只在启用虚拟模式时才真正用到 */
const {
    list: virtualList,
    containerProps,
    wrapperProps,
} = (() => {
    if (!enableVirtual.value) {
        // 非虚拟模式占位，防止模板里写一堆判断
        return {
            list: computed(() => source.value.map((item, index) => ({ index, data: item }))),
            containerProps: {
                style: {},
            } as any,
            wrapperProps: {
                style: {},
            } as any,
        };
    }

    const { list, containerProps, wrapperProps } = useVirtualList(source, {
        itemHeight: virtualScroll.value?.itemHeight ?? 40,
        overscan: 5,
    });

    const style: CSSProperties = {
        ...((containerProps.style || {}) as CSSProperties),
        height: `${virtualScroll.value?.height ?? 400}px`,
        overflowY: 'auto',
        overflowX: 'auto',
    };

    return {
        list,
        containerProps: {
            ...containerProps,
            style,
        },
        wrapperProps,
    };
})();

/** 真正用于渲染的 dataSource */
const tableData = computed(() => (enableVirtual.value ? virtualList.value.map((i) => i.data) : source.value));
</script>

<template>
    <!-- 虚拟模式 -->
    <div v-if="enableVirtual" class="virtual-table-container" v-bind="containerProps">
        <div v-bind="wrapperProps">
            <Table
                v-bind="tableProps"
                :pagination="false"
                :data-source="tableData"
                :scroll="undefined"
                class="virtual-table"
                @change="(...args) => emit('change', ...args)"
                @expand="(...args) => emit('expand', ...args)"
                @expandedRowsChange="(keys) => emit('expandedRowsChange', keys)"
                @update:expandedRowKeys="(keys) => emit('update:expandedRowKeys', keys)"
            >
                <!-- 插槽透传：bodyCell、headerCell、empty 等都照常用 -->
                <template v-for="(_, slotName) in $slots" #[slotName]="slotData">
                    <slot :name="slotName" v-bind="slotData" />
                </template>
            </Table>
        </div>
    </div>

    <!-- 普通模式：完全当原生 a-table 用 -->
    <Table
        v-else
        v-bind="tableProps"
        :data-source="dataSource"
        @change="(...args) => emit('change', ...args)"
        @expand="(...args) => emit('expand', ...args)"
        @expandedRowsChange="(keys) => emit('expandedRowsChange', keys)"
        @update:expandedRowKeys="(keys) => emit('update:expandedRowKeys', keys)"
    >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotData">
            <slot :name="slotName" v-bind="slotData" />
        </template>
    </Table>
</template>

<style scoped>
.virtual-table-container {
    /* 高度由 virtualScroll.height 控制，这里不死写 */
}

/* 重点：让表头在容器内部 sticky 固定在顶部 */
.virtual-table-container :deep(.ant-table-thead) {
    position: sticky;
    top: 0;
    z-index: 1;
}

/* 防止滚动时表头透明 */
.virtual-table-container :deep(.ant-table-thead > tr > th) {
    background: #fff;
}
</style>
