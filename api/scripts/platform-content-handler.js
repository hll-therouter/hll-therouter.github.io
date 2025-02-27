filteringContext = {
    dependencies: {},
    restrictedDependencies: [],
    activeFilters: []
}
let highlightedAnchor;
let topNavbarOffset;
let instances = [];
let sourcesetNotification;

const samplesDarkThemeName = 'darcula'
const samplesLightThemeName = 'idea'

window.addEventListener('load', () => {
    document.querySelectorAll("div[data-platform-hinted]")
        .forEach(elem => elem.addEventListener('click', (event) => togglePlatformDependent(event, elem)))
    document.querySelectorAll("div[tabs-section]")
        .forEach(elem => elem.addEventListener('click', (event) => toggleSectionsEventHandler(event)))
    const filterSection = document.getElementById('filter-section')
    if (filterSection) {
        filterSection.addEventListener('click', (event) => filterButtonHandler(event))
        initializeFiltering()
    }
    initTabs()
    handleAnchor()
    initHidingLeftNavigation()
    topNavbarOffset = document.getElementById('navigation-wrapper')
})

const initPlayground = (theme) => {
    if (!samplesAreEnabled()) return
    instances.forEach(instance => instance.destroy())
    instances = []

    // Manually tag code fragments as not processed by playground since we also manually destroy all of its instances
    document.querySelectorAll('code.runnablesample').forEach(node => {
        node.removeAttribute("data-kotlin-playground-initialized");
    })

    KotlinPlayground('code.runnablesample', {
        getInstance: playgroundInstance => {
            instances.push(playgroundInstance)
        },
        theme: theme
    });
}

// We check if type is accessible from the current scope to determine if samples script is present
// As an alternative we could extract this samples-specific script to new js file but then we would handle dark mode in 2 separate files which is not ideal
const samplesAreEnabled = () => {
    try {
        KotlinPlayground
        return true
    } catch (e) {
        return false
    }
}


const initHidingLeftNavigation = () => {
    document.getElementById("main").onclick = () => {
        document.getElementById("leftColumn").classList.remove("open");
    }
}

// Hash change is needed in order to allow for linking inside the same page with anchors
// If this is not present user is forced to refresh the site in order to use an anchor
window.onhashchange = handleAnchor

function scrollToElementInContent(element) {
    const scrollToElement = () => document.getElementById('main').scrollTo({
        top: element.offsetTop - topNavbarOffset.offsetHeight,
        behavior: "smooth"
    })

    const waitAndScroll = () => {
        setTimeout(() => {
            if (topNavbarOffset) {
                scrollToElement()
            } else {
                waitForScroll()
            }
        }, 50)
    }

    if (topNavbarOffset) {
        scrollToElement()
    } else {
        waitAndScroll()
    }
}


function handleAnchor() {
    if (highlightedAnchor) {
        highlightedAnchor.classList.remove('anchor-highlight')
        highlightedAnchor = null;
    }

    let searchForTab = function (element) {
        if (element && element.hasAttribute) {
            if (element.hasAttribute("data-togglable")) return element;
            else return searchForTab(element.parentNode)
        } else return null
    }
    let anchor = window.location.hash
    if (anchor != "") {
        anchor = anchor.substring(1)
        let element = document.querySelector('a[data-name="' + anchor + '"]')
        if (element) {
            let tab = searchForTab(element)
            if (tab) {
                toggleSections(tab)
            }
            const content = element.nextElementSibling
            if (content) {
                content.classList.add('anchor-highlight')
                highlightedAnchor = content
            }

            scrollToElementInContent(element)
        }
    }
}

function initTabs() {
    document.querySelectorAll("div[tabs-section]")
        .forEach(element => {
            showCorrespondingTabBody(element)
            element.addEventListener('click', (event) => toggleSectionsEventHandler(event))
        })
    let cached = localStorage.getItem("active-tab")
    if (cached) {
        let parsed = JSON.parse(cached)
        let tab = document.querySelector('div[tabs-section] > button[data-togglable="' + parsed + '"]')
        if (tab) {
            toggleSections(tab)
        }
    }
}

function showCorrespondingTabBody(element) {
    const buttonWithKey = element.querySelector("button[data-active]")
    if (buttonWithKey) {
        const key = buttonWithKey.getAttribute("data-togglable")
        document.querySelector(".tabs-section-body")
            .querySelector("div[data-togglable='" + key + "']")
            .setAttribute("data-active", "")
    }
}

function filterButtonHandler(event) {
    if (event.target.tagName == "BUTTON" && event.target.hasAttribute("data-filter")) {
        let sourceset = event.target.getAttribute("data-filter")
        if (filteringContext.activeFilters.indexOf(sourceset) != -1) {
            filterSourceset(sourceset)
        } else {
            unfilterSourceset(sourceset)
        }
    }
}

function initializeFiltering() {
    filteringContext.dependencies = JSON.parse(sourceset_dependencies)
    document.querySelectorAll("#filter-section > button")
        .forEach(p => filteringContext.restrictedDependencies.push(p.getAttribute("data-filter")))
    Object.keys(filteringContext.dependencies).forEach(p => {
        filteringContext.dependencies[p] = filteringContext.dependencies[p]
            .filter(q => -1 !== filteringContext.restrictedDependencies.indexOf(q))
    })
    let cached = window.localStorage.getItem('inactive-filters')
    if (cached) {
        let parsed = JSON.parse(cached)
        filteringContext.activeFilters = filteringContext.restrictedDependencies
            .filter(q => parsed.indexOf(q) == -1)
    } else {
        filteringContext.activeFilters = filteringContext.restrictedDependencies
    }
    refreshFiltering()
}

function filterSourceset(sourceset) {
    filteringContext.activeFilters = filteringContext.activeFilters.filter(p => p != sourceset)
    refreshFiltering()
    addSourcesetFilterToCache(sourceset)
}

function unfilterSourceset(sourceset) {
    if (filteringContext.activeFilters.length == 0) {
        filteringContext.activeFilters = filteringContext.dependencies[sourceset].concat([sourceset])
        refreshFiltering()
        filteringContext.dependencies[sourceset].concat([sourceset]).forEach(p => removeSourcesetFilterFromCache(p))
    } else {
        filteringContext.activeFilters.push(sourceset)
        refreshFiltering()
        removeSourcesetFilterFromCache(sourceset)
    }

}

function addSourcesetFilterToCache(sourceset) {
    let cached = localStorage.getItem('inactive-filters')
    if (cached) {
        let parsed = JSON.parse(cached)
        localStorage.setItem('inactive-filters', JSON.stringify(parsed.concat([sourceset])))
    } else {
        localStorage.setItem('inactive-filters', JSON.stringify([sourceset]))
    }
}

function removeSourcesetFilterFromCache(sourceset) {
    let cached = localStorage.getItem('inactive-filters')
    if (cached) {
        let parsed = JSON.parse(cached)
        localStorage.setItem('inactive-filters', JSON.stringify(parsed.filter(p => p != sourceset)))
    }
}

function toggleSections(target) {
    localStorage.setItem('active-tab', JSON.stringify(target.getAttribute("data-togglable")))
    const activateTabs = (containerClass) => {
        for (const element of document.getElementsByClassName(containerClass)) {
            for (const child of element.children) {
                if (child.getAttribute("data-togglable") === target.getAttribute("data-togglable")) {
                    child.setAttribute("data-active", "")
                } else {
                    child.removeAttribute("data-active")
                }
            }
        }
    }

    activateTabs("tabs-section")
    activateTabs("tabs-section-body")
}

function toggleSectionsEventHandler(evt) {
    if (!evt.target.getAttribute("data-togglable")) return
    toggleSections(evt.target)
}

function togglePlatformDependent(e, container) {
    let target = e.target
    if (target.tagName != 'BUTTON') return;
    let index = target.getAttribute('data-toggle')

    for (let child of container.children) {
        if (child.hasAttribute('data-toggle-list')) {
            for (let bm of child.children) {
                if (bm == target) {
                    bm.setAttribute('data-active', "")
                } else if (bm != target) {
                    bm.removeAttribute('data-active')
                }
            }
        } else if (child.getAttribute('data-togglable') == index) {
            child.setAttribute('data-active', "")
        } else {
            child.removeAttribute('data-active')
        }
    }
}

function refreshFiltering() {
    let sourcesetList = filteringContext.activeFilters
    document.querySelectorAll("[data-filterable-set]")
        .forEach(
            elem => {
                let platformList = elem.getAttribute("data-filterable-set").split(' ').filter(v => -1 !== sourcesetList.indexOf(v))
                elem.setAttribute("data-filterable-current", platformList.join(' '))
            }
        )
    refreshFilterButtons()
    refreshPlatformTabs()
    refreshNoContentNotification()
}

function refreshNoContentNotification() {
    const element = document.getElementsByClassName("main-content")[0]
    if(filteringContext.activeFilters.length === 0){
        element.style.display = "none";

        const appended = document.createElement("div")
        appended.className = "filtered-message"
        appended.innerText = "All documentation is filtered, please adjust your source set filters in top-right corner of the screen"
        sourcesetNotification = appended
        element.parentNode.prepend(appended)
    } else {
        if(sourcesetNotification) sourcesetNotification.remove()
        element.style.display = "block"
    }
}

function refreshPlatformTabs() {
    document.querySelectorAll(".platform-hinted > .platform-bookmarks-row").forEach(
        p => {
            let active = false;
            let firstAvailable = null
            p.childNodes.forEach(
                element => {
                    if (element.getAttribute("data-filterable-current") != '') {
                        if (firstAvailable == null) {
                            firstAvailable = element
                        }
                        if (element.hasAttribute("data-active")) {
                            active = true;
                        }
                    }
                }
            )
            if (active == false && firstAvailable) {
                firstAvailable.click()
            }
        }
    )
}

function refreshFilterButtons() {
    document.querySelectorAll("#filter-section > button")
        .forEach(f => {
            if (filteringContext.activeFilters.indexOf(f.getAttribute("data-filter")) != -1) {
                f.setAttribute("data-active", "")
            } else {
                f.removeAttribute("data-active")
            }
        })
}
