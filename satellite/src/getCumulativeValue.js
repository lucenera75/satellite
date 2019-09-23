export default (todoId, todos) => {
  // debugger
  // if (todoId===1568628316703) {
  //     console.log("...")
  //     debugger
  // }
  let val = 1;
  val += Number((todos.find(t => t.id === todoId) || { priority: 0 }).priority);
  return cumulate(todoId, todos, val);
};

const cumulate = (todoId, todos, val) => {
  Object.values(todos)
    .filter(t => t.dependsOn.indexOf(todoId) >= 0)
    .forEach(t => {
      val++;
      val += Number(t.priority || 0);
      val = cumulate(t.id, todos, val);
    });
  return val;
};
