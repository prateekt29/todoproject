import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import "./bootstrap.css";

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const newtodo = {
      title: "new-todo"
    };

    axios
      .post("/api/todos/", newtodo)
      .then((res) => {
        this.setState({
          todoid: res.data.id
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    axios
      .get("/api/todos/" + this.state.todoid)
      .then((res) => {
        this.setState({
          items: res.data.todoItems
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <h1 className="text-center">TODO</h1>
        <div className="row col-12">
          <div className="container">
            <form class="form-inline col-12" onSubmit={this.handleSubmit}>
              <input
                class="form-control col-11"
                type="text"
                placeholder="What needs to be done?"
                onChange={this.handleChange}
                value={this.state.text}
              />
              <button class="btn btn-secondary col-1" type="submit">
                Add
              </button>
            </form>
            <TodoList
              items={this.state.items}
              complete={this.completeTodo.bind(this)}
              delete={this.deleteTodo.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.text.length) {
      return;
    }
    const newtodoitem = {
      complete: false,
      content: this.state.text
    };

    axios
      .post("/api/todos/" + this.state.todoid + "/items", newtodoitem)
      .then((res) => {
        newtodoitem["id"] = res.data.id;
        console.log(newtodoitem);
        this.setState({
          items: this.state.items.concat(newtodoitem),
          text: ""
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  completeTodo(todo) {
    const todos = this.state.items;
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id === todo.id) {
        todos[i].complete = true;
        break;
      }
    }
    this.setState({
      items: todos
    });

    axios
      .put("/api/todos/" + this.state.todoid + "/items/" + todo.id, {
        complete: true
      })
      .then((res) => {
        console.log(res.status);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  deleteTodo(todo) {
    axios
      .delete("/api/todos/" + this.state.todoid + "/items/" + todo.id)
      .then((res) => {
        if (res.status === 204) {
          this.setState({
            items: this.state.items.filter((item) => item.id !== todo.id)
          });
        }
        console.log(res.status);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <div className="container">
        <table className="table table-bordered">
          <tbody>
            {this.props.items.map((item) => (
              <Todo
                todo={item}
                complete={this.props.complete}
                delete={this.props.delete}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

class Todo extends React.Component {
  done(e) {
    e.preventDefault();
    this.props.complete(this.props.todo);
  }

  delete(e) {
    e.preventDefault();
    this.props.delete(this.props.todo);
  }

  render() {
    let todo = this.props.todo;

    if (todo.complete) {
      return (
        <tr>
          <td>
            <del>{todo.content}</del>
          </td>
          <td>
            <a
              href=""
              className="btn btn-danger"
              onClick={this.delete.bind(this)}
            >
              [-]
            </a>
          </td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>{todo.content}</td>
          <td>
            <a
              className="btn btn-success"
              href=""
              onClick={this.done.bind(this)}
            >
              [✓]
            </a>
          </td>
          <td>
            <a
              className="btn btn-danger"
              href=""
              onClick={this.delete.bind(this)}
            >
              [-]
            </a>
          </td>
        </tr>
      );
    }
  }
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));
