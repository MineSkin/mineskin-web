<template>
    <div ref="container" class="v-responsive">
        <dbg :data="{variant,state}" style="position: absolute"/>
    </div>
</template>
<script setup lang="ts">
import { sleep } from "~/util/misc";

const container = useTemplateRef("container");
const state = defineModel<string>({required: true});
const props = defineProps<{
    variant?: string,
    texture?: string,
    cape?: string
}>();

const skinRender = ref<any>(null);

onMounted(async () => {
    console.log('onMounted')

    window.jQuery = {};
    for (let i = 0; i < 50; i++) {
        console.log(window.THREE);
        if (typeof window.THREE === 'undefined') {
            await sleep(200);
            continue;
        }
        console.log('found THREE')
        break;
    }
    console.log(container.value);
    const w = container.value.offsetWidth;
    const h = container.value.offsetHeight;
    console.log(w);
    console.log(h)
    for (let i = 0; i < 50; i++) {
        console.log(window.SkinRender);
        if (typeof window.SkinRender === 'undefined') {
            await sleep(200);
            continue;
        }
        console.log('found SkinRender')
        break;
    }

    state.value = 'initializing';
    const temp = new window.SkinRender({
        sendStats: false,
        autoResize: true,
        showGrid: true,
        canvas: {
            width: 400,
            height: 400
        },
        camera: {
            x: -15,
            y: 35,
            z: 20,
            target: [0, 16, 0]
        },
        controls: {
            pan: false
        }
    }, container.value);
    state.value = 'initialized';

    skinRender.value = temp;
    window._skinRender = temp;

    if (props.texture) {
        doRender();
    }
});

watch(() => props.texture, () => {
    if (state.value === 'initialized') {
        doRender();
    }
})

function doRender() {
    state.value = 'rendering';
    skinRender.value.render({
        url: props.texture,
        capeUrl: props.cape,
        slim: props.variant === 'slim'
    }, () => {
        console.log('skin rendered')
        setTimeout(() => {
            state.value = 'rendered';
            setTimeout(()=>{
                skinRender.value.resize(container.value.offsetWidth, container.value.offsetWidth);
            })
        }, 500);
    });
}

watch(skinRender, async () => {

    // for (let i = 0; i < 50; i++) {
    //     console.log(skinRender.value);
    //     if (typeof skinRender.value === 'undefined' || !skinRender.value) {
    //         await sleep(200);
    //         continue;
    //     }
    //     console.log('found SkinRender instance')
    //     break;
    // }
    if (!skinRender.value) return;


}, {immediate: true})
</script>