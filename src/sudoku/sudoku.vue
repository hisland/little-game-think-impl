<template>
  <div class="wrap" v-if="game">
    <div class="history">
      <div v-for="(vv0, index0) in history" :key="index0" class="line">
        <span @click="Restore(vv0)">{{vv0}}</span>
        <span class="del" @click="DelHistory(index0)">x</span>
      </div>
    </div>
    <div>
      <div>
        <button @click="init()">重来</button>
        <button @click="resolve()">解题</button>
        <button @click="SaveLocal()">保存</button>
      </div>
      <div>
        <button @click="game.TryAllRestOne()">3个唯一</button>
        <button @click="game.TryBlocks()">块唯一</button>
        <button @click="game.TryRows()">行唯一</button>
        <button @click="game.TryCols()">列唯一</button>
      </div>
    </div>
    <input type="text" ref="text" @keyup="FillCell($event)" />
    <div class="cellWrap" :style="{ width: wrapWidth }">
      <div class="line" v-for="(vv0, index0) in game.rows" :key="index0">
        <div
          class="cell"
          v-for="(vv1, index1) in vv0"
          :key="index1"
          @click="SetCell(vv1, $event)"
        >{{vv1.value}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import GameCore from './sudoku.js'
export default {
  components: {},
  data() {
    const LocalHistory = localStorage.getItem('sudoku-history')
    const history = LocalHistory ? LocalHistory.split('|||') : []
    return {
      config: {
        rows: 20,
        cols: 10,
      },
      game: null,
      current: null,
      history,
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
    SaveLocal() {
      const value = this.game.cells.map((vv) => vv.value).join('-')
      this.history.push(value)
      localStorage.setItem('sudoku-history', this.history.join('|||'))
    },
    DelHistory(index) {
      this.history.splice(index, 1)
      localStorage.setItem('sudoku-history', this.history.join('|||'))
    },
    Restore(vv0) {
      this.game = new GameCore()
      const { cells } = this.game
      vv0.split('-').forEach((vv1, index1) => {
        if (vv1 === '') {
          cells[index1].value = null
        } else {
          cells[index1].value = vv1 - 0
        }
      })
    },
    init() {
      this.game = new GameCore()
    },
    resolve() {
      this.game.resolve()
    },
    SetCell(cell, ee) {
      if (ee.shiftKey) {
        cell.value = null
      } else {
        this.current = cell
        this.$refs.text.value = ''
        this.$refs.text.focus()
      }
    },
    FillCell(ee) {
      // console.log(ee)
      if (ee.keyCode === 8) {
        this.current.value = null
        return
      }
      const val = ee.keyCode - 48
      // console.log(val)
      if (val > 0 && val < 10) {
        this.current.value = val
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
}
.line {
  display: flex;
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

.history {
  position: fixed;
  top: 0;
  right: 0;
  .line {
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #eee;
    margin-bottom: 3px;
    position: relative;
    .del {
      background: #999;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 1em;
      text-align: center;
    }
  }
}
</style>
