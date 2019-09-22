import React from "react";
import AppContext from "./AppContext";
import TodoItem from "./TodoItem";
import ModalTodoEdit from "./ModalTodoEdit";
import ForceGraph from "./ForceGraph";
export default () => {
  // React.memo((props) => {
  //   <ForceGraph />
  // })
  const context = React.useContext(AppContext);
  const memoForceGraph = React.useMemo(() => <ForceGraph />, [
    JSON.stringify(context.board)
  ]);
  return (
    <div>
          <div
          style={{
            display: "flex",
            flexDirection: "row"
          }}>
            Board name: 
            <input type="text" 
            className="form-control"
            value={context.board.name || context.board.id}
            onChange={(e) => {
              context.setBoard({...context.board,name:e.target.value})
            }}></input>
            <button
            onClick={(e)=>{
              if (window.confirm("are you sure?")){
                alert("at your wish");
                context.deleteCurrentBoard()
              }
            }}
            >Delete board</button>
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
        <div style={{ width: "600px", height: "800px", overflow: "scroll" }}>
          <input
            type="text"
            className="form-control"
            value={context.searchTerms}
            onChange={e => context.setSearchTerms(e.target.value)}
          />
          <ul className="list-group">
            {Object.values(context.board.todos)
              .sort((a, b) => {
                if (a.active && !b.active) return -1;
                if (!a.active && b.active) return 1;
                const allDepsA = a.dependsOn.map(d => context.board.todos[d]);
                const openDepsA = allDepsA.filter(d => d && d.active);
                const allDepsB = b.dependsOn.map(d => context.board.todos[d]);
                const openDepsB = allDepsB.filter(d => d && d.active);
                if (openDepsB.length > 0) {
                  return openDepsA.length - openDepsB.length;
                }
                return b.weight - a.weight;
                // return
              })
              .filter(todo => {
                if (!context.searchTerms.trim()) {
                  return true;
                }
                return context.filteredIds.indexOf(todo.id) >= 0;
              })
              .map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
          </ul>
        </div>
        {/* <MemoForceGraph /> */}
        {memoForceGraph}
      </div>
    </div>
  );
};
