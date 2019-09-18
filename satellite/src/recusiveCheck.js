export default (todoId,todos) => {
    debugger
    console.log("checking recursivity")
    const currentChain=[todoId]
    return buildChain(todoId,todos,currentChain)
}

const buildChain = (todoId,todos,currentChain) => {
    console.log("checking " + todos[todoId].title)
    console.log(currentChain.map(tid => todos[tid].title).join("=>"))
    const currentTodo = todos[todoId]
    if (currentTodo){
        currentTodo.dependsOn.forEach(tid => {
            if (todos[tid]) {
                if (currentChain.indexOf(tid)>=0) {
                    debugger
                    throw "found recursivity " + [...currentChain,tid].map(tid => todos[tid].title).join("=>")
                }
                const chain = [...currentChain, tid]
                buildChain(tid,todos, chain)
            }
        })
        return false
    }
    return false
}