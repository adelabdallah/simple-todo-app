import React from 'react';

const CompletedTodos = (props) => {
  return (
    <div className='completed-todos'>
      <h3>Completed Todos</h3>
      {
        props.completedTodos.map((todo, index) => {
          return <p className='completed-todos__title' key={index}>{todo.title}</p>
        })
      }
    </div>
  );
};

export default CompletedTodos;