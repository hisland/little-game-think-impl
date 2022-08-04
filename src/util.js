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

// 顺时针基于原点旋转坐标
export function RotateRight([deltaX, deltaY]) {
  return [-deltaY, deltaX]
}
// 逆时针基于原点旋转坐标
export function RotateLeft([deltaX, deltaY]) {
  return [deltaY, -deltaX]
}

export function swapIndex(list, index1, index2) {
  const tmp = list[index1]
  list[index1] = list[index2]
  list[index2] = tmp
}

export function randomInt(min, max) {
  if (max === void 0) {
    max = min
    min = 0
  }
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new TypeError('randomInt Expected all arguments to be numbers')
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function SaveLocalJSON(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj))
}
export function GetLocalJSON(key) {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : saved
}
export function GetLocalJSONByVersion(key, newObj) {
  const saved = localStorage.getItem(key)
  if (saved) {
    const obj = JSON.parse(saved)
    if (obj.version !== newObj.version) {
      return newObj
    } else {
      return obj
    }
  } else {
    return newObj
  }
}
