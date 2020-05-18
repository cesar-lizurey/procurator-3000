<template>
  <v-app>
    <v-content>
      <BoutonsMenu/>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import BoutonsMenu from './components/BoutonsMenu'

export default {
  name: 'App',

  components: {
    BoutonsMenu
  },

  data: () => ({

  })
}
</script>
