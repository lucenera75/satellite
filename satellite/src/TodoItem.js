import React from "react";
import AppContext from "./AppContext";

export default ({ todo }) => {
  const context = React.useContext(AppContext);
  const className =
    context.currentTodoId === todo.id
      ? "list-group-item active"
      : "list-group-item";
  const allDeps = todo.dependsOn.map(d => context.board.todos[d]);
  const openDeps = allDeps.filter(d => d && d.active);
  const classNames = ["list-group-item"]
  if (openDeps.length===0) {
    classNames.push("text-success")
  } else {
    classNames.push("text-danger")
  }
  if (!todo.active) {
    classNames.push("text-muted")
    classNames.push("text-line-through")
  }
  return (
    <li
      className={classNames.join(" ")}      
      tabIndex="0"
      onKeyPress={e => {
        if (e.key === "Delete") {
          context.removeTodo(todo);
        }
        if (e.key === "Enter") {
          context.setCurrentTodoId(todo.id);
        }
      }}
    >      
      <input
        className="form-check-input"
        type="checkbox"
        checked={!todo.active}
        onChange={() => {
          todo.active = !todo.active;
          if (!todo.active) {
            todo.dateCompleted = new Date().getTime();
          } else {
            todo.dateCompleted = false;
          }
          context.updateTodo(todo);
        }}
      />
      {`-${todo.title}-${openDeps.length}/${allDeps.length}` }
      {todo.dateCreate && `- created on: ${new Date(todo.dateCreate).toLocaleDateString()}`}
      {todo.dateCompleted && `- completed on: ${new Date(todo.dateCompleted).toLocaleDateString()}`}
      <button
      style={{float:"right"}}
      className="btn btn-primary"
      onClick={() => context.setCurrentTodoId(todo.id)}
      >E</button>
    </li>
  );
};
