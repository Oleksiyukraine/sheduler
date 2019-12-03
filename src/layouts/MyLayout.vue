<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-img
          :src="url.drawerBg"
          spinner-color="white"
          style="min-height: 150px; width: 100%"
        />
        <div class="login-register-element">
          <q-icon name="account_circle" />
          <div v-if="!isAuth" class="flex">
            <q-item clickable tag="a" to="/login"><q-item-label>{{ $t('login') }}</q-item-label></q-item>
            <q-item clickable tag="a" to="/register"><q-item-label>{{ $t('register') }}</q-item-label></q-item>
          </div>
          <div v-else>
            <div class="text-h6 user-name">
              {{ user.email }}
            </div>
          </div>
        </div>

        <q-item clickable tag="a" to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('sideMenuItemHome') }}</q-item-label>
          </q-item-section>
        </q-item>
        <hr>
        <q-item clickable @click="langList = !langList">
          <q-item-section avatar>
            <q-icon name="public" />
          </q-item-section>
          <div style="display: flex; justify-content: space-between; width: 100%">
            <q-item-section>
              <q-item-label>{{ $t('sideMenuItemLang') }}</q-item-label>
            </q-item-section>
            <q-item-section class="text-right">
              <q-item-label style="text-transform: uppercase; font-weight: bold; color: #31CCEC">{{startLocale.title}}</q-item-label>
            </q-item-section>
          </div>
        </q-item>
        <q-separator />
        <q-item v-if="isAuth" clickable @click.stop="logout()">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('logout') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-dialog v-model="langList" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-primary text-white">
        <q-bar>
          <div class="text-center full-width">{{ $t('selectLang') }}</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup></q-btn>
        </q-bar>
        <div class="lang-wrapper">
          <ul>
            <li
              class="shadow-2"
              v-for="(item, index) in locale"
              :key="index"
              @click="setLocate(item)"
            >
              <div>
                {{ item.title }}
              </div>
            </li>
          </ul>
        </div>
      </q-card>
    </q-dialog>
    <q-page-container>
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MyLayout',

  data () {
    return {
      langList: false,
      leftDrawerOpen: false,
      url: { drawerBg: 'https://placeimg.com/500/300/nature?t=' + Math.random() },
      startLocale: { title: 'English', code: 'en-us' },
      locale: [
        { title: 'English', code: 'en-us' },
        { title: 'Ukraine', code: 'uk' }
      ]
    }
  },
  computed: {
    isAuth () {
      return this.$store.state.account.authenticated
    },
    user () {
      return this.$store.state.account.user
    }
  },
  watch: {
    '$route' (to, from) {
      this.$store.dispatch('account/setRouteData', { from, to })
    }
  },
  mounted () {
    const localeStorage = this.$q.localStorage.getItem('locale')
    if (localeStorage) {
      this.startLocale = this.locale.find(item => item.code === localeStorage.code)
      this.$i18n.locale = localeStorage.code
    }
  },
  methods: {
    setLocate (locale) {
      this.startLocale.title = locale.title
      this.$i18n.locale = locale.code
      this.$q.localStorage.set('locale', locale)
      this.langList = false
    },
    logout () {
      this.$store.dispatch('account/logout').then(() => {
        this.$q.notify({ icon: 'done', color: 'positive', message: this.$t('success') })
        if (this.$router.path !== '/') { this.$router.push(`/login`) }
        this.leftDrawerOpen = false
      }).catch(() => {
        this.$q.notify({ icon: 'done', color: 'warning', message: this.$t('unknownError') })
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .login-register-element {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    color: whitesmoke;
    i {
      font-size: 38px;
      text-shadow: 1px 1px 0 #747474;
    }
    a {
      font-weight: bold;
      font-size: 16px;
      text-shadow: 1px 1px 0 #747474;
    }
  }
  .lang-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    ul {
      list-style-type: none;
      padding: 1rem;
      margin: 0;
      li{
        width: 150px;
        line-height: 30px;
        padding: 5px 15px;
        margin: 5px;
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .user-name {
    font-weight: bold;
    text-shadow: 0 0 1px black;
    text-transform: uppercase;
  }
</style>
