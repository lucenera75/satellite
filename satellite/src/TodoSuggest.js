import React from "react";
import AppContext from "./AppContext";
import Autosuggest from "react-autosuggest";

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.title || "";

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => <div>{suggestion.title || ""}</div>;

export default class TodoSuggest extends React.Component {
  static contextType = AppContext;
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: []
    };
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  getSuggestions = value => {
    const punct =
      "\\[" +
      "\\!" +
      '\\"' +
      "\\#" +
      "\\$" + // since javascript does not
      "\\%" +
      "\\&" +
      "\\'" +
      "\\(" +
      "\\)" + // support POSIX character
      "\\*" +
      "\\+" +
      "\\," +
      "\\\\" +
      "\\-" + // classes, we'll need our
      "\\." +
      "\\/" +
      "\\:" +
      "\\;" +
      "\\<" + // own version of [:punct:]
      "\\=" +
      "\\>" +
      "\\?" +
      "\\@" +
      "\\[" +
      "\\]" +
      "\\^" +
      "\\_" +
      "\\`" +
      "\\{" +
      "\\|" +
      "\\}" +
      "\\~" +
      "\\]";
    const re = new RegExp( // tokenizer
      "\\s*" + // discard possible leading whitespace
      "(" + // start capture group
      "\\.{3}" + // ellipsis (must appear before punct)
      "|" + // alternator
      "\\w+\\-\\w+" + // hyphenated words (must appear before punct)
      "|" + // alternator
      "\\w+'(?:\\w+)?" + // compound words (must appear before punct)
      "|" + // alternator
      "\\w+" + // other words
      "|" + // alternator
      "[" +
      punct +
      "]" + // punct
        ")" // end capture group
    );
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    console.log(inputValue);
    const todo = this.context.getCurrentTodo()
    return inputLength === 0
      ? []
      : Object.values(this.context.board.todos).filter(value => {
          // do not suggest if already a dependency 
          if (todo.dependsOn.indexOf(value.id) >=0) {return false}
          // do not suggest if not active
          if (!value.active) {return false} 
          const tokens = value && value.title.split(re).map(t => t.toLowerCase()) || [];
          // console.log(tokens);
          const validtokens = tokens.filter(t => {
            const test =
              t.trim() !== "" &&
              inputValue.trim() != "" &&
              (t.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
                inputValue.toLowerCase().indexOf(t.toLowerCase()) >= 0);
            // console.log(t, inputValue, test);
            return test;
          });

          // const found = tokens.indexOf(inputValue.toLowerCase()) >= 0;
          // console.log("validtokens: ", validtokens);
          return validtokens.length > 0;
        });
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      className:"form-control",
      style:{wordBreak: "break-word"},
      placeholder: "...",
      value,
      onChange: this.onChange,
      onKeyPress: (e) => {
        // console.log("key ",e.key)
        if (e.key === "Enter"){
          // console.log(this.suggestion,this.state.value)
          const todo = this.context.getCurrentTodo()
          if (this.suggestion) {
            todo.dependsOn.push(this.suggestion.id)
            this.suggestion = false;
          } else {
            const newTodo = this.context.createNewTodo(value)
            todo.dependsOn.push(newTodo.id)
          }
          this.context.updateTodo(todo)
        }
        // if (e.key === 'Delete') {
        //   context.removeTodo(todo)
        // }
    }

    };

    // Finally, render it!
    console.log(value)
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={(e,{suggestion}) => {this.suggestion = suggestion}}        
      />
    );
  }
}
