import React from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import "./index.css";

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
        <h1>TODO</h1>
        <form class="form-inline my-2 my-lg-0" onSubmit={this.handleSubmit}>
          <input
            class="form-control mr-sm-2"
            type="text"
            placeholder="What needs to be done?"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button class="btn btn-secondary my-2 my-sm-0" type="submit">
            Add
          </button>
        </form>
        <TodoList
          items={this.state.items}
          complete={this.completeTodo.bind(this)}
          delete={this.deleteTodo.bind(this)}
        />
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
    const newtodo = {
      title: "new-todo"
    };
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
      <ul>
        {this.props.items.map((item) => (
          <Todo
            todo={item}
            complete={this.props.complete}
            delete={this.props.delete}
          />
        ))}
      </ul>
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
        <table class="table table-hover">
          <tbody>
            <tr class="table-active">
              <th scope="row">
                <del>{todo.content}</del>
              </th>
              <td>
                <a href="" onClick={this.delete.bind(this)}>
                  [-]
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <table class="table table-hover">
          <tbody>
            <tr class="table-active">
              <th scope="row">{todo.content}</th>
              <td>
                <a href="" onClick={this.done.bind(this)}>
                  [✓]
                </a>
              </td>
              <td>
                <a href="" onClick={this.delete.bind(this)}>
                  [-]
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
  }
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));
