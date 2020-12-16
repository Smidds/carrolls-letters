<template>
  <div>
    <div class="upper-content">
      <h1>{{ page.title }}</h1>
      <p v-html="page.description" />
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
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.upper-content {
  padding-bottom: 2.5rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid black;
}

.wingdings {
  font-family: 'Wingdings', serif;
}
</style>
