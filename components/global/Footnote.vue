<template>
  <v-menu offset-x right>
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            elevation="2"
            icon
            outlined
            small
            v-bind="attrs"
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon color="primary">
              mdi-chat-alert-outline
            </v-icon>
          </v-btn>
        </template>
        <span>A note from Lisa</span>
      </v-tooltip>
    </template>
    <v-card class="footnote">
      <slot />
    </v-card>
  </v-menu>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.footnote {
  padding: 0.5rem;
}
</style>
