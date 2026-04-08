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

.rainbow .v-tab__slider {
    background: linear-gradient(90deg, #FE0000 16.66%,
    #FD8C00 16.66%, 33.32%,
    #FFE500 33.32%, 49.98%,
    #119F0B 49.98%, 66.64%,
    #0644B3 66.64%, 83.3%,
    #C22EDC 83.3%) !important;
    height: 4px !important;
}

.v-tab.v-tab.v-btn {
    min-width: 70px !important;
}

@media (max-width: 960px) {
    .v-toolbar__content > .v-toolbar-title {
        margin-inline-start: 8px !important;
    }

    .v-toolbar-title {
        font-size: 1rem !important;
    }
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
        <v-app-bar-title :class="{'flex-0-1': mdAndUp}">
            <nuxt-link class="app-bar-link" :to="localePath('/')">
                <span v-if="mdAndUp" class="mr-1">MineSkin</span>
                <span v-if="plan" class="font-weight-light text-member text-capitalize">{{ plan }}</span>
                <v-chip
                    v-if="mdAndUp &&  config.public.isDev "
                    density="compact"
                    :color="config.public.isDev ? 'warning' :'secondary'"
                    variant="flat"
                    class="ml-2"
                >
                    {{ config.public.isDev ? 'Dev Mode' : '' }}
                </v-chip>
            </nuxt-link>
        </v-app-bar-title>

        <v-spacer v-if="mdAndUp"></v-spacer>

        <div class="d-flex flex-auto" v-if="mdAndUp">
            <!--            <v-btn icon-->
            <!--                   v-if="mdAndUp"-->
            <!--                   @click="searching ? search() : showSearch()"-->
            <!--            >-->
            <!--                <v-icon>mdi-magnify</v-icon>-->
            <!--            </v-btn>-->
            <v-expand-x-transition>
                <v-text-field
                    v-if="mdAndUp"
                    ref="searchField"
                    density="compact"
                    v-model="filter"
                    placeholder="Search Skins"
                    clearable
                    @keydown.enter="search()"
                    hide-details
                    single-line
                    min-width="20vw"
                />
            </v-expand-x-transition>
        </div>

        <v-spacer v-if="mdAndUp"></v-spacer>

        <v-tabs
            align-tabs="end"
            stacked
            :class="{'rainbow': rainbow }"
        >
            <v-tab :to="localePath('/')">
                <span v-if="mdAndUp">{{ $t("Generate") }}</span>
                <v-icon v-else icon="mdi-home"></v-icon>
            </v-tab>
            <v-tab :to="localePath('/skins')">
                <span v-if="mdAndUp">{{ $t("Gallery") }}</span>
                <v-icon v-else icon="mdi-image-search"></v-icon>
            </v-tab>
            <v-tab v-if="isHydrated" :to="localePath('/my-skins')">
                <span v-if="mdAndUp">{{ $t("My Skins") }}</span>
                <v-icon v-else icon="mdi-view-grid"></v-icon>
            </v-tab>
        </v-tabs>

        <v-divider v-if="mdAndUp" vertical class="mx-4 my-2"/>

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
                class="ml-2 user-avatar"
                :class="{'member':isMember}"
                color="info"
            >
                <a v-if="authStore.authed" class="img-link" href="https://account.mineskin.org"
                   @click.prevent="jobsDrawer = !jobsDrawer">
                    <v-img :src="authStore.user?.picture||PLACEHOLDER_HEAD" alt="User Avatar"></v-img>
                </a>
                <v-btn v-else icon @click="jobsDrawer = !jobsDrawer">
                    <a class="img-link text-white"
                       @click.prevent
                       href="https://account.mineskin.org/?utm_source=web&utm_medium=link&utm_campaign=nav_avatar">
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
import { computed, onMounted } from "vue";
import { PLACEHOLDER_HEAD } from "~/util/skin";

const config = useRuntimeConfig();

const localePath = useLocalePath();

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const queueStore = useQueueStore();

const isHydrated = ref(false);

const {smAndUp, mdAndUp} = useDisplay();

const {authed, grants} = storeToRefs(authStore);
const {jobsSorted, jobsDrawer, jobCount, pendingJobCount} = storeToRefs(queueStore);

const filter = ref(route.query?.search || '');

const search = () => {
    if (filter.value === '') {
        return;
    }
    router.push({
        path: '/skins',
        query: {
            search: filter.value
        },
        force: true,
    });
}

const isMember = computed(() => {
    return authed.value && grants.value?.ad_free; //TODO: use a separate grant for this
});

const plan = computed(() => {
    if (!authed.value) return null;
    if (!grants.value.plan) return null;
    if (grants.value.plan === 'free') return null;
    return grants.value.plan;
})

const rainbow = computed(() => {
    const date = new Date();
    const month = date.getUTCMonth();
    return month === 5 || month === 6;
});

onMounted(() => {
    isHydrated.value = true;
})

</script>