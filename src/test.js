/**
 * array-x — test suite
 * Run: node --test src/test.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as ax from './index.js';

// ─── Basic Helpers ──────────────────────────────────────────

describe('head/last/tail/init/nth', () => {
  it('head returns first element', () => {
    assert.equal(ax.head([1,2,3]), 1);
    assert.equal(ax.head([]), undefined);
    assert.equal(ax.head(null), undefined);
  });
  it('last returns last element', () => {
    assert.equal(ax.last([1,2,3]), 3);
    assert.equal(ax.last([]), undefined);
  });
  it('tail returns all but first', () => {
    assert.deepEqual(ax.tail([1,2,3]), [2,3]);
    assert.deepEqual(ax.tail([1]), []);
    assert.deepEqual(ax.tail([]), []);
  });
  it('init returns all but last', () => {
    assert.deepEqual(ax.init([1,2,3]), [1,2]);
    assert.deepEqual(ax.init([1]), []);
  });
  it('nth supports negative indexing', () => {
    assert.equal(ax.nth([1,2,3], 0), 1);
    assert.equal(ax.nth([1,2,3], -1), 3);
    assert.equal(ax.nth([1,2,3], -2), 2);
    assert.equal(ax.nth([1,2,3], 5), undefined);
    assert.equal(ax.nth([1,2,3], -5), undefined);
  });
});

describe('compact', () => {
  it('removes falsy values', () => {
    assert.deepEqual(ax.compact([0, 1, false, 2, '', 3, null, undefined, NaN, 4]), [1, 2, 3, 4]);
  });
  it('handles non-array', () => {
    assert.deepEqual(ax.compact(null), []);
  });
});

// ─── Chunk / Partition ──────────────────────────────────────

describe('chunk', () => {
  it('chunks correctly', () => {
    assert.deepEqual(ax.chunk([1,2,3,4,5], 2), [[1,2],[3,4],[5]]);
    assert.deepEqual(ax.chunk([1,2,3,4], 2), [[1,2],[3,4]]);
  });
  it('handles edge cases', () => {
    assert.deepEqual(ax.chunk([], 3), []);
    assert.deepEqual(ax.chunk([1,2,3], 0), [[1],[2],[3]]);
    assert.deepEqual(ax.chunk([1,2,3], -5), [[1],[2],[3]]);
  });
});

describe('partition', () => {
  it('splits by predicate', () => {
    const [even, odd] = ax.partition([1,2,3,4,5,6], x => x % 2 === 0);
    assert.deepEqual(even, [2,4,6]);
    assert.deepEqual(odd, [1,3,5]);
  });
  it('passes index', () => {
    const [yes, no] = ax.partition(['a','b','c'], (_, i) => i < 2);
    assert.deepEqual(yes, ['a','b']);
    assert.deepEqual(no, ['c']);
  });
});

// ─── Take / Drop ────────────────────────────────────────────

describe('take/drop family', () => {
  it('take', () => {
    assert.deepEqual(ax.take([1,2,3,4], 2), [1,2]);
    assert.deepEqual(ax.take([1,2,3], 0), []);
    assert.deepEqual(ax.take([1,2,3], 10), [1,2,3]);
    assert.deepEqual(ax.take([1,2,3], -1), []);
  });
  it('takeRight', () => {
    assert.deepEqual(ax.takeRight([1,2,3,4], 2), [3,4]);
    assert.deepEqual(ax.takeRight([1,2,3], 0), []);
  });
  it('takeWhile', () => {
    assert.deepEqual(ax.takeWhile([1,2,3,1,2], x => x < 3), [1,2]);
  });
  it('takeRightWhile', () => {
    assert.deepEqual(ax.takeRightWhile([1,2,3,2,1], x => x < 3), [2,1]);
  });
  it('drop', () => {
    assert.deepEqual(ax.drop([1,2,3,4], 2), [3,4]);
    assert.deepEqual(ax.drop([1,2,3], 0), [1,2,3]);
  });
  it('dropRight', () => {
    assert.deepEqual(ax.dropRight([1,2,3,4], 2), [1,2]);
  });
  it('dropWhile', () => {
    assert.deepEqual(ax.dropWhile([1,2,3,4,1], x => x < 3), [3,4,1]);
  });
});

// ─── Flatten ────────────────────────────────────────────────

describe('flatten family', () => {
  it('flatten depth 1', () => {
    assert.deepEqual(ax.flatten([[1,2],[3,4]]), [1,2,3,4]);
  });
  it('flatten depth limited', () => {
    assert.deepEqual(ax.flatten([[1,[2,3]],4], 1), [1,[2,3],4]);
  });
  it('flattenDeep', () => {
    assert.deepEqual(ax.flattenDeep([[1,[2,[3,[4]]]],5]), [1,2,3,4,5]);
  });
  it('flattenShallow', () => {
    assert.deepEqual(ax.flattenShallow([[1,2],[3,[4]]]), [1,2,3,[4]]);
  });
});

// ─── Unique / Dedup ─────────────────────────────────────────

describe('unique/dedupe', () => {
  it('removes duplicates for primitives', () => {
    assert.deepEqual(ax.unique([1,2,2,3,3,3]), [1,2,3]);
    assert.deepEqual(ax.unique(['a','b','a']), ['a','b']);
  });
  it('uses keyFn for objects', () => {
    const items = [{id:1,v:'a'},{id:2,v:'b'},{id:1,v:'c'}];
    const result = ax.unique(items, o => o.id);
    assert.equal(result.length, 2);
    assert.equal(result[0].v, 'a');
    assert.equal(result[1].v, 'b');
  });
  it('dedupeAdjacent removes consecutive dups', () => {
    assert.deepEqual(ax.dedupeAdjacent([1,1,2,2,2,3,1,1]), [1,2,3,1]);
  });
  it('handles NaN', () => {
    assert.deepEqual(ax.unique([NaN, NaN, 1]), [NaN, 1]);
  });
});

// ─── Set Operations ─────────────────────────────────────────

describe('set operations', () => {
  it('union', () => {
    assert.deepEqual(ax.union([1,2,3],[3,4,5]), [1,2,3,4,5]);
    assert.deepEqual(ax.union([1,2],[3,4],[5,6]), [1,2,3,4,5,6]);
    assert.deepEqual(ax.union([1,1],[2,2]), [1,2]);
  });
  it('intersection', () => {
    assert.deepEqual(ax.intersection([1,2,3],[2,3,4]), [2,3]);
    assert.deepEqual(ax.intersection([1,2,3],[4,5,6]), []);
    assert.deepEqual(ax.intersection([1,2,3,4],[2,4],[2,3,4]), [2,4]);
  });
  it('difference', () => {
    assert.deepEqual(ax.difference([1,2,3,4],[2,4]), [1,3]);
    assert.deepEqual(ax.difference([1,2,3],[4,5]), [1,2,3]);
    assert.deepEqual(ax.difference([1,2,3],[]), [1,2,3]);
  });
  it('symmetricDifference/xor', () => {
    assert.deepEqual(ax.symmetricDifference([1,2,3],[2,3,4]), [1,4]);
    assert.deepEqual(ax.xor([1,2],[3,4]), [1,2,3,4]);
  });
  it('isSubset', () => {
    assert.equal(ax.isSubset([1,2],[1,2,3]), true);
    assert.equal(ax.isSubset([1,4],[1,2,3]), false);
  });
  it('isSuperset', () => {
    assert.equal(ax.isSuperset([1,2,3],[1,2]), true);
    assert.equal(ax.isSuperset([1,2],[1,2,3]), false);
  });
});

// ─── Zip ─────────────────────────────────────────────────────

describe('zip family', () => {
  it('zip basic', () => {
    assert.deepEqual(ax.zip([1,2,3],['a','b','c']), [[1,'a'],[2,'b'],[3,'c']]);
  });
  it('zip stops at shortest', () => {
    assert.deepEqual(ax.zip([1,2,3],['a','b']), [[1,'a'],[2,'b']]);
  });
  it('zipWith', () => {
    const result = ax.zipWith([1,2,3],[10,20,30], (a,b) => a+b);
    assert.deepEqual(result, [11,22,33]);
  });
  it('zipLongest', () => {
    assert.deepEqual(ax.zipLongest([1,2,3],['a','b']), [[1,'a'],[2,'b'],[3,undefined]]);
  });
  it('zipLongest with fillValue', () => {
    assert.deepEqual(ax.zipLongest([1,2,3],['a','b'], null), [[1,'a'],[2,'b'],[3,null]]);
  });
  it('unzip', () => {
    assert.deepEqual(ax.unzip([[1,'a'],[2,'b'],[3,'c']]), [[1,2,3],['a','b','c']]);
  });
});

// ─── Range ───────────────────────────────────────────────────

describe('range', () => {
  it('basic range', () => {
    assert.deepEqual(ax.range(5), [0,1,2,3,4]);
  });
  it('with start/end', () => {
    assert.deepEqual(ax.range(2,6), [2,3,4,5]);
  });
  it('with step', () => {
    assert.deepEqual(ax.range(0,10,2), [0,2,4,6,8]);
  });
  it('descending', () => {
    assert.deepEqual(ax.range(5,0,-1), [5,4,3,2,1]);
  });
  it('step 0 returns empty', () => {
    assert.deepEqual(ax.range(0,5,0), []);
  });
  it('rangeBy', () => {
    assert.deepEqual(ax.rangeBy(3, i => i*i), [0,1,4]);
  });
});

// ─── Search ──────────────────────────────────────────────────

describe('search functions', () => {
  it('binarySearch finds element', () => {
    const arr = [1,3,5,7,9,11];
    assert.equal(ax.binarySearch(arr, 5), 2);
    assert.equal(ax.binarySearch(arr, 1), 0);
    assert.equal(ax.binarySearch(arr, 11), 5);
  });
  it('binarySearch returns insertion point for missing', () => {
    const arr = [1,3,5,7,9];
    const result = ax.binarySearch(arr, 4);
    assert.equal(result, ~2); // complement of insertion index
  });
  it('indexOfAll', () => {
    assert.deepEqual(ax.indexOfAll([1,2,1,3,1,4], 1), [0,2,4]);
  });
  it('count', () => {
    assert.equal(ax.count([1,2,1,3,1], 1), 3);
  });
  it('countBy', () => {
    const m = ax.countBy([1,2,3,4,5,6], x => x % 2 === 0 ? 'even' : 'odd');
    assert.equal(m.get('even'), 3);
    assert.equal(m.get('odd'), 3);
  });
});

// ─── Sorting ────────────────────────────────────────────────

describe('sortBy/orderBy/rank', () => {
  it('sortBy ascending', () => {
    assert.deepEqual(ax.sortBy([3,1,2], x => x), [1,2,3]);
  });
  it('sortBy descending', () => {
    assert.deepEqual(ax.sortBy([1,3,2], x => x, 'desc'), [3,2,1]);
  });
  it('sortBy objects', () => {
    const items = [{a:3},{a:1},{a:2}];
    const result = ax.sortBy(items, o => o.a);
    assert.deepEqual(result.map(o => o.a), [1,2,3]);
  });
  it('orderBy multi-key', () => {
    const items = [
      {x:1,y:2},{x:1,y:1},{x:2,y:1}
    ];
    const result = ax.orderBy(items, [
      {key: o => o.x, order: 'asc'},
      {key: o => o.y, order: 'desc'},
    ]);
    assert.equal(result[0].x, 1);
    assert.equal(result[0].y, 2);
  });
  it('rank', () => {
    const items = [10, 20, 20, 30];
    const result = ax.rank(items, x => x);
    // rank is descending: 30→rank1, 20→rank2, 20→rank2, 10→rank4
    // result order follows original input order
    assert.equal(result.find(r => r.value === 30).rank, 1);
    assert.equal(result.find(r => r.value === 10).rank, 4);
    const rank20 = result.filter(r => r.value === 20);
    assert.equal(rank20[0].rank, 2);
    assert.equal(rank20[1].rank, 2);
  });
});

// ─── Grouping ───────────────────────────────────────────────

describe('groupBy/bucket', () => {
  it('groupBy', () => {
    const m = ax.groupBy([1,2,3,4,5,6], x => x % 2 === 0 ? 'even' : 'odd');
    assert.deepEqual(m.get('even'), [2,4,6]);
    assert.deepEqual(m.get('odd'), [1,3,5]);
  });
  it('bucket', () => {
    const b = ax.bucket([1,2,3,4,5], 2);
    assert.equal(b.length, 2);
    assert.deepEqual(b[0], [1,2,3]);
    assert.deepEqual(b[1], [4,5]);
  });
});

// ─── Math Helpers ───────────────────────────────────────────

describe('math helpers', () => {
  it('sum', () => {
    assert.equal(ax.sum([1,2,3,4,5]), 15);
    assert.equal(ax.sum([]), 0);
    assert.equal(ax.sum([1,'a',3]), 4);
  });
  it('product', () => {
    assert.equal(ax.product([1,2,3,4]), 24);
    assert.equal(ax.product([]), 1);
  });
  it('min/max', () => {
    assert.equal(ax.min([3,1,4,1,5]), 1);
    assert.equal(ax.max([3,1,4,1,5]), 5);
    assert.equal(ax.min([]), undefined);
  });
  it('mean', () => {
    assert.equal(ax.mean([1,2,3,4,5]), 3);
    assert.equal(ax.mean([]), 0);
  });
  it('median odd', () => {
    assert.equal(ax.median([3,1,2]), 2);
  });
  it('median even', () => {
    assert.equal(ax.median([1,2,3,4]), 2.5);
  });
  it('mode', () => {
    assert.deepEqual(ax.mode([1,2,2,3,3,3]), [3]);
  });
  it('mode tie', () => {
    assert.deepEqual(ax.mode([1,1,2,2,3]).sort(), [1,2]);
  });
  it('variance/stdDev', () => {
    const data = [2,4,4,4,5,5,7,9];
    assert.ok(Math.abs(ax.variance(data) - 4) < 0.001);
    assert.ok(Math.abs(ax.stdDev(data) - 2) < 0.001);
  });
  it('percentile', () => {
    const data = [1,2,3,4,5,6,7,8,9,10];
    assert.equal(ax.percentile(data, 0), 1);
    assert.equal(ax.percentile(data, 100), 10);
    assert.equal(ax.percentile(data, 50), 5.5);
  });
  it('sumBy', () => {
    assert.equal(ax.sumBy([{v:1},{v:2},{v:3}], o => o.v), 6);
  });
  it('minBy/maxBy', () => {
    const items = [{v:3},{v:1},{v:2}];
    assert.equal(ax.minBy(items, o => o.v).v, 1);
    assert.equal(ax.maxBy(items, o => o.v).v, 3);
  });
});

// ─── Window / Pairwise ──────────────────────────────────────

describe('window/pairwise', () => {
  it('sliding window', () => {
    assert.deepEqual(ax.window([1,2,3,4,5], 3), [[1,2,3],[2,3,4],[3,4,5]]);
  });
  it('window with step', () => {
    assert.deepEqual(ax.window([1,2,3,4,5], 2, 2), [[1,2],[3,4]]);
  });
  it('pairwise', () => {
    assert.deepEqual(ax.pairwise([1,2,3,4]), [[1,2],[2,3],[3,4]]);
  });
  it('pairwise single element', () => {
    assert.deepEqual(ax.pairwise([1]), []);
  });
});

// ─── Combinatorics ──────────────────────────────────────────

describe('cartesianProduct/permutations/combinations/powerSet', () => {
  it('cartesianProduct', () => {
    assert.deepEqual(ax.cartesianProduct([1,2],['a','b']), [[1,'a'],[1,'b'],[2,'a'],[2,'b']]);
  });
  it('cartesianProduct single', () => {
    assert.deepEqual(ax.cartesianProduct([1,2,3]), [[1],[2],[3]]);
  });
  it('permutations', () => {
    const p = ax.permutations([1,2,3]);
    assert.equal(p.length, 6);
  });
  it('permutations r=2', () => {
    const p = ax.permutations([1,2,3], 2);
    assert.deepEqual(p, [[1,2],[1,3],[2,1],[2,3],[3,1],[3,2]]);
  });
  it('combinations r=2', () => {
    const c = ax.combinations([1,2,3,4], 2);
    assert.equal(c.length, 6);
    assert.deepEqual(c[0], [1,2]);
  });
  it('combinations r=0', () => {
    assert.deepEqual(ax.combinations([1,2,3], 0), [[]]);
  });
  it('powerSet', () => {
    const ps = ax.powerSet([1,2]);
    assert.equal(ps.length, 4);
    assert.deepEqual(ps[0], []);
    assert.deepEqual(ps[ps.length-1], [1,2]);
  });
});

// ─── Mutation Helpers ───────────────────────────────────────

describe('swap/move/rotate/fill/repeat', () => {
  it('swap', () => {
    const arr = [1,2,3,4];
    ax.swap(arr, 0, 2);
    assert.deepEqual(arr, [3,2,1,4]);
  });
  it('swap negative', () => {
    const arr = [1,2,3,4];
    ax.swap(arr, 0, -1);
    assert.deepEqual(arr, [4,2,3,1]);
  });
  it('move', () => {
    const arr = [1,2,3,4,5];
    ax.move(arr, 0, 2);
    assert.deepEqual(arr, [2,3,1,4,5]);
  });
  it('rotate right', () => {
    assert.deepEqual(ax.rotate([1,2,3,4,5], 2), [4,5,1,2,3]);
  });
  it('rotate left', () => {
    assert.deepEqual(ax.rotate([1,2,3,4,5], -2), [3,4,5,1,2]);
  });
  it('rotate zero', () => {
    assert.deepEqual(ax.rotate([1,2,3], 0), [1,2,3]);
  });
  it('rotate overflow', () => {
    assert.deepEqual(ax.rotate([1,2,3], 5), [2,3,1]);
  });
  it('fill static', () => {
    assert.deepEqual(ax.fill(3, 0), [0,0,0]);
  });
  it('fill function', () => {
    assert.deepEqual(ax.fill(3, i => i*2), [0,2,4]);
  });
  it('repeat', () => {
    assert.deepEqual(ax.repeat([1,2], 3), [1,2,1,2,1,2]);
    assert.deepEqual(ax.repeat([1], 0), []);
  });
});

// ─── Conversion ─────────────────────────────────────────────

describe('keyBy/toPairs/fromPairs', () => {
  it('keyBy', () => {
    const items = [{id:1,name:'a'},{id:2,name:'b'}];
    const result = ax.keyBy(items, o => o.id);
    assert.equal(result[1].name, 'a');
    assert.equal(result[2].name, 'b');
  });
  it('keyBy with valFn', () => {
    const items = [{id:1,name:'a'}];
    const result = ax.keyBy(items, o => o.id, o => o.name);
    assert.equal(result[1], 'a');
  });
  it('toPairs', () => {
    const items = [{id:1,name:'a'},{id:2,name:'b'}];
    assert.deepEqual(ax.toPairs(items, o => o.id, o => o.name), [[1,'a'],[2,'b']]);
  });
  it('fromPairs', () => {
    assert.deepEqual(ax.fromPairs([['a',1],['b',2]]), {a:1, b:2});
  });
});

// ─── Misc ───────────────────────────────────────────────────

describe('misc utilities', () => {
  it('isEmpty', () => {
    assert.equal(ax.isEmpty([]), true);
    assert.equal(ax.isEmpty([1]), false);
    assert.equal(ax.isEmpty(null), true);
  });
  it('sameMembers', () => {
    assert.equal(ax.sameMembers([1,2,3],[3,2,1]), true);
    assert.equal(ax.sameMembers([1,2],[1,2,3]), false);
  });
  it('startsWith', () => {
    assert.equal(ax.startsWith([1,2,3,4],[1,2]), true);
    assert.equal(ax.startsWith([1,2,3],[2,3]), false);
  });
  it('endsWith', () => {
    assert.equal(ax.endsWith([1,2,3,4],[3,4]), true);
    assert.equal(ax.endsWith([1,2,3],[1,2]), false);
  });
  it('sample returns element from array', () => {
    const arr = [1,2,3,4,5];
    assert.ok(arr.includes(ax.sample(arr)));
    assert.equal(ax.sample([]), undefined);
  });
  it('sampleSize correct count', () => {
    const result = ax.sampleSize([1,2,3,4,5], 3);
    assert.equal(result.length, 3);
    const unique = [...new Set(result)];
    assert.equal(unique.length, 3); // no replacement
  });
  it('shuffle preserves elements', () => {
    const arr = [1,2,3,4,5];
    const shuffled = ax.shuffle(arr);
    assert.deepEqual(arr, [1,2,3,4,5]); // original unchanged
    assert.equal(shuffled.length, 5);
    assert.deepEqual(shuffled.slice().sort(), [1,2,3,4,5]);
  });
  it('interleave', () => {
    assert.deepEqual(ax.interleave([1,3,5],[2,4,6]), [1,2,3,4,5,6]);
  });
  it('intersperse', () => {
    assert.deepEqual(ax.intersperse([1,2,3], 0), [1,0,2,0,3]);
  });
  it('splitAt', () => {
    assert.deepEqual(ax.splitAt([1,2,3,4,5], 2), [[1,2],[3,4,5]]);
  });
  it('splitAt negative', () => {
    assert.deepEqual(ax.splitAt([1,2,3,4,5], -2), [[1,2,3],[4,5]]);
  });
  it('splitWhen', () => {
    assert.deepEqual(ax.splitWhen([1,2,5,6,1,2], x => x < 3), [[1,2],[5,6],[1,2]]);
  });
  it('deepFind', () => {
    assert.equal(ax.deepFind([[1,[2,[3]]],4], v => v === 3), 3);
    assert.equal(ax.deepFind([[1,[2]]], v => v === 5), undefined);
  });
  it('toggle add', () => {
    assert.deepEqual(ax.toggle([1,2,3], 4), [1,2,3,4]);
  });
  it('toggle remove', () => {
    assert.deepEqual(ax.toggle([1,2,3], 2), [1,3]);
  });
  it('pipe', () => {
    const result = ax.pipe(
      [1,2,3,4,5],
      arr => arr.filter(x => x > 1),
      arr => arr.map(x => x * 2),
      arr => arr.reduce((a, b) => a + b, 0),
    );
    assert.equal(result, 28);
  });
});

// ─── Default Export ─────────────────────────────────────────

describe('default export', () => {
  it('has all functions', () => {
    const defaultExport = ax.default;
    assert.ok(typeof defaultExport.chunk === 'function');
    assert.ok(typeof defaultExport.flatten === 'function');
    assert.ok(typeof defaultExport.unique === 'function');
    assert.ok(typeof defaultExport.permutations === 'function');
  });
});
