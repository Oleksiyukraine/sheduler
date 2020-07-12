<template>
  <q-page class="flex column" v-if="$store.state.account.authenticated">
    <HeaderTitle :text="$t('board') + ' - ' + currentBoard.title"/>
    <body>
      <div class="task-filter-wrapper">
        <div class="task-filter">
          <div class="q-pr-sm">
            <q-checkbox v-model="isCompleteAllTasks" @input="setCompleteAllTasks" value="" class="full-width"/>
          </div>
          <div class="full-width">
            <q-select
              v-model="sortOptionsModel"
              :label="$t('filterTask')"
              :options="sortOptions"
              option-value="val"
              option-label="title"
              emit-value
              map-options
              value=""
              dense
              @input="sort"
            />
          </div>
        </div>
        <div class="search-wrapper">
          <q-input
            dense
            v-model="search"
            :label="$t('findTask')"
            class="q-pa-sm"
            value=""
          >
            <template v-slot:append>
              <q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        <div class="add-task" @click.stop="prompt = !prompt">
          <q-btn dense color="secondary" icon="exposure_plus_1" />
        </div>
      </div>
      <div v-if="tasks.length">
        <draggable v-model="tasks">
          <transition-group name="list" tag="div">
            <div v-for="(element, index) in filteredList" :key="element.id" class="task-list shadow-2" :class="{'complete-task': element.complete}">
              <div class="task-is-complete">
                <q-icon name="drag_indicator" />
                <q-checkbox v-model="element.complete" @input="setCompleteTask(index)" value=""/>
              </div>
              <div class="task-text" v-if="element.title">
                {{element.title}}
              </div>
              <div class="task-actions">
                <div @click.stop="addToFavoriteTask(index)">
                  <q-icon v-if="element.favorite" name="favorite" color="primary" size="24px" />
                  <q-icon v-else name="favorite_border" color="primary" size="24px" />
                </div>
                <div @click.stop="editTask(element, index)">
                  <q-icon name="create" color="primary" size="24px" />
                </div>
                <div @click.stop="deleteTask(element)">
                  <q-icon name="delete" color="warning" size="24px" />
                </div>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </body>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <q-input
            class="q-mb-lg"
            v-model="newTask.title"
            :label="$t('enterTask')"
            autofocus
            filled
            counter
            :rules="[rules.required, rules.lengthTitle]"
            type="textarea"
            value=""
          >
            <template v-slot:append>
              <q-icon v-if="newTask.title !== ''" name="close" @click="newTask.title = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat :label="$t('cancel')" v-close-popup />
          <q-btn flat :label="$t('addTask')" v-close-popup @click.stop="addTask"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px" v-if="editItemIndex != null">
        <q-card-section>
          <form @submit.prevent.stop="onSubmit()" class="q-gutter-md">
            <q-input
              class="q-mb-lg"
              v-model="tasks[editItemIndex].title"
              :label="$t('editTask')"
              autofocus
              filled
              ref="title"
              type="textarea"
              value=""
            >
              <template v-slot:append>
                <q-icon v-if="tasks[editItemIndex].title !== ''" name="close" @click="tasks[editItemIndex].title = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat type="reset" :label="$t('cancel')" v-close-popup />
              <q-btn flat type="submit" :label="$t('editTask')" />
            </q-card-actions>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import HeaderTitle from '../components/HeaderTitle'
import draggable from 'vuedraggable'
import { firebaseDb } from '../boot/firebase'

export default {
  name: 'Board',
  components: { HeaderTitle, draggable },
  data () {
    return {
      search: '',
      isCompleteAllTasks: false,
      sortOptions: [
        { val: 'asc', title: this.$t('newFirst') },
        { val: 'desc', title: this.$t('oldFirst') }
      ],
      sortOptionsModel: { val: 'asc', title: this.$t('newFirst') },
      editItemIndex: null,
      newTask: {
        title: '',
        boardId: this.$route.params.id,
        favorite: false,
        complete: false,
        createdAt: new Date()
      },
      currentBoard: { title: '' },
      tasks: [],
      prompt: false,
      editDialog: false,
      formHasError: false,
      rules: {
        lengthTitle: (val) => val.length < 50 || `${this.$t('charLimit')}`,
        required: (v) => !!v || this.$t('notEmptyField')
      }
    }
  },
  created () {
    if (!this.$store.state.account.authenticated) {
      this.$router.push(`/login`)
    } else {
      this.$bind('tasks', firebaseDb.collection('tasks').where('boardId', '==', this.$route.params.id).orderBy('createdAt', 'asc'))
      this.$bind('currentBoard', firebaseDb.collection('board').doc(this.$route.params.id))
    }
  },
  computed: {
    filteredList () {
      return this.tasks.filter(task => {
        return task.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  methods: {
    sort () {
      this.tasks = this.tasks.reverse()
    },
    setCompleteAllTasks () {
      if (this.tasks.length) {
        this.$q.loading.show()
        this.tasks.forEach((task) => {
          task.complete = true
          firebaseDb.collection('tasks').doc(task.id).set(task).then(() => {
            this.$q.loading.hide()
          }).catch((error) => {
            this.$q.loading.hide()
            this.$q.notify({ color: 'warning', message: error })
          })
        })
      } else {
        this.$q.notify({ color: 'positive', message: this.$t('nullTask') })
      }
    },
    addTask () {
      this.$q.loading.show()
      this.newTask.createdAt = new Date()
      firebaseDb.collection('tasks').doc().set(this.newTask).then((res) => {
        this.$q.loading.hide()
        this.newTask.title = ''
        this.$q.notify({ color: 'positive', message: this.$t('success') })
      }).catch(error => {
        this.$q.loading.hide()
        this.$q.notify({ color: 'warning', message: error })
      })
    },
    deleteTask (task) {
      this.$q.loading.show()
      firebaseDb.collection('tasks').doc(task.id).delete().then((res) => {
        this.$q.loading.hide()
        this.$q.notify({ color: 'positive', message: this.$t('success') })
      }).catch((error) => {
        this.$q.loading.hide()
        this.$q.notify({ color: 'warning', message: error })
      })
    },
    setCompleteTask (index) {
      this.$q.loading.show()
      const editTask = this.tasks[index]
      firebaseDb.collection('tasks').doc(editTask.id).set(editTask).then(() => {
        this.$q.loading.hide()
      }).catch((error) => {
        this.$q.loading.hide()
        this.$q.notify({ color: 'warning', message: error })
      })
    },
    addToFavoriteTask (index) {
      this.$q.loading.show()
      this.tasks[index].favorite = !this.tasks[index].favorite
      const editTask = this.tasks[index]
      firebaseDb.collection('tasks').doc(editTask.id).set(editTask).then(() => {
        this.$q.loading.hide()
      }).catch((error) => {
        this.$q.loading.hide()
        this.$q.notify({ color: 'warning', message: error })
      })
    },
    editTask (task, index) {
      this.editItemIndex = index
      this.editDialog = true
    },
    onSubmit () {
      this.$q.loading.show()
      this.$refs.title.validate()

      if (this.$refs.title.hasError) {
        this.formHasError = true
        this.$q.loading.hide()
        this.$q.notify({ color: 'warning', message: this.$t('validationsError') })
      } else {
        const editTask = this.tasks[this.editItemIndex]
        firebaseDb.collection('tasks').doc(editTask.id).set(editTask).then(() => {
          this.$q.loading.hide()
          this.editDialog = false
        }).catch((error) => {
          this.$q.loading.hide()
          this.$q.notify({ color: 'warning', message: error })
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .task-is-complete {
    display: flex;
    align-items: center;
    font-size: 19px;
    font-weight: bold;
  }
  .task-filter-wrapper {
    display: flex;
    align-items: center;
    background-color: whitesmoke;
  }
  .task-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: .1rem 0;
    padding: .2rem;
    background-color: whitesmoke;
  }
  .complete-task {
    background-color: lightblue !important;
    transition: background-color 1s ease;
  }
  .add-task {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 0 .5rem;
  }
  .task-list {
    display: flex;
    justify-content: space-between;
    margin: .5rem;
    padding: .5rem;
    background-color: whitesmoke;
    transition: background-color 1s ease;
  }
  .task-text {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 .5rem;
  }
  .task-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      margin: 0 .2rem;
    }
  }

/*  Transition group*/
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
    opacity: 0;
    transform: scale(0);
  }
</style>
