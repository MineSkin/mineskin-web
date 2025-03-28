<template>
    <div>
        <v-row justify="center" class="mb-2 flex-0-0">
            {{ $t("URL") }}
        </v-row>
        <InputList
            v-model="urls"
            :label="$t('URL')"
            type="url"
            rule="url"
            prepend-icon="mdi-link"
            :image-provider="item=>item"
            :waiting="generating"
        />
        <v-row align="end">
            <v-col>
                {{ $t("Enter the URLs of skin images you want to generate signatures for") }}
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
import InputList from "./list/InputList.vue";

const urls = defineModel<string[]>({required: true});
const hasUrl = computed(() => urls.value.filter(url=>url.length>0).length > 0);
const emit = defineEmits(['continue']);

onBeforeMount(()=>{
    if(urls.value.length === 0){
        urls.value.push('');
    }
});

const props = defineProps<{
    generating?: boolean
}>()


function cont(){
    if(!hasUrl.value) return;
    emit('continue');
}
</script>