<template>
    <v-select
        label="Visibility"
        v-model="visibility"
        :items="visibilities"
        :item-props="visibilityProps"
        hint="Visibility of the skin"
        persistent-hint
    />
</template>
<script setup lang="ts">
import { useGenerateStore } from "~/stores/generate";
import { storeToRefs } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";
import { computed, ref } from "vue";
import { useSettingsStore } from "~/stores/settings";
import { useNuxtApp } from "#app";

const {$flags} = useNuxtApp();

const authStore = useAuthStore();
const {grants} = storeToRefs(authStore);

const settingsStore = useSettingsStore();

const generateStore = useGenerateStore();
const {visibility} = storeToRefs(generateStore);

const {visibility: preferredVisibility} = storeToRefs(settingsStore);

watch(() => visibility.value, (value) => {
    preferredVisibility.value = value;
}, {immediate: true});

const canUsePrivateSkins = computed(() => {
    return authStore.authed && grants.value?.private_skins;
});

const visibilities = ref<SkinVisibility2[]>([SkinVisibility2.PUBLIC, SkinVisibility2.UNLISTED]);
onMounted(async () => {
    try {
        if ($flags.hasFeature('web.visibility.private')) {
            visibilities.value.push(SkinVisibility2.PRIVATE);
        }
    } catch (e) {
        console.error(e);
    }
})

function visibilityProps(item: SkinVisibility2) {
    switch (item) {
        case SkinVisibility2.PUBLIC:
            return {
                prependIcon: "mdi-earth",
                title: "Public",
                subtitle: "Visible to everyone"
            };
        case SkinVisibility2.UNLISTED:
            return {
                prependIcon: "mdi-link",
                title: "Unlisted",
                subtitle: "Visible to anyone with the link"
            };
        case SkinVisibility2.PRIVATE:
            return {
                prependIcon: "mdi-eye-off",
                appendIcon: !canUsePrivateSkins.value ? 'mdi-lock' : '',
                title: canUsePrivateSkins.value ? "Private ✨" : "Private ✨ - Requires Subscription",
                subtitle: "Visible to you only",
                disabled: !canUsePrivateSkins.value
            };
    }
}

</script>