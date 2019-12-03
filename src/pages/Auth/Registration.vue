<template>
  <q-page>
    <HeaderTitle :text="$t('registerNewAccount')"/>
    <q-card-section>
      <div class="q-pa-md">
        <form @submit.prevent.stop="onSubmit(user)" @reset.prevent.stop="onReset" class="q-gutter-md">
          <q-input
            ref="email"
            bottom-slots
            v-model.trim="user.email"
            filled
            :label="$t('enterEmail')"
            type="email"
            lazy-rules
            :rules="[rules.required, rules.email]"
          >
            <template v-if="user.email" v-slot:append>
              <q-icon name="close" @click="user.email = ''" class="cursor-pointer" />
            </template>
          </q-input>
          <q-input
            ref="password"
            v-model.trim="user.password"
            filled
            :type="isPwd ? 'password' : 'text'"
            :label="$t('enterPassword')"
            counter
            :rules="rules.length"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            ref="passwordConfirm"
            v-model.trim="user.passwordConfirm"
            filled
            :type="isConfirmPwd ? 'password' : 'text'"
            :label="$t('confirmPassword')"
            counter
            :rules="rules.length"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isConfirmPwd = !isConfirmPwd"
              />
            </template>
          </q-input>
          <div class="q-mt-xl" style="display: flex; justify-content: space-between">
            <q-btn :label="$t('register')" type="submit" color="primary" outline />
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
  name: 'RegistrationIndex',

  components: { HeaderTitle },

  data () {
    return {
      hasError: false,
      dense: false,
      isPwd: true,
      isConfirmPwd: true,
      formHasError: null,
      user: {
        email: null,
        password: null,
        passwordConfirm: null
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

  methods: {
    onSubmit (user) {
      this.$refs.email.validate()
      this.$refs.password.validate()
      if (this.user.password === this.user.passwordConfirm) {
        if (this.$refs.email.hasError || this.$refs.password.hasError) {
          this.formHasError = true
        } else {
          this.$q.loading.show()
          this.$store.dispatch('account/registration', user).then((res) => {
            this.$q.notify({ icon: 'done', color: 'positive', message: this.$t('loginSuccess') })
            this.$q.notify({ icon: 'done', color: 'positive', message: this.$t('registerSuccess') })
            this.$q.loading.hide()
            this.$router.push('/')
          }).catch(() => {
            this.$q.loading.hide()
            this.$q.notify({ color: 'warning', message: this.$t('unknownError') })
          })
        }
      } else {
        this.$q.notify({ color: 'warning', message: this.$t('passwordConfirmError') })
      }
    },

    onReset () {
      this.user.email = null
      this.user.password = null
      this.user.passwordConfirm = null
      this.$refs.email.resetValidation()
      this.$refs.password.resetValidation()
      this.$refs.passwordConfirm.resetValidation()
    }
  }
}
</script>
