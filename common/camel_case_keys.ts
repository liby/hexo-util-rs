import { camelCase } from 'camel-case'

function getter(key: string) {
  return function () {
    return this[key]
  }
}

function setter(key: string) {
  return function (value: unknown) {
    this[key] = value
  }
}

function toCamelCase(str: string) {
  let prefixLength = -1

  // eslint-disable-next-line no-empty
  while (str[++prefixLength] === '_') {}

  if (!prefixLength) {
    return camelCase(str)
  }
  return str.substring(0, prefixLength) + camelCase(str.substring(prefixLength))
}

function camelCaseKeys(obj: object) {
  if (typeof obj !== 'object') throw new TypeError('obj must be an object!')

  const keys = Object.keys(obj)
  const result = {}

  for (const oldKey of keys) {
    const newKey = toCamelCase(oldKey)

    result[newKey] = obj[oldKey]

    if (newKey !== oldKey) {
      Object.defineProperty(result, oldKey, {
        get: getter(newKey),
        set: setter(newKey),
        configurable: true,
        enumerable: true,
      })
    }
  }

  return result
}

export = camelCaseKeys
