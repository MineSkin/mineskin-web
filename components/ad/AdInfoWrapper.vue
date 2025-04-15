<style scoped>
</style>
<template>
    <ClientOnly>
        <v-row v-if="ready && grants && !grants.ad_free "
               class="ad-info-wrapper">
            <v-col cols="12" md="8" style="text-align: end" v-if="showMemberInfo">
                <slot></slot>
            </v-col>
            <v-col cols="12" md="4" lg="2" xl="1" class="align-content-center" v-if="showMemberInfo">
                <div>
                    Members don't see ads.
                </div>
                <div>
                    <a class="text-decoration-none"
                       href="https://account.mineskin.org/store" target="_blank">
                        Store
                        <v-icon size="small" icon="mdi-open-in-new"></v-icon>
                    </a>
                </div>
            </v-col>
            <v-col cols="12" v-else-if="!showMemberInfo">
                <slot></slot>
            </v-col>
        </v-row>
    </ClientOnly>
</template>
<script setup lang="ts">

import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";
import { useNuxtApp } from "nuxt/app";
import { computed } from "vue";

const {$flags} = useNuxtApp();

const authStore = useAuthStore();
const {grants} = storeToRefs(authStore);

const showMemberInfo = computed(() => $flags.hasFeature('web.show_ad_member_info'));

const ready = ref(false);
onMounted(() => {
    ready.value = true;
});
</script>