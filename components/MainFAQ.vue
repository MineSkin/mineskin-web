<template>
    <div>
        <h4 class="text-h5 mb-4">{{ $t("Frequently Asked Questions") }}</h4>
        <v-expansion-panels variant="accordion" multiple>
            <v-expansion-panel
                text="MineSkin.org is a Minecraft skin generator that allows you to quickly get skin texture data with valid signatures by just uploading skin images."
                :title="$t('What is MineSkin?')"
            />
            <v-expansion-panel
                text="With the skin data and signatures provided by MineSkin, you can easily apply custom skins to in-game player heads, player NPCs, or even change a player’s in-game appearance. This is useful for personalizing game experiences, creating unique avatars, and customizing characters in creative ways."
                title="What can I use skin data / signatures for?"
            />
            <v-expansion-panel
                text="Minecraft skins are made up of two parts: the skin texture and the skin signature. The skin texture is the image that you see in-game, while the skin signature is a unique identifier that allows the game to verify the authenticity of the skin texture. MineSkin generates both the skin texture and the skin signature for you."
                title="Why can't I just get signatures directly?"
            />
            <v-expansion-panel
                text="MineSkin makes it fast and easy to generate custom Minecraft skin data by automating the process of creating skin signatures. Doing this manually can be very time-consuming and cumbersome, especially if you need to generate a large number of skins."
                title="Why should I use MineSkin to generate skin signatures?"
            />
            <v-expansion-panel
                text="MineSkin uses Minecraft accounts provided by the community to generate skin signatures. Specifically, it uploads the skin texture to a Minecraft account and then downloads the resulting skin signature. This process is automated and does not require any manual intervention."
                title="How does MineSkin generate skin signatures?"
            />
            <v-expansion-panel
                title="How can I help to make generating skins faster?"
            >
                <template v-slot:text>
                    If you have a Minecraft account you don't regularly use, you can help speed up the skin generation
                    process by providing it to MineSkin.
                    This allows MineSkin to use the account to generate skin signatures more quickly and efficiently.
                    Head over to the <a href="https://account.mineskin.org" target="_blank">Account Manager</a> to
                    provide
                    your account.
                </template>
            </v-expansion-panel>
            <v-expansion-panel
                title="How do I use the MineSkin API?"
            >
                <template v-slot:text>
                    The MineSkin API allows you to programmatically generate skin data and signatures for use in your
                    own
                    projects.
                    You can find the API documentation and more information on the <a href="https://docs.mineskin.org"
                                                                                      target="_blank">MineSkin Docs</a>.
                </template>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>
<script setup lang="ts">
</script>