<template>
    <div>
        <v-img :src="image"></v-img>
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    url?: string;
    user?: string;
}>();

const image = computed(()=>{
    const url = new URL('https://minerender.org/embed/skin/');
    if (props.url) {
        url.searchParams.set('skin.url', props.url);
    }else if(props.user){
        url.searchParams.set('skin.name', props.user);
    }
    url.searchParams.set('autoResize', 'true');
    url.searchParams.set('shadow', 'true');
    url.searchParams.set('camera.position', '=-15,35,20');
    url.searchParams.set('controls.pan', 'false');
    return url.toString();
})
</script>