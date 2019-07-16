<template>
  <div class="wrap">
    <div>
      <button v-if="gameState==='running'" @click="pause()">暂停</button>
      <button v-else-if="gameState==='paused'" @click="resume()">继续</button>
      <button v-else-if="gameState==='stoped'" @click="start()">开始</button>
    </div>
    <div class="cellWrap" :style="{width:wrapWidth}">
      <template v-for="index0 in state.max">
        <div class="cell" :class="cellClz(index0-1)" :key="index0"></div>
      </template>
    </div>
  </div>
</template>
<script>
import GameCore from './snake.js'
export default {
  components: {},
  data() {
    return {
      config: {
        rows: 20,
        cols: 20,
      },
      state: {},
      speed: 300,
      gameState: 'stoped',
      timerHandle: null,
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
    cellClz(index0) {
      if (index0 === this.state.food) {
        return 'food'
      } else if (this.state.snake[0] === index0) {
        return 'snakeHead'
      } else if (this.state.snake.some(vv => vv === index0)) {
        return 'snake'
      }
    },
    start() {
      this.state = new GameCore(this.config.rows, this.config.cols)
      this.gameState = 'running'
      this.nextTick()
      this.setupKey()
    },
    stop() {
      this.gameState = 'stoped'
      this.teardownKey()
    },
    nextTick() {
      const rs = this.state.next()
      if (rs === 'fail') {
        this.stop()
      } else {
        this.timerHandle = setTimeout(() => {
          this.nextTick()
        }, this.speed)
      }
    },
    pause() {
      this.gameState = 'paused'
      clearTimeout(this.timerHandle)
    },
    resume() {
      this.gameState = 'running'
      this.nextTick()
    },
    setupKey() {
      window.addEventListener('keydown', this.EventHandle)
    },
    teardownKey() {
      window.removeEventListener('keydown', this.EventHandle)
    },
    EventHandle(ee) {
      if (ee.keyCode === 32) {
        if (this.gameState === 'paused') {
          this.resume()
        } else if (this.gameState === 'running') {
          this.pause()
        }
      } else if (ee.keyCode === 37) {
        this.ChangeDir('left')
      } else if (ee.keyCode === 38) {
        this.ChangeDir('up')
      } else if (ee.keyCode === 39) {
        this.ChangeDir('right')
      } else if (ee.keyCode === 40) {
        this.ChangeDir('down')
      }
    },
    ChangeDir(newDir) {
      const oldDir = this.state.dir
      if (
        (oldDir === 'up' || oldDir === 'down') &&
        (newDir === 'left' || newDir === 'right')
      ) {
        this.state.dir = newDir
      } else if (
        (oldDir === 'left' || oldDir === 'right') &&
        (newDir === 'up' || newDir === 'down')
      ) {
        this.state.dir = newDir
      }
    },
  },
  mounted() {},
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
  &.snakeHead {
    animation: snakeHead 0.3s alternate infinite;
  }
  &.snake {
    background-color: green;
  }
  &.food {
    background-color: red;
  }
}

@keyframes snakeHead {
  0% {
    background-color: green;
  }
  100% {
    background-color: pink;
  }
}
</style>
