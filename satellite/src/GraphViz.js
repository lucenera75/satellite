import React from "react";
import AppContext from "./AppContext";
import * as d3 from "d3";
import "d3-graphviz";
import ReactModal from "react-modal";

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "_")
    .replace(/</g, "_")
    .replace(/>/g, "_")
    .replace("(", "_")
    .replace(")", "_")
    .replace(/!/g, "_")
    .replace(/"/g, "_")
    .replace(/'/g, "_");
}
export default () => {
  const context = React.useContext(AppContext);
  const ref = React.createRef();
  const elements = [];
  React.useEffect(() => {
    Object.values(context.board.todos)
      .filter(t => t.active)
      .forEach(t => {
        t.dependsOn
          .filter(
            dId => context.board.todos[dId] && context.board.todos[dId].active
          )
          .forEach(dId => {
            elements.push(
              `"${escapeHtml(context.board.todos[dId].title)}" -> "${escapeHtml(
                t.title
              )}"`
            );
          });
      });
    console.log(elements);
    const el = ref.current;
    if (context.graphVizOpen && el) {
      debugger
      d3
        .select(el)
        .graphviz()
        // .width(1200)
        // .height(600)
        .fit(false).renderDot(`digraph  {
        ${elements.join("\n")}
      }`);
    }
  });

  return (
    <div>
      <button onClick={() => context.toggleGraphViz()}>graphviz</button>
      <ReactModal
        isOpen={context.graphVizOpen}
        onRequestClose={() => context.toggleGraphViz()}
        ariaHideApp={false}
      >
        <button
          style={{ float: "right" }}
          className="btn btn-info"
          onClick={() => context.toggleGraphViz()}
        >
          X
        </button>
        <div ref={ref}></div>
      </ReactModal>
    </div>
  );
};
