import { defineStore } from "pinia";
import { SkinVisibility2 } from "@mineskin/types";

export const useGalleryStore = defineStore('gallery', () => {

    const galleryItems = ref<string[]>([]);
    const galleryAnchor = ref<string | null>(null);
    const galleryScroll = ref<number>(0);
    // mode and search term the items were loaded for
    const galleryKey = ref<string | null>(null);

    return {
        galleryItems,
        galleryAnchor,
        galleryScroll,
        galleryKey
    }

}, {
})