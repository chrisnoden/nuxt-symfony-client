<script setup lang="ts">
const { query } = useRoute();

const emit = defineEmits<{
    change: [viewType: ViewTypeType],
}>()

const viewType = ref<ViewTypeType>(query?.viewType === 'grid' ? 'grid' : undefined);

const onChangeViewType = async(newViewType: ViewTypeType) => {
    viewType.value = newViewType;

    emit('change', newViewType);
}

</script>

<template>
    <div class="flex flex-row gap-1 items-center">

        <button
            type="button"
            class="flex justify-center rounded-md px-2 text-sm font-semibold uppercase leading-6 shadow-xs py-1.5 group focus-visible:outline-highlight-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            :class="[
                !viewType && 'bg-core-light-700 dark:bg-core-dark-300',
                viewType && 'bg-core-light-300 cursor-pointer hover:bg-core-light-500 dark:bg-core-dark-700 dark:hover:bg-core-dark-500',
            ]"
            @click.prevent="onChangeViewType(undefined)"
        >
            <IconListView class="h-6 w-6 text-white group-hover:text-core-light-100" />
        </button>

        <button
            type="button"
            class="flex justify-center rounded-md px-2 text-sm font-semibold uppercase leading-6 shadow-xs py-1.5 group focus-visible:outline-highlight-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            :class="[
                viewType === 'grid' && 'bg-core-light-700 dark:bg-core-dark-300',
                viewType !== 'grid' && 'bg-core-light-300 cursor-pointer hover:bg-core-light-500 dark:bg-core-dark-700 dark:hover:bg-core-dark-500',
            ]"
            @click.prevent="onChangeViewType('grid')"
        >
            <IconGridView class="h-6 w-6 text-white group-hover:text-core-light-100" />
        </button>

    </div>
</template>
