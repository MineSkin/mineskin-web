<template>
    <v-btn icon v-if="!searching"
           @click="searching = true"
    >
        <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-text-field v-else
                  density="compact"
                  v-model="filter"
                  placeholder="Search"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  @keydown.enter="searching = false"
                  @keydown.esc="searching = false"
                  class="my-2"
    />
</template>
<script setup lang="ts">

const searching = ref(false);
const filter = ref('');

</script>