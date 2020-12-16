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
        class="mb-3"
        :src="`${baseUrl}/images/${source}`"
        :alt="captionText"
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
  }
}
</script>

<style lang="scss" scoped>
.letter-image {
  .images {
    margin-bottom: 0.5rem;
  }

  .caption {
    text-align: center;
    font-style: italic;
  }
}
</style>
