<template>
    <v-container>
        {{ hasNext }}
        {{ after }}

        <v-infinite-scroll :items="skins" :onLoad="load">
            <v-row>
                <template v-for="(item, index) in skins" :key="item">
                    <v-col cols="2">
                        <v-sheet @click="viewSkin(item.uuid)">
                            <v-img
                                lazy-src="/img/questionhead.png"
                                :src="renderSkinHead(item.texture)"
                                aspect-ratio="1"
                            />
                            {{ item.uuid.substring(0,8) }}
                        </v-sheet>
                    </v-col>
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
import { renderSkinHead } from "~/util/render";

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
    const response = await $mineskin.skins.list(after.value);
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
    await load({done: () => {}})
})


function viewSkin(uuid: string) {
    console.debug('viewSkin', uuid);
    router.push(`/${uuid}`);
}

</script>