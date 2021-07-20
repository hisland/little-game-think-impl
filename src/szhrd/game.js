import { toIndex, toPos, swapIndex } from './util'
import shuffle from 'lodash-es/shuffle'

export class Game {
  constructor(gridCount = 4) {
    this.gridCount = gridCount
    this.InitGrid()
  }
  InitGrid() {
    this.isWin = false
    const list1 = this.RandomGrid(this.gridCount)
    while (true) {
      const list2 = shuffle(list1)
      const canResolve = this.CheckCanResolve(list2, this.gridCount)
      console.log(
        'canResolve: ',
        canResolve,
        list2.map((vv) => vv.cellText)
      )
      if (canResolve) {
        this.list = list2
        break
      }
    }
  }
  RandomGrid(gridCount) {
    const list = []
    for (let yy = 0; yy < gridCount; yy++) {
      for (let xx = 0; xx < gridCount; xx++) {
        const idx = toIndex(xx, yy, gridCount)
        const cell = {
          isEmpty: xx === gridCount - 1 && yy === gridCount - 1, // 最后一格是空白
          cellIndex: idx,
          cellText: idx + 1,
        }
        list.push(cell)
      }
    }
    return list
  }
  CheckCanResolve(list, gridCount) {
    const isBorderOdd = gridCount % 2 === 1
    const nums = list.filter((vv) => !vv.isEmpty).map((cell) => cell.cellText)
    let pairCount = 0
    for (let ii = 0; ii < nums.length; ii++) {
      for (let jj = ii + 1; jj < nums.length; jj++) {
        if (nums[ii] > nums[jj]) {
          pairCount += 1
        }
      }
    }
    const isPairCountOdd = pairCount % 2 === 1
    if (isBorderOdd && !isPairCountOdd) {
      return true
    }
    const emptyIndex = list.findIndex((cell) => cell.isEmpty)
    const [, emptyY] = toPos(emptyIndex, gridCount)
    const isEmptyYOdd = (emptyY + 1) % 2 === 1
    if (!isBorderOdd) {
      if (isPairCountOdd && isEmptyYOdd) {
        return true
      }
      if (!isPairCountOdd && !isEmptyYOdd) {
        return true
      }
    }
    return false
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
