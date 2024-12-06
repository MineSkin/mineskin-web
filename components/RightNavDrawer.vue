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
            <v-list-item v-if="authStore.authed">
                <template v-slot:prepend>
                    <v-avatar>
                        <v-img :src="authStore.user?.picture" alt="User Avatar"></v-img>
                    </v-avatar>
                </template>
                <v-list-item-action>
                    <v-btn
                        variant="tonal"
                        color="primary"
                        href="https://account.mineskin.org"
                        append-icon="mdi-arrow-right">
                        {{ $t("Manage Account") }}
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
            <v-list-item v-else>
                <v-list-item-action>
                    <v-btn
                        color="primary"
                        @click.prevent="loginRedirect"
                        href="https://account.mineskin.org"
                        append-icon="mdi-arrow-right">
                        {{ $t("Sign In") }}
                    </v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-list>
        <v-divider/>
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

const loginRedirect = () => {
    authStore.reset();
    window.location.href = 'https://account.mineskin.org/login?redirect=https://mineskin.org/';
}
</script>