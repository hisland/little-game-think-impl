<template>
  <div class="gameWrap">
    <div>
      <button @click="initGame(3)">3格</button>
      <button @click="initGame(4)">4格</button>
      <button @click="initGame(5)">5格</button>
      <button @click="initGame(6)">6格</button>
    </div>
    <div v-if="game && game.isWin">win</div>
    <div
      class="cellWrap"
      v-if="game"
      :style="{ width: game.gridCount * 3 + 'em' }"
    >
      <div
        class="cell"
        v-for="(vv0, index0) in game.list"
        :key="index0"
        @click="game.Tap(vv0, index0)"
      >
        <span v-if="!vv0.isEmpty">{{ vv0.cellText }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { onMounted } from 'vue'
import { Game } from './game'
export default {
  props: {},
  emits: {},
  setup(props, { attrs, slots, emit }) {
    const game = ref(null)
    function initGame(gridCount) {
      game.value = new Game(gridCount)
    }
    return {
      game,
      initGame,
    }
  },
}
</script>
<style scoped lang="scss">
.gameWrap {
  display: flex;
}
.cellWrap {
  display: flex;
  flex-wrap: wrap;
  width: 9em;
}
.cell {
  width: 3em;
  height: 3em;
  border: 1px solid #000;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
