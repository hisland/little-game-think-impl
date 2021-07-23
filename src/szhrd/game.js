import { toIndex, toPos } from './util'
import { swapIndex } from './util'
import shuffle from 'lodash-es/shuffle'

export class Game {
  constructor(gridCount = 4) {
    this.gridCount = gridCount
    this.pairCount = 0
    this.InitGrid()
  }
  InitGrid() {
    this.isWin = false
    const serieList = this.SerieGrid(this.gridCount)
    while (true) {
      const randomList = shuffle(serieList)
      const canResolve = this.CheckCanResolve(randomList, this.gridCount)
      console.log(
        'canResolve: ',
        canResolve,
        randomList.map((vv) => vv.cellText)
      )
      if (canResolve) {
        this.list = randomList
        this.pairCount = this.GetPairCount(this.list)
        break
      }
    }
  }
  SerieGrid(gridCount) {
    const list = []
    for (let yy = 0; yy < gridCount; yy++) {
      for (let xx = 0; xx < gridCount; xx++) {
        const index = toIndex(xx, yy, gridCount)
        const cell = {
          isEmpty: false,
          cellIndex: index,
          cellText: index + 1,
        }
        list.push(cell)
      }
    }
    list[gridCount * gridCount - 1].isEmpty = true // 最后一格是空白
    return list
  }
  // 随机生成的数列只有 50% 几率可解, 此算法能检测是否可解
  // https://horatiuvlad.com/unitbv/inteligenta_artificiala/2015/TilesSolvability.html
  CheckCanResolve(list, gridCount) {
    const is_border_odd = gridCount % 2 === 1
    const pairCount = this.GetPairCount(list)
    const is_pairCount_odd = pairCount % 2 === 1
    if (is_border_odd && !is_pairCount_odd) {
      return true
    }
    const emptyIndex = list.findIndex((cell) => cell.isEmpty)
    const [, emptyY] = toPos(emptyIndex, gridCount)
    // 原文从下往上数的奇偶性 与 索引从上往下+1数的奇偶性 **刚好相反**
    const is_emptyY_odd = (emptyY + 1) % 2 === 1
    if (!is_border_odd) {
      // 原文 odd配even, 这里 odd配odd
      if (is_pairCount_odd && is_emptyY_odd) {
        return true
      }
      // 原文 even配odd, 这里 even配even
      if (!is_pairCount_odd && !is_emptyY_odd) {
        return true
      }
    }
    return false
  }
  GetPairCount(list) {
    const nums = list.filter((vv) => !vv.isEmpty).map((cell) => cell.cellText)
    let pairCount = 0
    for (let ii = 0; ii < nums.length; ii++) {
      for (let jj = ii + 1; jj < nums.length; jj++) {
        if (nums[ii] > nums[jj]) {
          pairCount += 1
        }
      }
    }
    return pairCount
  }
  CheckResult() {
    for (const [index, cell] of this.list.entries()) {
      console.log('CheckResult index: ', index, cell.cellIndex)
      if (index !== cell.cellIndex) {
        console.log('CheckResult first not match: ', index, cell.cellIndex)
        return false
      }
    }
    return true
  }
  Tap(cell, cellIndex) {
    if (this.isWin) {
      return alert('你已经赢了, 重新开始吧')
    }
    const emptyIndex = this.list.findIndex((cell) => cell.isEmpty)
    const moved = this.Swap(cellIndex, emptyIndex)
    this.pairCount = this.GetPairCount(this.list)
    if (moved) {
      this.isWin = this.CheckResult()
    }
  }
  Swap(index1, index2) {
    const { gridCount } = this
    const [x1, y1] = toPos(index1, gridCount)
    const [x2, y2] = toPos(index2, gridCount)

    if (x1 === x2 || y1 === y2) {
      if (x1 === x2) {
        // 同列
        if (y1 < y2) {
          //空白 下->上
          for (let ii = y2; ii > y1; ii--) {
            const idx1 = toIndex(x1, ii, gridCount)
            const idx2 = toIndex(x1, ii - 1, gridCount)
            swapIndex(this.list, idx1, idx2)
          }
        } else {
          //空白 上->下
          for (let ii = y2; ii < y1; ii++) {
            const idx1 = toIndex(x1, ii, gridCount)
            const idx2 = toIndex(x1, ii + 1, gridCount)
            swapIndex(this.list, idx1, idx2)
          }
        }
      } else if (y1 === y2) {
        //同行
        if (x1 < x2) {
          //空白左移
          const tmp = this.list.splice(index2, 1)
          this.list.splice(index1, 0, ...tmp)
        } else {
          //空白右移 实践结果和上面一样的操作
          const tmp = this.list.splice(index2, 1)
          this.list.splice(index1, 0, ...tmp)
        }
      }

      return true
    } else {
      console.log('can not move')
      return false
    }
  }
}
