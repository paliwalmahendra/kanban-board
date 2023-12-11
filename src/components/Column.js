import React from 'react';
import Task from './Task.js'
import PropTypes from 'prop-types';
import TodoIcon from '@mui/icons-material/RadioButtonUncheckedOutlined'; // Replace with appropriate icons
import InProgressIcon from '@mui/icons-material/RotateRight';
import DoneIcon from '@mui/icons-material/CheckCircle';
import BacklogIcon from '@mui/icons-material/History';
import Typography from '@mui/material/Typography';
import LowPriorityIcon from '@mui/icons-material/SignalCellularAlt1Bar';
import PriorityHighIcon from '@mui/icons-material/SignalCellularAlt';
import PriorityMediumIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/MoreHoriz';

import { TaskContext } from './../context'

export default class Column extends React.Component {

    render() {
        const statusIconMapping = {
            'Todo': <TodoIcon />,
            'In Progress': <InProgressIcon />,
            'Done': <DoneIcon />,
            'Backlog': <BacklogIcon />,
            'Low': <LowPriorityIcon />,
            'Medium': <PriorityMediumIcon />,
            'High': <PriorityHighIcon />,
            'Urgent': <WarningIcon style={{color: 'red'}} />,
            'No': <BlockIcon />
        };

        const { Consumer: TaskConsumer } = TaskContext;

        const { columnTitle, className, item } = this.props

        return (
            <div className={className}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '8px' }}>
                        {statusIconMapping[columnTitle]}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" style={{ marginRight: '8px', fontSize: 14, fontWeight: 'bold' }}>{columnTitle}
                        </Typography>
                        {item.count > 0 && (
                            <Typography variant="subtitle2" color="text.secondary">
                                {item.count}
                            </Typography>
                        )}
                    </div>
                </div>
                <TaskConsumer>
                    {(context) => this.generateTaskList(context)}
                </TaskConsumer>
            </div>
        )
    }

    generateTaskList = (context) => {
        const { id, ordering } = this.props
        let tasks = context.tasks.filter(task => task.columnId == id)
        if (ordering == 'Priority') {
            tasks = tasks.sort((a, b) => b.priority - a.priority)
        } else if (ordering == 'Title') {
            tasks = tasks.sort((a, b) => a.title.localeCompare(b.title))
        }
        return tasks.map(task =>
            <Task key={task.id} item={task} moveTask={context.moveTask} moveBackTask={context.moveBackTask} removeTask={context.removeTask}></Task>)
    }
}

Column.propTypes = {
    columnTitle: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.number,
    count: PropTypes.number,
    item: PropTypes.object,
    ordering: PropTypes.string
}
