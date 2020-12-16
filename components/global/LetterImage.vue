<template>
  <div class="letter-image mx-auto mt-5 mb-5">
    <div>
      <v-img
        v-for="source in sources"
        :key="source"
        contain
        max-height="300"
        max-width="500"
        eager
        class="mb-3 clickable-image"
        :src="`${baseUrl}/images/${source}`"
        :alt="captionText"
        @click="open(`${baseUrl}/images/${source}`)"
      />
    </div>
    <div v-if="$slots.default" class="caption primary--text mx-auto px-2 px-md-5">
      <slot />
    </div>
  </div>
</template>

<script>
import domParser from 'node-html-parser'

export default {
  props: {
    sources: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      baseUrl: process.env.baseUrl
    }
  },
  computed: {
    captionText () {
      return this.$slots.default ? domParser(this.$slots.default).text : ''
    }
  },
  methods: {
    open (imagePath) {
      window.open(imagePath, '_blank')
    }
  }
}
</script>

<style lang="scss">
.letter-image {
  .clickable-image {
    cursor: pointer;
  }

  .v-image {
    margin-left: auto;
    margin-right: auto;
  }

  .caption {
    text-align: center;
    font-style: italic;
  }
}
</style>
