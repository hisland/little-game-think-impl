import { randomInt } from '../util'
import { toIndex, toPos } from '../util'

export default class Game {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.max = rows * cols
    this.state = 'running'
    this.guid = 0
    this.cells = []
    this.randomInt()

    // this.setInt(0, 4)
    // this.setInt(1, 2)
    // this.setInt(2, 4)
    // this.setInt(0, 4)
    // this.setInt(1, 4)
    // this.setInt(2, 2)
    // this.setInt(0, 16)

    // this.setInt(1, 8)
    // this.setInt(2, 4)
    // this.setInt(3, 2)
    // this.setInt(4, 2)
    // this.setInt(5, 4)
    // this.setInt(6, 16)
    // this.setInt(7, 32)
    // this.setInt(8, 4)
    // this.setInt(9, 6)
    // this.setInt(10, 32)
    // this.setInt(11, 4)
    // this.setInt(12, 16)
    // this.setInt(13, 32)
    // this.setInt(14, 2)
    // this.setInt(15, 64)
  }
  setInt(index, rnd_value) {
    const [xx, yy] = toPos(index, this.cols)
    this.cells.push({
      uid: this.guid++,
      style: {
        left: xx * 55 + 5 + 'px',
        top: yy * 55 + 5 + 'px',
      },
      index: index,
      value: rnd_value,
    })
  }
  setCellIndex(cell, index) {
    cell.index = index
    const [xx, yy] = toPos(index, this.cols)
    cell.style = {
      left: xx * 55 + 5 + 'px',
      top: yy * 55 + 5 + 'px',
    }
  }
  randomInt() {
    const has_index = this.cells.map((vv) => vv.index)
    console.log('has_index: ', has_index)
    const rest_index = []
    for (let ii = 0; ii < this.max; ii++) {
      if (has_index.indexOf(ii) === -1) {
        rest_index.push(ii)
      }
    }
    if (rest_index.length) {
      console.log('rest_index: ', rest_index)
      const rnd_index = randomInt(0, rest_index.length - 1)
      const index = rest_index[rnd_index]
      const rnd_value = Math.random() < 0.5 ? 2 : 4
      const [xx, yy] = toPos(index, this.cols)
      this.cells.push({
        uid: this.guid++,
        style: {
          left: xx * 55 + 5 + 'px',
          top: yy * 55 + 5 + 'px',
        },
        index: index,
        value: rnd_value,
      })
    }
  }
  CheckCanMove() {
    const { cells } = this
    // 有空格可移动, 直接返回
    if (cells.length < this.max) return true
    // 没有空格, 依次检查各方向是否能合并
    for (const dir of ['left', 'up', 'right', 'down']) {
      for (const line of this.GenLinesByDir(dir)) {
        let prev_index = line.shift()
        let prev_cell = cells.find((vv) => vv.index === prev_index)
        for (const now_index of line) {
          const now_cell = cells.find((vv) => vv.index === now_index)
          // 挨着的 2 个 cell 值相同即可以合并, 直接返回
          if (prev_cell.value === now_cell.value) {
            return true
          } else {
            prev_index = now_index
            prev_cell = now_cell
          }
        }
      }
    }
    return false
  }
  GenLinesByDir(dir) {
    const { rows, cols } = this
    const rs = []
    if (dir === 'left') {
      for (let row = 0; row < rows; row++) {
        const line = []
        for (let col = 0; col < cols; col++) {
          const idx = toIndex(col, row, cols)
          line.push(idx)
        }
        rs.push(line)
      }
    } else if (dir === 'right') {
      for (let row = 0; row < rows; row++) {
        const line = []
        for (let col = 0; col < cols; col++) {
          // 用减法获得 3,2,1,0..., 使左右循环统一
          const idx = toIndex(cols - 1 - col, row, cols)
          line.push(idx)
        }
        rs.push(line)
      }
    } else if (dir === 'up') {
      for (let col = 0; col < cols; col++) {
        const line = []
        for (let row = 0; row < rows; row++) {
          const idx = toIndex(col, row, cols)
          line.push(idx)
        }
        rs.push(line)
      }
    } else if (dir === 'down') {
      for (let col = 0; col < cols; col++) {
        const line = []
        for (let row = 0; row < rows; row++) {
          // 用减法获得 3,2,1,0..., 使上下循环统一
          const idx = toIndex(col, rows - 1 - row, cols)
          line.push(idx)
        }
        rs.push(line)
      }
    }
    return rs
  }
  DoMove(dir) {
    let moved = false
    for (const line of this.GenLinesByDir(dir)) {
      let prev = 0
      let prev_index = line[prev]
      let prev_cell = this.cells.find((vv) => vv.index === prev_index)
      for (let ii = 1; ii < line.length; ii++) {
        const now_index = line[ii]
        const now_cell = this.cells.find((vv) => vv.index === now_index)
        // debugger
        if (now_cell) {
          if (!prev_cell) {
            this.setCellIndex(now_cell, prev_index)
            prev_cell = now_cell
            moved = true
          } else if (prev_cell.value === now_cell.value) {
            const idx = this.cells.findIndex((vv) => vv === prev_cell)
            this.cells.splice(idx, 1)

            now_cell.value += prev_cell.value
            this.setCellIndex(now_cell, prev_index)

            prev += 1
            prev_index = line[prev]
            prev_cell = null

            moved = true
          } else {
            prev += 1
            prev_index = line[prev]
            prev_cell = this.cells.find((vv) => vv.index === prev_index)
            if (!prev_cell) {
              ii--
            }
          }
        }
      }
    }
    return moved
  }
  TryMove(dir) {
    if (this.state !== 'fail') {
      console.log('move', dir)
      if (this.DoMove(dir)) {
        this.randomInt()
        if (!this.CheckCanMove()) {
          this.state = 'fail'
        }
      } else {
        console.log('not move')
      }
    } else {
      console.log('you are fail!')
    }
  }
  MoveLeft() {
    this.TryMove('left')
  }
  MoveUp() {
    this.TryMove('up')
  }
  MoveRight() {
    this.TryMove('right')
  }
  MoveDown() {
    this.TryMove('down')
  }
}
