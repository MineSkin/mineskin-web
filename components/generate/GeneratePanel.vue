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
            Generate New Skin Data
        </h3>
        <v-row class="my-2 d-flex text-center"
               :justify="generateType === GenerateType.UPLOAD ? 'center':generateType===GenerateType.USER?'end':'start'">
            <v-col
                :cols="!generateType ? 4:generateType === GenerateType.URL ? 6 : 'auto'"
                class="mx-4 section-col"
            >
                <GenerateUrlSection
                    class="section-url flex-column"
                    :class="{'d-flex':!generateType || generateType === GenerateType.URL}"
                    v-show="!generateType || generateType === GenerateType.URL"
                    v-model="urls"
                    @continue="generate"
                />
            </v-col>
            <v-divider vertical v-show="!generateType"/>
            <v-col
                class="mx-4 section-col"
                :cols="!generateType?'':generateType === GenerateType.UPLOAD ? 4 : 4"
            >
                <GenerateUploadSection
                    class="section-upload flex-column"
                    :class="{'d-flex':!generateType || generateType === GenerateType.UPLOAD}"
                    v-show="!generateType || generateType === GenerateType.UPLOAD"
                    v-model="uploadFiles"
                    @pick="showFilePicker()"
                />
            </v-col>
            <v-divider vertical v-show="!generateType"/>
            <v-col
                :cols="!generateType ? 4 : generateType === GenerateType.USER ? 6 : 'auto'"
                class="mx-4 section-col"
            >
                <GenerateUserSection
                    class="section-user flex-column"
                    :class="{'d-flex':!generateType || generateType === GenerateType.USER}"
                    v-show="!generateType || generateType === GenerateType.USER"
                    v-model="users"
                    @continue="generate"
                />
            </v-col>
        </v-row>
        <v-divider class="my-4"/>
        <v-expand-transition>
            <v-row v-show="generateType" class="my-2" justify="center">
                <v-spacer></v-spacer>
                <v-col>
                    <v-select
                        label="Visibility"
                        v-model="visibility"
                        :items="visibilities"
                        :item-props="visibilityProps"
                        hint="Visibility of the skin"
                        persistent-hint
                    />
                </v-col>
                <v-col>
                    <v-text-field
                        label="Name (optional)"
                        v-model="name"
                        hint="Optional name for this skin"
                        persistent-hint
                    />
                </v-col>
                <v-col>
                    <v-select
                        label="Variant"
                        v-model="variant"
                        :items="Object.values(SkinVariant)"
                        :item-props="variantProps"
                        hint="Variant of the skin"
                        persistent-hint
                    />
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
        <v-expand-transition>
            <v-row v-show="generateType" class="my-4" justify="center">
                <v-col>
                    <v-row justify="center" class="mb-2 text-center">
                        <v-btn
                            color="primary"
                            text="Generate"
                            size="x-large"
                            @click="generate"
                            :disabled="generating"
                        ></v-btn>
                    </v-row>
                    <v-row justify="center" class="mt-2 text-center">
                        <div v-if="showCreditsInfo && !generating && (credits && credits.balance>0)">
                            <span>This request will consume {{ imageCount || 1 }} {{ imageCount>1?'credits':'credit' }} if the skin is successfully generated.</span><br/>
                            <span>You have {{ credits?.balance }} {{ credits?.type }} credits remaining.</span>
                        </div>
                        <div v-else-if="showCreditsInfo && !generating">
                            <span>You do not have any credits remaining.</span><br/>
                            <span>This skin may take longer to generate.</span>
                        </div>
                        <div v-if="generating">
                            <div>
                                Your {{ imageCount > 1 ? 'skins are' : 'skin is' }} being generated...
                            </div>
                            <div>
                                Check the
                                <action-link @click.prevent="queueStore.jobsDrawer = true" icon="mdi-list-status"
                                             tooltip="Show Jobs">Job List
                                </action-link>
                                for progress,
                                or
                                <action-link @click.prevent="reset" icon="mdi-reload" tooltip="Reset Image Selection">
                                    generate more skins
                                </action-link>
                                .
                            </div>
                        </div>
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

const {$mineskin, $notify, $flags} = useNuxtApp();

const authStore = useAuthStore();
const queueStore = useQueueStore();

const {
    data: credits,
    status: creditsStatus,
} = useLazyAsyncData<BasicCreditInfo>("credits", async () => {
    return (await $mineskin.me.credits())?.credit;
});


const generateType = computed<Maybe<GenerateType>>(() => {
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

//TODO: limit number of images

const uploadFiles = ref<File[]>([]);
const urls = ref<string[]>(['']);
const users = ref<string[]>(['']);

const visibilities = [SkinVisibility2.PUBLIC, SkinVisibility2.UNLISTED];

const name = ref('');
const visibility = ref(SkinVisibility2.PUBLIC);
const variant = ref(SkinVariant.UNKNOWN);

const imageCount = computed(() => {
    switch (generateType.value) {
        case GenerateType.UPLOAD:
            return uploadFiles.value.length;
        case GenerateType.URL:
            return urls.value.filter(url => url.length > 0).length;
        case GenerateType.USER:
            return users.value.filter(user => user.length > 0).length;
    }
    return 0;
})

const canUsePrivateSkins = computed(() => {
    return authStore.authed && authStore.grants?.private_skins;
});

const showCreditsInfo = computed(() => $flags.hasFeature('web.credits.show_info'));

const generating = ref(false);

const dragging = ref(false);

const onDragStart = (e: DragEvent) => {
    console.log(e.type, e);
    dragging.value = true;
};
const onDragEnd = (e: DragEvent) => {
    console.log(e.type, e);
    dragging.value = false;
};

function onDrop(e: DragEvent) {
    console.log(e.type, e);
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
    uploadFiles.value.push(...filtered);
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

function reset() {
    uploadFiles.value = [];
    urls.value = [''];
    users.value = [''];
    name.value = '';
    visibility.value = SkinVisibility2.PUBLIC; // TODO: persist preferred visibility
    variant.value = SkinVariant.UNKNOWN;
    generating.value = false;
}

async function generate() {
    console.log('generate');
    generating.value = true;
    await sleep(100);
    let response;
    switch (generateType.value) {
        case GenerateType.UPLOAD:
            //TODO: actually process all images
            response = await $mineskin.queue.upload(uploadFiles.value[0], {
                visibility: visibility.value,
                variant: variant.value || undefined,
                name: name.value
            });
            if (response.success) {
                if ('job' in response) {
                    queueStore.addJob((response as GenerateJobResponse).job);
                }
            }
            break;
        case GenerateType.URL:
            response = await $mineskin.queue.url(urls.value[0], {
                visibility: visibility.value,
                variant: variant.value || undefined,
                name: name.value
            });
            if (response.success) {
                if ('job' in response) {
                    queueStore.addJob((response as GenerateJobResponse).job);
                }
            }
            break;
        case GenerateType.USER:
            $notify({
                text: 'User generation not yet implemented',
                color: 'warning'
            });
            break;
    }
}

onMounted(() => {
    if ($flags.hasFeature('web.visibility.private')) {
        visibilities.push(SkinVisibility2.PRIVATE);
    }
})

</script>