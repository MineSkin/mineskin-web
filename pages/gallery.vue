<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h2>Skin Gallery</h2>
            </v-col>
        </v-row>
        <v-infinite-scroll :items="skins" :onLoad="load" style="overflow: hidden">
            <v-row justify="center">
                <template v-for="(item, index) in skins" :key="item">
                    <!--                    <v-col cols="4" sm="3" md="2">-->
                    <div v-if="item.ad"
                         style="max-height: 1200px;width:min(390px,max(180px,40vmin));">
                        <ad-wrappper
                            ad-format="fluid"
                            ad-layout-key="+1i+s2-10-1k+6v"
                            ad-slot="3361952161"
                        />
                    </div>
                    <skin-link-card v-else class="ma-2" :skin="item"/>
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
import type { Maybe } from "@mineskin/types";
import type { ListedSkin } from "~/types/SkinListResponse";

useHead({
    title: 'Gallery'
});

const router = useRouter()

const {$mineskin, $flags} = useNuxtApp();

const filter = computed<string>(() => {
    return router.currentRoute.value.query.filter || '';
})

// const {
//     data: skins,
//     status: skinsStatus,
// } = await useLazyFetch(async () => {
//     return $mineskin.skins.list();
// });

const skins = ref<ListedSkin[]>([]);
const after = ref<string | null>(null);
const hasNext = ref(true);

async function api() {
    if (!hasNext.value) return [];
    const response = await $mineskin.skins.list(after.value, undefined, filter.value);
    console.debug(response);
    const skins = response?.skins || [];
    hasNext.value = skins.length > 0;
    if (skins.length > 0) {
        after.value = skins[skins.length - 1].uuid!;
        if (inlineAdRate.value != 0 && Math.random() < inlineAdRate.value) {
            skins.splice(Math.floor(Math.random() * skins.length), 0, {uuid: '', ad: true});
        }
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

const inlineAdRate = computed(() => Number($flags.getValue('web.ads.gallery_inline_rate', {
    fallback: .5
})));

onMounted(async () => {
    await load({
        done: () => {
        }
    })
})


</script>