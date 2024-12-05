<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <h2>{{ $t("Export Skins") }}</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-data-table
                :items="skins"
                item-value="uuid"
                :headers="headers"
                v-model="selected"
                show-select
            >
                <template v-slot:item.timestamp="{item,index}">
                    <DateLocal :date="item.timestamp"/>
                </template>
                <template v-slot:item.texture="{item, index}">
                    <v-img
                        aspect-ratio="1"
                        height="48"
                        width="48"
                        :src="'https://mineskin.org/textures/'+item.texture"
                        class="d-inline-block"
                    ></v-img>
                    {{ item.texture }}
                </template>

                <template v-slot:footer.prepend>
                    <v-select
                        v-model="skinSource"
                        :items="sourceItems"
                        item-title="text"
                        item-value="value"
                        max-width="200"
                        hide-details
                        class="mx-2"
                    ></v-select>
                    <v-spacer/>
                </template>
            </v-data-table>
        </v-row>
        <v-row>
            <v-col cols="auto">
                <v-select
                    v-model="exportFormat"
                    :items="formats"
                    item-title="text"
                    item-value="value"
                    max-width="200"
                    hide-details
                    class="mx-2"
                ></v-select>
            </v-col>
            <v-col>
                <v-btn
                    class="my-2"
                    color="secondary"
                    :disabled="exporting||!selected.length"
                    :loading="exporting"
                    @click="doExport"
                    prepend-icon="mdi-download"
                >
                    Export
                </v-btn>
            </v-col>
        </v-row>
        <dbg :data="{selected,skinSource,exportFormat}"/>
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
import { useLazyAsyncData, useNuxtApp } from "#app";
import type { Maybe, SkinInfo2 } from "@mineskin/types";
import type { ListedSkin, SkinListResponse } from "~/types/SkinListResponse";
import { sleep } from "~/util/misc";

useHead({
    title: 'Export Skins'
});

const router = useRouter()

const {$mineskin, $notify} = useNuxtApp();

const headers = [
    {
        key: 'timestamp',
        title: 'Date'
    },
    {
        key: 'uuid',
        title: 'UUID'
    },
    {
        key: 'name',
        title: 'Name'
    },
    {
        key: 'texture',
        title: 'Texture'
    }
]
const selected = ref([]);

const sourceItems = [
    {text: 'My Skins', value: 'mine'},
    {text: 'Latest Skins', value: 'latest'}
]
const skinSource = ref('mine');

const formats = [
    {text: 'JSON', value: 'json'},
    {text: 'CSV', value: 'csv'}
];
const exportFormat = ref('json');

const {
    data: latestSkinsRes,
    refresh: refreshLatestSkins
} = useLazyAsyncData<SkinListResponse>(`latest-skins-export`, async () => {
    return (await $mineskin.skins.list(undefined, 100));
}, {
    immediate: false
});

const {
    data: mySkinsRes,
    refresh: refreshMySkins
} = useLazyAsyncData<SkinListResponse>(`my-skins-export`, async () => {
    return (await $mineskin.me.skins(undefined, 100));
}, {
    immediate: false
});

const skins = computed<ListedSkin[]>(() => {
    if (skinSource.value === 'latest') {
        return latestSkinsRes.value?.skins;
    }
    return mySkinsRes.value?.skins;
});

const exporting = ref(false);
const doExport = async () => {
    if (exporting.value) return;
    exporting.value = true;
    console.log('exporting', selected.value, exportFormat.value);
    $notify({
        text: `Exporting ${ selected.value.length } skins as ${ exportFormat.value }`,
        color: 'info',
        timeout: 1200
    });

    const str = await makeExportString();

    let blob: Blob;
    if (exportFormat.value === 'json') {
        blob = new Blob([str], {type: 'application/json'});
    } else if (exportFormat.value === 'csv') {
        blob = new Blob([str], {type: 'text/csv'});
    }

    const url = URL.createObjectURL(blob!);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mineskin-export.${ exportFormat.value }`;
    a.click();
    URL.revokeObjectURL(url);
    exporting.value = false;

}

const makeExportString = async (limit: number = -1) => {
    const loadedSkins: SkinInfo2[] = [];
    let i = 0;
    for (const uuid of selected.value) {
        const skinRes = await $mineskin.skins.get(uuid);
        console.log(skinRes);
        loadedSkins.push(skinRes.skin);
        await sleep(100);
        if (limit > 0 && i++ > limit) break;
    }

    console.log(loadedSkins);

    if (exportFormat.value === 'json') {
        return JSON.stringify(loadedSkins, null, 2);
    } else if (exportFormat.value === 'csv') {
        return 'Timestamp,UUID,Name,Variant,Value,Signature,Texture\n' + loadedSkins.map(skin => {
            const textureData = skin.texture.data;
            const textureHashes = skin.texture.hash;
            return `${ skin.generator.timestamp },${ skin.uuid },${ skin.name },${ skin.variant },${ textureData.value },${ textureData.signature },${ textureHashes.skin }`
        }).join('\n');
    }
    throw new Error('Invalid export format');
}

// const {
//     data: skins,
//     status: skinsStatus,
// } = await useLazyFetch(async () => {
//     return $mineskin.skins.list();
// });


onMounted(async () => {
    // await load({
    //     done: () => {
    //     }
    // })
    await refreshMySkins();
    await refreshLatestSkins();
})


</script>