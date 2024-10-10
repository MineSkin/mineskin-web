<template>
    <v-sheet rounded elevation="1" class="mx-auto pa-4">
        <h3 class="text-h6 mb-2">
            Latest Skins
            <v-btn icon="mdi-arrow-right" variant="text"></v-btn>
        </h3>
        <v-row>
            <v-col cols="12" md="3" v-for="n in 4" :key="n">
                <v-card>
                    <v-img
                        :lazy-src="`https://picsum.photos/6/6?image=${n * 5 + 10}`"
                        :src="`https://picsum.photos/180/180?image=${n * 5 + 10}`"
                        aspect-ratio="1"
                    ></v-img>
                    <v-card-title>Card Title</v-card-title>
                    <v-card-text>
                        <p>Lorem Ipsum...</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-sheet>
</template>