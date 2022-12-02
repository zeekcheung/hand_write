type Fn = (...args: any) => any

/**
 * 对函数`fn`进行柯里化
 * @param fn 需要柯里化的函数
 * @returns 经过柯里化后的函数
 */
const curry = (fn: Fn): Fn => {
  const argsLen: number = fn.length,
    args: unknown[] = []

  const curriedFn = function (...rest: unknown[]) {
    // 收集参数
    args.push(...rest)
    // 如果参数已经足够，则执行原函数，返回结果
    if (args.length >= argsLen) {
      // 执行函数（注意透传 this 和参数）
      const res = fn.apply(this, args)
      // 清空参数数组
      args.length = 0
      // 返回执行结果
      return res
    }
    // 如果参数还不够，继续返回函数
    return curriedFn
  }

  return curriedFn
}

// ==================== use case ====================
const add = (a: number, b: number, c: number) => a + b + c

const curriedAdd = curry(add)

console.log(curriedAdd(1)(2)(3))  // 6
console.log(curriedAdd(1)(2, 3))  // 6
console.log(curriedAdd(1, 2)(3))  // 6
console.log(curriedAdd(1, 2, 3))  // 6

// eslint-disable-next-line prefer-rest-params
console.log(
  curry(function (a: number, b: number) {
    console.log(this, a, b)
    return a + b
  }).call({}, 1, 2)  // {}, 1, 2
)  // 3
