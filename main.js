function main() {
    if (process.argv.length < 3) {
        console.log("Error: no arguments provided (need exactly 1)")
        return
    }

    if (process.argv.length > 3) {
        console.log("Error: too many arguments provided (need exactly 1)")
        return
    }

    console.log(`Crawling URL ${process.argv[2]}...`)
}

main()
