const { test, expect } = require('@jest/globals')
const { normalizeUrl } = require('./crawl.js')

test("trailing slash is ignored", () => {
    expect(normalizeUrl("https://duckduckgo.com/"))
        .toBe(normalizeUrl("https://duckduckgo.com"))
})

test("http(s) is ignored", () => {
    expect(normalizeUrl("https://duckduckgo.com/"))
        .toBe(normalizeUrl("http://duckduckgo.com/"))
})

test("search params are ignored", () => {
    expect(normalizeUrl("https://duckduckgo.com/?t=h_&q=lol&ia=web"))
        .toBe(normalizeUrl("https://duckduckgo.com/"))
})

test("hash is ignored", () => {
    expect(normalizeUrl("https://duckduckgo.com/#searchbox_input"))
        .toBe(normalizeUrl("https://duckduckgo.com/"))
})
