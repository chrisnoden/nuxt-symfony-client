<script setup lang="ts">
import { merge } from 'lodash-es';
import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from '~/components/ui/pagination'
import {
    Button,
} from '~/components/ui/button'
import PerPageSelect from '~/components/datatable/PerPageSelect.vue';

const props = defineProps<{
    pagination?: ApiPaginationType,
}>()

const emit = defineEmits<{
    change: [pagination: ApiPaginationType],
}>()

const perPage = ref<number>(props.pagination?.per_page ?? 25);

const onPageChange = (page: number) => {
    const newPagination = merge(props.pagination, { current_page: page });
    emit('change', newPagination);
}

const onPerPageChange = (value: number) => {
    const newPagination = merge(props.pagination, { per_page: value });
    emit('change', newPagination);
}
</script>

<template>
    <div class="grid grid-cols-1 items-center gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        <div class="hidden lg:block">
            &nbsp;
        </div>

        <div class="justify-self-center md:justify-self-start lg:justify-self-center">
            <Pagination
                v-if="pagination && pagination?.total_pages > 1"
                v-slot="{ page }"
                :items-per-page="pagination.per_page"
                :total="pagination.total"
                :sibling-count="1"
                show-edges
                :page="pagination.current_page"
                @update:page="onPageChange"
            >
                <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                    <PaginationFirst class="cursor-pointer" />
                    <PaginationPrev class="cursor-pointer" />

                    <template v-for="(item, index) in items">
                        <PaginationListItem
                            v-if="item.type === 'page'"
                            :key="index"
                            :value="item.value"
                            as-child
                        >
                            <Button class="h-10 cursor-pointer p-0 min-w-10" :variant="item.value === page ? 'default' : 'outline'">
                                {{ item.value }}
                            </Button>
                        </PaginationListItem>

                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                    </template>

                    <PaginationNext class="cursor-pointer" />
                    <PaginationLast class="cursor-pointer" />
                </PaginationList>
            </Pagination>
        </div>

        <div class="justify-self-center md:justify-self-end">
            <PerPageSelect
                v-model="perPage"
                @update:model-value="onPerPageChange"
            />
        </div>
    </div>
</template>
