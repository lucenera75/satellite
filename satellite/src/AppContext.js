import React from "react";

const AppContext = React.createContext({
    endpoint: process.env.REACT_APP_SAT_BASE_URL,
    board:false,
    availableBoards: [],
    filteredIds: [],
    searchTerms: "",
    graphVizOpen: false,
    toggleGraphViz: () => {},
    setSearchTerms: searchTerms => {},
    currentTodo: false,
    focusedTodo: false,
    setFocusedTodo: focusedTodo => {},
    createAndEditNewTodo: () => {},
    createNewTodo: (title, flush = true) => {},
    getCurrentTodo: () => {},
    setCurrentTodoId: todoId => {},
    setBoard: (board, cb) => {},
    deleteCurrentBoard: async () => {},
    refreshWeights: () => {},
    addTodo: todo => {},
    removeTodo: todo => {},
    updateTodo: (todo, cb) => {},
    getOrderedList: () => {}
});

export default AppContext;
