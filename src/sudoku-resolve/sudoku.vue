<template>
  <div class="wrap" v-if="game">
    <div class="history">
      <div v-for="(vv0, index0) in history" :key="index0" class="line">
        <span @click="RestoreHistory(vv0)">{{ index0 + 1 }}. {{ vv0 }}</span>
        <span class="del" @click="DelHistory(index0)">x</span>
      </div>
    </div>
    <div>
      <div>
        <label> <input type="checkbox" v-model="showAxis" />显示轴 </label>
      </div>
      <div>
        <button @click="init()">全空白</button>
        <button @click="resolve()">解题</button>
        <input type="text" v-model.trim="prefix" placeholder="名字备注" />
        <button @click="SaveCurrent()">保存</button>
        <button @click="game.validate()">验证</button>
      </div>
      <div>
        <button @click="game.TryBlocksOnlyOne()">单宫唯一</button>
        <button @click="game.TryRowsOnlyOne()">单行唯一</button>
        <button @click="game.TryColsOnlyOne()">单列唯一</button>
        <button @click="game.TryCellsOnlyOne()">[宫行列]同时唯一</button>
      </div>
      <div>
        <button @click="game.TryBlockCross()">1-9横竖宫唯一</button>
      </div>
      <div>
        <button @click="game.SetMark()">标记</button>
        <button @click="game.ClearMark()">清除标记</button>
        <button @click="game.TrimMarkNakedPair()">显性数对2对</button>
        <button @click="game.FillNakedSingle()">填写标记唯余</button>
      </div>
      <div>
        <button @click="game.Rotate(true)">旋转-顺时针</button>
        <button @click="game.Rotate(false)">旋转-逆时针</button>
      </div>
    </div>

    <input
      class="hiddenText"
      type="text"
      ref="text"
      @keydown="FillCell($event)"
    />

    <div class="sudokuWrap">
      <div class="cell first" v-if="showAxis"></div>
      <div class="hLine" v-if="showAxis">
        <div class="line">
          <div class="cell axis" v-for="(vv0, index0) in 9" :key="index0">
            {{ vv0 - 1 }}
          </div>
        </div>
      </div>
      <div class="vLine" v-if="showAxis">
        <div class="line" v-for="(vv0, index0) in 9" :key="index0">
          <div class="cell axis">{{ vv0 - 1 }}</div>
        </div>
      </div>
      <div class="grid">
        <div class="line" v-for="(vv0, index0) in game.rows" :key="index0">
          <div
            v-for="(vv1, index1) in vv0"
            :key="index1"
            class="cell"
            :class="{
              currentCell: vv1.index === current.index,
              currentLine:
                vv1.row === current.row ||
                vv1.col === current.col ||
                vv1.block === current.block,
            }"
            @click="SetFocus(vv1, $event)"
          >
            <div class="val1" v-if="vv1.value">{{ vv1.value }}</div>
            <div class="temp" v-else>
              <div class="val2" v-for="(vv0, index0) in 9" :key="index0">
                <span v-if="vv1.tmpValues.has(vv0)">{{ vv0 }}</span>
              </div>
            </div>
          </div>
        </div>
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
      prefix: '',
      game: null,
      current: {},
      history,
      showAxis: false,
    }
  },
  watch: {},
  props: {},
  computed: {},
  methods: {
    SaveCurrent() {
      const qq = this.game.cells.map((vv) => vv.value).join('-')
      const aa = this.prefix ? this.prefix + ': ' + qq : qq
      this.history.push(aa)
      this.SaveLocal()
    },
    DelHistory(index) {
      this.history.splice(index, 1)
      this.SaveLocal()
    },
    SaveLocal() {
      localStorage.setItem('sudoku-history', this.history.join('|||'))
    },
    RestoreHistory(vv0) {
      const [aa, bb] = vv0.split(': ')
      const str = bb || aa
      this.game = new GameCore()
      const { cells } = this.game
      str.split('-').forEach((vv1, index1) => {
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
    SetFocus(cell, ee) {
      if (ee.shiftKey) {
        cell.value = null
        this.$refs.text.value = ''
        this.$refs.text.focus()
      } else {
        this.SetCurrentCell(cell)
      }
    },
    SetCurrentCell(cell) {
      this.current = cell
      this.$refs.text.value = ''
      this.$refs.text.focus()
    },
    FillCell(ee) {
      // console.log(ee)
      if (ee.keyCode === 9) {
        const { index } = this.current
        if (ee.shiftKey) {
          if (index > 0) {
            this.SetCurrentCell(this.game.cells[index - 1])
          }
        } else {
          if (index < 80) {
            this.SetCurrentCell(this.game.cells[index + 1])
          }
        }
        ee.preventDefault()
      } else if (ee.keyCode >= 37 && ee.keyCode <= 40) {
        const { index } = this.current
        const { keyCode } = ee
        let newIndex
        if (keyCode === 37) {
          newIndex = index > 0 ? index - 1 : 80
        } else if (keyCode === 39) {
          newIndex = index < 80 ? index + 1 : 0
        } else if (keyCode === 38) {
          newIndex = index >= 9 ? index - 9 : index
        } else if (keyCode === 40) {
          newIndex = index <= 71 ? index + 9 : index
        }
        this.SetCurrentCell(this.game.cells[newIndex])
        ee.preventDefault()
      } else if (ee.keyCode === 8 || ee.keyCode === 32) {
        this.current.value = null
      } else {
        const val = ee.keyCode - 48
        // console.log(val)
        if (val > 0 && val < 10) {
          this.game.SetValue(this.current, val)
        }
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
@use "sass:math";

$border-color1: #2b2c2e;
$border-color2: #aaabac;
$cell-size: 48px;

.sudokuWrap {
  margin: 20px;
  display: flex;
  flex-wrap: wrap;
  width: $cell-size * 10 + 3px * 3;
  .cell {
    width: $cell-size;
    height: $cell-size;
    flex: 1 1 auto;
    box-sizing: border-box;
    &.first {
      border: 1px solid $border-color1;
      background: #eee;
      width: $cell-size + 3px;
      height: $cell-size + 3px;
    }
    &.currentLine {
      background: #e3eef4;
    }
    &.currentCell {
      background: #bae0f9;
    }
  }
  .hLine {
    flex: 1 1 auto;
    display: flex;
    color: #ddd;
    border: 3px solid $border-color1;
    border-bottom: none;
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eee;
      border-top: none;
      border-right: 1px solid $border-color2;
      border-bottom: none;
    }
  }
  .vLine {
    width: $cell-size;
    flex: 1 1 auto;
    color: #ddd;
    border: 3px solid $border-color1;
    border-right: none;
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eee;
      border-right: none;
      border-bottom: 1px solid $border-color2;
      border-left: none;
    }
  }
  .grid {
    flex: 1 1 auto;
    border: 3px solid $border-color1;
  }

  .line {
    flex: 1 1 auto;
    display: flex;
    &:nth-child(3) .cell,
    &:nth-child(6) .cell {
      border-bottom: 3px solid $border-color1;
    }
    &:nth-child(9) .cell {
      border-bottom: none;
    }
  }
  .cell {
    border-right: 1px solid $border-color2;
    border-bottom: 1px solid $border-color2;
    &:nth-child(3),
    &:nth-child(6) {
      border-right: 3px solid $border-color1;
    }
    &:nth-child(9) {
      border-right: none;
    }
  }
  .cell {
    position: relative;
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
        width: math.div(1, 3) * 100%;
        height: math.div(1, 3) * 100%;
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

.hiddenText {
  position: absolute;
  top: -1000px;
  opacity: 0;
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
