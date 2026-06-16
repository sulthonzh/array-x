#!/usr/bin/env node
/**
 * array-x CLI — command-line interface for array utilities
 */

import { readFileSync } from 'node:fs';
import * as arrayX from './index.js';

const args = process.argv.slice(2);
const command = args[0];

function readInput() {
  // Try stdin
  try {
    const data = readFileSync(0, 'utf-8').trim();
    if (data) {
      try { return JSON.parse(data); } catch { return data.split('\n').filter(Boolean); }
    }
  } catch { /* no stdin */ }
  return null;
}

function parseArg(name) {
  const idx = args.indexOf(name);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

function parseNumArg(name, def) {
  const v = parseArg(name);
  if (v === undefined) return def;
  const n = Number(v);
  return Number.isNaN(n) ? def : n;
}

function printArray(arr) {
  if (args.includes('--json')) {
    console.log(JSON.stringify(arr, null, 2));
  } else if (Array.isArray(arr) && arr.every(v => typeof v !== 'object')) {
    console.log(arr.join(' '));
  } else {
    console.log(JSON.stringify(arr, null, 2));
  }
}

const commands = {
  chunk() {
    const input = readInput();
    const size = parseNumArg('--size', 2);
    if (Array.isArray(input)) printArray(arrayX.chunk(input, size));
  },
  flatten() {
    const input = readInput();
    const depth = parseNumArg('--depth', Infinity);
    if (Array.isArray(input)) printArray(arrayX.flatten(input, depth));
  },
  unique() {
    const input = readInput();
    if (Array.isArray(input)) printArray(arrayX.unique(input));
  },
  union() {
    const input = readInput();
    if (Array.isArray(input)) printArray(arrayX.union(...input.filter(Array.isArray)));
  },
  intersection() {
    const input = readInput();
    if (Array.isArray(input)) printArray(arrayX.intersection(...input.filter(Array.isArray)));
  },
  difference() {
    const input = readInput();
    if (Array.isArray(input) && input.length >= 2) {
      printArray(arrayX.difference(input[0], ...input.slice(1)));
    }
  },
  shuffle() {
    const input = readInput();
    if (Array.isArray(input)) printArray(arrayX.shuffle(input));
  },
  sample() {
    const input = readInput();
    const n = parseNumArg('--n', 1);
    if (Array.isArray(input)) printArray(arrayX.sampleSize(input, n));
  },
  reverse() {
    const input = readInput();
    if (Array.isArray(input)) printArray(input.slice().reverse());
  },
  sort() {
    const input = readInput();
    if (Array.isArray(input)) printArray(input.slice().sort((a, b) => a - b));
  },
  range() {
    const start = parseNumArg('--start', 0);
    const end = parseNumArg('--end', 10);
    const step = parseNumArg('--step', 1);
    printArray(arrayX.range(start, end, step));
  },
  permutations() {
    const input = readInput();
    const r = parseNumArg('--r');
    if (Array.isArray(input)) printArray(arrayX.permutations(input, r));
  },
  combinations() {
    const input = readInput();
    const r = parseNumArg('--r', 2);
    if (Array.isArray(input)) printArray(arrayX.combinations(input, r));
  },
  zip() {
    const input = readInput();
    if (Array.isArray(input)) printArray(arrayX.zip(...input.filter(Array.isArray)));
  },
  stats() {
    const input = readInput();
    if (!Array.isArray(input)) { console.log('No input'); return; }
    const nums = input.filter(v => typeof v === 'number');
    const stats = {
      count: nums.length, sum: arrayX.sum(nums), mean: arrayX.mean(nums),
      median: arrayX.median(nums), mode: arrayX.mode(nums),
      min: arrayX.min(nums), max: arrayX.max(nums),
      variance: arrayX.variance(nums), stdDev: arrayX.stdDev(nums),
    };
    console.log(JSON.stringify(stats, null, 2));
  },
  demo() {
    console.log('array-x demo\n');
    console.log('chunk([1,2,3,4,5], 2):', arrayX.chunk([1,2,3,4,5], 2));
    console.log('flatten([[1,2],[3,[4,5]]]):', arrayX.flattenDeep([[1,2],[3,[4,5]]]));
    console.log('unique([1,2,2,3,3,3]):', arrayX.unique([1,2,2,3,3,3]));
    console.log('union([1,2,3],[3,4,5]):', arrayX.union([1,2,3],[3,4,5]));
    console.log('intersection([1,2,3],[2,3,4]):', arrayX.intersection([1,2,3],[2,3,4]));
    console.log('difference([1,2,3,4],[2,4]):', arrayX.difference([1,2,3,4],[2,4]));
    console.log('shuffle([1,2,3,4,5]):', arrayX.shuffle([1,2,3,4,5]));
    console.log('permutations([1,2,3], 2):', arrayX.permutations([1,2,3], 2));
    console.log('combinations([1,2,3,4], 2):', arrayX.combinations([1,2,3,4], 2));
    console.log('zip([1,2,3],["a","b","c"]):', arrayX.zip([1,2,3],['a','b','c']));
    console.log('pairwise([1,2,3,4]):', arrayX.pairwise([1,2,3,4]));
    console.log('window([1,2,3,4,5], 3):', arrayX.window([1,2,3,4,5], 3));
    console.log('rotate([1,2,3,4,5], 2):', arrayX.rotate([1,2,3,4,5], 2));
    console.log('interleave([1,3,5],[2,4,6]):', arrayX.interleave([1,3,5],[2,4,6]));
    console.log('range(1,10,2):', arrayX.range(1,10,2));
    console.log('stats([1,2,3,4,5]): sum=' + arrayX.sum([1,2,3,4,5]) + ' mean=' + arrayX.mean([1,2,3,4,5]) + ' median=' + arrayX.median([1,2,3,4,5]));
    console.log('cartesianProduct([1,2],["a","b"]):', arrayX.cartesianProduct([1,2],['a','b']));
    console.log('powerSet([1,2]):', arrayX.powerSet([1,2]));
  },
  help() {
    console.log(`array-x — array manipulation CLI

Commands:
  chunk [--size N]        Split input into chunks
  flatten [--depth N]     Flatten nested arrays
  unique                  Remove duplicates
  union                   Union of arrays [[...],[...]]
  intersection            Intersection of arrays
  difference              Difference of arrays
  shuffle                 Shuffle array
  sample [--n N]          Sample N random elements
  sort                    Sort numerically
  range [--start S --end E --step T]  Generate range
  permutations [--r N]    Permutations
  combinations [--r N]    Combinations
  zip                     Zip arrays
  stats                   Statistics summary
  demo                    Show examples

Reads JSON array from stdin.
Use --json for JSON output.

Examples:
  echo '[1,2,2,3,3,3]' | array-x unique
  echo '[[1,2],[3,4]]' | array-x flatten
  array-x range --start 0 --end 10 --step 2
  array-x demo`);
  },
};

if (!command || command === 'help' || command === '--help' || command === '-h') {
  commands.help();
} else if (commands[command]) {
  commands[command]();
} else {
  console.error(`Unknown command: ${command}\nRun 'array-x help' for usage.`);
  process.exit(1);
}
