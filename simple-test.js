const { stripTags } = require('./index')

const text = 'lorem ipsum < a> < div>'
console.assert(stripTags(text) === text, 'Simple test failed')

console.info('Simple test passed')
