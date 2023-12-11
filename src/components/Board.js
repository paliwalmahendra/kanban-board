import React from 'react';
import ColumnContainer from './ColumnContainer';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterIcon from '@mui/icons-material/Tune';
import Menu from '@mui/material/Menu';
import ListItemText from '@mui/material/ListItemText';


export default class Board extends React.Component {

    state = {
        grouping: 'Status',
        ordering: 'Priority',
        isMenuOpen: false,
        anchorEl: null,
    };

    statusColumns = [
        { id: 1, title: 'Backlog', limit: 10, className: 'column col_first' },
        { id: 2, title: 'Todo', limit: 10, className: 'column col_second' },
        { id: 3, title: 'In Progress', limit: 10, className: 'column col_third' },
        { id: 4, title: 'Done', limit: 10, className: 'column col_fourth' }]

    priorityColums = [
        { id: 1, title: 'No', limit: 10, className: 'column col_first' },
        { id: 2, title: 'Low', limit: 10, className: 'column col_first' },
        { id: 3, title: 'Medium', limit: 10, className: 'column col_second' },
        { id: 4, title: 'High', limit: 10, className: 'column col_third' },
        { id: 5, title: 'Urgent', limit: 10, className: 'column col_fourth' }]

    getUserColumns = (users) => {
        return users.map((user, index) => {
            return { id: index + 1, title: user.name, userId: user.id, limit: 10, className: 'column col_first' }
        })
    }

    removeUsersWithZeroTasks = (users, tasks) => {
        const usersWithTasks = users.filter(user => {
            return tasks.some(task => task.userId === user.id);
        });

        return usersWithTasks;

    }

    statusToColumnId = {
        "Backlog": 1,
        "Todo": 2,
        "In progress": 3,
        "Done": 4
    }

    priorityToColumnId = {
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        4: 5
    }

    formatTaskAsPerStatus = (task = []) => {
        return task.map((task) => ({
            ...task,
            columnId: this.statusToColumnId[task.status],
            grouping: 'Status',
        }))
    }

    formatTaskAsPerPriority = (task = []) => {
        return task.map((task) => ({
            ...task,
            columnId: this.priorityToColumnId[task.priority],
            grouping: 'Priority',
        }))
    }

    formatTaskAsPerUser = (userColumns, task = []) => {
        return task.map((task) => ({
            ...task,
            columnId: userColumns.find((column) => column.userId === task.userId).id,
            grouping: 'User'
        }))
    }
    appendUserName = (task = [], userIdToName = {}) => {
        return task.map((task) => ({
            ...task,
            userName: userIdToName[task.userId]
        }))
    }


    getCount = (filterType, tasks, columnId, userId) => {
        if (filterType === 'Status') {
            return tasks.filter((task) => this.statusToColumnId[task.status] === columnId).length
        } else if (filterType === 'Priority') {
            return tasks.filter((task) => this.priorityToColumnId[task.priority] === columnId).length
        }
        return tasks.filter((task) => task.userId === userId).length
    }

    appendCountToColumn = (filterType, columns, tasks, ordering = undefined) => {
        return columns.map((column) => ({
            ...column,
            count: this.getCount(filterType, tasks, column.id, column.userId),
            ordering: ordering
        }))
    }

    regroupTask = (grouping, ordering) => {
        console.log(`grouping tasks with ${grouping}`)
        if (grouping == 'Priority') {
            const taskList = this.formatTaskAsPerPriority(this.props.tasks)
            this.props.setColumns(this.appendCountToColumn(event.target.value, this.priorityColums, taskList, ordering));
            this.props.setTasks(taskList)
        } else if (grouping == 'Status') {
            const taskList = this.formatTaskAsPerStatus(this.props.tasks);
            this.props.setColumns(this.appendCountToColumn(event.target.value, this.statusColumns, taskList, ordering))
            this.props.setTasks(taskList)
        } else {
            const users = this.removeUsersWithZeroTasks(this.props.users, this.props.tasks)
            const userColumns = this.getUserColumns(users)
            const taskList = this.formatTaskAsPerUser(userColumns, this.props.tasks)
            this.props.setColumns(this.appendCountToColumn(event.target.value, userColumns, taskList, ordering));
            this.props.setTasks(taskList)
        }
    }


    handleGroupingChange = (event) => {
        this.regroupTask(event.target.value, this.state.grouping)
        this.setState({ grouping: event.target.value });
    };

    handleOrderingChange = (event) => {
        this.setState({ ordering: event.target.value });
        this.regroupTask(this.state.grouping, event.target.value)
    };

    handleMenuOpen = (event) => {
        this.setState({
            isMenuOpen: true,
            anchorEl: event.currentTarget,
        });
    };

    handleMenuClose = () => {
        this.setState({
            isMenuOpen: false,
        });
    };


    render() {
        const { grouping, ordering, isMenuOpen, anchorEl } = this.state;
        const { columns, tasks, setColumns, setTasks } = this.props;
        return (
            <section className="kanban">
                <div className="dropdown-container">
                    <Button
                        variant="outlined"
                        onClick={this.handleMenuOpen}
                        style={{
                            color: 'black',
                            textTransform: 'none',
                            margin: '10px 0 0 10px',
                        }}
                        startIcon={<FilterIcon />}
                    >
                        Display {isMenuOpen ? <ExpandMoreIcon /> : <ExpandMoreIcon />}
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={this.handleMenuClose}
                    >
                        <MenuItem>
                            <ListItemText primary="Grouping" />
                            <FormControl style={{ margin: '20px 20px' }}>
                                <Select
                                    value={grouping}
                                    onChange={this.handleGroupingChange}
                                    style={{ width: '100px', height: '30px' }}
                                >
                                    <MenuItem value="Priority">Priority</MenuItem>
                                    <MenuItem value="Status">Status</MenuItem>
                                    <MenuItem value="User">User</MenuItem>
                                </Select>
                            </FormControl>
                        </MenuItem>
                        <MenuItem>
                            <ListItemText primary="Ordering" />
                            <FormControl style={{ margin: '20px 20px' }}>
                                <Select
                                    value={ordering}
                                    onChange={this.handleOrderingChange}
                                    style={{ width: '100px', height: '30px' }}
                                >
                                    <MenuItem value="Priority">Priority</MenuItem>
                                    <MenuItem value="Title">Title</MenuItem>
                                </Select>
                            </FormControl>
                        </MenuItem>
                    </Menu>
                </div>
                <ColumnContainer
                    columns={columns}
                    tasks={tasks}
                    setColumns={setColumns}
                    setTasks={setTasks}
                    grouping={grouping}
                    ordering={this.state.ordering}
                />
            </section >
        )
    }
}

Board.propTypes = {
    columns: PropTypes.array,
    tasks: PropTypes.array,
    setColumns: PropTypes.func,
    setTasks: PropTypes.func,
    grouping: PropTypes.string,
    ordering: PropTypes.string,
    users: PropTypes.array
}