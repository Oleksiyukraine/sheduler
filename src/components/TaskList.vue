<template>
  <draggable v-model="boards">
    <transition-group>
      <div v-for="(element, index) in boards" :key="index" class="q-ma-sm q-pa-sm shadow-1">
        <div class="text-h6">{{ element.title }}</div>
        <q-separator inset/>
        <div class="text-subtitle1">{{ element.desc }}</div>
      </div>
    </transition-group>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'Boards',
  props: ['boards'],
  components: { draggable },
  data () {
    return {
    }
  },
  mounted () {
    console.log('Boards', this.boards)
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
