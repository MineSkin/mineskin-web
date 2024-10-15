<template>
    <div>
        <v-row justify="center" class="mb-2 flex-0-0">
            URL
        </v-row>
        <InputList
            v-model="urls"
            label="URL"
            type="url"
            rule="url"
            prepend-icon="mdi-link"
            :image-provider="item=>item"
        />
        <v-row align="end">
            <v-col>
                Enter the URL of a skin image you want to generate data for
            </v-col>
        </v-row>
<!--        <v-row justify="center" align="center" class="my-2">-->
<!--            <v-btn-->
<!--                color="primary"-->
<!--                icon="mdi-arrow-right"-->
<!--                variant="elevated"-->
<!--                aria-label="Continue"-->
<!--                :disabled="!hasUrl"-->
<!--                @click="cont()"-->
<!--            ></v-btn>-->
<!--        </v-row>-->
    </div>
</template>
<script setup lang="ts">
const urls = defineModel<string[]>(['']);
const hasUrl = computed(() => urls.value.filter(url=>url.length>0).length > 0);
const emit = defineEmits(['continue']);

function cont(){
    if(!hasUrl.value) return;
    emit('continue');
}
</script>