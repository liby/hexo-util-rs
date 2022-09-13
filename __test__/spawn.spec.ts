import { writeFile, unlink } from 'fs'
import { join } from 'path'

import test from 'ava'
import rewire from 'rewire'

import { CacheStream, spawn } from '../index'

const isWindows = process.platform === 'win32'
const isLinux = process.platform === 'linux'
const catCommand = isWindows ? 'type' : 'cat'

const fixturePath = join(__dirname, 'spawn_test.txt')
const fixture = 'test content'

// eslint-disable-next-line no-console
console.log('这里是', process.platform)
test.before(() => {
  writeFile(fixturePath, fixture, (err) => {
    if (err) throw err
  })
})

test.after.always(() => {
  unlink(fixturePath, (err) => {
    if (err) throw err
  })
})

test('default - string', (t) => {
  return spawn(catCommand, fixturePath).then((result) => {
    t.pass(result)
  })
})

test('default - empty argument and options', async (t) => {
  if (isWindows) {
    const out = await spawn('ver')
    t.true(out.trim().startsWith('Microsoft Windows'))
  } else {
    const out = await spawn('uname')
    t.true(['Linux', 'Darwin'].includes(out.trim()))
  }
})

test('default - options and empty argument', async (t) => {
  if (isWindows) {
    const out = await spawn('chdir', { cwd: __dirname })
    t.is(out.trim(), __dirname)
  } else {
    const out = await spawn('pwd', { cwd: __dirname })
    t.is(out.trim(), __dirname)
  }
})

test('error', (t) => {
  const promise = spawn(catCommand, ['nothing'])
  if (isWindows) {
    return promise.then(
      () => {},
      (err) => {
        t.is(err.message, 'spawn type ENOENT')
        t.is(err.code, 'ENOENT')
      },
    )
  }

  if (isLinux) {
    return promise.then(
      () => {},
      (err) => {
        t.pass(err.message)
      },
    )
  }

  return promise.then(
    () => {},
    (err) => {
      t.is(err.message, 'cat: nothing: No such file or directory\n')
      t.is(err.code, 1)
    },
  )
})

test('verbose - stdout', (t) => {
  const spawn = rewire('../common/spawn')
  const stdoutCache = new CacheStream()
  const stderrCache = new CacheStream()
  const content = 'something'

  spawn.__set__(
    'process',
    Object.assign({}, process, {
      stdout: stdoutCache,
      stderr: stderrCache,
    }),
  )

  // @ts-expect-error missing call signatures definition in @types/rewire
  return spawn('echo', [content], {
    verbose: true,
  }).then(() => {
    const result = stdoutCache.getCache().toString('utf8').trim()
    if (isWindows) {
      t.regex(result, new RegExp(`^(["']?)${content}\\1$`))
    } else if (isLinux) {
      t.pass(result)
    } else {
      t.is(result, content)
    }
  })
})

test('verbose - stderr', (t) => {
  const spawn = rewire('../common/spawn')
  const stdoutCache = new CacheStream()
  const stderrCache = new CacheStream()

  spawn.__set__(
    'process',
    Object.assign({}, process, {
      stdout: stdoutCache,
      stderr: stderrCache,
      removeListener: () => {},
      on: () => {},
    }),
  )

  // @ts-expect-error missing call signatures definition in @types/rewire
  return spawn(catCommand, ['nothing'], {
    verbose: true,
  }).then(
    () => {},
    () => {
      const stderrResult = stderrCache.getCache()

      if (isWindows) {
        // utf8 support in Windows shell (cmd.exe) is difficult.
        // Buffer.byteLength(stderrResult, 'hex').should.least(1)
        t.assert(Buffer.byteLength(stderrResult, 'hex') > 0)
      } else if (isLinux) {
        t.pass(stderrResult.toString('utf8'))
      } else {
        t.regex(stderrResult.toString('utf8'), /^cat: nothing: No such file or directory\n?$/)
      }
    },
  )
})

test('custom encoding', async (t) => t.pass(await spawn(catCommand, [fixturePath], { encoding: 'hex' })))

test('encoding = null', async (t) => t.pass(await spawn(catCommand, [fixturePath], { encoding: null })))

test('stdio = inherit', async (t) => t.pass(await spawn('echo', ['something'], { stdio: 'inherit' })))

test('command is required', (t) => {
  // @ts-expect-error
  t.throws(() => spawn())
})
