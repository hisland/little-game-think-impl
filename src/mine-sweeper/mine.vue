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
        <div
          class="cell"
          :class="cellClz(vv0)"
          @click="DoOpen(index0)"
          @contextmenu="DoFlag(index0, $event)"
        >
          {{ text(vv0) }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import GameCore from './mine.js'
export default {
  components: {},
  data() {
    return {
      config: {
        rows: 20,
        cols: 30,
        mines: 100,
      },
      state: {},
    }
  },
  watch: {},
  props: {},
  computed: {
    wrapWidth() {
      return this.config.cols * 20 + 'px'
    },
  },
  methods: {
    cellClz(vv0) {
      if (vv0.opened) {
        if (vv0.mark === 'flag') {
          if (vv0.value !== 9) {
            return 'error'
          } else {
            return 'right'
          }
        } else {
          return 'opened'
        }
      }
    },
    init() {
      this.state = new GameCore(
        this.config.rows,
        this.config.cols,
        this.config.mines
      )
    },
    text(vv0) {
      if (vv0.opened) {
        if (vv0.value === 9) {
          return '💣'
        } else {
          return vv0.value || ''
        }
      } else {
        if (vv0.mark === 'flag') {
          return '🚩'
        } else if (vv0.mark === 'question') {
          return '❔'
        }
      }
    },
    DoFail() {
      this.state.surrender()
    },
    DoOpen(index) {
      this.state.open(index)
    },
    DoFlag(index, ee) {
      ee.preventDefault()
      this.state.setMark(index)
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
  border: 1px solid #eee;
  box-sizing: border-box;
  cursor: default;
  user-select: none;
  background-color: #999;
  &.right {
    background-color: green;
  }
  &.error {
    background-color: red;
  }
  &.opened {
    background-color: #fff;
  }
}
</style>
