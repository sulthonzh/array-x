/**
 * array-x — Zero-dependency array manipulation utilities
 *
 * Chunking, flattening, dedup, set operations, permutations/combinations,
 * sorting, grouping, sliding windows, math helpers, and more.
 * @module array-x
 */

'use strict';

// ─── Basic Helpers ───────────────────────────────────────────

/**
 * Get first element of array.
 * @template T
 * @param {T[]} arr
 * @returns {T|undefined}
 */
export function head(arr) {
  return arr?.[0];
}

/**
 * Get last element of array.
 * @template T
 * @param {T[]} arr
 * @returns {T|undefined}
 */
export function last(arr) {
  return arr?.[arr.length - 1];
}

/**
 * All elements except the first.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function tail(arr) {
  return Array.isArray(arr) ? arr.slice(1) : [];
}

/**
 * All elements except the last.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function init(arr) {
  return Array.isArray(arr) ? arr.slice(0, -1) : [];
}

/**
 * Get nth element (supports negative indexing).
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T|undefined}
 */
export function nth(arr, n) {
  if (!Array.isArray(arr)) return undefined;
  const idx = n < 0 ? arr.length + n : n;
  return arr[idx];
}

/**
 * Remove falsy values (false, null, 0, "", undefined, NaN).
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function compact(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean) : [];
}

// ─── Chunking & Partitioning ───────────────────────────────

/**
 * Split array into chunks of given size.
 * @template T
 * @param {T[]} arr
 * @param {number} size — chunk size (≥1)
 * @returns {T[][]}
 */
export function chunk(arr, size = 1) {
  if (!Array.isArray(arr)) return [];
  const s = Math.max(1, size | 0);
  const result = [];
  for (let i = 0; i < arr.length; i += s) {
    result.push(arr.slice(i, i + s));
  }
  return result;
}

/**
 * Partition array into two groups based on predicate.
 * @template T
 * @param {T[]} arr
 * @param {(value: T, index: number, array: T[]) => boolean} predicate
 * @returns {[T[], T[]]} [matching, nonMatching]
 */
export function partition(arr, predicate) {
  if (!Array.isArray(arr)) return [[], []];
  const yes = [], no = [];
  for (let i = 0; i < arr.length; i++) {
    (predicate(arr[i], i, arr) ? yes : no).push(arr[i]);
  }
  return [yes, no];
}

// ─── Take / Drop ─────────────────────────────────────────────

/**
 * Take first n elements.
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function take(arr, n = 1) {
  if (!Array.isArray(arr)) return [];
  if (n < 0) return [];
  return arr.slice(0, n);
}

/**
 * Take last n elements.
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function takeRight(arr, n = 1) {
  if (!Array.isArray(arr)) return [];
  if (n <= 0) return [];
  return arr.slice(-n);
}

/**
 * Take elements while predicate is true (stops at first false).
 * @template T
 * @param {T[]} arr
 * @param {(value: T, index: number) => boolean} predicate
 * @returns {T[]}
 */
export function takeWhile(arr, predicate) {
  if (!Array.isArray(arr)) return [];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i], i)) break;
    result.push(arr[i]);
  }
  return result;
}

/**
 * Take elements from the end while predicate is true.
 * @template T
 * @param {T[]} arr
 * @param {(value: T, index: number) => boolean} predicate
 * @returns {T[]}
 */
export function takeRightWhile(arr, predicate) {
  if (!Array.isArray(arr)) return [];
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!predicate(arr[i], i)) break;
    result.unshift(arr[i]);
  }
  return result;
}

/**
 * Drop first n elements.
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function drop(arr, n = 1) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(n < 0 ? 0 : n);
}

/**
 * Drop last n elements.
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function dropRight(arr, n = 1) {
  if (!Array.isArray(arr)) return [];
  if (n <= 0) return arr.slice();
  return arr.slice(0, -n);
}

/**
 * Drop elements while predicate is true.
 * @template T
 * @param {T[]} arr
 * @param {(value: T, index: number) => boolean} predicate
 * @returns {T[]}
 */
export function dropWhile(arr, predicate) {
  if (!Array.isArray(arr)) return [];
  let i = 0;
  while (i < arr.length && predicate(arr[i], i)) i++;
  return arr.slice(i);
}

// ─── Flattening ─────────────────────────────────────────────

/**
 * Flatten array up to given depth.
 * @template T
 * @param {T[]} arr
 * @param {number} depth — default 1
 * @returns {T[]}
 */
export function flatten(arr, depth = 1) {
  if (!Array.isArray(arr)) return [];
  if (depth <= 0) return arr.slice();
  const result = [];
  const stack = [{ arr, depth, idx: 0 }];
  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    if (top.idx >= top.arr.length) {
      stack.pop();
      continue;
    }
    const val = top.arr[top.idx++];
    if (Array.isArray(val) && top.depth > 0) {
      stack.push({ arr: val, depth: top.depth - 1, idx: 0 });
    } else {
      result.push(val);
    }
  }
  return result;
}

/**
 * Deep flatten — recursively flatten all nested arrays.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function flattenDeep(arr) {
  return flatten(arr, Infinity);
}

/**
 * Flatten by exactly 1 level.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function flattenShallow(arr) {
  return flatten(arr, 1);
}

// ─── Unique / Dedup ─────────────────────────────────────────

/**
 * Remove duplicates (using Set for primitives, optional key fn for objects).
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => unknown} [keyFn] — identity function for dedup key
 * @returns {T[]}
 */
export function unique(arr, keyFn) {
  if (!Array.isArray(arr)) return [];
  if (!keyFn) return [...new Set(arr)];
  const seen = new Set();
  const result = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/** @alias unique */
export const dedupe = unique;

/**
 * Remove consecutive duplicates (keeps first of each run).
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function dedupeAdjacent(arr) {
  if (!Array.isArray(arr)) return [];
  const result = [];
  for (const item of arr) {
    if (result.length === 0 || !Object.is(result[result.length - 1], item)) {
      result.push(item);
    }
  }
  return result;
}

// ─── Set Operations ─────────────────────────────────────────

/**
 * Union of two or more arrays (unique elements from all).
 * @template T
 * @param {...T[]} arrays
 * @returns {T[]}
 */
export function union(...arrays) {
  const result = [];
  const seen = new Set();
  for (const arr of arrays) {
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      if (!seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }
  }
  return result;
}

/**
 * Intersection of two or more arrays (elements present in ALL).
 * @template T
 * @param {...T[]} arrays
 * @returns {T[]}
 */
export function intersection(...arrays) {
  if (arrays.length === 0) return [];
  const validArrays = arrays.filter(Array.isArray);
  if (validArrays.length === 0) return [];
  const [first, ...rest] = validArrays;
  if (rest.length === 0) return [...new Set(first)];
  const sets = rest.map(a => new Set(a));
  const seen = new Set();
  const result = [];
  for (const item of first) {
    if (!seen.has(item) && sets.every(s => s.has(item))) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

/**
 * Difference — elements in first array not in any others.
 * @template T
 * @param {T[]} arr
 * @param {...T[]} others
 * @returns {T[]}
 */
export function difference(arr, ...others) {
  if (!Array.isArray(arr)) return [];
  const excludeSet = new Set();
  for (const other of others) {
    if (Array.isArray(other)) {
      for (const item of other) excludeSet.add(item);
    }
  }
  return arr.filter(item => !excludeSet.has(item));
}

/**
 * Symmetric difference — elements in either but not in both.
 * @template T
 * @param {T[]} a
 * @param {T[]} b
 * @returns {T[]}
 */
export function symmetricDifference(a, b) {
  if (!Array.isArray(a)) a = [];
  if (!Array.isArray(b)) b = [];
  const setA = new Set(a);
  const setB = new Set(b);
  const result = [];
  const seen = new Set();
  for (const item of a) {
    if (!setB.has(item) && !seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  for (const item of b) {
    if (!setA.has(item) && !seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}

/** @alias symmetricDifference */
export const xor = symmetricDifference;

/**
 * Check if array is a subset of another.
 * @template T
 * @param {T[]} arr — potential subset
 * @param {T[]} superset
 * @returns {boolean}
 */
export function isSubset(arr, superset) {
  if (!Array.isArray(arr) || !Array.isArray(superset)) return false;
  const set = new Set(superset);
  return arr.every(item => set.has(item));
}

/**
 * Check if array is a superset of another.
 * @template T
 * @param {T[]} arr — potential superset
 * @param {T[]} subset
 * @returns {boolean}
 */
export function isSuperset(arr, subset) {
  return isSubset(subset, arr);
}

// ─── Zip ─────────────────────────────────────────────────────

/**
 * Zip multiple arrays together (like Python's zip).
 * Stops at shortest array.
 * @param {...*[]} arrays
 * @returns {Array<*[]>}
 */
export function zip(...arrays) {
  if (arrays.length === 0) return [];
  const valid = arrays.filter(Array.isArray);
  if (valid.length === 0) return [];
  const minLen = Math.min(...valid.map(a => a.length));
  const result = [];
  for (let i = 0; i < minLen; i++) {
    result.push(valid.map(a => a[i]));
  }
  return result;
}

/**
 * Zip with a combiner function.
 * @template T, R
 * @param {*[]} arrays
 * @param {(values: *[]) => R} fn
 * @returns {R[]}
 */
export function zipWith(...args) {
  const fn = args[args.length - 1];
  const arrays = args.slice(0, -1);
  if (typeof fn !== 'function') return [];
  const valid = arrays.filter(Array.isArray);
  if (valid.length === 0) return [];
  const minLen = Math.min(...valid.map(a => a.length));
  const result = [];
  for (let i = 0; i < minLen; i++) {
    result.push(fn(...valid.map(a => a[i])));
  }
  return result;
}

/**
 * Zip that fills missing values with a fillValue (like Python's zip_longest).
 * @param {*[]} arrays
 * @param {*} [fillValue=undefined]
 * @returns {Array<*[]>}
 */
export function zipLongest(...args) {
  const fillValue = args[args.length - 1];
  const arrays = (args.length >= 2 && !Array.isArray(args[args.length - 1]))
    ? args.slice(0, -1) : args;
  const valid = arrays.filter(Array.isArray);
  if (valid.length === 0) return [];
  const maxLen = Math.max(...valid.map(a => a.length));
  const fill = (args.length >= 2 && !Array.isArray(args[args.length - 1])) ? fillValue : undefined;
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    result.push(valid.map(a => i < a.length ? a[i] : fill));
  }
  return result;
}

/**
 * Unzip an array of tuples into separate arrays.
 * @param {Array<*[]>} arr
 * @returns {*[][]}
 */
export function unzip(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const maxLen = Math.max(...arr.map(t => Array.isArray(t) ? t.length : 0));
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    result.push(arr.map(t => (Array.isArray(t) ? t[i] : undefined)));
  }
  return result;
}

// ─── Range ───────────────────────────────────────────────────

/**
 * Create a range of numbers.
 * @param {number} start
 * @param {number} [end] — if omitted, range is 0..start
 * @param {number} [step=1]
 * @returns {number[]}
 */
export function range(start, end, step = 1) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  const result = [];
  if (step === 0) return result;
  if (step > 0) {
    for (let i = start; i < end; i += step) result.push(i);
  } else {
    for (let i = start; i > end; i += step) result.push(i);
  }
  return result;
}

/**
 * Create a range filled with a callback.
 * @param {number} count
 * @param {(index: number) => T} fn
 * @returns {T[]}
 */
export function rangeBy(count, fn) {
  const result = [];
  for (let i = 0; i < count; i++) result.push(fn(i));
  return result;
}

// ─── Search ──────────────────────────────────────────────────

/**
 * Binary search for a value in a sorted array.
 * Returns the index of the value, or the bitwise complement of the insertion point.
 * @template T
 * @param {T[]} sortedArr
 * @param {T} value
 * @param {(a: T, b: T) => number} [comparator]
 * @returns {number}
 */
export function binarySearch(sortedArr, value, comparator = (a, b) => (a < b ? -1 : a > b ? 1 : 0)) {
  if (!Array.isArray(sortedArr)) return -1;
  let lo = 0, hi = sortedArr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const cmp = comparator(sortedArr[mid], value);
    if (cmp === 0) return mid;
    if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  return ~lo;
}

/**
 * Find all indices of a value.
 * @template T
 * @param {T[]} arr
 * @param {T} value
 * @returns {number[]}
 */
export function indexOfAll(arr, value) {
  if (!Array.isArray(arr)) return [];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (Object.is(arr[i], value)) result.push(i);
  }
  return result;
}

/**
 * Count occurrences of a value.
 * @template T
 * @param {T[]} arr
 * @param {T} value
 * @returns {number}
 */
export function count(arr, value) {
  if (!Array.isArray(arr)) return 0;
  let c = 0;
  for (const item of arr) {
    if (Object.is(item, value)) c++;
  }
  return c;
}

/**
 * Count occurrences by a predicate or key function.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => unknown} keyFn
 * @returns {Map<unknown, number>}
 */
export function countBy(arr, keyFn) {
  const map = new Map();
  if (!Array.isArray(arr)) return map;
  for (const item of arr) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

// ─── Sorting ────────────────────────────────────────────────

/**
 * Sort a copy of the array by a key function.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => unknown} keyFn
 * @param {'asc'|'desc'} [order='asc']
 * @returns {T[]}
 */
export function sortBy(arr, keyFn, order = 'asc') {
  if (!Array.isArray(arr)) return [];
  const dir = order === 'desc' ? -1 : 1;
  return arr.slice().sort((a, b) => {
    const av = keyFn(a), bv = keyFn(b);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

/**
 * Multi-key sort.
 * @template T
 * @param {T[]} arr
 * @param {Array<{key: (value: T) => unknown, order?: 'asc'|'desc'}>} criteria
 * @returns {T[]}
 */
export function orderBy(arr, criteria) {
  if (!Array.isArray(arr) || !Array.isArray(criteria)) return arr ? arr.slice() : [];
  return arr.slice().sort((a, b) => {
    for (const { key, order = 'asc' } of criteria) {
      const av = key(a), bv = key(b);
      const dir = order === 'desc' ? -1 : 1;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
    }
    return 0;
  });
}

/**
 * Rank items (1-based) by a key function.
 * Returns array of {value, rank}.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => number} keyFn
 * @returns {Array<{value: T, rank: number}>}
 */
export function rank(arr, keyFn) {
  if (!Array.isArray(arr)) return [];
  const indexed = arr.map((value, i) => ({ value, key: keyFn(value), i }));
  indexed.sort((a, b) => b.key - a.key); // descending
  const result = [];
  let currentRank = 0;
  let prevKey = undefined;
  for (let j = 0; j < indexed.length; j++) {
    if (j === 0 || indexed[j].key !== prevKey) {
      currentRank = j + 1;
      prevKey = indexed[j].key;
    }
    result.push({ value: indexed[j].value, rank: currentRank });
  }
  return result;
}

// ─── Grouping ───────────────────────────────────────────────

/**
 * Group array elements by a key function.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => string|number} keyFn
 * @returns {Map<string|number, T[]>}
 */
export function groupBy(arr, keyFn) {
  const map = new Map();
  if (!Array.isArray(arr)) return map;
  for (const item of arr) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

/**
 * Group into N buckets of roughly equal size.
 * @template T
 * @param {T[]} arr
 * @param {number} n — number of buckets
 * @returns {T[][]}
 */
export function bucket(arr, n) {
  if (!Array.isArray(arr) || n < 1) return [];
  const size = Math.ceil(arr.length / n);
  return chunk(arr, size);
}

// ─── Math Helpers ───────────────────────────────────────────

/**
 * Sum all numeric values.
 * @param {number[]} arr
 * @returns {number}
 */
export function sum(arr) {
  if (!Array.isArray(arr)) return 0;
  let total = 0;
  for (const v of arr) {
    if (typeof v === 'number' && !Number.isNaN(v)) total += v;
  }
  return total;
}

/**
 * Product of all numeric values.
 * @param {number[]} arr
 * @returns {number}
 */
export function product(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 1;
  let total = 1;
  for (const v of arr) {
    if (typeof v === 'number' && !Number.isNaN(v)) total *= v;
  }
  return total;
}

/**
 * Minimum value (undefined for empty array).
 * @param {number[]} arr
 * @returns {number|undefined}
 */
export function min(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  let m = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < m) m = arr[i];
  }
  return m;
}

/**
 * Maximum value (undefined for empty array).
 * @param {number[]} arr
 * @returns {number|undefined}
 */
export function max(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  let m = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > m) m = arr[i];
  }
  return m;
}

/**
 * Average of numeric values.
 * @param {number[]} arr
 * @returns {number}
 */
export function mean(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/** @alias mean */
export const average = mean;

/**
 * Median (middle value of sorted array).
 * @param {number[]} arr
 * @returns {number}
 */
export function median(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Mode (most frequent values). Returns array for ties.
 * @param {number[]} arr
 * @returns {number[]}
 */
export function mode(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const counts = countBy(arr, v => v);
  let maxCount = 0;
  for (const c of counts.values()) maxCount = Math.max(maxCount, c);
  const result = [];
  for (const [val, c] of counts) {
    if (c === maxCount) result.push(val);
  }
  return result;
}

/**
 * Variance (population).
 * @param {number[]} arr
 * @returns {number}
 */
export function variance(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const m = mean(arr);
  let total = 0;
  for (const v of arr) {
    const d = v - m;
    total += d * d;
  }
  return total / arr.length;
}

/**
 * Standard deviation (population).
 * @param {number[]} arr
 * @returns {number}
 */
export function stdDev(arr) {
  return Math.sqrt(variance(arr));
}

/**
 * Percentile (0-100) using linear interpolation.
 * @param {number[]} arr
 * @param {number} p
 * @returns {number}
 */
export function percentile(arr, p) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  if (p <= 0) return sorted[0];
  if (p >= 100) return sorted[sorted.length - 1];
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/**
 * Sum by a key function.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => number} keyFn
 * @returns {number}
 */
export function sumBy(arr, keyFn) {
  if (!Array.isArray(arr)) return 0;
  let total = 0;
  for (const item of arr) total += keyFn(item) || 0;
  return total;
}

/**
 * Min by a key function. Returns the item, not the key.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => number} keyFn
 * @returns {T|undefined}
 */
export function minBy(arr, keyFn) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  let bestIdx = 0;
  let bestVal = keyFn(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    const v = keyFn(arr[i]);
    if (v < bestVal) { bestVal = v; bestIdx = i; }
  }
  return arr[bestIdx];
}

/**
 * Max by a key function. Returns the item, not the key.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => number} keyFn
 * @returns {T|undefined}
 */
export function maxBy(arr, keyFn) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  let bestIdx = 0;
  let bestVal = keyFn(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    const v = keyFn(arr[i]);
    if (v > bestVal) { bestVal = v; bestIdx = i; }
  }
  return arr[bestIdx];
}

// ─── Sliding Window ─────────────────────────────────────────

/**
 * Sliding window of given size over array.
 * @template T
 * @param {T[]} arr
 * @param {number} size — window size (≥1)
 * @param {number} [step=1] — step between windows
 * @returns {T[][]}
 */
export function window(arr, size = 1, step = 1) {
  if (!Array.isArray(arr)) return [];
  const s = Math.max(1, size | 0);
  const t = Math.max(1, step | 0);
  const result = [];
  for (let i = 0; i <= arr.length - s; i += t) {
    result.push(arr.slice(i, i + s));
  }
  return result;
}

/** @alias window */
export const sliding = window;

/**
 * Pairwise combine adjacent elements.
 * @template T
 * @param {T[]} arr
 * @returns {Array<[T, T]>}
 */
export function pairwise(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return [];
  const result = [];
  for (let i = 0; i < arr.length - 1; i++) {
    result.push([arr[i], arr[i + 1]]);
  }
  return result;
}

// ─── Combinatorics ──────────────────────────────────────────

/**
 * Cartesian product of multiple arrays.
 * @param {...*[]} arrays
 * @returns {Array<*[]>}
 */
export function cartesianProduct(...arrays) {
  if (arrays.length === 0) return [[]];
  const valid = arrays.filter(Array.isArray);
  if (valid.length !== arrays.length) return [];
  if (valid.length === 0) return [[]];
  const result = [[]];
  for (const arr of valid) {
    const newResult = [];
    for (const prefix of result) {
      for (const item of arr) {
        newResult.push([...prefix, item]);
      }
    }
    result.length = 0;
    result.push(...newResult);
  }
  return result;
}

/**
 * All permutations of an array.
 * @template T
 * @param {T[]} arr
 * @param {number} [r] — take r items per permutation (default: all)
 * @returns {T[][]}
 */
export function permutations(arr, r) {
  if (!Array.isArray(arr)) return [];
  const n = arr.length;
  const take = r !== undefined ? Math.min(r, n) : n;
  if (take === 0) return [[]];
  const result = [];
  const used = new Array(n).fill(false);
  const current = [];
  function backtrack() {
    if (current.length === take) {
      result.push([...current]);
      return;
    }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(arr[i]);
      backtrack();
      current.pop();
      used[i] = false;
    }
  }
  backtrack();
  return result;
}

/**
 * Combinations of choosing r items from array.
 * @template T
 * @param {T[]} arr
 * @param {number} r
 * @returns {T[][]}
 */
export function combinations(arr, r) {
  if (!Array.isArray(arr)) return [];
  const n = arr.length;
  if (r < 0 || r > n) return [];
  if (r === 0) return [[]];
  const result = [];
  function backtrack(start, current) {
    if (current.length === r) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < n; i++) {
      current.push(arr[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}

/**
 * Power set (all subsets).
 * @template T
 * @param {T[]} arr
 * @returns {T[][]}
 */
export function powerSet(arr) {
  if (!Array.isArray(arr)) return [[]];
  const n = arr.length;
  const count = 1 << n;
  const result = [];
  for (let mask = 0; mask < count; mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(arr[i]);
    }
    result.push(subset);
  }
  return result;
}

// ─── Mutation Helpers ───────────────────────────────────────

/**
 * Swap two elements in place.
 * @template T
 * @param {T[]} arr
 * @param {number} i
 * @param {number} j
 * @returns {T[]} — same array reference (mutated)
 */
export function swap(arr, i, j) {
  if (!Array.isArray(arr)) return arr;
  if (i < 0) i += arr.length;
  if (j < 0) j += arr.length;
  if (i >= 0 && j >= 0 && i < arr.length && j < arr.length) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Move element from one index to another (in place).
 * @template T
 * @param {T[]} arr
 * @param {number} from
 * @param {number} to
 * @returns {T[]} — same array reference (mutated)
 */
export function move(arr, from, to) {
  if (!Array.isArray(arr)) return arr;
  if (from < 0) from += arr.length;
  if (to < 0) to += arr.length;
  if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return arr;
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
  return arr;
}

/**
 * Create a rotated copy (shift elements by n positions).
 * Positive n rotates right, negative rotates left.
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function rotate(arr, n = 0) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const len = arr.length;
  const k = ((n % len) + len) % len;
  if (k === 0) return arr.slice();
  return [...arr.slice(-k), ...arr.slice(0, -k)];
}

/**
 * Fill an array with a static value.
 * @template T
 * @param {number} length
 * @param {T|((index: number) => T)} value
 * @returns {T[]}
 */
export function fill(length, value) {
  const result = new Array(Math.max(0, length | 0));
  if (typeof value === 'function') {
    for (let i = 0; i < result.length; i++) result[i] = value(i);
  } else {
    result.fill(value);
  }
  return result;
}

/**
 * Repeat array n times.
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function repeat(arr, n = 1) {
  if (!Array.isArray(arr) || n <= 0) return [];
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(...arr);
  }
  return result;
}

// ─── Conversion ─────────────────────────────────────────────

/**
 * Convert array of objects to object keyed by a property.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => string|number} keyFn
 * @param {(value: T) => unknown} [valFn] — transform value (default: identity)
 * @returns {Record<string|number, unknown>}
 */
export function keyBy(arr, keyFn, valFn) {
  const result = {};
  if (!Array.isArray(arr)) return result;
  for (const item of arr) {
    result[keyFn(item)] = valFn ? valFn(item) : item;
  }
  return result;
}

/**
 * Create pairs [key, value] from array of objects.
 * @template T
 * @param {T[]} arr
 * @param {(value: T) => string|number} keyFn
 * @param {(value: T) => unknown} [valFn]
 * @returns {Array<[string|number, unknown]>}
 */
export function toPairs(arr, keyFn, valFn) {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => [keyFn(item), valFn ? valFn(item) : item]);
}

/**
 * From pairs back to object.
 * @param {Array<[string|number, *]>} pairs
 * @returns {Record<string|number, *>}
 */
export function fromPairs(pairs) {
  const result = {};
  if (!Array.isArray(pairs)) return result;
  for (const [key, value] of pairs) result[key] = value;
  return result;
}

// ─── Misc ───────────────────────────────────────────────────

/**
 * Check if array is empty.
 * @param {*} arr
 * @returns {boolean}
 */
export function isEmpty(arr) {
  return !Array.isArray(arr) || arr.length === 0;
}

/**
 * Check if two arrays have the same elements (order-insensitive).
 * Uses === comparison.
 * @template T
 * @param {T[]} a
 * @param {T[]} b
 * @returns {boolean}
 */
export function sameMembers(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sortedA = a.slice().sort();
  const sortedB = b.slice().sort();
  return sortedA.every((v, i) => Object.is(v, sortedB[i]));
}

/**
 * Check if array starts with given prefix.
 * @template T
 * @param {T[]} arr
 * @param {T[]} prefix
 * @returns {boolean}
 */
export function startsWith(arr, prefix) {
  if (!Array.isArray(arr) || !Array.isArray(prefix)) return false;
  if (prefix.length > arr.length) return false;
  return prefix.every((v, i) => Object.is(v, arr[i]));
}

/**
 * Check if array ends with given suffix.
 * @template T
 * @param {T[]} arr
 * @param {T[]} suffix
 * @returns {boolean}
 */
export function endsWith(arr, suffix) {
  if (!Array.isArray(arr) || !Array.isArray(suffix)) return false;
  if (suffix.length > arr.length) return false;
  const offset = arr.length - suffix.length;
  return suffix.every((v, i) => Object.is(v, arr[offset + i]));
}

/**
 * Sample one random element.
 * @template T
 * @param {T[]} arr
 * @returns {T|undefined}
 */
export function sample(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Sample n random elements (without replacement).
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function sampleSize(arr, n = 1) {
  if (!Array.isArray(arr)) return [];
  const copy = arr.slice();
  const count = Math.min(n | 0, copy.length);
  // Fisher-Yates partial
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/**
 * Fisher-Yates shuffle (returns a new array).
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffle(arr) {
  if (!Array.isArray(arr)) return [];
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Interleave two or more arrays: [a1, b1, a2, b2, ...].
 * @param {...*[]} arrays
 * @returns {*[]}
 */
export function interleave(...arrays) {
  const valid = arrays.filter(Array.isArray);
  if (valid.length === 0) return [];
  const maxLen = Math.max(...valid.map(a => a.length));
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    for (const arr of valid) {
      if (i < arr.length) result.push(arr[i]);
    }
  }
  return result;
}

/**
 * Intersperse a separator between elements.
 * @template T
 * @param {T[]} arr
 * @param {T} separator
 * @returns {T[]}
 */
export function intersperse(arr, separator) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const result = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    result.push(separator, arr[i]);
  }
  return result;
}

/**
 * Split array at given index.
 * @template T
 * @param {T[]} arr
 * @param {number} index
 * @returns {[T[], T[]]}
 */
export function splitAt(arr, index) {
  if (!Array.isArray(arr)) return [[], []];
  const idx = index < 0 ? Math.max(0, arr.length + index) : index;
  return [arr.slice(0, idx), arr.slice(idx)];
}

/**
 * Split array into chunks using a predicate (new chunk starts when predicate returns true).
 * @template T
 * @param {T[]} arr
 * @param {(value: T, index: number) => boolean} predicate
 * @returns {T[][]}
 */
export function splitWhen(arr, predicate) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const result = [];
  let current = [arr[0]];
  let prev = predicate(arr[0], 0);
  for (let i = 1; i < arr.length; i++) {
    const cur = predicate(arr[i], i);
    if (cur === prev) {
      current.push(arr[i]);
    } else {
      result.push(current);
      current = [arr[i]];
      prev = cur;
    }
  }
  if (current.length > 0) result.push(current);
  return result;
}

/**
 * Deep find — recursively searches nested arrays.
 * @template T
 * @param {T[]|T[][]|...} arr
 * @param {(value: T) => boolean} predicate
 * @returns {T|undefined}
 */
export function deepFind(arr, predicate) {
  if (!Array.isArray(arr)) return undefined;
  for (const item of arr) {
    if (Array.isArray(item)) {
      const found = deepFind(item, predicate);
      if (found !== undefined) return found;
    } else if (predicate(item)) {
      return item;
    }
  }
  return undefined;
}

/**
 * Toggle element presence: add if absent, remove if present.
 * @template T
 * @param {T[]} arr
 * @param {T} value
 * @returns {T[]} — new array
 */
export function toggle(arr, value) {
  if (!Array.isArray(arr)) return [value];
  const idx = arr.indexOf(value);
  if (idx === -1) return [...arr, value];
  return arr.filter((_, i) => i !== idx);
}

/**
 * Pipe: apply a series of transformations to an array.
 * @template T
 * @param {T[]} arr
 * @param {...(arr: T[]) => T[]} fns
 * @returns {T[]}
 */
export function pipe(arr, ...fns) {
  return fns.reduce((acc, fn) => fn(acc), arr);
}

// ─── Default export object ──────────────────────────────────

const ArrayX = {
  head, last, tail, init, nth, compact,
  chunk, partition,
  take, takeRight, takeWhile, takeRightWhile,
  drop, dropRight, dropWhile,
  flatten, flattenDeep, flattenShallow,
  unique, dedupe, dedupeAdjacent,
  union, intersection, difference, symmetricDifference, xor,
  isSubset, isSuperset,
  zip, zipWith, zipLongest, unzip,
  range, rangeBy,
  binarySearch, indexOfAll, count, countBy,
  sortBy, orderBy, rank,
  groupBy, bucket,
  sum, product, min, max, mean, average, median, mode,
  variance, stdDev, percentile, sumBy, minBy, maxBy,
  window, sliding, pairwise,
  cartesianProduct, permutations, combinations, powerSet,
  swap, move, rotate, fill, repeat,
  keyBy, toPairs, fromPairs,
  isEmpty, sameMembers, startsWith, endsWith,
  sample, sampleSize, shuffle,
  interleave, intersperse, splitAt, splitWhen, deepFind, toggle, pipe,
};

export default ArrayX;
