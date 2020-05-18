<template>
  <component :is="$route.params.fonction + '-' + $route.params.cerfa"></component>
</template>

<script>
// @ is an alias to /src

import ResilierProcuration1495201 from "@/components/14952-01/ResilierProcuration.vue"
import ResilierProcuration1590202 from "@/components/15902-02/ResilierProcuration.vue"
import DonnerProcuration1495201 from "@/components/14952-01/DonnerProcuration.vue"
import DonnerProcuration1590202 from "@/components/15902-02/DonnerProcuration.vue"

export default {
  name: "Formulaire",
  components: {
    'resilier-14952-01': ResilierProcuration1495201,
    'resilier-15902-02': ResilierProcuration1590202,
    'donner-14952-01': DonnerProcuration1495201,
    'donner-15902-02': DonnerProcuration1590202
  }
}
</script>
