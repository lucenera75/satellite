import React from "react";
import AppContext from "./AppContext";

export default ({ todo }) => {
  const context = React.useContext(AppContext);
  const allDeps = todo.dependsOn.map(d => context.board.todos[d]);
  const openDeps = allDeps.filter(d => d && d.active);
  const classNames = [];
  if (openDeps.length === 0) {
    classNames.push("text-success");
  } else {
    classNames.push("text-danger");
  }
  if (!todo.active) {
    classNames.push("text-muted");
    classNames.push("text-line-through");
  }
  if (todo.id === context.focusedTodo.id) {
    classNames.push("bg-warning");
  } else {
    // classNames.push("bg-secondary")
  }
  return (
    <tr
      style={{ fontSize: "10px" }}
      className={classNames.join(" ")}
      tabIndex="0"
      onClick={() => {
        context.setFocusedTodo(todo);
      }}
      onDoubleClick={e => context.setCurrentTodoId(todo.id)}
      onKeyPress={e => {
        if (e.key === "Delete") {
          context.removeTodo(todo);
        }
        if (e.key === "Enter") {
          context.setCurrentTodoId(todo.id);
        }
      }}
    >
      <td>
        <input
          type="number"
          style={{
            width: "30px"
          }}
          value={todo.priority || 0}
          onChange={e => {
            context.updateTodo({ ...todo, priority: e.target.value });
          }}
        ></input>
      </td>
      <td>
        <input
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
      </td>
      <td style={{ width: "70%" }}>{todo.title}</td>
      <td>{`${openDeps.length}/${allDeps.length}`}</td>
      <td >{todo.weight}</td>
      <td style={{ width: "30%" }}>
        {todo.dateCreate &&
          `- created on: ${new Date(todo.dateCreate).toLocaleDateString()}`}
        {todo.dateCompleted &&
          `- completed on: ${new Date(
            todo.dateCompleted
          ).toLocaleDateString()}`}
      </td>
      <td>
        <button
          style={{ float: "right" }}
          className="btn btn-primary"
          onClick={() => context.setCurrentTodoId(todo.id)}
        >
          E
        </button>
      </td>
    </tr>
  );
};
