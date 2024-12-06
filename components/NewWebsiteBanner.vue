<style scoped>
.new-website-banner {
    right: 0;
    bottom: 0;
    z-index: 1000;
}
</style>
<template>
    <v-alert
        v-if="showBanner"
        position="fixed"
        class="new-website-banner ma-8"
        variant="elevated"
        type="info"
        closable
        @click:close="onClosed"
    >
        <template v-slot:title>
            Welcome to the new MineSkin website!
        </template>
        <template v-slot:text>
            This is currently in beta,<br/>
            please share any feedback or issues on <a class="text-decoration-none text-indigo"
                                                      href="https://minesk.in/discord" target="_blank">Discord</a>.<br/>
            <small>You can also go back
                to the <a class="text-decoration-none text-purple text-indigo" href="https://classic.mineskin.org?utm_source=website_v2&utm_medium=link&utm_campaign=announcement_banner">classic
                    website</a></small>
        </template>
    </v-alert>
</template>
<script setup lang="ts">
import { useSettingsStore } from "#imports";
import { storeToRefs } from "pinia";

const settingsStore = useSettingsStore();
const {newWebsiteBannerClosed} = storeToRefs(settingsStore);

const showBanner = computed(() => {
    return !newWebsiteBannerClosed.value || newWebsiteBannerClosed.value < Math.floor(Date.now()) - 1000 * 60 * 60 * 24;
});

const onClosed = () => {
    newWebsiteBannerClosed.value = Math.floor(Date.now());
}
</script>