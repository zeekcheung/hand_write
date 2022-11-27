/**
 * 实现`lodash.get`方法，用于以可选链语法（`?.`）访问嵌套对象的属性
 * @param source 源对象
 * @param path 属性链
 * @param defaultValue 属性默认值
 */
const get = (source: object, path: string, defaultValue?: unknown) => {
  let res: unknown = source;
  // 通过正则表达式将 path 中的所有中括号语法 [] 转化为点语法 .
  // $1 表示正则表达式中的第一个括号 (\d+) 中的 \d+ 所匹配到的字符串
  const resolvedPath: string = path.replace(/\[(\d+)\]/, ".$1");
  // 以点号分割 resolvedPath，得到所有属性
  const keys: string[] = resolvedPath.split(".");
  // 遍历属性数组
  for (const key of keys) {
    res = Object(res)[key];
    // 如果某个属性是 undefined/null，则直接返回默认值
    if (res === undefined || res === null) {
      return defaultValue;
    }
  }
  return res;
};

// ========== use case ==========
console.log(get({ a: null }, "a.b.c", 3)); // output: 3

console.log(get({ a: undefined }, "a", 3)); // output: 3

console.log(get({ a: null }, "a", 3)); // output: 3

console.log(get({ a: [{ b: 1 }] }, "a[0].b", 3)); // output: 1
