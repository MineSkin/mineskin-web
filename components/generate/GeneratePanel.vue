<style scoped>
.section-col {
    transition: max-width 1s;
}

.section-upload, .section-url, .section-user {
    min-height: 180px;
}

.drop-area {
    transition: background-color .2s ease-in-out;
}
</style>
<template>
    <v-sheet
        rounded
        elevation="1"
        class="mx-auto px-4 pt-0 pb-4 drop-area"
        @dragover.prevent="onDragStart"
        @dragstart.prevent="onDragStart"
        @dragleave.prevent="onDragEnd"
        @drop.prevent="onDrop"
        :color="dragging ? 'secondary' : ''"
    >
        <h3 class="text-h6 mb-2 pt-1">
            <span class="d-inline-block pt-2">{{ $t("Generate New Skin Data") }}</span>
        </h3>
        <dbg :data="{generateType,generateType_,imageCount,cape,capePreview}"/>
        <v-row class="my-2 d-flex text-center"
               :justify="generateType === GenerateType.UPLOAD ? 'center':generateType===GenerateType.USER?'end':'start'">
            <v-col
                :cols="12"
                :md="!generateType ? 4:generateType === GenerateType.URL ? 6 : 'auto'"
                class="section-col"
                :class="{'mx-4':mdAndUp,'my-2':!mdAndUp}"
            >
                <GenerateUrlSection
                    class="section-url flex-column"
                    :class="{'d-flex':!generateType || generateType === GenerateType.URL}"
                    v-show="!generateType || generateType === GenerateType.URL"
                    v-model="urls"
                    @continue="generate"
                    :generating="generating"
                />
            </v-col>
            <v-divider :vertical="mdAndUp" v-show="!generateType"/>
            <v-col
                :cols="12"
                :md="!generateType?'':generateType === GenerateType.UPLOAD ? 4 : 4"
                class="section-col"
                :class="{'mx-4':mdAndUp,'my-2':!mdAndUp}"
            >
                <GenerateUploadSection
                    class="section-upload flex-column"
                    :class="{'d-flex':!generateType || generateType === GenerateType.UPLOAD}"
                    v-show="!generateType || generateType === GenerateType.UPLOAD"
                    v-model="uploadFiles"
                    @pick="showFilePicker()"
                    :generating="generating"
                />
            </v-col>
            <v-divider :vertical="mdAndUp" v-show="!generateType"/>
            <v-col
                :cols="12"
                :md="!generateType ? 4 : generateType === GenerateType.USER ? 6 : 'auto'"
                class="section-col"
                :class="{'mx-4':mdAndUp,'my-2':!mdAndUp}"
            >
                <GenerateUserSection
                    class="section-user flex-column"
                    :class="{'d-flex':!generateType || generateType === GenerateType.USER}"
                    v-show="!generateType || generateType === GenerateType.USER"
                    v-model="users"
                    @continue="generate"
                    :generating="generating"
                />
            </v-col>
        </v-row>
        <v-row dense justify="center" v-if="imageCount>0">
            <action-link
                class="mx-2"
                @click.prevent="reset"
                icon="mdi-reload"
                tooltip="Reset Image Selection">
                Clear Images
            </action-link>
            <action-link
                class="mx-2"
                @click.prevent="jobsDrawer = true"
                icon="mdi-list-status"
                tooltip="Show Jobs">
                Show Completed Jobs
            </action-link>
        </v-row>
        <v-divider class="my-4"/>
        <v-expand-transition v-if="isHydrated">
            <v-row v-show="generateType" class="my-2" justify="center">
                <v-spacer></v-spacer>
                <v-col cols="12" :md="optionsColSize">
                    <VisibilitySelect v-model="visibility"/>
                </v-col>
                <v-col cols="12" :md="optionsColSize">
                    <NameInput v-model="name" :generate-type="generateType!" :image-count="imageCount"/>
                </v-col>
                <v-col cols="12" :md="optionsColSize">
                    <v-select
                        label="Variant"
                        v-model="variant"
                        :items="Object.values(SkinVariant)"
                        :item-props="variantProps"
                        hint="Variant of the skin"
                        persistent-hint
                    />
                </v-col>
                <v-col cols="12" :md="optionsColSize" v-if="showCapeSelect">
                    <v-select
                        label="Cape (optional)"
                        v-model="cape"
                        :items="supportedCapes"
                        :item-props="capeProps"
                        hint="Cape to apply"
                        persistent-hint
                        clearable
                        placeholder="No Cape"
                    >
                        <template v-slot:item="{item,props}">
                            <v-list-item role="option" v-bind="props">
                                <template v-slot:prepend v-if="props.preview">
                                    <v-avatar>
                                        <cape-view :texture="props.preview"/>
                                    </v-avatar>
                                </template>
                            </v-list-item>
                        </template>
                        <template v-slot:append v-if="capePreview">
                            <div>
                                <cape-view :texture="capePreview"/>
                            </div>
                        </template>
                        <template v-slot:message>
                            <span>Optional cape to apply <v-chip text="BETA" size="x-small" color="warning"
                                                                 variant="outlined"/></span>
                        </template>
                    </v-select>
                </v-col>
                <v-spacer></v-spacer>
            </v-row>
        </v-expand-transition>
        <v-expand-transition v-if="isHydrated">
            <v-row v-show="generateType" class="my-4" justify="center">
                <v-col>
                    <dbg :data="wrappedJobMap"></dbg>
                    <v-row justify="center" class="mb-2 text-center">
                        <v-btn
                            color="primary"
                            :text="$t('Generate') + (waitTime>0?' ('+waitTime+')':'')"
                            size="x-large"
                            @click="generate"
                            :disabled="!canGenerate"
                            :loading="generating"
                        ></v-btn>
                    </v-row>
                    <v-row justify="center" class="mt-2 text-center">
                        <ClientOnly>
                            <CreditsStatus :generating="generating" :estimate="creditsEstimate"/>
                            <div v-if="generating">
                                <div>
                                    Your {{ imageCount > 1 ? 'skins are' : 'skin is' }} being generated...
                                </div>
                                <div>
                                    Check the
                                    <action-link @click.prevent="jobsDrawer = true" icon="mdi-list-status"
                                                 tooltip="Show Jobs">Job List
                                    </action-link>
                                    for progress,
                                    or
                                    <action-link @click.prevent="reset" icon="mdi-reload"
                                                 tooltip="Reset Image Selection">
                                        generate more skins
                                    </action-link>
                                    .
                                </div>
                            </div>
                            <div v-else-if="!authStore.authed">
                                <v-alert color="warning" variant="tonal" icon="mdi-alert-circle" class="mt-1">
                                    <template #text>
                                        Please
                                        <action-link
                                            href="https://account.mineskin.org/login?redirect=https://mineskin.org/"
                                        >
                                            sign in
                                        </action-link>
                                        <span v-if="imageCount > 1">to generate multiple skins at once and to keep track of your skins.</span>
                                        <span
                                            v-else>to keep track of your skins and to get access to higher limits.</span>
                                    </template>
                                </v-alert>
                            </div>
                            <div v-else-if="imageCount > 3">
                                <v-alert color="primary" variant="tonal" icon="mdi-information" class="mt-1">
                                    <template #title>
                                        Need to generate a lot of skins?
                                    </template>
                                    <template #text>
                                        Check out the
                                        <action-link
                                            href="https://account.mineskin.org/store?utm_source=web&utm_medium=ad&utm_campaign=generate_banner_upgrade"
                                            target="_blank"
                                            class="upgrade-text-gradient"
                                        >
                                            ✨ upgrade options
                                        </action-link>
                                        for higher limits and faster generation times!
                                    </template>
                                </v-alert>
                            </div>
                        </ClientOnly>
                    </v-row>
                </v-col>
            </v-row>
        </v-expand-transition>
        <!--        <v-row>-->
        <!--            <dbg :data="{users,uploadFiles,urls,generateType}"/>-->
        <!--        </v-row>-->
    </v-sheet>
</template>
<script setup lang="ts">

import { GenerateType, SkinVariant, SkinVisibility2 } from "@mineskin/types";
import { useLazyAsyncData, useNuxtApp } from "nuxt/app";
import { useQueueStore } from "../../stores/queue";
import { computed, ref } from "vue";
import ActionLink from "../ActionLink.vue";
import GenerateUserSection from "./GenerateUserSection.vue";
import GenerateUploadSection from "./GenerateUploadSection.vue";
import GenerateUrlSection from "./GenerateUrlSection.vue";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";
import { processNameVariables, sleep } from "~/util/misc";
import { useSettingsStore } from "~/stores/settings";
import { storeToRefs } from "pinia";
import { useGenerateStore } from "~/stores/generate";
import { fileFromJson, fileToJson } from "~/util/file";
import type { JobSource, WrappedJob } from "~/types/WrappedJob";
import type { CapeListResponse, KnownCape } from "~/types/CapeListResponse";
import type { GenerateOptions } from "~/types/GenerateOptions";
import CapeView from "~/components/skin/CapeView.vue";
import VisibilitySelect from "~/components/generate/options/VisibilitySelect.vue";
import NameInput from "~/components/generate/options/NameInput.vue";

const {$mineskin, $notify, $flags, $gtag} = useNuxtApp();

const isHydrated = ref(false);

const authStore = useAuthStore();
const queueStore = useQueueStore();
const settingsStore = useSettingsStore();

const {mdAndUp, mdAndDown} = useDisplay();

const {grants} = storeToRefs(authStore);
const {jobsDrawer, lastJobSubmit, wrappedJobMap} = storeToRefs(queueStore);

const {visibility: preferredVisibility} = storeToRefs(settingsStore);

const generateStore = useGenerateStore();
const {
    name,
    visibility,
    variant,
    cape,

    uploadFiles,
    urls,
    users,

    generating
} = storeToRefs(generateStore);


const generateType = computed(() => {
    if (!isHydrated.value) return undefined;
    if (urls.value.filter(url => url.length > 0).length > 0) {
        return GenerateType.URL;
    }
    if (users.value.filter(user => user.length > 0).length > 0) {
        return GenerateType.USER;
    }
    if (uploadFiles.value.length > 0) {
        return GenerateType.UPLOAD;
    }
});

const imageCount = computed(() => {
    if (!isHydrated.value) return 0;
    switch (generateType.value) {
        case GenerateType.UPLOAD:
            return uploadFiles.value.length;
        case GenerateType.URL:
            return urls.value.filter(url => url.length > 0).length;
        case GenerateType.USER:
            return users.value.filter(user => user.length > 0).length;
    }
    return 0;
});

const creditsEstimate = computed(() => {
    return imageCount.value + (cape.value ? 1 : 0);
});

const generateType_ = computed(() => generateType.value);

const waitTime = ref(0);


//TODO: limit number of images


const visibilities = ref<SkinVisibility2[]>([SkinVisibility2.PUBLIC, SkinVisibility2.UNLISTED]);

const {
    data: knownCapesRes,
    refresh: refreshKnownCapes,
} = useLazyAsyncData<CapeListResponse>(`known-capes`, async () => {
    return (await $mineskin.capes.list());
});

const supportedCapes = computed<KnownCape[]>(() => {
    const supported: KnownCape[] = knownCapesRes?.value?.capes?.filter(c => c.supported) || [];
    // sort by name
    supported.sort((a, b) => {
        if (a.alias < b.alias) return -1;
        if (a.alias > b.alias) return 1;
        return 0;
    });
    return supported;
});
const capePreviewFor = (cape: KnownCape) => {
    if (!cape) return undefined;
    const match = supportedCapes.value?.find(c => c.uuid === cape.uuid);
    if (match?.hash) {
        return 'https://mineskin.org/textures/' + match.hash;
    }
    return match?.url?.replace('http://', 'https://');
}
const capePreview = computed(() => {
    if (!cape.value) return undefined;
    const match = supportedCapes.value?.find(c => c.uuid === cape.value);
    if (match?.hash) {
        return 'https://mineskin.org/textures/' + match.hash;
    }
    return match?.url?.replace('http://', 'https://');
});

const nameRules = [
    (v: string) => v.length <= 24 || 'Max 24 characters',
    (v: string) => /^[a-zA-Z0-9_.\-{} ]*$/g.test(v) || 'Only a-z, 0-9, _-.{} allowed'
];

watch(() => imageCount.value, (value) => {
    if (value > 1 && !canGenerateMultiple.value) {
        $notify({
            text: 'Please sign in to generate multiple skins at once',
            color: 'warning'
        });
        return;
    }
});

const showCreditsInfo = computed(() => $flags.hasFeature('web.credits.show_info'));

const dragging = ref(false);

const onDragStart = (e: DragEvent) => {
    dragging.value = true;
};
const onDragEnd = (e: DragEvent) => {
    dragging.value = false;
};

function onDrop(e: DragEvent) {
    dragging.value = false;
    if (!e.dataTransfer) return;
    const files = Array.from(e.dataTransfer.files);
    console.log(files);
    collectUploadedFiles(files);
}

function showFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png';
    input.multiple = true;
    input.onchange = (e) => {
        if (!input.files) return;
        collectUploadedFiles(Array.from(input.files));
    };
    input.click();
}


function collectUploadedFiles(files: File[]) {
    const filtered = files.filter(f => {
        if (!f.type.startsWith('image/png')) {
            $notify({
                text: `Only PNG images are allowed, but got ${ f.type }`,
                color: 'warning'
            });
            return false;
        }
        if (f.size <= 0) {
            $notify({
                text: `File is empty`,
                color: 'warning'
            });
            return false;
        }
        if (f.size > 20000) {
            $notify({
                text: `File is too large. maximum size is 20KB, but got ${ (f.size / 1024).toFixed(2) }KB`,
                color: 'warning'
            });
            return false;
        }
        return true;
    });
    if (files.length <= 0) {
        $notify({
            text: 'No valid image files found',
            color: 'warning'
        })
        return;
    }
    Promise.all(filtered.map(f => fileToJson(f))).then(mapped => {
        uploadFiles.value.push(...mapped);
    });
}


function visibilityProps(item: SkinVisibility2) {
    switch (item) {
        case SkinVisibility2.PUBLIC:
            return {
                prependIcon: "mdi-earth",
                title: "Public",
                subtitle: "Visible to everyone"
            };
        case SkinVisibility2.UNLISTED:
            return {
                prependIcon: "mdi-link",
                title: "Unlisted",
                subtitle: "Visible to anyone with the link"
            };
        case SkinVisibility2.PRIVATE:
            return {
                prependIcon: "mdi-eye-off",
                appendIcon: !canUsePrivateSkins.value ? 'mdi-lock' : '',
                title: canUsePrivateSkins.value ? "Private ✨" : "Private ✨ - Requires Subscription",
                subtitle: "Visible to you only",
                disabled: !canUsePrivateSkins.value
            };
    }
}

function variantProps(item: SkinVariant) {
    switch (item) {
        case SkinVariant.CLASSIC:
            return {
                title: "Classic",
                subtitle: "Classic skin"
            };
        case SkinVariant.SLIM:
            return {
                title: "Slim",
                subtitle: "Slim skin"
            };
        case SkinVariant.UNKNOWN:
            return {
                title: "Auto",
                subtitle: "Auto-detect"
            };
    }
}

function capeProps(item: KnownCape) {
    return {
        title: item.alias + " ✨",
        value: item.uuid,
        disabled: !canGenerateCapes.value,
        subtitle: canGenerateCapes.value ? '' : 'Requires Basic Subscription',
        appendIcon: !canUsePrivateSkins.value ? 'mdi-lock' : '',
        preview: capePreviewFor(item)
    }
}

const isMember = computed(() => {
    return authStore.authed && authStore.grants?.ad_free; //TODO: use a separate grant for this
});

const canUsePrivateSkins = computed(() => {
    return authStore.authed && grants.value?.private_skins;
});
const canGenerateMultiple = computed(() => {
    return authStore.authed;
});
const canGenerateCapes = computed(() => {
    return authStore.authed && grants.value?.capes && generateType.value !== GenerateType.USER;
});

const showCapeSelect = computed(() => {
    return authStore.authed && generateType.value !== GenerateType.USER;
})
const optionsColSize = computed(() => {
    return showCapeSelect.value ? 2 : 3;
})

function reset() {
    uploadFiles.value = [];
    urls.value = [''];
    users.value = [''];
    name.value = '';
    visibility.value = preferredVisibility.value || SkinVisibility2.PUBLIC;
    variant.value = SkinVariant.UNKNOWN;
    generating.value = false;
    refreshWaitTime();
}

function getOptions(): GenerateOptions {
    return {
        visibility: visibility.value,
        variant: variant.value || undefined,
        name: name.value,
        cape: cape.value
    }
}

const canGenerate = computed(() => {
    return imageCount.value > 0 && !generating.value && waitTime.value <= 0;
});

async function handleQueueResponse(response: GenerateJobResponse, source: JobSource, index: number) {
    if (response.success) {
        if ('job' in response) {
            const wrapped: WrappedJob = {
                source: source,
                job: (response as GenerateJobResponse).job,
                check: {
                    last: Date.now(),
                    count: 0
                }
            };
            queueStore.addJob(wrapped);

            if (response.job.status === 'completed' || index % 2 === 0) {
                queueStore.updateSortedJobs();
            }

            const interval = Math.max(60 / (authStore.grants?.per_minute as number || 20), 0.5);
            if (response.job.status === 'completed') {
                await sleep(interval * 0.5);
            } else {
                await sleep(interval * 0.8);
            }
        }
    }
}

async function generate() {
    console.log('generate');
    if (imageCount.value > 1 && !canGenerateMultiple.value) {
        $notify({
            text: 'Please sign in to generate multiple skins at once',
            color: 'warning'
        });
        return;
    }
    generating.value = true;
    await sleep(100);


    try {
        // 1, 2-4, 4-8, 8-10, 10+
        let skinCountBucket = '1';
        if (imageCount.value >= 10) {
            skinCountBucket = '10+';
        } else if (imageCount.value >= 8) {
            skinCountBucket = '8-10';
        } else if (imageCount.value >= 4) {
            skinCountBucket = '4-8';
        } else if (imageCount.value >= 2) {
            skinCountBucket = '2-4';
        }
        $gtag('event', 'generate_skins', {
            generate_type: generateType.value,
            skin_count: imageCount.value,
            skin_count_bucket: skinCountBucket,
            multiple_allowed: `${ canGenerateMultiple.value }`,
            skin_visibility: visibility.value,
            skin_variant: variant.value,
            is_anonymous: `${ !authStore.authed }`,
            skin_cape: cape.value
        })
    } catch (e) {
        console.error(e);
    }

    const baseOptions: GenerateOptions = getOptions();

    // let responses: [GenerateJobResponse, JobSource][] = [];
    switch (generateType.value) {
        case GenerateType.UPLOAD: {
            if (!canGenerateMultiple.value) {
                uploadFiles.value = [uploadFiles.value[0]];
            }
            let index = 0;
            for (const file of uploadFiles.value) {
                let options = {...baseOptions};
                options.name = processNameVariables(name.value, generateType.value, index++, null, file, null);
                await sleep(100);
                lastJobSubmit.value = Date.now();
                const source: JobSource = {
                    type: 'file',
                    content: file,
                    name: file.name
                };
                //responses.push([await $mineskin.queue.upload(await fileFromJson(file), options), source]);
                await handleQueueResponse(
                    await $mineskin.queue.upload(await fileFromJson(file), options),
                    source,
                    index
                )
            }
            break;
        }
        case GenerateType.URL: {
            if (!canGenerateMultiple.value) {
                urls.value = [urls.value[0]];
            }
            let index = 0;
            for (const url of urls.value) {
                let options = {...baseOptions};
                options.name = processNameVariables(name.value, generateType.value, index++, url, null, null);
                await sleep(100);
                lastJobSubmit.value = Date.now();
                const source: JobSource = {
                    type: 'url',
                    content: url,
                    name: url
                }
                // responses.push([await $mineskin.queue.url(url, options), source])
                await handleQueueResponse(
                    await $mineskin.queue.url(url, options),
                    source,
                    index
                )
            }
            break;
        }
        case GenerateType.USER: {
            if (!canGenerateMultiple.value) {
                users.value = [users.value[0]];
            }
            let validated: string[][] = [];
            for (let user of users.value) {
                if (user.length < 32) {
                    const {valid, uuid} = await $mineskin.validate.name(user);
                    if (!valid) {
                        $notify({
                            text: `Invalid user: ${ user }`,
                            color: 'warning'
                        });
                        continue;
                    }
                    validated.push([user, uuid!]);
                }
            }
            //users.value = validated;
            let index = 0;
            for (const [user, uuid] of validated) {
                let options = {...baseOptions};
                options.name = processNameVariables(name.value, generateType.value, index++, null, null, user);
                await sleep(100);
                lastJobSubmit.value = Date.now();
                const source: JobSource = {
                    type: 'user',
                    content: uuid,
                    name: user
                }
                //responses.push([await $mineskin.queue.user(uuid, options), source])
                await handleQueueResponse(
                    await $mineskin.queue.user(uuid, options),
                    source,
                    index
                )
            }
            break;
        }
        default: {
            $notify({
                text: 'No valid input found',
                color: 'warning'
            });
            generating.value = false;
            return;
        }
    }
    // for (const [response, source] of responses) {
    //     if (response.success) {
    //         if ('job' in response) {
    //             const wrapped: WrappedJob = {
    //                 source: source,
    //                 job: (response as GenerateJobResponse).job,
    //                 check: {
    //                     last: Date.now(),
    //                     count: 0
    //                 }
    //             };
    //             queueStore.addJob(wrapped);
    //         }
    //     }
    // }
    queueStore.updateSortedJobs();

    await sleep(2000);
    generating.value = false;
    refreshWaitTime();
}

const refreshWaitTime = () => {
    if (authStore.authed) {
        waitTime.value = 0;
        return;
    }
    waitTime.value = Math.max(0, 6 - (Math.ceil(Date.now() / 1000) - Math.ceil(lastJobSubmit.value / 1000)));
    if (waitTime.value > 0) {
        setTimeout(() => {
            refreshWaitTime();
        }, 1000);
    }
}

watch(generateType, () => {
    console.debug('generateType', generateType.value);
}, {immediate: true})

onMounted(async () => {
    isHydrated.value = true;
    try {
        if ($flags.hasFeature('web.visibility.private')) {
            visibilities.value.push(SkinVisibility2.PRIVATE);
        }
    } catch (e) {
        console.error(e);
    }
    refreshWaitTime();
})

</script>