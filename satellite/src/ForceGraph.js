import React from "react";
import AppContext from "./AppContext";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";

export default ({ todo }) => {
  const context = React.useContext(AppContext);
  const [shown, setShown] = React.useState(true);
  const [showActive, setShowActive] = React.useState(true);
  const data = { nodes: [], links: [] };
  Object.values(context.board.todos).forEach(todo => {
    if (showActive) {
      if (todo.active) {
        data.nodes.push({
          id: todo.id + "",
          title: todo.title,
          active: todo.active
        });
      }
    } else {
      data.nodes.push({
        id: todo.id + "",
        title: todo.title,
        active: todo.active
      });
    }
    todo.dependsOn.forEach(dep => {
      if (context.board.todos[dep]) {
        if (showActive) {
          if (todo.active && context.board.todos[dep].active) {
            data.links.push({ source: dep + "", target: todo.id + "" });
          }
        } else {
          data.links.push({ source: dep + "", target: todo.id + "" });
        }
      }
    });
  });
  console.log(data);
  return (
    <div>
      <button onClick={() => setShown(!shown)}>toggle graph</button>
      <button onClick={() => setShowActive(!showActive)}>toggle active</button>
      {shown && (
        <div
          style={{
            width: "700px",
            height: "700px",
            margin: "auto",
            border: "solid green 1px"
          }}
        >
          <ForceGraph2D
            width="600"
            height="600"
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.25}
            graphData={data}
            nodeLabel={n => n.title}
            nodeColor={n => (n.active && "green") || "gray"}
          ></ForceGraph2D>
        </div>
      )}
    </div>
  );
};
