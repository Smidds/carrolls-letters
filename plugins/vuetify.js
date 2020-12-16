export default (context) => {
  if (process.client) {
    context.$vuetify.theme.dark = false
  }
}
