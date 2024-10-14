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
                    <v-btn rounded @click="jobsDrawer = !jobsDrawer">
                        <v-badge
                            :content="queueStore?.jobs?.length"
                            floating
                            location="bottom right"
                        >
                            <v-icon icon="mdi-list-status"></v-icon>
                        </v-badge>
                        <v-tooltip
                            activator="parent"
                            location="bottom"
                        >Show Jobs</v-tooltip>
                    </v-btn>
                </template>

            </v-app-bar>
            <v-main style="--v-layout-top: 56px">
                <NuxtPage/>
            </v-main>
            <v-navigation-drawer
                v-model="jobsDrawer"
                location="end"
                temporary
            >
                <JobList class="my-2"/>
            </v-navigation-drawer>
        </v-app>
    </NuxtLayout>
</template>
<script setup lang="ts">
import { useAuthStore, useQueueStore } from "#imports";

const router = useRouter();
// const showNav = computed(()=>{
//     return router.currentRoute.value.path === "/"||router.currentRoute.value.path === "/gallery";
// })

const authStore = useAuthStore();
const queueStore = useQueueStore();

const jobsDrawer = ref(false);

onMounted(() => {
    authStore.checkAuth();
})
</script>