const { myCrawler, report } = require('./crawl')

function main() {
    if (process.argv.length < 3) {
        console.log("Error: no arguments provided (need exactly 1)")
        return
    }

    if (process.argv.length > 3) {
        console.log("Error: too many arguments provided (need exactly 1)")
        return
    }

    myCrawler(process.argv[2])
        .then(pages => report(pages))
}

main()
