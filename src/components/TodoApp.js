import React from 'react';
import Header from './Header';
import Form from './Form';
import Todo from './Todos';
import CompletedTodos from './CompletedTodos';
import { v4 as uuidv4 } from 'uuid';

class TodoApp extends React.Component {

  state = {
    todos: [],
    completedTodos: [],
    searchTerm: ''
  }

  setTodos = () => {
    const todos = []
    const completedTodos = []

    fetch('http://localhost:8080/get')
      .then(response => response.json())
      .then(data => {
        data.forEach(unparsedDatum => {
          const datum = JSON.parse(unparsedDatum)

          if (datum.isCompleted) {
            completedTodos.push({
              id: datum.id,
              title: datum.title,
              description: datum.description,
              dueDate: datum.date,
              completed: datum.isCompleted
            })
          } else {
            todos.push({
              id: datum.id,
              title: datum.title,
              description: datum.description,
              dueDate: datum.date,
              completed: datum.isCompleted
            })
          }
        })
      })
      .then(() => {
        this.setState(() => ({
          todos,
          completedTodos
        }))
      });
  }

  editSearchTerm = (e) =>
    this.setState({ searchTerm: e.target.value })


  search = () => {
    return this.state.todos
      .filter(todo => todo.title.toLowerCase()
        .includes(this.state.searchTerm.toLowerCase()))
  }

  handleAddTodo = (todo) => {
    if (!todo.title) {
      return 'Enter a title';
    } else if (this.state.todos.filter(stateTodo => todo.title === stateTodo.title).length > 0) {
      return 'A todo with this title already exists';
    }

    fetch('http://localhost:8080/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: uuidv4(),
        title: todo.title,
        date: todo.dueDate,
        description: todo.description
      })
    })

    this.setState((prevState) => ({ todos: prevState.todos.concat(todo) }));
  }

  handleEditTodo = (originalTitle, newTitle) => {

    if (this.state.todos.filter(stateTodo => newTitle === stateTodo.title).length > 0) {
      return 'A todo with this title already exists';
    } else if (newTitle === null || newTitle.length === 0) {
      return 'Please enter a valid title'
    }

    const todo = this.state.todos.find(todo => todo.title === originalTitle)

    fetch('http://localhost:8080/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: todo.id,
        title: newTitle,
        date: todo.dueDate,
        description: todo.description,
        isCompleted: false
      })
    })

    const todoIndex = this.state.todos.findIndex((stateTodo) => originalTitle === stateTodo.title);
    const updatedTodos = this.state.todos;
    updatedTodos[todoIndex].title = newTitle

    this.setState(() => ({ todos: updatedTodos }));
  }

  handleCompleteTodo = (title) => {

    const todo = this.state.todos.find(todo => todo.title === title)

    fetch('http://localhost:8080/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: todo.id,
        title: todo.title,
        date: todo.dueDate,
        description: todo.description,
        isCompleted: true
      })
    })

    const updatedCompletedTodos = this.state.completedTodos;
    updatedCompletedTodos.push({ title: title })
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => {
        return todo.title !== title;
      }),
      completedTodos: updatedCompletedTodos
    }));
  }

  handleDeleteTodo = (todo) => {
    fetch(`http://localhost:8080/delete?id=${todo.id}`, {
      method: 'DELETE'
    })

    this.setState((prevState) =>
      ({ completedTodos: prevState.completedTodos.filter(completedTodo => completedTodo.title !== todo.title) }));
  }

  componentDidMount() {
    this.setTodos()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.todos.length !== this.state.todos.length ||
      prevState.completedTodos.length !== this.state.completedTodos.length
    ) {
      this.setTodos()
    }
  }

  render() {
    return (
      <div>
        <Header />

        <div className='container'>
          <Form
            handleAddTodo={this.handleAddTodo}
          />
          <input
            className='search-bar'
            type='text'
            value={this.state.searchTerm}
            onChange={this.editSearchTerm}
            placeholder='Search by title'
          />
          <Todo
            todos={this.search()}
            handleEditTodo={this.handleEditTodo}
            handleCompleteTodo={this.handleCompleteTodo}
          />
          {this.state.completedTodos.length &&
            <CompletedTodos
              handleCompleteTodo={this.handleCompleteTodo}
              handleDeleteTodo={this.handleDeleteTodo}
              completedTodos={this.state.completedTodos}
            />}
        </div>
      </div>
    )
  }
}

export default TodoApp