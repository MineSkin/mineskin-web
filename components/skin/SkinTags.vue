<style scoped>
a {
    cursor: pointer;
}
</style>
<template>
    <div class="d-flex">
        <div v-for="tag in tags" :key="tag.tag" class="d-inline-block mr-2">
            <v-chip :variant="tag.suggested ? 'outlined': 'tonal'"
                    :color="tag.suggested ? 'default' : tag.vote === 'up' ? 'secondary' : 'accent'">
                <template v-slot:prepend v-if="authed">
                    <a @click="upvote(tag)" :title="tag.vote==='up'?'Upvoted':'Upvote'">
                        <v-icon :color="tag.vote === 'up' ? 'green' : ''">mdi-arrow-up</v-icon>
                    </a>
                </template>
                <span class="mx-1" :title="tag.suggested ? 'Suggested Tag' : ''">
                    {{ tag.tag }}
                </span>
                <template v-slot:append v-if="authed">
                    <a @click="downvote(tag)" :title="tag.vote==='down'?'Downvoted':'Downvote'">
                        <v-icon :color="tag.vote === 'down' ? 'red' : ''">mdi-arrow-down</v-icon>
                    </a>
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
                          :rules="tagRules"
                          class="new-tag-input"
                          v-model="newTag"
                          prepend-inner-icon="mdi-close-circle"
                          @click:prepend-inner="toggleNewTagInput"
                          append-inner-icon="mdi-check-circle"
                          @click:append-inner="submitTag"
            ></v-text-field>
        </div>
        <InvisibleTurnstile v-if="skin" v-model:token="tagTurnstileToken" :key="'t'+tagTurnstileId.count"
                            action="vote-tag"/>
    </div>
</template>
<script setup lang="ts">
import { type Maybe, type SkinInfo2, type TagInfo, TagVoteType } from "@mineskin/types";
import { useAuthStore } from "#imports";
import { storeToRefs } from "pinia";
import InvisibleTurnstile from "~/components/InvisibleTurnstile.vue";
import { until, useCounter } from "@vueuse/core";
import { useLazyAsyncData } from "#app";

const props = defineProps<{
    skin: SkinInfo2;
}>();


const {
    data: tags
} = useLazyAsyncData<Maybe<(TagInfo & {
    vote: TagVoteType;
    suggested?: boolean
})[]>>(`skin-${ props.skin.uuid }-tags`, async () => {
    return (await $mineskin.skins.getTags(props.skin.uuid))?.tags?.sort((a, b) => {
        if (a.vote === b.vote) {
            if (a.suggested !== b.suggested) {
                return a.suggested ? 1 : -1;
            }
            return a.tag.localeCompare(b.tag);
        }
        return b.vote === 'up' ? 1 : -1;
    });
});


const authStore = useAuthStore();
const {authed} = storeToRefs(authStore);
// const authed = true;

const {$mineskin, $notify} = useNuxtApp();

const newTagInput = useTemplateRef('newTagInput');

const tagRules = [
    (v: string) => v.length <= 32 || 'Max 32 characters',
    (v: string) => /^[a-z0-9-_ ]*$/.test(v) || 'Only a-z, 0-9, - and _ allowed'
]
const addingTag = ref(false);
const newTag = ref("");

const tagTurnstileId = useCounter();
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
    tagTurnstileId.inc();
    const res = await $mineskin.skins.voteTag(props.skin.uuid, tag.tag, vote, token);
    if (res.success && tags.value) {
        const tagIndex = tags.value?.findIndex(t => t.tag === tag.tag);
        if (tagIndex !== -1) {
            const theTag = tags.value[tagIndex];
            theTag.vote = vote;
            theTag.suggested = false;
        }
    }
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
    tagTurnstileId.inc();
    addingTag.value = false;
    tags.value?.push({
        tag: tag,
        vote: TagVoteType.UP
    });
    const res = await $mineskin.skins.voteTag(props.skin.uuid, tag, TagVoteType.UP, token);
    if (res.success) {
        newTag.value = "";
    }
};
</script>