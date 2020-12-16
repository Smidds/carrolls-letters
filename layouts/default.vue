<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
      color="white"
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
    <v-app-bar :clipped-left="clipped" fixed app dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <a href="/" class="brand-link">
          <div class="brand white--text">
            <app-logo class="small-logo" />
            {{ title }}
          </div>
        </a>
      </v-toolbar-title>
    </v-app-bar>
    <v-main class="background">
      <v-container class="px-3 px-md-5">
        <v-row>
          <v-col>
            <nuxt />
          </v-col>
        </v-row>
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
  },
  mounted () {
    this.$nuxt.$on('open-menu', () => { this.drawer = !this.drawer })
  }
}
</script>

<style lang="scss">
.brand-link {
  text-decoration: none;

  .brand {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: 'Rochester', cursive;

    .small-logo {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }
  }
}

.background {
  background-color: #f6fafe;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%232196f3' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
}
</style>
