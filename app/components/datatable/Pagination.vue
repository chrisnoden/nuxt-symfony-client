<script setup lang="ts">
import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from '@/components/ui/pagination'

import {
    Button,
} from '@/components/ui/button'
import { merge } from 'lodash-es';

const props = defineProps<{
    pagination?: ApiPaginationType,
}>()

const emit = defineEmits<{
    changePage: [pagination: ApiPaginationType],
}>()

const onPageChange = (page: number) => {
    const newPagination = merge(props.pagination, { current_page: page });
    emit('changePage', newPagination);
}
</script>

<template>
    <Pagination
        v-if="pagination && pagination.total_pages > 1"
        v-slot="{ page }"
        :items-per-page="pagination.per_page"
        :total="pagination.total"
        :sibling-count="1"
        show-edges
        :page="pagination.current_page"
        @update:page="onPageChange"
    >
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items">
                <PaginationListItem
                    v-if="item.type === 'page'"
                    :key="index"
                    :value="item.value"
                    as-child
                >
                    <Button class="w-10 h-10 p-0" :variant="item.value === page ? 'default' : 'outline'">
                        {{ item.value }}
                    </Button>
                </PaginationListItem>

                <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext />
            <PaginationLast />
        </PaginationList>
    </Pagination>
</template>
