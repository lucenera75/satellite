import FlexSearch from "flexsearch"
const index = new FlexSearch({
    encode: "balance",
    tokenize: "forward",
    threshold: 0,
    async: false,
    worker: false,
    cache: false
});

export const addToSearch = (id, text) => {
    index.add(id, text)
}
export const removeFromSearch = (id) => {
    index.remove(id)
}
export const search = async (text) => {
    return await index.search(text)
}

window.search = search