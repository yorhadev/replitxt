(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function _getMainStack(title) {
        let mainStack = null
        document
            .querySelectorAll("main div.stack div.stack")
            .forEach((stack) => {
                if (stack.firstChild.textContent !== title) return
                mainStack = stack.lastChild
            })
        return mainStack
    }

    function _getMainStackLinks(mainStack) {
        let mainStackLinks = ""
        mainStack.childNodes.forEach((node) => {
            if (!node.className.includes("stack-item")) return
            const link = node.querySelector("a.title-link")
            mainStackLinks += `${link.text}\n${link.href}\n`
        })
        return mainStackLinks
    }

    function getStackTitles() {
        let titles = []
        const stacks = document.querySelectorAll("main div.stack div.stack")
        stacks.forEach(stack => titles.push(stack.firstChild.textContent))
        return titles
    }

    function getLinks(title) {
        const mainStack = _getMainStack(title)
        const mainStackLinks = _getMainStackLinks(mainStack)
        return mainStackLinks
    }

    browser.runtime.onMessage.addListener((request) => {
        if (request.command === "get-stack-titles") {
            const response = getStackTitles()
            return Promise.resolve({ response: response })
        }

        if (request.command === "get-links") {
            const response = getLinks(request.title)
            return Promise.resolve({ response: response })
        }
    });
})();
