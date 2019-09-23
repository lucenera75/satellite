import React from "react";
import AppContext from "./AppContext";
import TodoItem from "./TodoItem";
import ModalTodoEdit from "./ModalTodoEdit";
import ForceGraph from "./ForceGraph";
import GraphViz from "./GraphViz";
export default () => {
  const context = React.useContext(AppContext);
  return (
    <div>
      <GraphViz />

      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          Board name:
          <input
            type="text"
            className="form-control"
            value={context.board.name || context.board.id}
            onChange={e => {
              context.setBoard({ ...context.board, name: e.target.value });
            }}
          ></input>
          <button
            onClick={e => {
              if (window.confirm("are you sure?")) {
                alert("at your wish");
                context.deleteCurrentBoard();
              }
            }}
          >
            Delete board
          </button>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => context.createAndEditNewTodo()}
          >
            create new
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row"
          }}
        >
          {/* <div style={{ width: "600px", height: "300px", overflow: "scroll" }}>
          <TodoEdit />
        </div> */}
          <ModalTodoEdit />
          <div style={{ width: "600px", height: "800px" }}>
            <input
              type="text"
              className="form-control"
              value={context.searchTerms}
              onChange={e => context.setSearchTerms(e.target.value)}
            />
            <table>
              {context.getOrderedList().map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </table>
          </div>
          <ForceGraph />
        </div>
      </div>
    </div>
  );
};
