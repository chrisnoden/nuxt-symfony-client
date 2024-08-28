<script setup lang="ts">
import FieldLabel from '~/components/form/FieldLabel.vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { find } from 'lodash-es';

const value = defineModel<string>();
const props = withDefaults(defineProps<{
    autocomplete?: string,
    disabled?: boolean
    errors?: ValidationErrorType[],
    label?: string,
    minLength?: number,
    maxLength?: number,
    name?: string,
    placeholder?: string,
    required?: boolean,
    type?: 'email'|'password'|'tel'|'text',
}>(), {
    autocomplete: 'off',
    disabled: false,
    errors: undefined,
    label: undefined,
    minLength: 3,
    maxLength: 255,
    name: 'input-text',
    placeholder: undefined,
    required: false,
    type: 'text'
})
defineEmits<{
    input: [value: string],
}>()

const origValue = unref(value);

const hasError = computed((): boolean => undefined !== find(props.errors, (e) => e?.field === props.name));
const error = computed(
    (): string => {
        if (props.type === 'email') {
            return 'valid email address required';
        } else if (props.type === 'text') {
            return `${props.required && 'required; '}${props.minLength > 0 && 'min ' + props.minLength + ' chars'}`;

        }

        return find(props.errors, (e) => e?.field === props.name)?.message ?? 'not acceptable';
    })
const isModified = computed((): boolean => origValue !== value.value);
</script>

<template>
    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
        <div>
            <FieldLabel :name="name">{{ label ?? 'Input' }}</FieldLabel>
        </div>

        <div class="relative mt-2 sm:col-span-2 sm:mt-0 w-full">
            <input
                :id="name"
                v-model="value"
                :autocomplete="autocomplete"
                :disabled="disabled"
                :minlength="minLength"
                :maxlength="maxLength"
                :name="name"
                :placeholder="placeholder ?? label"
                :required="required"
                :type="type"
                class="
                    block w-full rounded-md border-0 py-1.5 dark:bg-body-bg-dark
                    text-core-light-900 dark:text-core-dark-100 placeholder:text-core-light-400 dark:placeholder:text-core-dark-600
                    ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6
                "
                :class="[
                    hasError && 'has-error',
                    isModified && 'is-modified',
                    (!disabled && !hasError) && 'shadow-sm',
                    (disabled) && 'ring-core-light-100 dark:ring-core-dark-900',
                    (hasError && !disabled) && 'ring-red-600',
                ]"
                @input="$emit('input', $event.target?.value ?? '')"
            >

            <div
                v-if="!disabled"
                v-tooltip.left="{ value: error,
                                  class: 'error' }"
                class="md:absolute right-2 top-2 inline-flex items-center pt-1 md:pt-0"
                :class="[
                    hasError ? 'visible' : 'invisible',
                ]"
            >
                <ExclamationTriangleIcon
                    class="w-5 h-5 text-red-600"
                />

                <div
                    class="md:hidden text-red-600 text-sm ml-2"
                >{{ error }}</div>
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped>
    input.is-modified:not(.has-error) {
        &:invalid {
            &:not(:placeholder-shown) {
                @apply ring-amber-500;
            }

            + div {
                @apply visible;
            }
        }

        &:valid:not(:focus) {
            @apply ring-green-400;
        }

        &:valid:focus {
            @apply ring-green-600;
        }
    }
</style>
