# `@napi-rs/hexo-util`

![https://github.com/liby/hexo-util-rs/actions](https://github.com/liby/hexo-util-rs/workflows/CI/badge.svg)

> Generated from [napi-rs/package-template](https://github.com/napi-rs/package-template)

⚠️ This project is in alpha stage. And there may some bugs existed.

# Usage

1. **Clone** this project.
2. Run `yarn install` to install dependencies.
3. After `yarn build/npm run` build command, you can see `hexo-util.[darwin|win32|linux].node` file in project root. This is the native addon built from [lib.rs](https://github.com/liby/hexo-util-rs/blob/main/src/lib.rs).
4. Test With [ava](https://github.com/avajs/ava), run `yarn test/npm run test` to testing native addon. You can also switch to another testing framework if you want.


## Support matrix

|                  | node14 | node16 | node18 |
| ---------------- | ------ | ------ | ------ |
| Windows x64      | ✓      | ✓      | ✓      |
| Windows x32      | ✓      | ✓      | ✓      |
| Windows arm64    | ✓      | ✓      | ✓      |
| macOS x64        | ✓      | ✓      | ✓      |
| macOS arm64      | ✓      | ✓      | ✓      |
| Linux x64 gnu    | ✓      | ✓      | ✓      |
| Linux x64 musl   | ✓      | ✓      | ✓      |
| Linux arm gnu    | ✓      | ✓      | ✓      |
| Linux arm64 gnu  | ✓      | ✓      | ✓      |
| Linux arm64 musl | ✓      | ✓      | ✓      |
| Android arm64    | ✓      | ✓      | ✓      |
| Android armv7    | ✓      | ✓      | ✓      |
| FreeBSD x64      | ✓      | ✓      | ✓      |

## Performance

See [benchmark](https://github.com/liby/hexo-util-rs/tree/main/benchmark) for benchmark code.

Hardware info:
```
System Version: macOS 12.4 (21F79)
Kernel Version: Darwin 21.5.0
Processor Name: 8-Core Intel Core i9
Processor Speed: 2.3 GHz
L2 Cache (per Core): 256 KB
L3 Cache: 16 MB
Memory: 32 GB
```

Benchmark:

<details>
<summary>Strip HTML</summary>

```
❯ yarn bench
Running "mini fixture" suite...
Progress: 100%

  hexo-util-rs-buffer:
    1 343 399 ops/s, ±0.55%   | 12.9% slower

  hexo-util-rs:
    1 542 449 ops/s, ±0.44%   | fastest

  hexo-util:
    933 979 ops/s, ±1.30%     | 39.45% slower

  striptags:
    466 526 ops/s, ±1.55%     | 69.75% slower

  string-strip-html:
    13 805 ops/s, ±11.48%      | slowest, 99.1% slower

Finished 5 cases!
  Fastest: hexo-util-rs
  Slowest: string-strip-html
Running "large fixture" suite...
Progress: 100%

  hexo-util-rs-buffer:
    816 ops/s, ±2.62%   | fastest

  hexo-util-rs:
    631 ops/s, ±3.68%   | 22.67% slower

  hexo-util:
    285 ops/s, ±4.13%   | 65.07% slower

  striptags:
    141 ops/s, ±1.45%   | 82.72% slower

  string-strip-html:
    7 ops/s, ±8.74%     | slowest, 99.14% slower

Finished 5 cases!
  Fastest: hexo-util-rs-buffer
  Slowest: string-strip-html
```
</details>


<details>
<summary>Slugify</summary>

```
❯ yarn bench
Running "slugify and escape diacritic" suite...
Progress: 100%

  hexo-util-rs:
    1 104 153 ops/s, ±0.30%   | fastest

  hexo-util:
    255 709 ops/s, ±0.61%     | slowest, 76.84% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
```
</details>


<details>
<summary>isExternalLink</summary>

```
❯ yarn bench
Running "Internal absolute url" suite...
Progress: 50%

  hexo-util-rs:
    1 038 833 ops/s, ±0.37% 
Progress: 100%

  hexo-util-rs:
    1 038 833 ops/s, ±0.37%   | fastest

  hexo-util:
    214 596 ops/s, ±0.30%     | slowest, 79.34% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "External absolute url" suite...
Progress: 50%

  hexo-util-rs:
    953 787 ops/s, ±0.41% 
Progress: 100%

  hexo-util-rs:
    953 787 ops/s, ±0.41%   | fastest

  hexo-util:
    203 306 ops/s, ±0.45%   | slowest, 78.68% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "Relative absolute url" suite...
Progress: 50%

  hexo-util-rs:
    42 956 520 ops/s, ±0.87% 
Progress: 100%

  hexo-util-rs:
    42 956 520 ops/s, ±0.87%   | fastest

  hexo-util:
    18 071 147 ops/s, ±0.63%   | slowest, 57.93% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
```
</details>

<details>
<summary>Encode URL</summary>

```
❯ yarn bench
Running "Encode URL - auth" suite...
Progress: 50%

  hexo-util-rs:
    1 299 520 ops/s, ±0.86% 
Progress: 100%

  hexo-util-rs:
    1 299 520 ops/s, ±0.86%   | fastest

  hexo-util:
    255 364 ops/s, ±0.92%     | slowest, 80.35% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "Encode URL - Internationalized domain name" suite...
Progress: 50%

  hexo-util-rs:
    599 196 ops/s, ±0.87% 
Progress: 100%

  hexo-util-rs:
    599 196 ops/s, ±0.87%   | fastest

  hexo-util:
    177 869 ops/s, ±1.89%   | slowest, 70.32% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "Encode URL - path with unicode" suite...
Progress: 50%

  hexo-util-rs:
    1 348 834 ops/s, ±1.38% 
Progress: 100%

  hexo-util-rs:
    1 348 834 ops/s, ±1.38%   | fastest

  hexo-util:
    1 111 192 ops/s, ±7.06%   | slowest, 17.62% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
```
</details>

<details>
<summary>Decode URL</summary>

```
❯ yarn bench
Running "Decode URL - regular" suite...
Progress: 50%

  hexo-util-rs:
    1 632 744 ops/s, ±0.75% 
Progress: 100%

  hexo-util-rs:
    1 632 744 ops/s, ±0.75%   | fastest

  hexo-util:
    272 866 ops/s, ±1.70%     | slowest, 83.29% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "Decode URL - path with space" suite...
Progress: 50%

  hexo-util-rs:
    2 630 212 ops/s, ±1.67% 
Progress: 100%

  hexo-util-rs:
    2 630 212 ops/s, ±1.67%   | fastest

  hexo-util:
    1 959 248 ops/s, ±0.72%   | slowest, 25.51% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "Decode URL - space" suite...
Progress: 50%

  hexo-util-rs:
    1 228 376 ops/s, ±6.64% 
Progress: 100%

  hexo-util-rs:
    1 228 376 ops/s, ±6.64%   | fastest

  hexo-util:
    239 213 ops/s, ±1.72%     | slowest, 80.53% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "Decode URL - hash and query" suite...
Progress: 50%

  hexo-util-rs:
    781 550 ops/s, ±1.90% 
Progress: 100%

  hexo-util-rs:
    781 550 ops/s, ±1.90%   | fastest

  hexo-util:
    166 420 ops/s, ±1.78%   | slowest, 78.71% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "Decode URL - Internationalized domain name" suite...
Progress: 50%

  hexo-util-rs:
    492 862 ops/s, ±6.49% 
Progress: 100%

  hexo-util-rs:
    492 862 ops/s, ±6.49%   | fastest

  hexo-util:
    155 205 ops/s, ±1.46%   | slowest, 68.51% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
```
</details>

