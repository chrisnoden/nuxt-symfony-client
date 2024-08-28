<script setup lang="ts">
import EntityCancelEditingButton from '~/components/form/EntityCancelEditingButton.vue';
import EntityEditButton from '~/components/form/EntityEditButton.vue';
import EntitySaveButton from '~/components/form/EntitySaveButton.vue';

const editable = defineModel<boolean>('editable');

defineProps<{
    canEdit?: boolean,
    isNew?: boolean,
}>()
defineEmits<{
    clickCancel: [],
    clickSave: [],
}>()
</script>

<template>
    <main class="max-w-7xl mx-auto w-full">
        <form class="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
            <div class="mt-6 w-full md:w-48 lg:w-64 space-y-4 sticky top-0 md:top-[48px] pt-1 md:pt-4 pb-2 bg-body-bg dark:bg-body-bg-dark z-10">
                <EntityEditButton
                    v-if="!isNew && canEdit && !editable"
                    @click="editable = true"
                />
                <EntityCancelEditingButton
                    v-else-if="isNew || (canEdit && editable)"
                    @click="editable = false; $emit('clickCancel')"
                />
                <EntitySaveButton
                    v-if="isNew || editable"
                    @click="$emit('clickSave')"
                />

                <slot name="sidebar" />
            </div>

            <div class="flex-1 w-full">
                <slot />
            </div>
        </form>
    </main>
</template>
