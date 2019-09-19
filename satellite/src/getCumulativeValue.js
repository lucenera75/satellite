export default (todoId,todos) => {
    let val = 1
    return cumulate(todoId,todos,val)
}

const cumulate = (todoId,todos,val) => {
    Object.values(todos)
    .filter(t => t.dependsOn.indexOf(todoId)>=0)
    .forEach( t=>{
        val ++    
        val = cumulate(t.id, todos, val)
    })
    return val
}