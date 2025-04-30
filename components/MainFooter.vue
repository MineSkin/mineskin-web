<template>
    <v-footer>
        <v-container :class="mdAndUp?'px-16':''">
            <v-row no-gutters justify="center" class="text-center">
                <v-col cols="12" md="6">
                    <v-row class="mb-1">
                        <v-col>
                            <a href="https://minesk.in/discord" target="_blank">Discord</a><br/>
                            <a href="https://github.com/MineSkin" target="_blank">GitHub</a><br/>
                            <a href="https://docs.mineskin.org/blog" target="_blank">Blog</a><br/>
                            <a href="https://crowdin.com/project/mineskin" target="_blank">Crowdin</a><br/>
                        </v-col>
                        <v-col>
                            <a href="https://account.mineskin.org">Account Manager</a><br/>
                            <a href="https://account.mineskin.org/keys">API Keys</a><br/>
                            <a href="https://status.mineskin.org" target="_blank">Status</a><br/>
                        </v-col>
                        <v-col>
                            <a href="https://docs.mineskin.org" target="_blank">Documentation</a><br/>
                            <a href="https://docs.mineskin.org/docs/category/mineskin-api" target="_blank">API
                                Reference</a><br/>
                            <a href="https://api.mineskin.org/openapi" target="_blank">V1 API Reference
                                (legacy)</a><br/>
                            <a href="https://classic.mineskin.org?utm_source=website_v2&utm_medium=link&utm_campaign=footer_link">Classic
                                Website</a><br/>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row no-gutters justify="center" class="text-center">
                <v-col cols="12" md="6">
                    <v-row class="my-1 text-medium-emphasis text-body-2" justify="center">
                        <v-col cols="6" md="2">
                            <v-img src="/img/cf-logo-v-rgb.png" style="margin-top:-8px;margin-bottom:2px"/>
                            Protected by <a href="https://cloudflare.com" target="_blank">Cloudflare</a>
                        </v-col>
                        <v-col cols="6" md="2">
                            <v-img src="/img/sentry-wordmark-light-400x119.svg"/>
                            Monitored by <a href="https://sentry.io/" target="_blank">Sentry</a>
                        </v-col>
                        <v-col cols="6" md="2">
                            <v-img src="/img/netcup_logo_RGB_white.svg"/>
                            Partially hosted by <a href="https://www.netcup.de/?ref=83524" target="_blank">netcup</a>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-divider class="my-2"/>
            <v-row no-gutters justify="center">
                <v-col>
                    <v-btn variant="text" href="https://legal.inventivetalent.org/imprint">Imprint</v-btn>
                    <v-btn variant="text" href="https://legal.inventivetalent.org/privacy/mineskin">Privacy</v-btn>
                    <v-btn variant="text" href="https://legal.inventivetalent.org/terms/mineskin">Terms</v-btn>
                    <a href="#" id="open_preferences_center">Cookie preferences</a>
                </v-col>
                <v-col class="text-center">
                    <div class="my-1">Copyright &copy; {{ new Date().getFullYear() }} <a
                        href="https://inventivetalent.org"
                        target="_blank">inventivetalent</a></div>
                </v-col>
                <v-col class="text-right">
                    Not affiliated with Minecraft / Mojang AB / Microsoft.
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
</template>
<script setup lang="ts">
import AdWrappper from "~/components/ad/AdWrappper.vue";

const {smAndUp, mdAndUp} = useDisplay();

const router = useRouter();

const randomBoolean = () => Math.random() > 0.5;
const isGallery = computed(() => router.currentRoute.value.name === 'gallery' || router.currentRoute.value.name === 'skins');

const showFooterAds = computed(() => randomBoolean() && !isGallery.value);
</script>