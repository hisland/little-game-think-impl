import { toIndex, toPos } from '../util'

export function isOutOfBounds(rows, cols, absPosList) {
  for (const [absX, absY] of absPosList) {
    if (absX < 0) {
      return true
    }
    if (absX > cols - 1) {
      return true
    }
    if (absY > rows - 1) {
      return true
    }
  }
}
export function isCollision(fills, absIndexList) {
  return absIndexList.some((absIndex) => fills.has(absIndex))
}

export function RotateRelativePos(relativeList) {
  return relativeList.map(([relativeX, relativeY]) => [-relativeY, relativeX])
}

export function GetShapeAbsPos(relativeList, offsetX, offsetY) {
  return relativeList.map(([relativeX, relativeY]) => {
    const absX = offsetX + relativeX
    const absY = offsetY + relativeY
    return [absX, absY]
  })
}

export function GetShapeAbsIndex(absPosList, cols) {
  return absPosList.map(([absX, absY]) => toIndex(absX, absY, cols))
}

export function GetShapeAbsIndexList(relativeList, offsetX, offsetY, cols) {
  return GetShapeAbsPos(relativeList, offsetX, offsetY).map(([absX, absY]) =>
    toIndex(absX, absY, cols)
  )
}
