import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';


const App = () => {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);

    const addTodoItem = () => {
        if (todo === '') {
            alert('Item is required');
            return;
        }

        setLoading(true);
        axios.post('/api/todos', {
            item: todo
        })
        .then(({ data }) => {
            setTodos((prevState) => [...prevState, data.todo])
            setTodo('');
            setLoading(false);
        })
        .catch((error) => {
            console.log("Error", error); // for debugging purposes only!      
            setLoading(false);
        })
    }

    const changeStatus = (item, status) => {
        setLoading(true)
        axios.post(`/api/todos/${item._id}`, {
            status: status
        })
            .then((response) => {
                const { data } = response;
                const newTodos = todos.map((t) => {
                    if (t._id === item._id) {
                        return data.todo; 
                    }
                    return t;
                });
                setTodos(newTodos);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }

    const removeTodo = (item) => {
        setLoading(true)
        axios.delete(`/api/todos/${item._id}`)
            .then(() => {
                const newTodos = todos.filter((t) => t._id !== item._id);
                setTodos(newTodos);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            })
    }

    useEffect(() => {
        const fetchTodos = () => {
            setLoading(true);
            axios.get('/api/todos')
                .then((response) => {
                    const { data } = response;
                    setTodos(data.todos);
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setTodos([]);
                    setLoading(false);
                });
        }

        fetchTodos();
    }, []);

    return (
        <div className='todo-app'>
            <div className='todo-app-wrapper'>
                <div className='todo-app-heading'>
                    Todo List
                </div>
                <div className='todo-app-form'>
                    <div className='todo-app-form-heading'>Add New Todo</div>
                    <div className='todo-app-form-content'>
                        <input 
                            type="text"
                            placeholder='TODO Item'
                            value={ todo }
                            onChange={ ({target: {value}}) => setTodo(value) }
                            disabled={ loading }
                        />
                        <button 
                            onClick={ addTodoItem }
                            disabled={ loading }
                        >Add TODO</button>
                    </div>
                </div>
                <div className='todo-app-items'>
                    {
                        todos.map(t => (
                            <div className='todo-app-item' key={t._id}>
                                <div className='todo-app-item-heading'>{ t.item }</div>
                                <div className='todo-app-item-actions'>
                                    <button disabled={ loading || t.status === "pending" } onClick={() => changeStatus(t, "pending")}>Pending</button>
                                    <button disabled={ loading || t.status === "inprogress" } onClick={() => changeStatus(t, "inprogress")}>In Progress</button>
                                    <button disabled={ loading || t.status === "completed" } onClick={() => changeStatus(t, "completed")}>Complete</button>
                                    <button disabled={ loading } onClick={() => removeTodo(t)}>Remove</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
