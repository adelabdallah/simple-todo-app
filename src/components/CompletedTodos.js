import React from 'react';

const CompletedTodos = (props) => {
  return (
    <div className='completed-todos'>
      <h3>Completed Todos</h3>
      {
        props.completedTodos.map((todo, index) => {
          return (
            <React.Fragment key={index}>
              <p className='completed-todos__title'>{todo.title}</p>
              <button
                onClick={(e) => {
                  props.handleDeleteTodo(todo)
                }}
              >
                Delete
              </button>
            </React.Fragment>
          )
        })
      }
    </div>
  );
};

export default CompletedTodos;