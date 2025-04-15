<style scoped>
.dismiss-button {
    position: absolute;
    right: 4px;
    top: 4px;
    z-index: 1000;
    text-decoration: none;
    color: rgba(145, 145, 145, 0.5);
}

.dismiss-button-bottom {
    top: unset;
    bottom: 4px;
}

.ad-ribbon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: rgba(80, 80, 80, 0.8);
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: bold;
}
</style>
<template>
    <ClientOnly>
        <v-row v-if="ready && grants && !grants.ad_free" v-show="!dismissed"
               class="ad-info-wrapper my-2" justify="center">

            <v-col v-if="lgAndUp" cols="12" xl="8"> <!-- Info on right -->
                <v-sheet color="grey-darken-3" style="position:relative;">
                    <a href="#" class="dismiss-button" @click.prevent="dismiss">
                        <v-icon icon="mdi-close"></v-icon>
                    </a>
                    <div class="ad-ribbon">Ad</div>

                    <v-row>
                        <v-col cols="10" style="text-align: end" v-if="showMemberInfo">
                            <slot></slot>
                        </v-col>
                        <v-col cols="2" class="align-content-center" v-if="showMemberInfo">
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
                </v-sheet>
            </v-col>
            <v-col v-else cols="12"><!-- Info Below -->
                <v-sheet color="grey-darken-3" style="position: relative">
                    <a href="#" class="dismiss-button dismiss-button-bottom" @click.prevent="dismiss">
                        <v-icon icon="mdi-close"></v-icon>
                    </a>
                    <div class="ad-ribbon">Ad</div>
                    <v-row>
                        <v-col cols="12" style="text-align: end" v-if="showMemberInfo">
                            <slot></slot>
                        </v-col>
                        <v-col cols="12" class="align-content-center text-center" v-if="showMemberInfo">
                            <div>
                                Members don't see ads.
                                <a class="text-decoration-none ml-2"
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
                </v-sheet>
            </v-col>


        </v-row>
    </ClientOnly>
</template>
<script setup lang="ts">

import { useAuthStore } from "~/stores/auth";
import { storeToRefs } from "pinia";
import { useNuxtApp } from "nuxt/app";
import { computed } from "vue";

const {smAndUp, mdAndUp, lgAndUp} = useDisplay();

const {$flags, $gtag} = useNuxtApp();

const authStore = useAuthStore();
const {grants} = storeToRefs(authStore);

const showMemberInfo = computed(() => $flags.hasFeature('web.show_ad_member_info'));

const dismissed = ref(false);
const dismiss = () => {
    dismissed.value = true;
    try {
        $gtag('event', 'dismiss_ad')
    } catch (e) {
        console.error(e);
    }
}

const ready = ref(false);
onMounted(() => {
    ready.value = true;
});
</script>