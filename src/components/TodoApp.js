import React from 'react';
import Header from './Header';
import Form from './Form';
import Todo from './Todos';
import CompletedTodos from './CompletedTodos';
import "regenerator-runtime/runtime.js";


class TodoApp extends React.Component {

  state = {
    todos: [],
    completedTodos: []
  }

  handleAddTodo = (todo) => {
    if (!todo.title) {
      return 'Enter a title';
    } else if (this.state.todos.filter(stateTodo => todo.title === stateTodo.title).length > 0) {
      return 'A todo with this title already exists';
    }

    this.setState((prevState) => ({ todos: prevState.todos.concat(todo) }));
  }

  handleEditTodo = (originalTitle, newTitle) => {

    if (this.state.todos.filter(stateTodo => newTitle === stateTodo.title).length > 0) {
      return 'A todo with this title already exists';
    } else if (newTitle === null || newTitle.length === 0) {
      return 'Please enter a valid title'
    }

    const todoIndex = this.state.todos.findIndex((stateTodo) => originalTitle === stateTodo.title);
    const updatedTodos = this.state.todos;
    updatedTodos[todoIndex].title = newTitle

    this.setState(() => ({ todos: updatedTodos }));
  }

  handleCompleteTodo = (title) => {
    const updatedCompletedTodos = this.state.completedTodos;
    updatedCompletedTodos.push({ title: title })
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => {
        return todo.title !== title;
      }),
      completedTodos: updatedCompletedTodos
    }));
  }

  async componentDidMount() {

    const response = await fetch('http://localhost:8080/get', {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true'
      }
    })

    console.log(response.json())

    try {
      const todosJson = localStorage.getItem('todos');
      const completedTodosJson = localStorage.getItem('completedTodos');
      const todos = JSON.parse(todosJson);
      const completedTodos = JSON.parse(completedTodosJson);

      if (todos) {
        this.setState(() => ({
          todos
        }));
      }
      if (completedTodos) {
        this.setState(() => ({
          completedTodos
        }));
      }
    } catch (error) {
      //Do nothing
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.todos.length !== this.state.todos.length) {
      const todosJson = JSON.stringify(this.state.todos);
      localStorage.setItem('todos', todosJson);
      console.log('todos updated');
    }
    const completedTodosJson = JSON.stringify(this.state.completedTodos);
    localStorage.setItem('completedTodos', completedTodosJson);
    console.log('completed updated');
  }

  render() {
    return (
      <div>
        <Header />
        <Form
          handleAddTodo={this.handleAddTodo}
        />
        <div className='container'>

          <Todo
            todos={this.state.todos}
            handleEditTodo={this.handleEditTodo}
            handleCompleteTodo={this.handleCompleteTodo}
          />
          <CompletedTodos
            handleCompleteTodo={this.handleCompleteTodo}
            completedTodos={this.state.completedTodos}
          />
        </div>
        {console.log(this.state.todos)}
        {console.log(this.state.completedTodos)}
      </div>
    )
  }
}

export default TodoApp