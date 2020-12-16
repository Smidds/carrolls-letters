<template>
  <div>
    <div class="upper-content mx-auto pb-10 mb-16">
      <h1 class="page-title">
        {{ page.title }}
      </h1>
      <p class="description" v-html="page.description" />
      <v-row justify="center">
        <v-btn color="primary" :href="page.docPath" download>
          Download Original Doc
        </v-btn>
      </v-row>
    </div>
    <nuxt-content :document="page" />
  </div>
</template>

<script>
import domParser from 'node-html-parser'

export default {
  async asyncData ({ $content, params, error }) {
    const year = params.year
    const page = await $content('letters', year)
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: 'Page not found' })
      })

    return {
      page
    }
  },
  head () {
    const pageDescription = domParser(this.page.description.replace(/<span.*?wingdings.*?<\/span>/, '')).text

    return {
      title: this.page.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: pageDescription
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: pageDescription
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.page.title
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: `${process.env.baseUrl}/images/${this.page.previewImage}`
        },
        {
          hid: 'og:image:alt',
          name: 'og:image:alt',
          content: `A randomly selected image from the year ${this.page.title}`
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.upper-content {
  border-bottom: 1px solid black;
  max-width: 800px;

  .page-title {
    font-size: 50px;
    text-align: center;
    font-family: 'Rochester', cursive;
  }
}

.description {
  font-size: 1em;
  line-height: 2em;
  text-indent: 2em;
}

.wingdings {
  font-family: 'Wingdings', serif;
}
</style>
