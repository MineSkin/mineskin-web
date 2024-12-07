<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <h2>{{ $t("My Skins") }}</h2>
            </v-col>
            <v-spacer/>
            <v-col cols="auto">
                <v-btn v-if="authStore.authed" :to="localePath('/export')" color="secondary">Export Skins</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="!authStore.authed" justify="center">
            <v-col cols="auto">
                <v-alert type="warning" text="Sign in to view your skins"></v-alert>
            </v-col>
        </v-row>
        <v-infinite-scroll v-else :items="skins" :onLoad="load" style="overflow: hidden">
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
        </v-infinite-scroll>
        <v-row v-if="mySkins && mySkins.length > 0" class="mt-4">
            <v-divider class="my-2"/>
            <v-col>
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
import { onMounted } from "vue";

useHead({
    title: 'My Skins'
});

const localePath = useLocalePath();

const router = useRouter()

const {$mineskin} = useNuxtApp();

const authStore = useAuthStore();

const skinStore = useSkinStore();
const {mySkins, legacySkins} = storeToRefs(skinStore);

// const {
//     data: skins,
//     status: skinsStatus,
// } = await useLazyFetch(async () => {
//     return $mineskin.skins.list();
// });

const skins = ref([]);
const after = ref(null);
const hasNext = ref(true);

async function api() {
    if (!hasNext.value) return [];
    const response = await $mineskin.me.skins(after.value);
    console.debug(response);
    const skins = response?.skins || [];
    hasNext.value = skins.length > 0;
    if (skins.length > 0) {
        after.value = skins[skins.length - 1].uuid;
    }
    return skins;
    // return new Promise(resolve => {
    //     setTimeout(() => {
    //         resolve(Array.from({ length: 10 }, (k, v) => v + items.value.at(-1) + 1))
    //     }, 1000)
    // })
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