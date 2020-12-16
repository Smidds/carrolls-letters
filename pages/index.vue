<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-img
          :height="imageHeight"
          :src="lettersImage"
        />
        <v-card-title class="d-flex justify-center mt-5 mb-5">
          <app-logo />
          <span class="site-title">Carroll's Letters</span>
        </v-card-title>
        <v-card-text>
          <p class="mb-7 indent">
            This website is intended as a platform to host my grandfather Carroll Smith's letters to his mother spanning the years 1956 to 1975. The letters were originally transcribed by hand by my aunt Lisa, and then converted by me, Carroll's grandson Isaac, into a web-accessible format. The letters were originally transcribed into 3 separate, physical volumes, and multiple copies were made and distributed to a handful of people. This was the original intrduction to those three volumes:
          </p>
          <h1 class="text-center mb-5 font-italic">
            Introduction
          </h1>
          <p class="text-center font-italic">
            "Dad wrote letters to his mother nearly every week, from the time he first left home for college, until the end of 1975. Grandmother saved every letter, adding dates where they were missing, summarizing the contents briefly in the top left hand corner, and bundling them by year. The letters are addressed at first simply to Mother, and later on to Mother, Aunt Clara, M.J. & Bill. Most of the letters take up both sides of a standard 8½ x 11 sheet, although many are twice that long, and a few are mere paragraphs. The longest letter was eight handwritten pages! In the beginning the letters are supplemented by many small postcards (that are really hard to read!), but these gradually taper off.
          </p>
          <p class="text-center font-italic">
            I began this transcription with the year 1956, the year Dad met Mom. At first I was only typing out excerpts of the most interesting parts of the letters, but eventually I came to agree with Jeremy that they should be transcribed verbatim. I did not correct any errors that Dad made in spelling, punctuation, or word forms (to, too, their, there, etc.), so, to the best of my ability, whatever errors or omissions you see are Dad’s, and not mine 😊. Dad does not often date his letters, so the dates that I use were either taken from postmarks, or were written in later by Grandmother, so they are not always completely accurate.
          </p>
          <p class="text-center font-italic">
            The original letters will be stored in a box in my closet, and eventually passed on to Jeremy the Historian, the one most likely to be interested in having them.
          </p>
          <p class="text-center font-italic">
            Taken as a whole, these letters constitute a history of our family. They are, to me, fascinating and priceless.
          </p>
          <p class="text-center font-italic">
            I hope you will agree.
          </p>
          <p class="text-center font-italic primary--text">
            Editorial comments will appear [as buttons, like this <footnote>This text originally read "in blue"</footnote>, highlited in blue]. Dad’s favorite color 😊
          </p>
          <v-btn color="primary" class="d-block mx-auto mt-10" @click="$nuxt.$emit('open-menu')">
            Start Reading
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AppLogo from '@/assets/icons/letter-rotated.svg?inline'

export default {
  components: {
    AppLogo
  },
  data () {
    return {
      baseUrl: process.env.baseUrl
    }
  },
  computed: {
    lettersImage () {
      return `${this.baseUrl}/images/1653cbe558888ddab4e87773d8ae4211_html_9e1c2d2c.jpg`
    },
    imageHeight () {
      return this.$vuetify.breakpoint.md ? '400px' : '200px'
    }
  }
}
</script>

<style lang="scss">
.site-title {
  font-size: 50px;
  font-family: 'Rochester', cursive;
}

.indent {
  text-indent: 2em;
}

</style>
