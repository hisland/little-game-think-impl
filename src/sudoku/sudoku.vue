<template>
  <div class="wrap" v-if="game">
    <div class="history">
      <div v-for="(vv0, index0) in history" :key="index0" class="line">
        <span @click="Restore(vv0)">{{index0+1}}: {{vv0}}</span>
        <span class="del" @click="DelHistory(index0)">x</span>
      </div>
    </div>
    <div>
      <div>
        <button @click="init()">全空白</button>
        <button @click="resolve()">解题</button>
        <button @click="SaveLocal()">保存</button>
        <button @click="game.validate()">验证</button>
      </div>
      <div>
        <button @click="game.TryBlocks()">单宫唯一</button>
        <button @click="game.TryRows()">单行唯一</button>
        <button @click="game.TryCols()">单列唯一</button>
        <button @click="game.TryCells()">[宫行列]同时唯一</button>
      </div>
      <div>
        <button @click="game.TryBlockRowCol()">1-9横竖宫唯一</button>
      </div>
      <div>
        <button @click="game.TryMark()">标记</button>
      </div>
    </div>
    <input type="text" ref="text" @keyup="FillCell($event)" />

    <div class="sudokuWrap">
      <div class="cell first"></div>
      <div class="hLine">
        <div
          class="cell axis"
          :class="{hBold:(index0%3===0)}"
          v-for="(vv0, index0) in 9"
          :key="index0"
        >{{vv0-1}}</div>
      </div>
      <div class="vLine">
        <div
          class="cell axis"
          :class="{vBold:(index0%3===0)}"
          v-for="(vv0, index0) in 9"
          :key="index0"
        >{{vv0-1}}</div>
      </div>
      <div class="grid">
        <div class="line" v-for="(vv0, index0) in game.rows" :key="index0">
          <div
            v-for="(vv1, index1) in vv0"
            :key="index1"
            class="cell"
            :class="{hBold:(index1%3===0),vBold:(index0%3===0),currentCell:(vv1.index===current.index),currentLine:(vv1.row===current.row||vv1.col===current.col||vv1.block===current.block)}"
            @click="SetCell(vv1, $event)"
          >
            <div class="val1" v-if="vv1.value">{{vv1.value}}</div>
            <div class="temp" v-else>
              <div class="val2" v-for="(vv0, index0) in 9" :key="index0">
                <span v-if="vv1.tmpValues.has(vv0)">{{vv0}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cellWrap">
      <div class="vLine1"></div>
      <div class="vLine2"></div>
      <div class="hLine1"></div>
      <div class="hLine2"></div>
      <div class="line">
        <div class="cell axis"></div>
        <div class="cell axis" v-for="(vv0, index0) in 9" :key="index0">{{vv0-1}}</div>
      </div>
      <div class="line" v-for="(vv0, index0) in game.rows" :key="index0">
        <div class="cell axis">{{index0}}</div>
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
    const history = LocalHistory
      ? LocalHistory.split('|||')
      : [
          '3--5-2---9-6----9-3-1-8--2--4---5-6-9-7---9-7--4---3-8-------2----8-5-2--3-1-6-7------2-----2--4--9-3-1-5-6-1--7-6----4-9',
        ]
    return {
      game: null,
      current: {},
      history,
    }
  },
  watch: {},
  props: {},
  computed: {},
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

    window.kkk = this
  },
}
</script>
<style scoped lang="scss">
$border-color1: #2b2c2e;
$border-color2: #aaabac;

.sudokuWrap {
  margin: 10px;
  $size: 48px;
  display: flex;
  flex-wrap: wrap;
  width: $size * 10;
  .cell {
    width: $size;
    height: $size;
    flex: 0 0 auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    &.first {
      border: 1px solid $border-color1;
    }
    &.hBold {
      border-left: 3px solid $border-color1;
      margin-left: -1px;
    }
    &.vBold {
      border-top: 3px solid $border-color1;
      margin-top: -1px;
    }
    &.currentLine {
      background: #e3eef4;
    }
    &.currentCell {
      background: #bae0f9;
    }
  }
  .hLine {
    height: $size;
    width: $size * 9;
    flex: 1 1 auto;
    display: flex;
    color: #999;
    .cell {
      background: #eee;
      border-top: 1px solid $border-color2;
      border-right: 1px solid $border-color2;
      border-bottom: 1px solid $border-color2;
    }
  }
  .vLine {
    width: $size;
    height: $size * 9;
    flex: 0 0 auto;
    color: #999;
    .cell {
      background: #eee;
      border-right: 1px solid $border-color2;
      border-bottom: 1px solid $border-color2;
      border-left: 1px solid $border-color2;
    }
  }
  .grid {
    flex: 1 1 auto;
    .line {
      display: flex;
    }
    .cell {
      position: relative;
      border-bottom: 1px solid $border-color2;
      border-right: 1px solid $border-color2;
    }
    .val1 {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .temp {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      .val2 {
        width: 1/3 * 100%;
        height: 1/3 * 100%;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        color: $border-color2;
      }
    }
  }
}

.cellWrap {
  position: relative;
  .vLine1 {
    position: absolute;
    background: green;
    width: 196px;
    height: 2px;
    top: 86px;
    left: 22px;
  }
  .vLine2 {
    position: absolute;
    background: green;
    width: 196px;
    height: 2px;
    top: 152px;
    left: 22px;
  }
  .hLine1 {
    position: absolute;
    background: green;
    width: 2px;
    height: 196px;
    left: 86px;
    top: 22px;
  }
  .hLine2 {
    position: absolute;
    background: green;
    width: 2px;
    height: 196px;
    left: 152px;
    top: 22px;
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
    &.axis {
      background-color: #eee;
      color: #999;
    }
  }
}

.history {
  position: fixed;
  top: 0;
  right: 0;
  .line {
    font-family: monospace;
    width: 120px;
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
