<template>
    <slot name="root">
<pre class="instructions">
// Skin <slot name="skinShortId">MISSING</slot> generated on <slot name="skinDate">MISSING</slot> via MineSkin.org - https://minesk.in/<slot name="skinUuid">MISSING</slot>
PlayerProfile skin<slot name="skinShortId">MISSING</slot> = Bukkit.createProfile(UUID.fromString("<slot name="uuidString">MISSING</slot>"), "skin<slot name="skinShortId">MISSING</slot>");
skin<slot name="skinShortId">MISSING</slot>.setProperty(new ProfileProperty("textures", "<slot name="skinValue"></slot>", "<slot name="skinSignature"></slot>"));
</pre>
    </slot>
</template>
<script setup lang="ts">
</script>