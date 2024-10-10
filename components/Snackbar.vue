<!-- based on https://stackoverflow.com/a/62809325/6257838 -->
<!-- https://dev.to/stephann/how-to-create-a-global-snackbar-using-nuxt-vuetify-and-vuex-1bda -->
<template>
  <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      location="top right"
      position="fixed">
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn
          v-show="snackbar.closable"
          color="red"
          variant="text"
          @click="snackbar.show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {useState} from "#app";
import type { SnackbarConfig } from "~/types/plugins";

const snackbar = useState<SnackbarConfig>('snackbar', () => ({
  show: false,
  color: '',
  text: '',
  timeout: -1,
  closable: true
}))
</script>
