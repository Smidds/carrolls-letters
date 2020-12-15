<template>
  <div class="letter" :class="classes">
    <h2><b>{{ displayDate }}</b></h2>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format/index'

export default {
  props: {
    date: { type: String, default: null },
    variation: { type: String, default: 'standard' }
  },
  computed: {
    displayDate () {
      if (/\d+-\d+-\d+/.test(this.date) && this.variation !== 'note') {
        const parsedDate = parseDate(this.date, 'M-d-yy', new Date())
        return formatDate(parsedDate, 'do \'of\' MMMM, yyyy - EEEE')
      }
      return this.date
    },
    classes () {
      return {
        'lisa-note': this.variation === 'note'
      }
    }
  }
}
</script>

<style lang="scss">
.letter {
  margin: 2.5rem 0;

  &.lisa-note {
    background-color: lightblue;
  }
}
</style>
