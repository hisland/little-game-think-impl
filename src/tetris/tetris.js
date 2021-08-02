import { toIndex, toPos } from '../util'
import { RotateRelativePos } from './util'
import { isOutOfBounds } from './util'
import { isCollision } from './util'
import { GetShapeAbsPos, GetShapeAbsIndex, GetShapeAbsIndexList } from './util'

const shapes = [
  {
    name: 'Ll',
    blocks: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [1, 1],
    ],
  },
  {
    name: 'line',
    blocks: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [2, 0],
    ],
  },
  {
    name: 'Lr',
    blocks: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-1, 1],
    ],
  },
  {
    name: 'Zl',
    blocks: [
      [-1, 0],
      [0, 0],
      [0, 1],
      [1, 1],
    ],
  },
  {
    name: 'square',
    blocks: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
  },
  {
    name: 'Zr',
    blocks: [
      [0, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
    ],
  },
  {
    name: 'T',
    blocks: [
      [-1, 0],
      [0, 0],
      [1, 0],
      [0, 1],
    ],
  },
]
export default class TetrisGame {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.max = rows * cols
    this.fills = new Set()
    this.shape1 = this.RandomShape()
    this.shape1Set = new Set()
    this.shape2 = this.RandomShape()
    this.shapeX = Math.floor(this.cols / 2)
    this.shapeY = 0
    this.state = 'running'
    this.RefreshShape()

    // for (let ii = 15 * 17; ii < 15 * 18 - 1; ii++) {
    //   this.fills.add(ii)
    // }
    // this.fills.add(277)
    // for (let ii = 15 * 19; ii < 15 * 20 - 1; ii++) {
    //   this.fills.add(ii)
    // }
  }
  resume() {
    this.state = 'running'
  }
  pause() {
    this.state = 'paused'
  }
  ToggleRun() {
    if (this.state === 'paused') {
      this.resume()
    } else if (this.state === 'running') {
      this.pause()
    }
  }
  NextShape() {
    this.shape1 = this.shape2
    this.shape2 = this.RandomShape()
    this.shapeX = Math.floor(this.cols / 2)
    this.shapeY = 0
    this.RefreshShape()
  }
  RefreshShape() {
    const list = GetShapeAbsIndexList(
      this.shape1.blocks,
      this.shapeX,
      this.shapeY,
      this.cols
    )
    this.shape1Set = new Set(list)
  }
  Rotate() {
    const { shapeX, shapeY } = this
    const newBlocks = RotateRelativePos(this.shape1.blocks)
    const movedAbsPos = GetShapeAbsPos(newBlocks, shapeX, shapeY)
    const cannot1 = isOutOfBounds(this.rows, this.cols, movedAbsPos)
    const movedAbsIndex = GetShapeAbsIndex(movedAbsPos, this.cols)
    const cannot2 = isCollision(this.fills, movedAbsIndex)

    if (!cannot1 && !cannot2) {
      this.shape1.blocks = newBlocks
      this.RefreshShape()
    }
  }
  CanMove(dir) {
    // debugger
    let { shapeX, shapeY } = this
    if (dir === 'left') shapeX += -1
    else if (dir === 'right') shapeX += 1
    else if (dir === 'down') shapeY += 1

    const movedAbsPos = GetShapeAbsPos(this.shape1.blocks, shapeX, shapeY)
    const cannot1 = isOutOfBounds(this.rows, this.cols, movedAbsPos)
    const movedAbsIndex = GetShapeAbsIndex(movedAbsPos, this.cols)
    const cannot2 = isCollision(this.fills, movedAbsIndex)

    return !cannot1 && !cannot2
  }
  MoveShapeLeft() {
    if (this.CanMove('left')) {
      this.shapeX--
      this.RefreshShape()
    }
  }
  MoveShapeRight() {
    if (this.CanMove('right')) {
      this.shapeX++
      this.RefreshShape()
    }
  }
  MoveShapeDown() {
    if (this.CanMove('down')) {
      console.log('down')
      this.shapeY++
      this.RefreshShape()
    } else {
      console.log('stack')
      for (const absIndex of this.shape1Set) {
        this.fills.add(absIndex)
      }
      this.RemoveFullLines()
      this.NextShape()
    }
  }
  RemoveFullLines() {
    console.log('RemoveFullLines: ')
    const { fills, rows, cols } = this
    let down_lines = 0
    for (let yy = rows - 1; yy >= 0; yy--) {
      // 每行, 从下往上检查
      console.log('RemoveFullLines: yy', yy)
      let count1 = 0
      let count0 = 0
      for (let xx = 0; xx <= cols - 1; xx++) {
        // console.log('RemoveFullLines: xx', xx)
        // 每列, 从左往右检查
        const index = toIndex(xx, yy, cols)
        if (fills.has(index)) {
          count1 += 1
          // 如果有消除行, 需要下移 down_lines 行
          if (down_lines > 0) {
            fills.delete(index)
            fills.add(index + cols * down_lines)
          }
        } else {
          count0 += 1
        }
      }
      if (count0 === cols) {
        // 全白, 说明再往上已经没有需要检查的了,直接跳出
        console.log('RemoveFullLines: 全白', yy)
        break
      }
      if (count1 === cols) {
        console.log('RemoveFullLines: 全黑', yy)
        // 全黑, 消除
        for (let xx = 0; xx <= cols - 1; xx++) {
          // 因为上面已经下移, 再次消除需要指定偏移 down_lines 行
          const index = toIndex(xx, yy + down_lines, cols)
          fills.delete(index)
        }
        down_lines++
      }
    }
  }
  RandomShape() {
    const rid = Math.floor(Math.random() * shapes.length)
    // return shapes[1]
    return shapes[rid]
  }
}
