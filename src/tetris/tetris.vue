<template>
  <div class="wrap">
    <div>
      <button v-if="state.gameState === 'running'" @click="DoFail()">
        认输☹️
      </button>
      <button v-else-if="state.gameState === 'accomplish'" @click="init()">
        再来😁
      </button>
      <button v-else-if="state.gameState === 'fail'" @click="init()">
        重来😁
      </button>
    </div>
    <div class="cellWrap" :style="{ width: wrapWidth }">
      <template v-for="(vv0, index0) in state.cells" :key="index0">
        <div class="cell" :class="{ has: vv0.has }"></div>
      </template>
    </div>
  </div>
</template>
<script>
import GameCore from './tetris.js'
export default {
  components: {},
  data() {
    return {
      config: {
        rows: 20,
        cols: 10,
      },
      state: {},
    }
  },
  watch: {},
  props: {},
  computed: {
    wrapWidth() {
      return this.config.cols * (20 + 2) + 'px'
    },
  },
  methods: {
    init() {
      this.state = new GameCore(this.config.rows, this.config.cols)
    },
  },
  mounted() {
    this.init()
  },
}
</script>
<style scoped lang="scss">
.cellWrap {
  display: flex;
  flex-wrap: wrap;
}
.cell {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  box-sizing: border-box;
  cursor: default;
  user-select: none;
  background-color: #999;
  margin: 0 2px 2px 0;
  &.has {
    background-color: green;
  }
}
</style>
