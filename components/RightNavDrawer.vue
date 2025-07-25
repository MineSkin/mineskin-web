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
        <v-skeleton-loader type="actions" v-if="!isHydrated"/>
        <v-list v-else>
            <v-list-item v-if="authStore.authed">
                <template v-slot:prepend>
                    <v-avatar class="user-avatar" :class="{'member':isMember}">
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

<!--        <v-list v-if="isHydrated">-->
<!--            <v-list-subheader v-if="authStore.authed">{{ $t("Credits") }}</v-list-subheader>-->
<!--            <v-list-item v-if="authStore.authed">-->
<!--                <CreditsInfo/>-->
<!--            </v-list-item>-->
<!--        </v-list>-->

        <v-skeleton-loader type="list-item@4" v-if="!isHydrated"/>
        <JobList v-else class="my-2" style="max-height: 50vh; overflow-y: auto"/>

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
            <div class="my-1 mx-2">Help to <a href="https://docs.mineskin.org/docs/wiki/translations" target="_blank">translate
                MineSkin</a></div>
        </div>
    </v-navigation-drawer>
</template>
<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useQueueStore } from "~/stores/queue";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const {locale, locales, setLocale} = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const router = useRouter();

const authStore = useAuthStore();
const queueStore = useQueueStore();

const {jobsSorted, jobsDrawer} = storeToRefs(queueStore);

const isHydrated = ref(false);

const loginRedirect = () => {
    authStore.reset();
    setTimeout(() => {
        window.location.href = 'https://account.mineskin.org/login?redirect=https://mineskin.org/';
    }, 100);
}

const isMember = computed(() => {
    return authStore.authed && authStore.grants?.ad_free; //TODO: use a separate grant for this
});

onMounted(() => {
    isHydrated.value = true;
})

</script>