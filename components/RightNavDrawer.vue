<style scoped>
.pos-absolute {
    position: absolute;
}

.pos-relative {
    position: relative;
}
</style>
<template>
    <v-navigation-drawer
        v-model="jobsDrawer"
        location="end"
        temporary
        width="320"
        class="pos-relative"
    >
        <v-list>
            <v-list-subheader v-if="authStore.authed">{{ $t("Credits") }}</v-list-subheader>
            <v-list-item v-if="authStore.authed">
                <CreditsInfo/>
            </v-list-item>
        </v-list>
        <JobList class="my-2"/>
        <v-spacer/>
        <div class="pos-absolute bottom-0 right-0 w-100">
            <v-divider/>
            <v-select
                density="compact"
                class="mx-4 mt-4"
                prepend-inner-icon="mdi-translate"
                :model-value="locale"
                :items="locales"
                item-title="name"
                item-value="code"
                @update:model-value="setLocale"
                hide-details
            ></v-select>
            <div class="my-1 mx-2">Help to <a href="https://crowdin.com/project/mineskin" target="_blank">translate
                MineSkin</a></div>
        </div>
    </v-navigation-drawer>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";

const {locale, locales, setLocale} = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const router = useRouter();

const authStore = useAuthStore();
const queueStore = useQueueStore();

const {jobsSorted, jobsDrawer} = storeToRefs(queueStore);
</script>