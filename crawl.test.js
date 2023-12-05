const { test, expect } = require('@jest/globals')
const { normalizeURL, getURLsFromHTML: getURLsFromHTML } = require('./crawl.js')

// normalizeURL tests
test("trailing slash is ignored", () => {
    expect(normalizeURL("https://duckduckgo.com/"))
        .toBe(normalizeURL("https://duckduckgo.com"))
})

test("http(s) is ignored", () => {
    expect(normalizeURL("https://duckduckgo.com/"))
        .toBe(normalizeURL("http://duckduckgo.com/"))
})

test("search params are ignored", () => {
    expect(normalizeURL("https://duckduckgo.com/?t=h_&q=lol&ia=web"))
        .toBe(normalizeURL("https://duckduckgo.com/"))
})

test("hash is ignored", () => {
    expect(normalizeURL("https://duckduckgo.com/#searchbox_input"))
        .toBe(normalizeURL("https://duckduckgo.com/"))
})


// getURLsFromHTML tests
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
