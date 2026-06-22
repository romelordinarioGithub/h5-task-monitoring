import { useState, useContext, forwardRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// helper
import { dateChecker } from 'pages/Task/helpers';
// Context
import TicketContext from 'pages/Ticket/Context';
// MUI Components
import {
  Box,
  Divider,
  Zoom,
  Dialog,
  Tabs,
  Tab,
  Button,
  Stack,
} from '@mui/material';
// local component
import Header from 'pages/Ticket/views/Header';
import Popup from 'pages/Task/Components/Popup';
import ListSelection from 'pages/Ticket/Components/ListSelection';
import VirtualListSelection from 'pages/Ticket/Components/VirtualListSelection';
// Pages
import Update from 'pages/Ticket/views/Update';
import ActivityLog from 'pages/Ticket/views/ActivityLog';
import Files from 'pages/Ticket/views/Files';
import Timelog from 'pages/Ticket/views/Timelog';
// Styles
import TimerDateTimePicker from 'components/Common/TimerDateTimePicker';

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function Main() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  const {
    ticket,
    overview,
    isUpdatingTimer,
    anchorEl,
    openDialog,
    horizontal,
    option,
    optionType,
    selected,
    limit,
    taskTimerStopwatch,
    isParent,
    isTaskTimerRunning,
    isTaskTimerPaused,
    isAssignee,
    isOverdue,
    handleClose,
    handleSave,
    handleOpen,
    handleOnClickOptions,
    handlePin,
    handleCloseDialog,
    handleOnTransitionExit,
    handlePlayPauseTaskTimer,
    handleStopTaskTimer,
  } = useContext(TicketContext);

  return (
    <Dialog
      keepMounted
      closeAfterTransition
      disableEnforceFocus
      open={openDialog}
      TransitionComponent={Transition}
      onClose={handleCloseDialog}
      TransitionProps={{
        onExited: handleOnTransitionExit,
      }}
      maxWidth="lg"
      fullWidth={true}
      PaperProps={{
        sx: {
          overflow: 'hidden',
          borderRadius: '26px',
          border: '1px solid rgba(229, 231, 235, 0.75)',
          boxShadow: '0 35px 80px -35px rgba(92, 33, 180, 0.35)',
        },
      }}
    >
      <Box>
        <Header
          isAssignee={isAssignee}
          onOpen={handleOpen}
          onFavorite={handlePin}
        />
        <Divider />
        <Box
          display="flex"
          sx={{ height: 'calc(100vh - 10em)', backgroundColor: '#f8f9ff' }}
        >
          <Box
            sx={{
              borderLeft: '1px solid #ede9fe',
              width: '100%',
            }}
          >
            <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  borderBottom: 1,
                  borderColor: '#ede9fe',
                  padding: '0 1em',
                  backgroundColor: '#fdfcff',
                }}
              >
                <Tabs value={value} onChange={handleChange}>
                  <Tab label="Update" disableRipple />
                  <Tab label="Activity log" disableRipple />
                  <Tab label="Files" disableRipple />
                  <Tab label="Timelog" disableRipple />
                </Tabs>
                <Box
                  display="flex"
                  justifyContent="center"
                  sx={{ paddingY: '.5em' }}
                >
                  <Button
                    variant="contained"
                    target="_blank"
                    href={ticket?.slack_url}
                    disabled={_.isNull(ticket?.slack_url)}
                    sx={{
                      background: '#F22076',
                      fontSize: '0.8em',
                      fontWeight: 600,
                      height: '2.7em',
                    }}
                  >
                    Slack
                  </Button>
                </Box>
              </Stack>
              <Box
                height="calc(100% - 49px)"
                overflow="auto"
                p={2}
                sx={{ backgroundColor: '#ffffff' }}
              >
                {value === 0 ? <Update /> : <Box />}
                {value === 1 ? <ActivityLog /> : <Box />}
                {value === 2 ? <Files /> : <Box />}
                {value === 3 ? <Timelog /> : <Box />}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Popup
        handleClose={handleClose}
        anchorEl={anchorEl}
        horizontal={horizontal}
        content={
          ['assignees', 'watcher'].includes(optionType) ? (
            <VirtualListSelection
              taskId={ticket.id}
              option={
                optionType === 'watcher'
                  ? _.filter(
                      option,
                      (opt) =>
                        !_.map(ticket.assignee, (assignee) =>
                          Number(assignee.user_id ?? assignee.id)
                        ).includes(opt.id)
                    )
                  : option
              }
              type={optionType}
              selected={selected}
              handleSave={handleSave}
            />
          ) : [
              'due_date',
              'delivery_date',
              'date_started',
              'date_ended',
            ].includes(optionType) ? (
            <TimerDateTimePicker
              type={optionType}
              selected={selected}
              taskId={ticket.id}
              handleSave={handleSave}
              handleClose={handleClose}
              limit={limit}
            />
          ) : (
            <Fragment>
              <ListSelection
                option={option}
                type={optionType}
                selected={selected}
                ticketId={ticket?.id}
                handleSave={handleSave}
                handleClose={handleClose}
                onClickOptions={handleOnClickOptions}
                onPlayPauseTimer={handlePlayPauseTaskTimer}
                onStopTimer={handleStopTaskTimer}
                timer={{
                  taskTimerStopwatch,
                  dueDate: ticket.due_date,
                  dateCreated: ticket.created_at,
                  isOverdue,
                }}
                timerState={{
                  isTaskTimerRunning,
                  isTaskTimerPaused,
                  isOverdue: dateChecker(overview.due_date) === 'Overdue',
                }}
                isParent={isParent}
                isAssignee={isAssignee}
                isUpdatingTimer={isUpdatingTimer}
              />
            </Fragment>
          )
        }
      />
    </Dialog>
  );
}

Main.propTypes = {
  onCloseDialog: PropTypes.any,
};
