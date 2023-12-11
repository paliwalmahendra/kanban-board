import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TodoIcon from '@mui/icons-material/RadioButtonUncheckedOutlined'; // Replace with appropriate icons
import InProgressIcon from '@mui/icons-material/RotateRight';
import DoneIcon from '@mui/icons-material/CheckCircle';
import BacklogIcon from '@mui/icons-material/History';
import LowPriorityIcon from '@mui/icons-material/SignalCellularAlt1Bar';
import PriorityHighIcon from '@mui/icons-material/SignalCellularAlt';
import PriorityMediumIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/MoreHoriz';



function Task(props) {

    const task = props.item
    console.log(`task log ${JSON.stringify(task)}`)
    const { userName, id, title, priority, tag, status, grouping } = task
    const firstName = userName.split(" ")[0];
    const lastName = userName.split(" ").length > 1 ? userName.split(" ")[1] : "";
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);

    const renderStars = (priority) => {

        const priorityIcons = {
            1: <LowPriorityIcon />,
            2: <PriorityMediumIcon />,
            3: <PriorityHighIcon  />,
            4: <WarningIcon  style={{ color: 'red' }} />,
            0: <BlockIcon />
        }
        return priorityIcons[priority];
    };
    const renderStatus = (status) => {
        const statusIcons = {
            'Todo': <TodoIcon style={{ fontSize: 10 }} />,
            'In progress': <InProgressIcon style={{ fontSize: 10 }} />,
            'Done': <DoneIcon style={{ fontSize: 10 }} />,
            'Backlog': <BacklogIcon style={{ fontSize: 10 }} />
        }

        return statusIcons[status]
    }

    return (


        <Card sx={{ width: '95%', justifyContent: 'center' }} className='task'>
            <CardHeader
                title={id}
                avatar={
                    <Avatar aria-label="recipe" >
                        {`${firstInitial.toUpperCase()}${lastInitial.toUpperCase()}`}
                    </Avatar>
                }
            />
            <CardContent>
                <Typography variant="h5" color="text.primary" gutterBottom style={{ fontWeight: 'bold', fontSize: 12 }}>
                    {grouping != 'Status' && renderStatus(status)} {title}
                </Typography>
                <div className='priority-icon' style={{ display: 'flex', alignItems: 'center' }}>
                    {grouping != 'Priority' && (<div style={{ marginRight: '20px' }}>
                        {renderStars(priority)}
                    </div>)}
                    <Typography variant="subtitle2" color="text.secondary" style={{ fontSize: 10, float: 'right' }}>
                        {tag.map((tag, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', border: '0.1px solid lightgrey', paddingBottom: "2px 10px", marginRight: 2 }} >
                                <FiberManualRecordIcon color="text.primary" style={{ fontSize: 10, marginRight: 2, fontWeight: 'bold' }} />
                                <span style={{ paddingRight: 4 }}>{tag}</span>
                            </div>
                        ))}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    )
}

export default Task

Task.propTypes = {
    item: PropTypes.object,
    status: PropTypes.string,
    grouping: PropTypes.string
}
