const { test, expect } = require('@jest/globals')
const { normalizeUrl, getUrlsFromHTML: getURLsFromHTML } = require('./crawl.js')

// normalizeUrl tests
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


// getUrlsFromHTML tests
test("urls are extracted", () => {
    const htmlStr = `<p>I did talk about JS noise briefly in the <a href="/posts/developer-philosophies/">Developer Philosophies</a> article, although I wrote that... ... attention to a language’s common philosophies and practices (and I contemplated that topic in yet another article called <a href="/posts/pragmatism-vs-idealism/">Pragmatism vs Idealism</a>).</p> <a href="/">Home</a>`

    expect(getURLsFromHTML(htmlStr, "https://wipdev.netlify.app"))
        .toStrictEqual([
            "https://wipdev.netlify.app/posts/developer-philosophies/",
            "https://wipdev.netlify.app/posts/pragmatism-vs-idealism/",
            "https://wipdev.netlify.app/"
        ])
})

test("`about:blank` is removed", () => {
    const htmlStr = `<div class="onboardingEd_onboardingEdDismiss__WnMRt"><a href="#" class="onboardingEd_dismissBtn__PZMVz">Dismiss forever</a><span class="onboardingEd_divider__ICbPu">|</span><a href="#" class="onboardingEd_backToSearchBtn__81cxP">Back to search</a></div>`

    expect(getURLsFromHTML(htmlStr, "https://duckduckgo.com/"))
        .toStrictEqual([
            "https://duckduckgo.com/#",
            "https://duckduckgo.com/#",
        ])
})
