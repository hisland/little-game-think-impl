import { randomInt } from '../util'
import { toIndex } from '../util'

export default class Game {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.max = rows * cols
    this.state = 'running'
    this.initCells()
    this.randomInt()

    console.log(
      this.GenLinesByDir('left')
        .map((line) => line.map((cell) => cell.index).join('-'))
        .join('\n')
    )
    console.log(
      this.GenLinesByDir('right')
        .map((line) => line.map((cell) => cell.index).join('-'))
        .join('\n')
    )
    console.log(
      this.GenLinesByDir('up')
        .map((line) => line.map((cell) => cell.index).join('-'))
        .join('\n')
    )
    console.log(
      this.GenLinesByDir('down')
        .map((line) => line.map((cell) => cell.index).join('-'))
        .join('\n')
    )
  }
  initCells() {
    const list = []
    for (let ii = 0; ii < this.max; ii++) {
      list.push({
        index: ii,
        value: 0,
      })
    }
    this.cells = list
  }
  randomInt() {
    const emptyCells = this.cells.filter(({ value }) => value === 0)
    if (emptyCells.length) {
      const rnd_index = randomInt(0, emptyCells.length - 1)
      const rnd_value = Math.random() < 0.5 ? 2 : 4
      emptyCells[rnd_index].value = rnd_value
    }
  }
  CheckCanMove() {
    // 有空格可移动, 直接返回
    for (const cell of this.cells) {
      if (cell.value === 0) return true
    }
    // 没有空格, 依次检查各方向是否能合并
    for (const dir of ['left', 'up', 'right', 'down']) {
      for (const line of this.GenLinesByDir(dir)) {
        let prev = line.shift()
        for (const cell of line) {
          // 挨着的 2 个 cell 值相同即可以合并, 直接返回
          if (prev.value === cell.value) {
            return true
          } else {
            prev = cell
          }
        }
      }
    }
    return false
  }
  GenLinesByDir3(dir) {
    // 想要统合各方向为一个循环体, 感觉太复杂了, 放弃
    // 至少要分成 左右, 上下 2部分, 懒得搞了
    const { rows, cols, cells } = this
    const outer_max = dir === 'left' || dir === 'right' ? rows : cols
    const inner_max = dir === 'left' || dir === 'right' ? cols : rows
    const inner_dir = dir === 'left' || dir === 'up' ? 1 : -1
    const inner_base =
      dir === 'left' || dir === 'up' ? 0 : dir === 'right' ? cols - 1 : rows - 1
    const rs = []
    for (let ii = 0; ii < outer_max; ii++) {
      const line = []
      for (let jj = 0; jj < inner_max; jj++) {
        const idx = toIndex(jj * inner_dir + inner_base, ii, cols)
        line.push(cells[idx])
      }
      rs.push(line)
    }
    return rs
  }
  GenLinesByDir(dir) {
    const { rows, cols, cells } = this
    const rs = []
    if (dir === 'left') {
      for (let row = 0; row < rows; row++) {
        const line = []
        for (let col = 0; col < cols; col++) {
          const idx = toIndex(col, row, cols)
          line.push(cells[idx])
        }
        rs.push(line)
      }
    } else if (dir === 'right') {
      for (let row = 0; row < rows; row++) {
        const line = []
        for (let col = 0; col < cols; col++) {
          // 用减法获得 3,2,1,0..., 使左右循环统一
          const idx = toIndex(cols - 1 - col, row, cols)
          line.push(cells[idx])
        }
        rs.push(line)
      }
    } else if (dir === 'up') {
      for (let col = 0; col < cols; col++) {
        const line = []
        for (let row = 0; row < rows; row++) {
          const idx = toIndex(col, row, cols)
          line.push(cells[idx])
        }
        rs.push(line)
      }
    } else if (dir === 'down') {
      for (let col = 0; col < cols; col++) {
        const line = []
        for (let row = 0; row < rows; row++) {
          // 用减法获得 3,2,1,0..., 使上下循环统一
          const idx = toIndex(col, rows - 1 - row, cols)
          line.push(cells[idx])
        }
        rs.push(line)
      }
    }
    return rs
  }
  GenLinesByDir1(dir) {
    const { rows, cols, cells } = this
    const rs = []
    if (dir === 'left') {
      for (let row = 0; row < rows; row++) {
        const line = []
        // 0,1,2,3... 递增
        for (let col = 0; col < cols; col++) {
          const idx = toIndex(col, row, cols)
          line.push(cells[idx])
        }
        rs.push(line)
      }
    } else if (dir === 'right') {
      for (let row = 0; row < rows; row++) {
        const line = []
        // 3,2,1,0... 递减
        for (let col = cols - 1; col >= 0; col--) {
          const idx = toIndex(col, row, cols)
          line.push(cells[idx])
        }
        rs.push(line)
      }
    } else if (dir === 'up') {
      for (let col = 0; col < cols; col++) {
        const line = []
        for (let row = 0; row < rows; row++) {
          const idx = toIndex(col, row, cols)
          line.push(cells[idx])
        }
        rs.push(line)
      }
    } else if (dir === 'down') {
      for (let col = 0; col < cols; col++) {
        const line = []
        for (let row = rows - 1; row >= 0; row--) {
          const idx = toIndex(col, row, cols)
          line.push(cells[idx])
        }
        rs.push(line)
      }
    }
    return rs
  }
  DoMove(dir) {
    let moved = false
    for (const line of this.GenLinesByDir(dir)) {
      let prev_index = 0
      let prev_cell = line[prev_index]
      for (let ii = 1; ii < line.length; ii++) {
        const cell = line[ii]
        if (cell.value > 0) {
          if (prev_cell.value === 0) {
            prev_cell.value = cell.value
            cell.value = 0
            moved = true
          } else if (prev_cell.value === cell.value) {
            prev_cell.value += cell.value
            cell.value = 0
            prev_index += 1
            prev_cell = line[prev_index]
            moved = true
          } else {
            prev_index += 1
            prev_cell = line[prev_index]
            if (prev_cell !== cell) {
              prev_cell.value = cell.value
              cell.value = 0
              moved = true
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
