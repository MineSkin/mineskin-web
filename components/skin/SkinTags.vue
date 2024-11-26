<style scoped>
a {
    cursor: pointer;
}
</style>
<template>
    <div class="d-flex">
        <div v-for="tag in tags" :key="tag.tag" class="d-inline-block mr-2">
            <v-chip>
                <template v-slot:prepend v-if="authed">
                    <a @click="upvote(tag)">
                        <v-icon>mdi-arrow-up</v-icon>
                    </a>
                    <v-tooltip text="Upvote" activator="parent" location="bottom"/>
                </template>
                <span class="mx-1">{{ tag.tag }}</span>
                <template v-slot:append v-if="authed">
                    <a @click="downvote(tag)">
                        <v-icon>mdi-arrow-down</v-icon>
                    </a>
                    <v-tooltip text="Downvote" activator="parent" location="bottom"/>
                </template>
            </v-chip>
        </div>
        <div class="d-inline-block">
            <v-chip @click="toggleNewTagInput" v-if="authed && !addingTag">
                <template v-slot:prepend>
                    <v-icon>mdi-plus</v-icon>
                </template>
                <span>Add Tag</span>
            </v-chip>
            <v-text-field v-else-if="authed"
                          ref="newTagInput"
                          density="compact"
                          variant="outlined"
                          width="200"
                          placeholder="Tag"
                          class="new-tag-input"
                          v-model="newTag"
                          prepend-inner-icon="mdi-close-circle"
                          @click:prepend-inner="toggleNewTagInput"
                          append-inner-icon="mdi-check-circle"
                          @click:append-inner="submitTag"
            ></v-text-field>
        </div>
        <InvisibleTurnstile v-if="skin" v-model:token="tagTurnstileToken" action="vote-tag"/>
    </div>
</template>
<script setup lang="ts">
import { type Maybe, type SkinInfo2, type TagInfo, TagVoteType } from "@mineskin/types";
import { useAuthStore } from "#imports";
import { storeToRefs } from "pinia";
import InvisibleTurnstile from "~/components/InvisibleTurnstile.vue";
import { until } from "@vueuse/core";
import { useLazyAsyncData } from "#app";

const props = defineProps<{
    skin: SkinInfo2;
}>();


const {
    data: tags
} = useLazyAsyncData<Maybe<(TagInfo&{vote: TagVoteType})[]>>(`skin-${ props.skin.uuid }-tags`, async () => {
    return (await $mineskin.skins.getTags( props.skin.uuid))?.tags;
});


const authStore = useAuthStore();
const {authed} = storeToRefs(authStore);
// const authed = true;

const {$mineskin, $notify} = useNuxtApp();

const newTagInput = useTemplateRef('newTagInput');

const addingTag = ref(false);
const newTag = ref("");

const tagTurnstileToken: Ref<string | null> = ref(null);

//TODO: turnstile

const upvote = async (tag: TagInfo) => {
    await doVote(tag, TagVoteType.UP);
};

const downvote = async (tag: TagInfo) => {
    await doVote(tag, TagVoteType.DOWN);
};

const doVote = async (tag: TagInfo, vote: TagVoteType) => {
    console.log("Voting tag", tag, vote);
    const token = await until(tagTurnstileToken).not.toBeNull({timeout: 5000});
    const res = await $mineskin.skins.voteTag(props.skin.uuid, tag.tag, vote, token);
};

const toggleNewTagInput = () => {
    addingTag.value = !addingTag.value;
    if (addingTag.value) {
        setTimeout(() => {
            newTagInput.value.focus();
        }, 0);
    }
};

const submitTag = async () => {
    const tag = newTag.value;
    if (!tag) {
        return;
    }
    console.log("Submitting tag", tag);
    const token = await until(tagTurnstileToken).not.toBeNull({timeout: 5000});
    addingTag.value = false;
    const res = await $mineskin.skins.voteTag(props.skin.uuid, tag, TagVoteType.UP, token);
    if (res.success) {
        newTag.value = "";
        tags.value?.push({tag});
    }
};
</script>