<template>
  <div class="wrap">
    <div>
      <span>
        <span>宽度</span>
        <input type="text" v-model.number="config.cols" style="width: 30px" />
      </span>
      <span>
        <span>高度</span>
        <input type="text" v-model.number="config.rows" style="width: 30px" />
      </span>
      <span>
        <label>
          <input type="checkbox" v-model="config.isSetBase" />
          <span>设置基点</span>
        </label>
      </span>
      <button @click="RotateLeft()">左旋</button>
      <button @click="RotateRight()">右旋</button>
      <button @click="Clear()">清除</button>
    </div>
    <div class="cellWrap" :style="{ width: wrapWidth2 }">
      <div class="legend1">
        <div class="cell"></div>
      </div>
      <div class="legend2" :style="{ width: wrapWidth1 }">
        <div v-for="(vv0, index0) in config.cols" :key="index0" class="cell">
          {{ index0 - config.baseX }}
        </div>
      </div>
      <div class="legend3">
        <div v-for="(vv0, index0) in config.rows" :key="index0" class="cell">
          {{ index0 - config.baseY }}
        </div>
      </div>
      <div class="legend4" :style="{ width: wrapWidth1 }">
        <div
          v-for="(vv0, index0) in config.rows * config.cols"
          :key="index0"
          class="cell"
          @click="ClickCell(index0)"
          @mousedown="DownFill(index0)"
          @mouseenter="MoveFill(index0)"
          :class="{ fill: fills.has(index0), base: isBase(index0) }"
        ></div>
      </div>
    </div>
  </div>
  <div>
    {{ shapeIndex }}
  </div>
</template>
<script>
import { toIndex, toPos } from '../util'
import { RotateRight, RotateLeft } from '../util'

import GameCore from './game.js'
export default {
  components: {},
  data() {
    return {
      config: {
        cols: 15,
        rows: 20,
        baseX: 0,
        baseY: 0,
        isSetBase: false,
      },
      isFill: false,
      fills: new Set(),
    }
  },
  watch: {},
  props: {},
  computed: {
    wrapWidth1() {
      return this.config.cols * (20 + 2) + 'px'
    },
    wrapWidth2() {
      return (this.config.cols + 1) * (20 + 2) + 'px'
    },
    shapeIndex() {
      const list = []
      const fills = [...this.fills].sort()
      for (const index of fills) {
        const [xx, yy] = toPos(index, this.config.cols)
        list.push([xx - this.config.baseX, yy - this.config.baseY])
      }
      return list
    },
  },
  methods: {
    isBase(index) {
      const [xx, yy] = toPos(index, this.config.cols)
      return this.config.baseX === xx && this.config.baseY === yy
    },
    ClickCell(index) {
      if (this.config.isSetBase) {
        const [xx, yy] = toPos(index, this.config.cols)
        this.SetBase(xx, yy)
      }
    },
    SetBase(xx, yy) {
      this.config.baseX = xx
      this.config.baseY = yy
    },
    ToggleFill(index) {
      if (this.fills.has(index)) {
        this.fills.delete(index)
      } else {
        this.fills.add(index)
      }
    },
    DownFill(index) {
      if (!this.config.isSetBase) {
        this.isFill = true
        this.ToggleFill(index)
        const mouseup = () => {
          this.isFill = false
          window.removeEventListener('mouseup', mouseup)
        }
        window.addEventListener('mouseup', mouseup)
      }
    },
    MoveFill(index) {
      if (this.isFill) {
        this.ToggleFill(index)
      }
    },
    RotateRight() {
      const fills = new Set()
      for (const rPos of this.shapeIndex) {
        const [dx, dy] = RotateRight(rPos)
        const ax = dx + this.config.baseX
        const ay = dy + this.config.baseY
        const index = toIndex(ax, ay, this.config.cols)
        fills.add(index)
      }
      this.fills = fills
    },
    RotateLeft() {
      const fills = new Set()
      for (const rPos of this.shapeIndex) {
        const [dx, dy] = RotateLeft(rPos)
        const ax = dx + this.config.baseX
        const ay = dy + this.config.baseY
        const index = toIndex(ax, ay, this.config.cols)
        fills.add(index)
      }
      this.fills = fills
    },
    Clear() {
      this.fills = new Set()
    },
  },
  mounted() {},
}
</script>
<style scoped lang="scss">
.cellWrap {
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
}
.legend1 {
  width: 22px;
  height: 22px;
}
.legend2 {
  display: flex;
}
.legend3 {
  width: 22px;
}
.legend4 {
  display: flex;
  flex-wrap: wrap;
}
.legend1,
.legend2,
.legend3 {
  .cell {
    background-color: #eee;
  }
}
.cell {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  box-sizing: border-box;
  cursor: default;
  user-select: none;
  background-color: #ccc;
  margin: 0 2px 2px 0;
  &.fill {
    background-color: green;
  }
  &.base {
    border: 1px solid red;
  }
}
</style>
