<template>
  <div class="wrap">
    <div class="btnWrap">
      <span>
        <span>宽度</span>
        <input type="text" v-model.trim="config.cols" style="width: 30px" />
      </span>
      <span>
        <span>高度</span>
        <input type="text" v-model.trim="config.rows" style="width: 30px" />
      </span>
      <button @click="DoInit()">重来😁</button>
      <span v-if="game && game.state === 'fail'">失败</span>
    </div>
    <template v-if="game">
      <div class="cellWrap" :style="{ width: wrapWidth }">
        <div
          v-for="(vv1, index1) in game.cells"
          :key="index1"
          class="cell"
          :class="'cell-' + vv1.value"
        >
          {{ vv1.value || '' }}
          <!-- {{ index1 }} -->
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import GameCore from './game.js'
export default {
  components: {},
  data() {
    return {
      config: {
        cols: 4,
        rows: 4,
      },
      game: null,
    }
  },
  watch: {},
  props: {},
  computed: {
    wrapWidth() {
      return this.config.cols * (50 + 5) + 'px'
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
      if (ee.keyCode === 32) {
        this.game.randomInt()
      } else if (ee.keyCode === 37) {
        // left
        this.game.MoveLeft()
      } else if (ee.keyCode === 38) {
        // up
        this.game.MoveUp()
      } else if (ee.keyCode === 39) {
        // right
        this.game.MoveRight()
      } else if (ee.keyCode === 40) {
        // down
        this.game.MoveDown()
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
.btnWrap {
  padding: 10px;
}
.cellWrap {
  display: flex;
  flex-wrap: wrap;
  padding: 5px 0 0 5px;
  background: #bfae9e;
}
.cell {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  box-sizing: border-box;
  cursor: default;
  user-select: none;
  background-color: #ccc3b5;
  border-radius: 5px;
  margin: 0 5px 5px 0;
  &.cell-2 {
    color: #796f66;
    background-color: #eee5de;
    font-size: 30px;
  }
  &.cell-4 {
    color: #796f66;
    background-color: #ecddc1;
    font-size: 30px;
  }
  &.cell-8 {
    color: #fff;
    background-color: #f5af81;
    font-size: 30px;
  }
  &.cell-16 {
    color: #fff;
    background-color: #f49462;
    font-size: 30px;
  }
  &.cell-32 {
    color: #fff;
    background-color: #f3775c;
    font-size: 30px;
  }
  &.cell-64 {
    color: #fff;
    background-color: #f05239;
    font-size: 30px;
  }
  &.cell-128 {
    color: #fff;
    background-color: #edce7b;
    font-size: 26px;
  }
  &.cell-256 {
    color: #fff;
    background-color: #e5d25d;
    font-size: 26px;
  }
  font-size: 30px;
  font-family: auto;
}
</style>
