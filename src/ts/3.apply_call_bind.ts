// @ts-nocheck
type Fn = (...args: unknown[]) => unknown

type ApplyMethod = (
  this: FnWithMethod,
  thisArg: unknown,
  args: unknown[]
) => unknown

type CallMethod = (
  this: FnWithMethod,
  thisArg: unknown,
  ...args: unknown[]
) => unknown

type BindMethod = (
  this: FnWithMethod,
  thisArg: unknown,
  ...args: unknown[]
) => Fn

type FnWithMethod = Fn & {
  _apply: ApplyMethod
  _call: CallMethod
  _bind: BindMethod
}

/**
 * 实现 Function.prototype.apply 方法
 */
const apply: ApplyMethod = function (this, thisArg, args) {
  // 如果 thisArg 是基本数据类型，则将其转换为对应的封装类型
  if (typeof thisArg !== 'object' || thisArg === null) {
    // 如果 thisArg 是 null/undefined，则将其转换为全局对象（window/globalThis）
    thisArg =
      thisArg === null || thisArg === undefined
        ? typeof window !== undefined
          ? window
          : globalThis
        : Object(thisArg)
  }
  // 将原函数作为 thisArg 对象的方法执行
  const key = Symbol('fn')
  Object.defineProperty(thisArg, key, {
    value: this, // 不可枚举
  })
  const res = (thisArg as object)[key](...args)
  // 清除 key
  delete (thisArg as object)[key]
  // 返回执行结果
  return res
}

/**
 * 实现 FUnction.prototype.call 方法
 */
const call: CallMethod = function (this, thisArg, ...args) {
  return this._apply(thisArg, args)
}

/**
 * 实现 Function.prototype.bind 方法
 */
const bind: BindMethod = function (this, thisArg, ...args) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const that = this
  // 返回一个新的函数，该函数绑定了 this 和部分参数
  return function (...rest: unknown[]) {
    return that._apply(thisArg, [...args, ...rest])
  }
}

Object.defineProperties(Function.prototype, {
  _apply: { value: apply },
  _call: { value: call },
  _bind: { value: bind },
})

// ==================== use case ====================
const fn = function (...nums: number[]) {
  console.log(this)
  return nums.reduce((prevSum, num) => prevSum + num, 0)
}

const nums = [1, 2, 3]

console.log(fn._apply(1, nums))  // { 1 }\n  6
console.log(fn._apply(undefined, nums))  // window\n 6
console.log(fn._apply(null, nums))  // window\n 6
console.log(fn._apply({}, nums))  // {}\n 6

// console.log(fn._call(1, ...nums))
// console.log(fn._call(undefined, ...nums))
// console.log(fn._call(null, ...nums))
// console.log(fn._call({}, ...nums))

// console.log(fn._bind(1, 1)(2, 3))
// console.log(fn._bind(undefined, 1, 2)(3))
// console.log(fn._bind(null)(1, 2, 3))
// console.log(fn._bind({}, ...nums)())
