import { useContext, forwardRef } from 'react';
import PropTypes from 'prop-types';
// helper
import { dateChecker } from 'pages/Task/helpers';
// Context
import TaskContext from 'pages/Task/Context';
// MUI Components
import { Box, Divider, Typography, Modal, Zoom, Dialog } from '@mui/material';
// local component
import Header from 'pages/Task/views/Header';
import Popup from 'pages/Task/Components/Popup';
import ListSelection from 'pages/Task/Components/ListSelection';
import ListAddSelection from 'pages/Task/Components/ListAddSelection';
import VirtualListSelection from 'pages/Task/Components/VirtualListSelection';
import TimerDateTimePicker from 'components/Common/TimerDateTimePicker';
import DateTimerPicker from 'pages/Task/Components/DateTimePicker';
import CommentDialog from 'pages/Task/Components/CommentDialog';
// Pages
import LeftPanel from 'pages/Task/views/LeftPanel';
import RightPanel from 'pages/Task/views/RightPanel';
import ResponseSummary from 'pages/Task/Components/ResponseSummary';
import CommentViewHistoryDialog from 'pages/Task/Components/CommentViewHistoryDialog';
// Styles
import { useStyles } from 'pages/Task/styles';
import _ from 'lodash';
import 'react-reflex/styles.css';

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function Main({ onCloseDialog }) {
  const classes = useStyles();

  const {
    overview,
    options,
    userData,
    isUpdatingTimer,
    anchorEl,
    openDialog,
    horizontal,
    option,
    optionType,
    selected,
    limit,
    attachmentPreview,
    modalType,
    modalData,
    extraData,
    selectedTaskId,
    taskTimerStopwatch,
    isModalOpen,
    isParent,
    isSubtask,
    isTaskTimerRunning,
    isTaskTimerPaused,
    isAssignee,
    isOverdue,
    handleClose,
    handleSave,
    handleOpen,
    handleOnClickOptions,
    handlePin,
    handleModal,
    handleCloseDialog,
    handleOnTransitionExit,
    handlePlayPauseTaskTimer,
    handleStopTaskTimer,
  } = useContext(TaskContext);

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
      aria-describedby="alert-dialog-slide-description"
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
      <>
        <Box>
          <Header
            isAssignee={isAssignee}
            onOpen={handleOpen}
            onFavorite={handlePin}
          />
          {overview.status !== 'complete' &&
            dateChecker(overview.due_date?.replace(/-/g, '/')) !== 'track' &&
            !_.isNull(overview.due_date) &&
            !_.isEmpty(overview.due_date) && (
              <Box
                display="flex"
                justifyContent="center"
                backgroundColor={
                  dateChecker(overview.due_date?.replace(/-/g, '/')) !==
                  'Critical'
                    ? '#f26464'
                    : '#ffb648'
                }
                sx={{ borderTop: '1px solid #0000001f' }}
              >
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: '#ffffff', textTransform: 'uppercase' }}
                >
                  {dateChecker(overview.due_date?.replace(/-/g, '/'))}
                </Typography>
              </Box>
            )}

          <Divider />
          <Box
            display="flex"
            sx={{ height: 'calc(100vh - 10em)', backgroundColor: '#f8f9ff' }}
          >
            <Box width={360} sx={{ backgroundColor: '#fdfcff' }}>
              <LeftPanel
                id={overview.id}
                isSubtask={!overview.is_parent}
                onCloseDialog={onCloseDialog}
              />
            </Box>
            <Box
              sx={{
                borderLeft: '1px solid #ede9fe',
                width: 'calc(100% - 360px)',
                backgroundColor: '#f8f9ff',
              }}
            >
              <RightPanel />
            </Box>
          </Box>
        </Box>

        {/* Popup */}
        {['thread_resolve', 'thread_reject'].includes(selected) && (
          <CommentDialog />
        )}
        {['thread_history', 'comment_history'].includes(selected) && (
          <CommentViewHistoryDialog data={extraData} />
        )}
        <Popup
          handleClose={handleClose}
          anchorEl={anchorEl}
          horizontal={horizontal}
          content={
            ['assignees', 'watcher'].includes(optionType) ? (
              <VirtualListSelection
                taskId={overview.id}
                option={
                  optionType === 'watcher'
                    ? _.filter(
                        option,
                        (opt) =>
                          !_.map(overview.assignees, (assignee) =>
                            Number(assignee.user_id ?? assignee.id)
                          ).includes(opt.id) && opt.data_source !== 'concept'
                      )
                    : option
                }
                type={optionType}
                selected={selected}
                isSubtask={isSubtask}
                isParent={isParent}
                handleSave={handleSave}
              />
            ) : // desktopDisplayList
            ['due_date', 'delivery_date'].includes(optionType) ? (
              <DateTimerPicker
                type={optionType}
                selected={selected}
                taskId={overview.id}
                isParent={overview.rel_type === 'task' ? 1 : 0}
                handleSave={handleSave}
                handleClose={handleClose}
                limit={limit}
              />
            ) : ['date_started', 'date_ended'].includes(optionType) ? (
              <TimerDateTimePicker
                type={optionType}
                selected={selected}
                taskId={overview.id}
                isParent={overview.rel_type === 'task' ? 1 : 0}
                handleSave={handleSave}
                handleClose={handleClose}
                limit={limit}
              />
            ) : ['tags', 'triggers'].includes(optionType) ? (
              <ListAddSelection
                taskId={overview.id}
                defaultData={
                  optionType === 'tags'
                    ? options.tagsList
                    : options.triggersList
                }
                type={optionType}
                relType={overview.rel_type}
                handleSave={handleSave}
              />
            ) : ['desktop_displays', 'mobile_displays'].includes(optionType) ? (
              <ListAddSelection
                taskId={overview.id}
                defaultData={
                  optionType === 'desktop_displays'
                    ? options.desktopDisplayList
                    : options.mobileDisplayList
                }
                type={optionType}
                relType={overview.rel_type}
                handleSave={handleSave}
              />
            ) : (
              <ListSelection
                option={option}
                type={optionType}
                selected={selected}
                taskId={selectedTaskId ?? overview.id}
                handleSave={handleSave}
                handleClose={handleClose}
                onClickOptions={handleOnClickOptions}
                onPlayPauseTimer={handlePlayPauseTaskTimer}
                onStopTimer={handleStopTaskTimer}
                timer={{
                  taskTimerStopwatch,
                  dueDate: overview.due_date,
                  dateCreated: overview.date_created,
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
                userData={userData}
              />
            )
          }
        />
        {!_.isNull(modalType) && (
          <Modal
            className={classes.modal}
            open={isModalOpen}
            onClose={() => handleModal(null, false, null)}
          >
            <Zoom in={isModalOpen}>
              {['attachment_preview'].includes(modalType) ? (
                <img
                  src={attachmentPreview}
                  alt="attachment_preview"
                  height="70%"
                />
              ) : ['response_summary'].includes(modalType) ? (
                <Box className={classes.responseSummaryContainer}>
                  <ResponseSummary data={modalData} />
                </Box>
              ) : null}
            </Zoom>
          </Modal>
        )}
      </>
    </Dialog>
  );
}

Main.propTypes = {
  onCloseDialog: PropTypes.any,
};
