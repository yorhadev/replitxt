function handleClicks() {
    document.addEventListener("click", e => {
        function _checkPopupUl() {
            const content = document.getElementById("popup-content")
            if (content.childElementCount <= 0) return
            content.firstChild.remove()
        }

        function _createPopupUl(titlesList) {
            const content = document.getElementById("popup-content")
            const ul = document.createElement("ul")
            titlesList.forEach((title) => {
                const li = document.createElement("li")
                li.innerText = title
                li.classList.add("hidden")
                li.classList.add("visuallyhidden")
                ul.appendChild(li)
            })
            content.appendChild(ul)
        }

        function _animatePopupLi() {
            const ul = document.querySelectorAll("#popup-content li")
            ul.forEach((li) => {
                li.classList.remove("hidden")
                setTimeout(() => li.classList.remove('visuallyhidden'), 20)
            })
        }

        function _downloadLinksAsTXT(content) {
            const date = new Date()
            const link = document.createElement("a")
            const file = new Blob([content], { type: 'text/plain' })
            link.href = URL.createObjectURL(file)
            link.download = `replitxt-${e.target.innerText}-${date.getTime()}.txt`
            link.click()
            link.remove()
            URL.revokeObjectURL(link.href)
        }

        function getStackTitles(tabs) {
            browser.tabs
                .sendMessage(tabs[0].id, {
                    command: "get-stack-titles",
                })
                .then((response) => {
                    _checkPopupUl()
                    _createPopupUl(response.response)
                    _animatePopupLi()
                })
        }

        function getLinks(tabs) {
            browser.tabs
                .sendMessage(tabs[0].id, {
                    command: "get-links",
                    title: e.target.innerText
                })
                .then((response) => {
                    _downloadLinksAsTXT(response.response)
                })
        }

        if (e.target.tagName === "BUTTON") {
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then(getStackTitles)
        }

        if (e.target.tagName === "LI") {
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then(getLinks)
        }
    })
}

browser.tabs
    .executeScript({ file: "/scripts/handle-repls.js" })
    .then(handleClicks)