// x,y 转换成 index, x,y 坐标从 0 开始
export function toIndex(xx, yy, lineCount) {
  return lineCount * yy + xx
}

// index 转换成 x,y
export function toPos(index, lineCount) {
  const xx = index % lineCount
  const yy = (index - xx) / lineCount
  return [xx, yy]
}

export function swapIndex(list, index1, index2) {
  const tmp = list[index1]
  list[index1] = list[index2]
  list[index2] = tmp
}
