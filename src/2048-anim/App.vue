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
      <div class="cellWrap" :style="{ width: wrapWidth, height: wrapWidth }">
        <div
          v-for="(vv1, index1) in game.max"
          :key="'bg-' + index1"
          class="cell"
        ></div>

        <transition-group name="cell">
          <div
            v-for="vv1 in game.cells"
            class="cell2 cell-2"
            :class="'cell-' + vv1.value"
            :style="vv1.style"
            :key="'value-' + vv1.uid"
          >
            {{ vv1.value }}
          </div>
        </transition-group>
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
  position: relative;
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
}
.cell2 {
  position: absolute;
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
  /* transform: scale(0.5); */
  transition: transform 0.25s ease;
  &.cell-2 {
    color: #796f66;
    background-color: #eee5de;
    font-size: 30px;
    z-index: 1;
  }
  &.cell-4 {
    color: #796f66;
    background-color: #ecddc1;
    font-size: 30px;
    z-index: 2;
  }
  &.cell-8 {
    color: #fff;
    background-color: #f5af81;
    font-size: 30px;
    z-index: 3;
  }
  &.cell-16 {
    color: #fff;
    background-color: #f49462;
    font-size: 30px;
    z-index: 4;
  }
  &.cell-32 {
    color: #fff;
    background-color: #f3775c;
    font-size: 30px;
    z-index: 5;
  }
  &.cell-64 {
    color: #fff;
    background-color: #f05239;
    font-size: 30px;
    z-index: 6;
  }
  &.cell-128 {
    color: #fff;
    background-color: #edce7b;
    font-size: 26px;
    z-index: 7;
  }
  &.cell-256 {
    color: #fff;
    background-color: #e5d25d;
    font-size: 26px;
    z-index: 8;
  }
  font-size: 30px;
  font-family: auto;
}

.cell-enter-active {
  transition: all 0.25s ease;
}
.cell-enter-from {
  opacity: 0;
  transform: scale(0);
}
.cell-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
