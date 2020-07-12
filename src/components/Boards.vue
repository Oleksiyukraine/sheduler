<template>
  <div class="boards-wrapper">
    <q-list v-for="(board, index) in boards" :key="index" class="boards-list">
      <q-card bordered class="my-card" @click.stop="redirectTo(board)">
        <q-card-section class="flex justify-between row">
          <div class="text-h6">
            {{ board.title }}
          </div>
          <div class="flex">
            <div @click.stop="editBoard(index)">
              <q-icon name="create" color="secondary" size="24px" />
            </div>
            <div @click.stop="deleteBoardAsk(board)">
              <q-icon name="delete" color="warning" size="24px" />
            </div>
          </div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="text-subtitle2">
            {{ board.desc }}
          </div>
        </q-card-section>
      </q-card>
    </q-list>
    <q-dialog v-model="editDialog" persistent v-if="editDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-subtitle1">
            {{ $t('editBoard') }}:{{ boards[editIndex].title }}
          </div>
        </q-card-section>

        <q-card-section>
          <form @submit.prevent.stop="onSubmit()" class="q-gutter-md">
            <q-input
              class="q-mb-lg"
              dense
              v-model="boards[editIndex].title"
              :label="$t('enterBoardTitle')"
              autofocus
              ref="title"
              lazy-rules
              value=""
              counter
              :rules="[rules.required, rules.lengthTitle]"
            >
              <template v-slot:append>
                <q-icon v-if="boards[editIndex].title !== ''" name="close" @click="boards[editIndex].title = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <q-input
              dense
              v-model="boards[editIndex].desc"
              :label="$t('enterBoardDesc')"
              ref="desc"
              value=""
              counter
              filled
              type="textarea"
              lazy-rules
              :rules="[rules.required, rules.lengthDesc]"
            >
              <template v-slot:append>
                <q-icon v-if="boards[editIndex].desc !== ''" name="close" @click="boards[editIndex].desc = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat type="reset" :label="$t('cancel')" v-close-popup />
              <q-btn flat type="submit" :label="$t('editBoard')"/>
            </q-card-actions>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteAsk" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-primary text-white">
        <q-card-section>
          <div class="text-h6 text-center">
            {{ $t('confirmDel') }}
          </div>
        </q-card-section>
        <q-card-section class="flex justify-between">
          <q-btn :label="$t('yes')" color="red" class="q-mr-md" @click="deleteBoard" style="min-width: 100px"/>
          <q-btn :label="$t('nope')" color="secondary" @click="deleteAsk = false, boardToDel = null" style="min-width: 100px"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { firebaseDb } from '../boot/firebase'

export default {
  name: 'Boards',
  props: ['boards'],
  data () {
    return {
      boardToDel: null,
      deleteAsk: false,
      editIndex: null,
      editDialog: false,
      formHasError: false,
      rules: {
        lengthTitle: (val) => val.length < 15 || `${this.$t('charLimit')}`,
        lengthDesc: (val) => val.length < 50 || `${this.$t('charLimit')}`,
        required: (v) => !!v || this.$t('notEmptyField')
      }
    }
  },
  methods: {
    redirectTo (board) {
      this.$router.push({
        path: `/board/${board.id}`
      })
    },
    editBoard (index) {
      this.editIndex = index
      this.editDialog = true
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
        const editBoard = this.boards[this.editIndex]
        firebaseDb.collection('board').doc(editBoard.id).set(editBoard).then(() => {
          this.$q.loading.hide()
          this.editDialog = false
        }).catch((error) => {
          this.$q.loading.hide()
          this.$q.notify({ color: 'warning', message: error })
        })
      }
    },
    deleteBoardAsk (board) {
      this.deleteAsk = true
      this.boardToDel = board.id
    },
    deleteBoard () {
      this.$q.loading.show()
      firebaseDb.collection('board').doc(this.boardToDel).delete().then((res) => {
        this.$q.loading.hide()
        this.deleteAsk = false
        this.boardToDel = null
        this.$q.notify({ color: 'positive', message: this.$t('success') })
      }).catch((error) => {
        this.$q.loading.hide()
        this.$q.notify({ color: 'warning', message: error })
      })
    }
  }
}
</script>

<style scoped>
  .my-card {
    margin: .5rem;
  }
</style>
