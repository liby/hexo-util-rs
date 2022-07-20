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
Progress: 100%

  hexo-util-rs:
    3 364 399 ops/s, ±0.61%   | fastest

  hexo-util:
    3 351 396 ops/s, ±0.25%   | slowest, 0.39% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "External absolute url" suite...
Progress: 100%

  hexo-util-rs:
    3 123 518 ops/s, ±0.32%   | fastest

  hexo-util:
    3 095 847 ops/s, ±0.33%   | slowest, 0.89% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
Running "Relative absolute url" suite...
Progress: 100%

  hexo-util-rs:
    3 387 815 ops/s, ±0.70%   | fastest

  hexo-util:
    3 276 915 ops/s, ±0.95%   | slowest, 3.27% slower

Finished 2 cases!
  Fastest: hexo-util-rs
  Slowest: hexo-util
```
</details>
