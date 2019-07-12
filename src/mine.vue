<template>
  <div class="wrap">
    <div>
      <button v-if="state.gameState==='ready'" @click="init()">开始</button>
      <button v-if="state.gameState==='running'" @click="DoFail()">认输</button>
      <button v-if="state.gameState==='accomplish'" @click="init()">再来</button>
      <button v-if="state.gameState==='fail'" @click="init()">重来</button>
    </div>
    <div class="cellWrap" :style="{width:wrapWidth}">
      <template v-for="(vv0, index0) in state.cells">
        <div
          class="cell"
          :class="vv0.flag"
          :key="index0"
          @click="DoOpen(vv0, index0)"
          @contextmenu="DoFlag(vv0, $event)"
        >{{text(vv0)}}</div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      config: {
        rows: 10,
        cols: 20,
        mines: 50,
      },
      state: {
        gameState: 'ready',
        cells: [],
      },
    }
  },
  watch: {},
  props: {},
  computed: {
    wrapWidth() {
      return this.config.cols * 20 + 'px'
    },
    max() {
      return this.config.rows * this.config.cols
    },
  },
  methods: {
    init() {
      const len = this.max
      const cells = []
      for (let ii = 0; ii < len; ii++) {
        cells.push({
          value: -1,
          flag: 'normal',
        })
      }
      const mines = this.randomMines()
      for (const vv of mines) {
        cells[vv].value = 9
      }
      this.state.cells = cells
      cells.forEach((vv1, index1) => {
        if (vv1.value !== 9) {
          vv1.value = this.countMines(this.aroundPos(index1))
        }
      })
      this.state.gameState = 'running'
    },
    randomMines() {
      const rid = () => Math.floor(Math.random() * this.max)
      const ss = new Set()
      while (ss.size < this.config.mines) {
        ss.add(rid())
      }
      return ss
    },
    text(vv0) {
      if (vv0.flag === 'normal') {
        return ''
      } else if (vv0.flag === 'flag') {
        return 'F'
      } else if (vv0.flag === 'question') {
        return '?'
      } else if (vv0.flag === 'open') {
        if (vv0.value === 9) {
          return '💣'
        } else {
          return vv0.value || ''
        }
      }
    },
    toIndex([xx, yy]) {
      return this.config.cols * yy + xx
    },
    toPos(index) {
      const xx = index % this.config.cols
      const yy = (index - xx) / this.config.cols
      return [xx, yy]
    },
    aroundIndex(index) {
      const { cols } = this.config
      const arr = [
        index - cols - 1,
        index - cols,
        index - cols + 1,
        index - 1,
        index + 1,
        index + cols - 1,
        index + cols,
        index + cols + 1,
      ]
      const { max } = this
      return arr.filter(vv => vv >= 0 && vv < max)
    },
    aroundPos(index) {
      const [xx, yy] = this.toPos(index)
      const arr = [
        [xx - 1, yy - 1],
        [xx, yy - 1],
        [xx + 1, yy - 1],
        [xx - 1, yy],
        [xx + 1, yy],
        [xx - 1, yy + 1],
        [xx, yy + 1],
        [xx + 1, yy + 1],
      ]
      const maxX = this.config.cols - 1
      const maxY = this.config.rows - 1
      return arr.filter(
        ([xx, yy]) => !(xx < 0 || yy < 0 || xx > maxX || yy > maxY)
      )
    },
    countMines2(indexList) {
      const { cells } = this.state
      let sum = 0
      for (const pos of indexList) {
        if (cells[this.toIndex(pos)].value === 9) {
          sum += 1
        }
      }
      return sum
    },
    countMines(posList) {
      const { cells } = this.state
      let sum = 0
      for (const pos of posList) {
        if (cells[this.toIndex(pos)].value === 9) {
          sum += 1
        }
      }
      return sum
    },
    DoFail() {
      for (const vv of this.state.cells) {
        vv.flag = 'open'
      }
      this.state.gameState = 'ready'
    },
    DoOpen(vv0, index) {
      if (vv0.value === 9) {
        // 失败, 雷
        // } else if (vv0.value > -1) {
        // 已经打开
      } else {
        const { cells } = this.state
        let deepCount = 0
        const doneSet = new Set()
        const deepIn = index1 => {
          deepCount++
          if (deepCount > 100) {
            console.log('early out')
            return
          }
          if (!doneSet.has(index1)) {
            doneSet.add(index1)
            const vv1 = cells[index1]
            vv1.flag = 'open'
            if (!vv1.value) {
              const posList = this.aroundPos(index1)
              for (const pos2 of posList) {
                const index2 = this.toIndex(pos2)
                deepIn(index2)
              }
            }
          }
        }
        deepIn(index)
      }
    },
    DoFlag(vv0, ee) {
      ee.preventDefault()
      if (vv0.flag === 'normal') {
        vv0.flag = 'flag'
      } else if (vv0.flag === 'flag') {
        vv0.flag = 'question'
      } else if (vv0.flag === 'question') {
        vv0.flag = 'normal'
      }
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
  &.normal {
    background-color: #999;
  }
  &.flag {
    background-color: #999;
  }
  &.question {
    background-color: #999;
  }
  &.open {
    background-color: #fff;
  }
}
</style>
