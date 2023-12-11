import React, { useState, useEffect } from 'react';
import './App.css';
import Board from './components/Board.js'
import axios from 'axios'

import { TaskContext, ColumnContext } from './context'

function App() {
    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])

    const statusClasses = [
        { id: 1, title: 'Backlog', limit: 10, className: 'column col_first' },
        { id: 2, title: 'Todo', limit: 10, className: 'column col_second' },
        { id: 3, title: 'In Progress', limit: 10, className: 'column col_third' },
        { id: 4, title: 'Done', limit: 10, className: 'column col_fourth' }]
    const [columns, setColumns] = useState(statusClasses)

    const statusToColumnId = {
        "Backlog": 1,
        "Todo": 2,
        "In progress": 3,
        "Done": 4
    }

    const formatTaskAsPerStatus = (task = []) => {
        return task.map((task) => ({
            ...task,
            columnId: statusToColumnId[task.status],
            grouping: 'Status',
        }))
    }

    const appendUserName = (task = [], userIdToName = {}) => {
        return task.map((task) => ({
            ...task,
            userName: userIdToName[task.userId]
        }))
    }

    const appendCountToColumn = (columns, tasks) => {
        return columns.map((column) => ({
            ...column,
            count: tasks.filter((task) => statusToColumnId[task.status] === column.id).length
        }))
    }

    async function fetchQuickSellTasks() {
        const response = await axios.get("https://api.quicksell.co/v1/internal/frontend-assignment");
        const taskResponse = response.data;
        let taskList = formatTaskAsPerStatus(taskResponse.tickets);
        const userIdToName = {};
        taskResponse.users.forEach((user) => {
            userIdToName[user.id] = user.name
        })
        taskList = appendUserName(taskList, userIdToName);
        setColumns(appendCountToColumn(columns, taskList))
        setTasks(taskList)
        setUsers(taskResponse.users)

    }

    useEffect(() => {
        fetchQuickSellTasks()
    }, []);

    const { Provider: TaskProvider } = TaskContext;
    const { Provider: ColumnProvider } = ColumnContext;

    return (
        <>
            {/* <Form getNewTask={getNewTask}/> */}
            <ColumnProvider value={{ columns }}>
                <TaskProvider value={{ tasks }}>
                    <Board columns={columns}
                        tasks={tasks}
                        setColumns={setColumns}
                        setTasks={setTasks}
                        users={users} />
                </TaskProvider>
            </ColumnProvider>
        </>
    );
}

export default App;
