<template>
  <div class="wrap">
    <Game></Game>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { onMounted } from 'vue'
import Game from './Game.vue'
export default {
  components: {
    Game,
  },
  props: {},
  emits: {},
  setup(props, { attrs, slots, emit }) {
    return {}
  },
}
</script>
<style scoped lang="scss">
</style>
