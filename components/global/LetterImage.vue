<template>
  <div class="letter-image">
    <div class="images">
      <v-img
        v-for="source in sources"
        :key="source"
        contain
        max-height="300"
        max-width="500"
        :src="`${baseUrl}/images/${source}`"
        :alt="caption"
      />
    </div>
    <div v-if="caption" class="caption" v-html="caption" />
  </div>
</template>

<script>
export default {
  props: {
    sources: {
      type: Array,
      default: () => []
    },
    caption: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      baseUrl: process.env.baseUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.letter-image {
  margin-bottom: 2rem;
  margin-top: 2rem;

  .images {
    margin-bottom: 0.5rem;
  }

  .caption {
    color: blue;
  }
}
</style>
