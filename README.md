# array-x

Zero-dependency array manipulation utilities. 80+ functions covering chunking, flattening, dedup, set operations, combinatorics, sorting, grouping, math helpers, sliding windows, and more.

## Why

You keep writing the same array helpers. `chunk`, `unique`, `flatten`, `intersection`, `groupBy`, `shuffle` — every project reinvents them. This collects them all in one zero-dependency package with a clean API and full test coverage.

## Install

```bash
npm install array-x
```

## Quick Start

```js
import { chunk, unique, flattenDeep, groupBy, sortBy } from 'array-x';

chunk([1, 2, 3, 4, 5], 2);        // [[1,2], [3,4], [5]]
unique([1, 2, 2, 3, 3, 3]);        // [1, 2, 3]
flattenDeep([[1, [2, [3]]], 4]);   // [1, 2, 3, 4]

const users = [
  { name: 'Alice', age: 30, dept: 'eng' },
  { name: 'Bob', age: 25, dept: 'eng' },
  { name: 'Carol', age: 35, dept: 'sales' },
];

groupBy(users, u => u.dept);        // Map { 'eng' => [...], 'sales' => [...] }
sortBy(users, u => u.age);          // [Bob(25), Alice(30), Carol(35)]
```

## API

### Basic Helpers
- `head(arr)` — first element
- `last(arr)` — last element
- `tail(arr)` — all but first
- `init(arr)` — all but last
- `nth(arr, n)` — nth element (supports negative)
- `compact(arr)` — remove falsy values

### Chunking & Partitioning
- `chunk(arr, size)` — split into chunks
- `partition(arr, predicate)` — split into [matching, nonMatching]

### Take / Drop
- `take(arr, n)` / `takeRight(arr, n)` — first/last n elements
- `takeWhile(arr, fn)` / `takeRightWhile(arr, fn)` — take while predicate holds
- `drop(arr, n)` / `dropRight(arr, n)` — skip first/last n
- `dropWhile(arr, fn)` — drop while predicate holds

### Flattening
- `flatten(arr, depth=1)` — flatten to given depth
- `flattenDeep(arr)` — fully recursive flatten
- `flattenShallow(arr)` — flatten exactly 1 level

### Unique / Dedup
- `unique(arr, keyFn?)` — remove duplicates (optional key function for objects)
- `dedupe(arr, keyFn?)` — alias of unique
- `dedupeAdjacent(arr)` — remove consecutive duplicates only

### Set Operations
- `union(...arrays)` — elements in any array (unique)
- `intersection(...arrays)` — elements in ALL arrays
- `difference(arr, ...others)` — elements in first but not others
- `symmetricDifference(a, b)` / `xor(a, b)` — in either, not both
- `isSubset(arr, superset)` — check subset
- `isSuperset(arr, subset)` — check superset

### Zip
- `zip(...arrays)` — combine arrays element-wise (stops at shortest)
- `zipWith(...arrays, fn)` — zip with combiner function
- `zipLongest(...arrays, fillValue?)` — zip padding with fillValue
- `unzip(arr)` — reverse of zip

### Range
- `range(start, end, step=1)` — generate number range
- `rangeBy(count, fn)` — generate with callback

### Search
- `binarySearch(sortedArr, value, comparator?)` — O(log n) search, returns index or ~insertionPoint
- `indexOfAll(arr, value)` — all indices of value
- `count(arr, value)` — count occurrences
- `countBy(arr, keyFn)` — count by key function → Map

### Sorting
- `sortBy(arr, keyFn, order='asc')` — sort copy by key
- `orderBy(arr, criteria[])` — multi-key sort
- `rank(arr, keyFn)` — rank items (1-based, ties get same rank)

### Grouping
- `groupBy(arr, keyFn)` — group into Map
- `bucket(arr, n)` — split into ~N equal buckets

### Math Helpers
- `sum(arr)` / `product(arr)` — numeric aggregation
- `min(arr)` / `max(arr)` — extreme values
- `mean(arr)` / `average(arr)` — arithmetic mean
- `median(arr)` — middle value
- `mode(arr)` — most frequent (array for ties)
- `variance(arr)` / `stdDev(arr)` — population statistics
- `percentile(arr, p)` — percentile with linear interpolation
- `sumBy(arr, fn)` / `minBy(arr, fn)` / `maxBy(arr, fn)` — key-based aggregation

### Sliding Window
- `window(arr, size, step=1)` / `sliding(...)` — sliding window slices
- `pairwise(arr)` — adjacent pairs `[ [a,b], [b,c], [c,d] ]`

### Combinatorics
- `cartesianProduct(...arrays)` — all combinations across arrays
- `permutations(arr, r?)` — all orderings (or r-length)
- `combinations(arr, r)` — r-element subsets
- `powerSet(arr)` — all subsets (2^n)

### Mutation Helpers
- `swap(arr, i, j)` — swap in place (supports negative indices)
- `move(arr, from, to)` — move element in place
- `rotate(arr, n)` — rotate copy (positive=right, negative=left)
- `fill(length, value)` — create filled array
- `repeat(arr, n)` — repeat array n times

### Conversion
- `keyBy(arr, keyFn, valFn?)` — array to object keyed by function
- `toPairs(arr, keyFn, valFn?)` — array to [key, value] pairs
- `fromPairs(pairs)` — pairs back to object

### Utilities
- `isEmpty(arr)` — check empty
- `sameMembers(a, b)` — order-insensitive comparison
- `startsWith(arr, prefix)` / `endsWith(arr, suffix)` — array prefix/suffix check
- `sample(arr)` — random element
- `sampleSize(arr, n)` — n random elements (without replacement)
- `shuffle(arr)` — Fisher-Yates shuffle (returns copy)
- `interleave(...arrays)` — interleave elements `[a1, b1, a2, b2, ...]`
- `intersperse(arr, separator)` — insert separator between elements
- `splitAt(arr, index)` — split into two at index
- `splitWhen(arr, predicate)` — group consecutive elements by predicate result
- `deepFind(arr, predicate)` — recursive find in nested arrays
- `toggle(arr, value)` — add if absent, remove if present
- `pipe(arr, ...fns)` — chain transformations

## CLI

```bash
# Remove duplicates
echo '[1,2,2,3,3,3]' | array-x unique

# Flatten
echo '[[1,2],[3,[4,5]]]' | array-x flatten

# Chunk
echo '[1,2,3,4,5,6]' | array-x chunk --size 2

# Stats
echo '[1,2,3,4,5,6,7,8,9,10]' | array-x stats

# Generate range
array-x range --start 0 --end 10 --step 2

# Permutations
echo '["a","b","c"]' | array-x permutations --r 2

# Demo
array-x demo
```

## Design Principles

- **Zero dependencies.** Just JavaScript. Works everywhere.
- **Immutable by default.** Most functions return new arrays. Mutation helpers (`swap`, `move`) are clearly marked.
- **Handles edge cases.** Empty arrays, null/undefined inputs, negative indices — all handled gracefully.
- **No bloat.** Each function does one thing well. No god functions.

## License

MIT
