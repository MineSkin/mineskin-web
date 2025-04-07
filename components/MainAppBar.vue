<style>
.app-bar-link {
    color: white;
    text-decoration: none;
    cursor: pointer;
}

.img-link {
    width: 100%;
    height: 100%;
}
</style>
<template>
    <v-app-bar density="comfortable" class="px-4" color="mskindigo">
        <v-img
            src="~/assets/img/mineskin-x64.png"
            aspect-ratio="1"
            max-width="40"
            max-height="40"
            @click="router.push(localePath('/'))"
        ></v-img>
        <v-app-bar-title class="flex-0-1">
            <nuxt-link v-if="mdAndUp" class="app-bar-link" :to="localePath('/')">
                MineSkin
                <v-chip
                    density="compact"
                    :color="config.public.isDev ? 'warning' :'secondary'"
                    variant="flat"
                >
                    {{ config.public.isDev ? 'Dev Mode' : 'V2 Beta' }}
                </v-chip>
            </nuxt-link>
        </v-app-bar-title>

        <div class="d-flex flex-auto">
            <v-btn icon
                   v-if="mdAndUp"
                   @click="searching ? search() : showSearch()"
            >
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-expand-x-transition>
                <v-text-field v-show="searching"
                              ref="searchField"
                              density="compact"
                              v-model="filter"
                              placeholder="Search"
                              append-inner-icon="mdi-close"
                              @click:append-inner="filter = ''; searching = false"
                              @keydown.enter="searching = false; search()"
                              @keydown.esc="searching = false"
                              hide-details
                              single-line
                              min-width="20vw"
                />
            </v-expand-x-transition>
        </div>

        <v-spacer></v-spacer>

        <v-tabs
            align-tabs="end"
        >
            <v-tab :to="localePath('/')">
                <span v-if="mdAndUp">{{ $t("Generate") }}</span>
                <v-icon v-else icon="mdi-home"></v-icon>
            </v-tab>
            <v-tab :to="localePath('/skins')">
                <span v-if="mdAndUp">{{ $t("Gallery") }}</span>
                <v-icon v-else icon="mdi-image-search"></v-icon>
            </v-tab>
            <v-tab v-if="authStore.authed" :to="localePath('/my-skins')">
                <span v-if="mdAndUp">{{ $t("My Skins") }}</span>
                <v-icon v-else icon="mdi-view-grid"></v-icon>
            </v-tab>
        </v-tabs>

        <v-divider vertical class="mx-4 my-2"/>

        <template v-slot:append>
            <NotificationModalButton v-if="mdAndUp"/>

            <v-btn icon @click="jobsDrawer = !jobsDrawer" v-show="mdAndUp">
                <v-badge dot
                         v-if="isHydrated && jobCount>0"
                         :color="pendingJobCount>0 ? 'warning':'success'"
                >
                    <v-icon icon="mdi-list-status"></v-icon>
                </v-badge>
                <div v-else>
                    <v-icon icon="mdi-list-status"></v-icon>
                </div>
                <v-tooltip
                    activator="parent"
                    location="bottom"
                >
                    {{ $t("Show Jobs") }}
                </v-tooltip>
            </v-btn>

            <v-avatar
                class="ml-2"
                color="info"
            >
                <a v-if="authStore.authed" class="img-link" href="https://account.mineskin.org"
                   @click.prevent="jobsDrawer = !jobsDrawer">
                    <v-img :src="authStore.user?.picture||PLACEHOLDER_HEAD" alt="User Avatar"></v-img>
                </a>
                <v-btn v-else icon @click="jobsDrawer = !jobsDrawer">
                    <a class="img-link text-white"
                       @click.prevent
                       href="https://account.mineskin.org/">
                        <v-icon>mdi-account</v-icon>
                    </a>
                </v-btn>
            </v-avatar>
        </template>

    </v-app-bar>
</template>
<script setup lang="ts">

import { useAuthStore } from "~/stores/auth";
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { PLACEHOLDER_HEAD } from "~/util/skin";

const config = useRuntimeConfig();

const localePath = useLocalePath();

const router = useRouter();

const authStore = useAuthStore();
const queueStore = useQueueStore();

const isHydrated = ref(false);

const {smAndUp, mdAndUp} = useDisplay();

const {jobsSorted, jobsDrawer, jobCount, pendingJobCount} = storeToRefs(queueStore);

const searching = ref(false);
const filter = ref('');
const searchField = useTemplateRef('searchField');

const showSearch = () => {
    searching.value = true;
    setTimeout(() => {
        searchField.value.focus();
    }, 0);
}

const search = () => {
    searching.value = false;
    if (filter.value === '') {
        return;
    }
    router.push({
        path: '/skins',
        query: {
            filter: filter.value
        },
        force: true,
    });
}

onMounted(() => {
    isHydrated.value = true;
})

</script>