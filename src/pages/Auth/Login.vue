<template>
  <q-page>
    <HeaderTitle :text="$t('enterToAccount')"/>
    <q-card-section>
      <div class="q-pa-md">
        <form @submit.prevent.stop="onSubmit(user)" @reset.prevent.stop="onReset" class="q-gutter-md">
          <q-input
            ref="email"
            v-model="user.email"
            filled
            :label="$t('enterEmail')"
            type="email"
            lazy-rules
            :rules="[rules.required, rules.email]"
            value=""
          >
            <template v-slot:append>
              <q-icon v-if="user.email !== ''" name="close" @click="user.email = ''" class="cursor-pointer" />
            </template>
          </q-input>
          <q-input
            ref="password"
            v-model="user.password"
            filled
            :type="isPwd ? 'password' : 'text'"
            :label="$t('enterPassword')"
            counter
            :rules="rules.length"
            lazy-rules
            value=""
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="login-actions q-mt-xl">
            <q-btn :label="$t('login')" type="submit" color="primary" outline />
            <q-btn :label="$t('reset')" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </form>
      </div>
    </q-card-section>
  </q-page>
</template>

<script>
import HeaderTitle from '../../components/HeaderTitle'

export default {
  name: 'LoginIndex',
  components: { HeaderTitle },
  data () {
    return {
      hasError: false,
      isPwd: true,
      accept: false,
      isConnected: false,
      personalID: null,
      FB: null,
      formHasError: null,
      user: {
        email: null,
        password: null
      },
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || this.$t('emailError')
        },
        length: [
          val => !!val || `${this.$t('notEmptyField')}`,
          val => val.length > 5 || `${this.$t('passwordChar')}`
        ],
        password: (v) => (v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) || this.$t('passwordError'),
        required: (v) => !!v || this.$t('notEmptyField')
      }
    }
  },
  mounted () {

  },
  methods: {
    onSubmit (user) {
      this.$refs.email.validate()
      this.$refs.password.validate()

      if (this.$refs.email.hasError || this.$refs.password.hasError) {
        this.formHasError = true
      } else {
        this.$q.loading.show()
        this.$store.dispatch('account/login', user).then((response) => {
          this.$q.notify({ icon: 'done', color: 'positive', message: this.$t('loginSuccess') })
          this.$q.loading.hide()
          this.$router.push('/')
        }).catch(() => {
          this.$q.loading.hide()
          this.$q.notify({ icon: 'done', color: 'warning', message: this.$t('unknownError') })
        })
      }
    },
    onReset () {
      this.user.email = null
      this.user.password = null
      this.$refs.email.resetValidation()
      this.$refs.password.resetValidation()
    }
  }
}
</script>
<style scoped lang="scss">
  .login-actions {
    display: flex;
    justify-content: space-between;
  }
</style>
