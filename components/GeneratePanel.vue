<template>
    <v-sheet
        rounded
        elevation="1"
        class="mx-auto pa-4 text-center"
    >
        <v-row class="my-2">
            <v-col
                class="mx-4"
            >
                <v-row justify="center" class="mb-2">
                    URL
                </v-row>
                <v-row justify="center" align="center" class="my-2">
                    <v-text-field
                        label="URL"
                    />
                </v-row>
                <v-row justify="center" align="center">
                    <v-btn
                        color="primary"
                        icon="mdi-arrow-right"
                        variant="elevated"
                        aria-label="Continue"
                    ></v-btn>
                </v-row>
            </v-col>
            <v-divider vertical/>
            <v-col
                class="mx-4"
            >
                <v-row justify="center" class="mb-2">
                    UPLOAD
                </v-row>
                <v-row justify="center" align="center">
                    <v-sheet
                        rounded
                        border
                        class="pa-2 ma-4"
                    >
                        <v-icon size="128">
                            mdi-upload
                        </v-icon>
                    </v-sheet>
                </v-row>
            </v-col>
            <v-divider vertical/>
            <v-col
                class="mx-4"
            >
                <v-row justify="center" class="mb-2">
                    USER
                </v-row>
                <v-row justify="center" align="center" class="my-2">
                    <v-text-field
                        label="USER"
                    />
                </v-row>
                <v-row justify="center" align="center">
                    <v-btn
                        color="primary"
                        icon="mdi-arrow-right"
                        variant="elevated"
                        aria-label="Continue"
                    ></v-btn>
                </v-row>
            </v-col>
        </v-row>
    </v-sheet>
</template>