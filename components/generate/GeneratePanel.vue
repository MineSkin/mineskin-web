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
                @click.prevent="reset"
                icon="mdi-reload"
                tooltip="Reset Image Selection">
                Clear Images
            </action-link>
        </v-row>
        <v-divider class="my-4"/>
        <v-expand-transition v-if="isHydrated">
            <v-row v-show="generateType" class="my-2" justify="center">
                <v-spacer></v-spacer>
                <v-col cols="12" :md="optionsColSize">
                    <v-select
                        label="Visibility"
                        v-model="visibility"
                        :items="visibilities"
                        :item-props="visibilityProps"
                        hint="Visibility of the skin"
                        persistent-hint
                    />
                </v-col>
                <v-col cols="12" :md="optionsColSize">
                    <v-text-field
                        label="Name (optional)"
                        v-model="name"
                        :rules="nameRules"
                        persistent-hint
                    >
                        <template v-slot:details>
                            <span>Optional name for this skin, supports variables <a
                                @click.prevent="variablesDialog=true"
                                href="#">
                                <v-icon icon="mdi-help-circle"/></a></span>
                        </template>
                    </v-text-field>
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
                <v-col cols="12" :md="optionsColSize" v-if="canGenerateCapes">
                    <v-select
                        label="Cape (optional)"
                        v-model="cape"
                        :items="supportedCapes"
                        item-value="uuid"
                        item-title="alias"
                        hint="Cape to apply"
                        persistent-hint
                        clearable
                        placeholder="No Cape"
                    >
                        <template v-slot:append v-if="capePreview">
                            <div>
                                <cape-view :texture="capePreview"/>
                            </div>
                        </template>
                        <template v-slot:message>
                            <span>Optional cape to apply <v-chip text="EXPERIMENTAL" size="x-small" color="warning"
                                                                 variant="outlined"/></span>
                        </template>
                    </v-select>
                </v-col>
                <v-spacer></v-spacer>
                <!--                <v-col>-->
                <!--&lt;!&ndash;                    <SimplePreview :user="users[0]" :url="urls[0]" :file="uploadFiles[0]"/>&ndash;&gt;-->
                <!--                </v-col>-->
                <!--                <v-col class="text-center">-->
                <!--                -->
                <!--                </v-col>-->
                <!--                <v-col>-->
                <!--                    <v-row>-->
                <!--                      <v-col>-->
                <!--                          <v-text-field-->
                <!--                              label="Name (optional)"-->
                <!--                              v-model="name"-->
                <!--                              hint="Optional name for this skin"-->
                <!--                              persistent-hint-->
                <!--                          />-->
                <!--                      </v-col>-->
                <!--                    </v-row>-->
                <!--                    <v-row>-->
                <!--                     <v-col>-->
                <!--                         <v-select-->
                <!--                             label="Visibility"-->
                <!--                             v-model="visibility"-->
                <!--                             :items="Object.values(SkinVisibility2)"-->
                <!--                             :item-props="visibilityProps"-->
                <!--                             hint="Visibility of the skin"-->
                <!--                             persistent-hint-->
                <!--                         />-->
                <!--                     </v-col>-->
                <!--                    </v-row>-->
                <!--                    <v-row>-->
                <!--                      <v-col>-->
                <!--                          <v-select-->
                <!--                              label="Variant"-->
                <!--                              v-model="variant"-->
                <!--                              :items="Object.values(SkinVariant)"-->
                <!--                              :item-props="variantProps"-->
                <!--                              hint="Variant of the skin. Use unknown for auto-detect"-->
                <!--                              persistent-hint-->
                <!--                          />-->
                <!--                      </v-col>-->
                <!--                    </v-row>-->
                <!--                </v-col>-->
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
                                <span>
                                    Please <action-link href="https://account.mineskin.org/login?redirect=https://mineskin.org/">sign in</action-link> to generate multiple skins at once and to keep track of your skins.
                                </span>
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
    <v-dialog
        v-if="isHydrated"
        v-model="variablesDialog"
        width="auto"
    >
        <v-card
            max-width="400"
            prepend-icon="mdi-help-circle"
            title="Variables / Placeholders"
        >
            <template v-slot:text>
                <div>Names support variables that will get replaced with the matching values when you generate a skin.
                    This is especially useful when generating multiple skins at once.
                </div>
                <br/>
                <div>
                    <b>Available variables:</b><br/>
                    <ul>
                        <li><b>{index}</b> - The index of the image in the list</li>
                        <li><b>{user}</b> - The name/UUID of the user</li>
                        <li><b>{file}</b> - The file name (also works for URLs)</li>
                    </ul>
                </div>
                <br/>
                <div>
                    <b>Preview:</b><br/>
                    <span v-if="replacedNamesPreview.length<=0">Enter a name first</span>
                    <ul>
                        <li v-for="name in replacedNamesPreview">{{ name }}</li>
                    </ul>
                </div>
            </template>
            <template v-slot:actions>
                <v-btn
                    class="ms-auto"
                    text="Ok"
                    @click="variablesDialog = false"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">

import { GenerateType, type Maybe, SkinVariant, SkinVisibility2 } from "@mineskin/types";
import { useLazyAsyncData, useNuxtApp } from "nuxt/app";
import { useQueueStore } from "../../stores/queue";
import { computed, ref } from "vue";
import ActionLink from "../ActionLink.vue";
import GenerateUserSection from "./GenerateUserSection.vue";
import GenerateUploadSection from "./GenerateUploadSection.vue";
import GenerateUrlSection from "./GenerateUrlSection.vue";
import type { GenerateJobResponse } from "~/types/GenerateJobResponse";
import type { BasicCreditInfo } from "~/types/BasicCreditInfo";
import { sleep } from "~/util/misc";
import { useSettingsStore } from "~/stores/settings";
import { storeToRefs } from "pinia";
import { useGenerateStore } from "~/stores/generate";
import { fileFromJson, type FileJson, fileToJson } from "~/util/file";
import type { JobSource, WrappedJob } from "~/types/WrappedJob";
import type { SkinListResponse } from "~/types/SkinListResponse";
import type { CapeListResponse, KnownCape } from "~/types/CapeListResponse";
import type { GenerateOptions } from "~/types/GenerateOptions";
import CapeView from "~/components/skin/CapeView.vue";

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

watch(() => visibility.value, (value) => {
    preferredVisibility.value = value;
}, {immediate: true});

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
    return knownCapesRes?.value?.capes?.filter(c => c.supported) || [];
});
const capePreview = computed(() => {
    if (!cape.value) return undefined;
    const url = supportedCapes.value?.find(c => c.uuid === cape.value)?.url;
    return url?.replace('http://', 'https://');
})

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

const variablesDialog = ref(false);
const processNameVariables = (index: number, url: string | null, file: File | FileJson | null, user: string | null) => {
    const original = name.value;
    let replaced = original;

    replaced = replaced.replace(/{index}/g, index.toString());

    if (generateType.value === GenerateType.USER && user) {
        replaced = replaced.replace(/{user}/g, user);
    }
    if (generateType.value === GenerateType.UPLOAD && file) {
        replaced = replaced.replace(/{file}/g, file.name.replace('.png', ''));
    }
    if (generateType.value === GenerateType.URL && url) {
        const parsed = new URL(url);
        const filename = parsed.pathname.split('/').pop();
        if (filename) {
            replaced = replaced.replace(/{file}/g, filename.replace('.png', ''));
        }
    }

    return replaced;
}

const replacedNamesPreview = computed(() => {
    return Array.from({length: imageCount.value}, (_, i) => {
        return processNameVariables(i, urls.value[i] || null, uploadFiles.value[i] || null, users.value[i] || null);
    }).filter(name => name.length > 0);
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
    const filtered = files.filter(f => f.type.startsWith('image/png'));
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
                title: "Private",
                subtitle: canUsePrivateSkins.value ? "Visible to you only" : "Requires Basic subscription",
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


const canUsePrivateSkins = computed(() => {
    return authStore.authed && grants.value?.private_skins;
});
const canGenerateMultiple = computed(() => {
    return authStore.authed;
});
const canGenerateCapes = computed(() => {
    return authStore.authed && grants.value?.capes && generateType.value !== GenerateType.USER;
});

const optionsColSize = computed(() => {
    return canGenerateCapes.value ? 2 : 3;
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
                options.name = processNameVariables(index++, null, file, null);
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
                options.name = processNameVariables(index++, url, null, null);
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
                options.name = processNameVariables(index++, null, null, user);
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