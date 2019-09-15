import React from "react";
import AppContext from "./AppContext";
import TodoItem from "./TodoItem";
import TodoEdit from "./TodoEdit";

export default () => {
  const context = React.useContext(AppContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row"
      }}
    >
      <div style={{ width: "600px", height: "600px", overflow: "scroll" }}>
        <TodoEdit />
      </div>
      <div style={{ width: "600px", height: "600px", overflow: "scroll" }}>
        <ul className="list-group">
          {Object.values(context.board.todos)
            .sort(
              (a,
              b) => {
                if (a.active && !b.active) return -1
                if (!a.active && b.active) return 1
                const allDepsA = a.dependsOn.map(
                  d => context.board.todos[d]
                );
                const openDepsA = allDepsA.filter(d => d.active);
                const allDepsB = b.dependsOn.map(
                  d => context.board.todos[d]
                );
                const openDepsB = allDepsB.filter(d => d.active);
                return openDepsA.length - openDepsB.length;
              }
            )
            .map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
        </ul>
      </div>
    </div>
  );
};
