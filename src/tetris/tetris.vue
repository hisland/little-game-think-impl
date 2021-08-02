<template>
  <div class="wrap">
    <div>
      <span>
        <span>宽度</span>
        <input type="text" v-model.trim="config.cols" style="width: 30px" />
      </span>
      <span>
        <span>高度</span>
        <input type="text" v-model.trim="config.rows" style="width: 30px" />
      </span>
      <button @click="DoInit()">重来😁</button>
    </div>
    <template v-if="game">
      <div class="cellWrap" :style="{ width: wrapWidth }">
        <div
          v-for="(vv1, index1) in game.max"
          :key="index1"
          class="cell"
          :class="{
            fill: game.fills.has(index1) || game.shape1Set.has(index1),
          }"
        >
          {{ index1 }}
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import GameCore from './tetris.js'
export default {
  components: {},
  data() {
    return {
      config: {
        cols: 15,
        rows: 20,
      },
      game: null,
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
    DoInit() {
      this.game = new GameCore(this.config.rows, this.config.cols)
    },

    SetupKeyDown() {
      window.addEventListener('keydown', this.EventHandle)
    },
    TeardownKeyDown() {
      window.removeEventListener('keydown', this.EventHandle)
    },
    EventHandle(ee) {
      if (!this.game) return
      // console.log('ee.keyCode: ', ee.keyCode)
      if (ee.keyCode === 27) {
        // esc
        this.game.ToggleRun()
      } else if (ee.keyCode === 32) {
        // blank
        this.game.FillShape()
      } else if (ee.keyCode === 37) {
        // left
        this.game.MoveShapeLeft()
      } else if (ee.keyCode === 38) {
        // up
        this.game.Rotate()
      } else if (ee.keyCode === 39) {
        // right
        this.game.MoveShapeRight()
      } else if (ee.keyCode === 40) {
        // down
        this.game.MoveShapeDown()
      }
    },
  },
  mounted() {
    this.DoInit()
    this.SetupKeyDown()
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
  background-color: #eee;
  margin: 0 2px 2px 0;
  &.fill {
    background-color: green;
  }
  font-size: 12px;
  font-family: serif;
  color: #ccc;
}
</style>
