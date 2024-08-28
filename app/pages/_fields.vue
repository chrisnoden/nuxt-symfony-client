<script setup lang="ts">
import ColumnChooser from '~/components/datatable/ColumnChooser.vue';
import TrueFalseColumn from '~/components/datatable/column-types/TrueFalseColumn.vue';
import InputCommon from '~/components/form/compact/InputCommon.vue';
import ButtonSubmit from '~/components/form/ButtonSubmit.vue';

let idx: number = 1;
const columns = [
    {
        id: idx++,
        props: {
            header: 'ID',
            field: 'id',
        },
        hideFromChooser: true,
        dataKey: true,
        sortable: true,
        visible: false,
    },
    {
        id: idx++,
        props: {
            header: 'Name',
            field: 'name',
        },
        defaultSort: 'asc',
        sortable: true,
        visible: true,
    },
    {
        id: idx++,
        props: {
            header: 'Email',
            field: 'email',
        },
        sortable: true,
        visible: true,
    },
    {
        id: idx++,
        props: {
            header: 'Enabled',
            class: 'text-center',
            field: 'enabled',
        },
        component: TrueFalseColumn,
        visible: true,
        width: 88,
    },
    {
        id: idx++,
        props: {
            header: '2FA',
            class: 'text-center',
            field: 'twoFactorEnabled',
        },
        component: TrueFalseColumn,
        visible: true,
        width: 80,
    },
]

const name = ref<string>();
</script>

<template>
    <div class="max-w-xl w-full mx-auto py-10">
        <div class="flex flex-col gap-8 border border-core-light-400 dark:border-core-dark-600 rounded-lg p-8">

            <ColumnChooser
                v-if="hideColumnChooser !== true"
                v-model="columns"
                @update:model-value="key += 1"
            />

            <InputCommon
                v-model="name"
                label="Common"
            />

            <InputCommon
                v-model="name"
                label="Common with error"
                error="Problem found"
            />

            <ButtonSubmit/>
        </div>
    </div>
</template>
