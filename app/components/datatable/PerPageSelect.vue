<script setup lang="ts">
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { has } from 'lodash-es';

const perPage = defineModel<number>({ required: true })
const route = useRoute();

const value = ref<string>(`${perPage.value}`);

const options = [
    10,
    25,
    50,
]
if (!options.includes(perPage.value)) {
    options.push(perPage.value);
}

watch(route, (route) => {
    if (has(route, 'query') && has(route.query, 'perPage')) {
        value.value = `${route.query.perPage as string}`;
    }
})
</script>

<template>
    <div class="inline-flex items-center space-x-2">
        <div class="text-sm uppercase text-core-light-500 dark:text-core-dark-500 whitespace-nowrap">per page</div>
        <Select
            v-model="value"
            @update:model-value="perPage = parseInt(value, 10)"
        >
            <SelectTrigger>
                <SelectValue placeholder="per page" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem
                        v-for="option in options"
                        :key="option"
                        :value="`${option}`"
                    >
                        {{ option }}
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
</template>
