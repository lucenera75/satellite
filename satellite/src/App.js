import React from "react";
import "./App.css";
import AppContext from "./AppContext";
import axios from "axios";
import Board from "./Board";
import { addToSearch, removeFromSearch, search } from "./Searcher";
import getCumulativeValue from "./getCumulativeValue";
import BoardsNavBar from "./BoardsNavBar";
/*
 *
 * board: {
 *  todos: {
 *    10001: {id: 10001, title: "jlh", summary: "udgkwdck", dependsOn: [10002,10003,...]},
 *    10002: {id: 10001, title: "jlh", summary: "udgkwdck", dependsOn: [10004,10005,...]},
 *    ...
 *  }
 *  metedata: {}
 * }
 *
 * when load first this is to load a board and invoke setBoard
 */

const loadBoards = async () => {
  const boards = await axios.get(
    `${process.env.REACT_APP_SAT_BASE_URL}/boards`
  );
  return boards.data;
};
const boardId = window.location.pathname.substr(1) || "1";
let isNew = false;
const loadBoard = async () => {
  let board = {
    todos: {},
    metadata: {}
  };
  try {
    board = (await axios.get(
      `${process.env.REACT_APP_SAT_BASE_URL}/boards/${boardId}`
    )).data;
    isNew = false;
  } catch (err) {
    isNew = true;
  }
  return board;
};
const deleteBoard = async id => {
  return await axios.delete(
    `${process.env.REACT_APP_SAT_BASE_URL}/boards/${id}`
  );
};
const saveBoard = async board => {
  if (isNew) {
    board.id = boardId;
    return await axios.post(
      `${process.env.REACT_APP_SAT_BASE_URL}/boards`,
      board
    );
    isNew = false;
  } else {
    return await axios.put(
      `${process.env.REACT_APP_SAT_BASE_URL}/boards/${boardId}`,
      board
    );
  }
  // console.log(result)
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.lastCheckpoint = false;
    this.state = {
      endpoint: process.env.REACT_APP_SAT_BASE_URL,
      board: {
        todos: {},
        metadata: {}
      },
      availableBoards: [],
      filteredIds: [],
      searchTerms: "",
      setSearchTerms: searchTerms => {
        this.setState({ searchTerms });
        search(searchTerms).then(filteredIds => this.setState({ filteredIds }));
      },
      currentTodo: false,
      focusedTodo: false,
      setFocusedTodo: focusedTodo => {
        this.setState({ focusedTodo });
      },
      createAndEditNewTodo: () => {
        const todo = this.state.createNewTodo("");
        this.state.setCurrentTodoId(todo.id);
      },
      createNewTodo: (title, flush = true) => {
        const todo = {
          id: new Date().getTime(),
          dateCreate: new Date().getTime(),
          lastUpdate: new Date().getTime(),
          dateCompleted: false,
          title: title,
          description: "",
          active: true,
          dependsOn: []
        };
        if (flush) {
          this.state.addTodo(todo);
        }
        return todo;
      },
      getCurrentTodo: () => {
        return (
          this.state.currentTodoId &&
          this.state.board.todos[this.state.currentTodoId]
        );
      },
      setCurrentTodoId: todoId => {
        console.log("setting todo id", todoId);
        debugger;
        this.setState({ currentTodoId: todoId });
      },
      setBoard: (board, cb) => this.setState({ board }, cb),
      deleteCurrentBoard: async () => {
        await deleteBoard(this.state.board.id);
        window.location = "/";
      },
      refreshWeights: () => {
        console.log("refreshing weights");
        Object.values(this.state.board.todos).forEach(todo => {
          todo.weight = getCumulativeValue(
            todo.id,
            Object.values(this.state.board.todos)
          );
        });
        this.state.setBoard({ ...this.state.board });
      },
      addTodo: todo => {
        const board = { ...this.state.board };
        board.todos[todo.id] = todo;
        addToSearch(todo.id, todo.title);
        this.state.setBoard(board);
      },
      removeTodo: todo => {
        const board = { ...this.state.board };
        delete board.todos[todo.id];
        removeFromSearch(todo.id);
        this.state.setBoard(board);
      },
      updateTodo: (todo, cb) => {
        const board = { ...this.state.board };
        todo.lastUpdate = new Date().getTime();
        board.todos[todo.id] = todo;
        addToSearch(todo.id, todo.title);
        this.state.setBoard(board, cb);
      },
      getOrderedList: () => {
        return Object.values(this.state.board.todos)
          .sort((a, b) => {
            if (a.active && !b.active) return -1;
            if (!a.active && b.active) return 1;
            const allDepsA = a.dependsOn.map(d => this.state.board.todos[d]);
            const openDepsA = allDepsA.filter(d => d && d.active);
            const allDepsB = b.dependsOn.map(d => this.state.board.todos[d]);
            const openDepsB = allDepsB.filter(d => d && d.active);
            if (openDepsB.length > 0) {
              return openDepsA.length - openDepsB.length;
            }
            return b.weight - a.weight;
            // return
          })
          .filter(todo => {
            if (!this.state.searchTerms.trim()) {
              return true;
            }
            return this.state.filteredIds.indexOf(todo.id) >= 0;
          });
      }
    };
  }

  async componentDidMount() {
    const board = await loadBoard();
    Object.values(board.todos).forEach(t => addToSearch(t.id, t.title));
    this.lastCheckpoint = JSON.stringify(board);
    this.state.setBoard(board);
    this.setState({ boardLoaded: true });
    if (isNew) {
      const firstTodo = this.state.createNewTodo("do something amazing", false);
      this.state.addTodo(firstTodo);
    }
    loadBoards().then(boards => {
      this.setState({
        availableBoards: boards.map(b => ({ id: b.id, name: b.name }))
      });
    });
    setInterval(() => {
      if (!this.state.boardLoaded) {
        return;
      }
      if (JSON.stringify(this.state.board) !== this.lastCheckpoint) {
        this.state.refreshWeights();
        console.log("committing changes");
        saveBoard(this.state.board);
        this.lastCheckpoint = JSON.stringify(this.state.board);
      } else {
        console.log("no changes");
      }
    }, 3000);
    const app = this;
    window.addEventListener(
      "keydown",
      function(e) {
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          // e.preventDefault();
          if (app.state.focusedTodo) {
            const list = app.state.getOrderedList();
            const idx = list.indexOf(
              list.find(todo => todo.id === app.state.focusedTodo.id)
            );
            if (e.keyCode == 40 && idx < list.length - 1) {
              const next = list[idx + 1];
              app.state.setFocusedTodo(next);
            }
            if (e.keyCode == 38 && idx > 0) {
              const next = list[idx - 1];
              app.state.setFocusedTodo(next);
            }
          }
        }
      },
      false
    );
  }

  render() {
    if (!this.state.board) {
      return <div />;
    }
    return (
      <AppContext.Provider value={this.state}>
        <BoardsNavBar />
        <Board />
      </AppContext.Provider>
    );
  }
}

export default App;
