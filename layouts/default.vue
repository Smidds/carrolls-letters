<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          to="/"
          nuxt
          exact
        >
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-model="showYears"
          prepend-icon="mdi-email-newsletter"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Letters</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="year in years"
            :key="year"
            :to="`/year/${year}`"
            nuxt
            exact
          >
            <v-list-item-content>
              <v-list-item-title v-text="year" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <a href="/" class="brand-link">
          <div class="brand">
            <app-logo class="small-logo" />
            {{ title }}
          </div>
        </a>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppLogo from '@/assets/icons/letter-rotated.svg?inline'

export default {
  components: {
    AppLogo
  },
  data () {
    return {
      clipped: true,
      drawer: false,
      showYears: true,
      years: ['1956', '1957', '1958', '1959', '1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975'],
      title: 'Carroll\'s Letters'
    }
  }
}
</script>

<style lang="scss">
.brand-link {
  text-decoration: none;

  .brand {
    color: black;
    display: flex;
    flex-direction: row;
    align-items: center;

    .small-logo {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
  }
}
</style>
