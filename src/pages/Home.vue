<template>
  <q-page class="flex column" v-if="$store.state.account.authenticated">
    <HeaderTitle :text="$t('homePage')"/>
    <body class="body">
    <div class="add-board" @click.stop="prompt = !prompt">
      <q-icon name="exposure_plus_1" />
      <strong>{{ $t('addBoard') }}</strong>
    </div>
    <Boards :boards="boards" />
    </body>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ $t('enterBoardTitle') }}
          </div>
        </q-card-section>
        <q-card-section>
          <form @submit.prevent.stop="onSubmit()" @reset.prevent.stop="onReset" class="q-gutter-md">
            <q-input
              class="q-mb-lg"
              dense
              v-model="newBoard.title"
              :label="$t('enterBoardTitle')"
              autofocus
              ref="title"
              lazy-rules
              value=""
              counter
              :rules="[rules.required, rules.lengthTitle]"
            >
              <template v-slot:append>
                <q-icon v-if="newBoard.title !== ''" name="close" @click="newBoard.title = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <q-input
              dense
              v-model="newBoard.desc"
              :label="$t('enterBoardDesc')"
              ref="desc"
              lazy-rules
              value=""
              counter
              filled
              type="textarea"
              :rules="[rules.required, rules.lengthDesc]"
            >
              <template v-slot:append>
                <q-icon v-if="newBoard.desc !== ''" name="close" @click="newBoard.desc = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat type="reset" :label="$t('cancel')" v-close-popup />
              <q-btn flat type="submit" :label="$t('addBoard')"/>
            </q-card-actions>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import HeaderTitle from '../components/HeaderTitle'
import Boards from '../components/Boards'
import { firebaseDb } from '../boot/firebase'

export default {
  name: 'PageIndex',
  components: { HeaderTitle, Boards },
  data () {
    return {
      prompt: false,
      newBoard: {
        title: '',
        desc: '',
        uid: this.$store.state.account.user.id,
        createdAt: new Date()
      },
      rules: {
        lengthTitle: (val) => val.length < 10 || `${this.$t('charLimit')}`,
        lengthDesc: (val) => val.length < 50 || `${this.$t('charLimit')}`,
        required: (v) => !!v || this.$t('notEmptyField')
      },
      formHasError: false,
      boards: []
    }
  },
  created () {
    if (!this.$store.state.account.authenticated) {
      this.$router.push(`/login`)
    } else {
      this.$bind('boards', firebaseDb.collection('board').where('uid', '==', this.$store.state.account.user.id))
    }
  },
  methods: {
    onReset () {
      this.newBoard.title = ''
      this.newBoard.desc = ''
      this.$refs.title.resetValidation()
      this.$refs.desc.resetValidation()
    },
    onSubmit () {
      this.$q.loading.show()
      this.$refs.title.validate()
      this.$refs.desc.validate()

      if (this.$refs.title.hasError || this.$refs.desc.hasError) {
        this.formHasError = true
        this.$q.loading.hide()
        this.$q.notify({ color: 'warning', message: this.$t('validationsError') })
      } else {
        this.newBoard.createdAt = new Date()
        console.log('before', this.newBoard)
        firebaseDb.collection('board').add(this.newBoard)
          .then(() => {
            console.log('then', this.newBoard)
            this.$q.loading.hide()
            this.prompt = false
            this.newBoard.title = ''
            this.newBoard.desc = ''
          })
          .catch((error) => {
            this.$q.loading.hide()
            this.$q.notify({ color: 'warning', message: error })
          })
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .body {

  }
  .boards-list {
    display: flex;
    flex-direction: column;
  }
  .add-board {
    display: flex;
    justify-content: flex-start;
    padding-left: 1rem;
    height: 50px;
    box-shadow: 0 0 1px gray;
    align-items: center;
    color: #747474;
    margin: .6rem;
    i {
      margin-right: 1rem;
      font-size: 28px;
    }
  }
  .right-el {
    margin: .1rem;
    position: relative;
    display: block;
    background-color:  $mainlogo;
    width: 30px;
    height: 70px;
    &:before {
      border-bottom: 40px solid  $mainlogo;
      border-left: 30px solid transparent;
      position: absolute;
      height: 0;
      width: 0;
      top: -40px;
      left: 0;
      display: block;
      content: '';
    }
    &:after {
      border-top: 52px solid  $mainlogo;
      border-right: 30px solid transparent;
      position: absolute;
      height: 0;
      width: 0;
      top: 70px;
      left: 0;
      display: block;
      content: '';
    }
  }
  .center-push {
    margin-bottom: 15px;
  }
  .center-el {
    margin: 0 1rem;
    position: relative;
    display: block;
    background-color:  $mainlogo;
    width: 30px;
    height: 120px;
    &:before {
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-bottom: 40px solid  $mainlogo;
      position: absolute;
      top: -40px;
      left: 0;
      display: block;
      content: '';
    }
    &:after {
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-top: 40px solid  $mainlogo;
      position: absolute;
      height: 0;
      width: 0;
      top: 120px;
      left: 0;
      display: block;
      content: '';
    }
  }
  .left-el {
    margin: .1rem;
    position: relative;
    display: block;
    background-color:  $mainlogo;
    width: 30px;
    height: 70px;
    &:before {
      border-bottom: 40px solid  $mainlogo;
      border-right: 30px solid transparent;
      position: absolute;
      height: 0;
      width: 0;
      top: -40px;
      left: 0;
      display: block;
      content: '';
    }
    &:after {
      border-top: 52px solid $mainlogo;
      border-left: 30px solid transparent;
      position: absolute;
      height: 0;
      width: 0;
      top: 70px;
      left: 0;
      display: block;
      content: '';
    }
  }
</style>
