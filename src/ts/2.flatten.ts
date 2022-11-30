/**
 * 通过 Array.prototype.reduce 实现数组扁平化
 * @param arr 需要扁平化的数组
 * @returns 扁平化后的数组
 */
const flattenArray1 = (arr: unknown[]): unknown[] =>
  arr.reduce<unknown[]>(
    (res, item) => res.concat(Array.isArray(item) ? flattenArray1(item) : item),
    []
  );

/**
 * 通过 递归 实现数组扁平化
 * @param arr 需要扁平化的数组
 * @returns 扁平化后的数组
 */
const flattenArray2 = (arr: unknown[]): unknown[] => {
  const res: unknown[] = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      res.push(...flattenArray2(item));
    } else {
      res.push(item);
    }
  })
  return res;
}

type Obj = Record<string, unknown>
/**
 * 通过递归实现 对象扁平化
 * @param obj 需要扁平化的对象
 * @returns 扁平化后的对象
 */
const flattenObj = (obj: object): Obj => {
  const res: Obj = {};
  const flatten = (key: string, value: unknown) => {
    // 递归出口
    if (typeof value !== 'object' || value === null) {
      return res[key.slice(1)] = value;
    }
    // 如果是数组，遍历每个元素进行扁平化
    else if (Array.isArray(value)) {
      value.forEach((item, i) => flatten(`${key}[${i}]`, item));
    }
    // 如果是对象，遍历每个属性进行扁平化
    else {
      Object.keys(value).forEach(currkey => {
        flatten(`${key}.${currkey}`, (value as Obj)[currkey])
      })
    }
  }
  flatten('', obj)
  return res;
}

// ==================== use case ====================
const arr = [1, [2, [3, [4]]]];
console.log(flattenArray1(arr));
console.log(flattenArray2(arr));

const obj = {
  a: 1,
  b: [2,[3]],
  c: { d: 4 },
}
console.log(flattenObj(obj));