<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2>{{ $t("My Skins") }}</h2>
            </v-col>
        </v-row>
        <v-infinite-scroll :items="skins" :onLoad="load" style="overflow: hidden">
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

useHead({
    title: 'My Skins'
});

const router = useRouter()

const {$mineskin} = useNuxtApp();

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
    await load({
        done: () => {
        }
    })
})


</script>