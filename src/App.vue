<template>
  <div id="q-app">
    <router-view v-if="loadMainData"/>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'App',
  data () {
    return {
      loadMainData: false
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('account/setUserData', user)
        this.loadMainData = true
      } else {
        this.$store.dispatch('account/clear')
        this.loadMainData = true
      }
    })
  }
}
</script>
