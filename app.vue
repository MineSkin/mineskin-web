<template>
    <NuxtLayout>
        <v-app>
            <Snackbars/>
            <v-app-bar density="comfortable">
                <v-app-bar-title>
                    MineSkin
                    <v-btn icon>
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                </v-app-bar-title>

                <v-spacer></v-spacer>

                <v-tabs
                    v-model="tab"
                    align-tabs="center"
                >
                    <v-tab value="one">Generate</v-tab>
                    <v-tab value="two">Gallery</v-tab>
                    <v-tab value="three">Item Three</v-tab>
                </v-tabs>


            </v-app-bar>
            <v-main>
                <NuxtPage/>
            </v-main>
        </v-app>
    </NuxtLayout>
</template>
<script setup lang="ts">
</script>