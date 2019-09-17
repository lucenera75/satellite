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
  return (
    <li
      className="list-group-item"
      tabIndex="0"
      className={className}
      onFocus={() => context.setCurrentTodoId(todo.id)}
      onKeyPress={e => {
        if (e.key === "Delete") {
          context.removeTodo(todo);
        }
      }}
    >
      <input
        type="checkbox"
        checked={!todo.active}
        onChange={() => {
          todo.active = !todo.active;
          if (todo.active) {
            todo.dateCompleted = new Date().getTime();
          } else {
            todo.dateCompleted = false;
          }
          context.updateTodo(todo);
        }}
      />
      {`-${todo.title}-${openDeps.length}/${allDeps.length}`}
    </li>
  );
};
