<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <h2>{{ $t("My Skins") }}</h2>
            </v-col>
            <v-spacer/>
            <v-col cols="auto">
                <v-btn v-if="legacySkins || mySkins" @click="showLocal=!showLocal" color="secondary" class="mx-2">
                    Toggle Local Skins
                </v-btn>
                <v-btn v-if="authStore.authed" :to="localePath('/export')" color="primary" class="mx-2">Export Skins
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-if="!authStore.authed" justify="center">
            <v-col cols="auto">
                <v-alert type="warning" @click.prevent="loginRedirect">
                    <template #text>
                        <a href="https://account.mineskin.org" class="text-blue-lighten-4">Sign in</a> to view your
                        skins
                    </template>
                </v-alert>
            </v-col>
        </v-row>
        <v-infinite-scroll v-else-if="!showLocal" :items="skins" :onLoad="load" style="overflow: hidden">
            <v-row justify="center" dense>
                <template v-for="(item, index) in skins" :key="item">
                    <!--                    <v-col cols="4" sm="3" md="2">-->
                    <v-col
                        cols="5"
                        xs="5"
                        sm="3"
                        md="2"
                        lg="2"
                        xl="1"
                        class="gallery-item-group ma-2"
                    >
                        <skin-link-card :skin="item"/>
                    </v-col>
                    <!--                    </v-col>-->
                </template>
            </v-row>
            <template v-slot:empty>
                <div class="text-center">
                    <div>No more results</div>
                    <div v-if="!unlimitedHistory" class="mt-4">
                        <v-alert color="primary" variant="tonal" icon="mdi-information" class="mt-1">
                            <template #text>
                                <action-link
                                    href="https://account.mineskin.org/store?utm_source=web&utm_medium=button&utm_campaign=skin_history_unlimited"
                                    target="_blank"
                                    class="upgrade-text-gradient"
                                >
                                    ✨ Upgrade
                                </action-link>
                                to view older skins
                            </template>
                        </v-alert>
                    </div>
                </div>
            </template>
        </v-infinite-scroll>
        <v-row v-if="showLocal && (legacySkins || mySkins)" class="mt-4">
            <v-divider class="my-2"/>
            <v-col cols="12" md="6" v-if="legacySkins && legacySkins.length > 0">
                <h3>Legacy Skins</h3>
                <span class="text-medium-emphasis">Skins stored in your browser that may not be linked to your account (e.g. from the classic website)</span>
                <v-list density="compact">
                    <v-list-item v-for="skin in legacySkins" :key="skin">
                        <template v-slot:title>
                            <NuxtLink :to="localePath('/skins/'+skin)">
                                {{ skin }}
                            </NuxtLink>
                        </template>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="12" md="6" v-if="mySkins && mySkins.length > 0">
                <h3>Local Skins</h3>
                <span class="text-medium-emphasis">Skins stored in your browser that may not be linked to your account (e.g. generated without being logged in)</span>
                <v-list density="compact">
                    <v-list-item v-for="skin in mySkins" :key="skin">
                        <template v-slot:title>
                            <NuxtLink :to="localePath('/skins/'+skin)">
                                {{ skin }}
                            </NuxtLink>
                        </template>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
        <!--            <v-col v-for="skin in skins">-->
        <!--                <v-card>-->
        <!--                    <v-card-text>-->
        <!--                        {{ skin }}-->
        <!--                    </v-card-text>-->
        <!--                </v-card>-->
        <!--            </v-col>-->
    </v-container>
</template>
<script setup lang="ts">
import { useNuxtApp } from "#app";
import { useSkinStore } from "#imports";
import { computed, onMounted } from "vue";
import ActionLink from "~/components/ActionLink.vue";

useHead({
    title: 'My Skins'
});

const localePath = useLocalePath();

const router = useRouter()

const {$mineskin} = useNuxtApp();

const authStore = useAuthStore();

const skinStore = useSkinStore();
const {mySkins, legacySkins} = storeToRefs(skinStore);

const showLocal = ref(false);

const loginRedirect = () => {
    authStore.reset();
    setTimeout(() => {
        window.location.href = 'https://account.mineskin.org/login?redirect=https://mineskin.org/my-skins';
    }, 100);
}

const unlimitedHistory = computed(() => authStore.grants?.skin_history_unlimited);

// const {
//     data: skins,
//     status: skinsStatus,
// } = await useLazyFetch(async () => {
//     return $mineskin.skins.list();
// });

const skins = ref([]);
const after = ref<string | null>(null);
const hasNext = ref(true);

async function api() {
    if (!hasNext.value) return [];
    const response = await $mineskin.me.skins(after.value);
    console.debug(response);
    const skins = response?.skins || [];
    hasNext.value = skins.length >= 16;
    if (hasNext.value) {
        let nextAfter = skins[skins.length - 1].uuid!;
        // hacky "fix" for a weird edge-case where the gallery infinitely shows the same set of skins
        if (nextAfter === after.value) {
            console.warn("nextAfter == after", nextAfter, after.value);
            nextAfter = skins[skins.length - 2].uuid!
        }
        after.value = nextAfter;

        // preload next
        $mineskin.me.skins(after.value);
    }
    return skins;
}

async function load({done}) {
    if (!authStore.authed) return;
    console.debug('load')
    // Perform API call
    const res = await api();
    if (res.length === 0) {
        done('empty');
        return;
    }

    skins.value.push(...res);

    done('ok')
}

onMounted(async () => {
    if (process.client) {
        try {
            const legacyStorageStr = localStorage.getItem("ngStorage-recentSkins");
            if (legacyStorageStr) {
                localStorage.setItem("ngStorage-recentSkins-legacy", legacyStorageStr);
                console.info("Migrating legacy skin storage");
                const parsed = JSON.parse(legacyStorageStr);
                for (let id of parsed) {
                    skinStore.addLegacySkin(id);
                }
                localStorage.removeItem("ngStorage-recentSkins");
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (!(await authStore.checkAuth())?.authenticated) return;
})


</script>