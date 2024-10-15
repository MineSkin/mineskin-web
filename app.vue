<style>
.img-link{
    width: 100%;
    height: 100%;
}
</style>
<template>
    <NuxtLayout>
        <v-app>
            <Snackbars/>
            <v-app-bar density="comfortable" class="px-4">
                <v-app-bar-title>
                    MineSkin
                    <v-btn icon>
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                </v-app-bar-title>

                <v-spacer></v-spacer>

                <v-tabs
                    align-tabs="center"
                >
                    <v-tab to="/">Generate</v-tab>
                    <v-tab to="/gallery">Gallery</v-tab>
                </v-tabs>

                <v-divider vertical class="mx-4 my-2"/>

                <template v-slot:append>
                    <v-btn icon @click="queueStore.jobsDrawer = !queueStore.jobsDrawer">
                        <component :is="queueStore?.jobs?.length>0?'v-badge':'div'"
                            :content="queueStore?.jobs?.length"
                            location="bottom right"
                        >
                            <v-icon icon="mdi-list-status"></v-icon>
                        </component>
                        <v-tooltip
                            activator="parent"
                            location="bottom"
                        >
                            Show Jobs
                        </v-tooltip>
                    </v-btn>


                    <v-avatar
                        class="ml-2"
                        color="info"
                    >
                        <a  v-if="authStore.authed" class="img-link" href="https://account.mineskin.org">
                            <v-img :src="authStore.user?.picture" alt="User Avatar"></v-img>
                            <v-tooltip
                                activator="parent"
                                location="bottom"
                            >
                                Go to Account
                            </v-tooltip>
                        </a>
                        <v-btn v-else  icon>
                            <a class="img-link text-white" href="https://account.mineskin.org">
                                <v-icon>mdi-account</v-icon>
                                <v-tooltip
                                    activator="parent"
                                    location="bottom"
                                >
                                    Sign In
                                </v-tooltip>
                            </a>
                        </v-btn>
                    </v-avatar>
                </template>

            </v-app-bar>
            <v-main style="--v-layout-top: 56px">
                <NuxtPage/>
            </v-main>
            <v-navigation-drawer
                v-model="queueStore.jobsDrawer"
                location="end"
                temporary
            >
                <JobList class="my-2"/>
            </v-navigation-drawer>
        </v-app>
    </NuxtLayout>
</template>
<script setup lang="ts">

import { useAuthStore } from "~/stores/auth";
import { useQueueStore } from "~/stores/queue";

const runtimeConfig = useRuntimeConfig();

const router = useRouter();
// const showNav = computed(()=>{
//     return router.currentRoute.value.path === "/"||router.currentRoute.value.path === "/gallery";
// })

const authStore = useAuthStore();
const queueStore = useQueueStore();

onBeforeMount(() => {
    authStore.checkAuth();
})
</script>