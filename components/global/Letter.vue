<template>
  <v-card :color="color" class="letter mt-7 mx-auto">
    <v-card-title class="headline date">
      <span class="date__text">{{ displayDate }}</span>
      <footnote v-if="hasFootnote" class="ml-3">
        <slot name="footnote" />
      </footnote>
    </v-card-title>
    <v-card-text class="px-md-8 text">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format/index'

export default {
  props: {
    date: { type: String, default: null },
    hasFootnote: Boolean,
    variation: { type: String, default: 'standard' }
  },
  computed: {
    displayDate () {
      if (/\d+-\d+-\d+/.test(this.date) && this.variation !== 'note') {
        const parsedDate = parseDate(this.date, 'M-d-yy', new Date('January 1 1980'))
        return formatDate(parsedDate, 'do \'of\' MMMM, yyyy - EEEE')
      }
      return this.date
    },
    color () {
      if (this.variation === 'note') {
        return 'accent lighten-5'
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
.letter {
  max-width: 800px;

  .date {
    display: inline-block;
  }

  .text {
    p {
      text-indent: 2em;
    }
  }
}
</style>
