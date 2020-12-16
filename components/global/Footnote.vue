<template>
  <v-menu offset-y eager top class="footnote">
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            elevation="2"
            icon
            outlined
            x-small
            v-bind="attrs"
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon color="primary">
              mdi-information-variant
            </v-icon>
          </v-btn>
        </template>
        <span>A note from Lisa</span>
      </v-tooltip>
    </template>
    <v-card class="footnote__text pa-3 mb-0">
      <slot />
    </v-card>
  </v-menu>
</template>

<script>
export default {}
</script>

<style lang="scss">
.footnote {
  &__text {
    max-width: 300px;

    p {
      margin-bottom: 0;
    }
  }
}
</style>
