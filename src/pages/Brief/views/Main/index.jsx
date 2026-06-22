import { useContext, forwardRef, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// helper
import { dateChecker } from 'pages/Brief/helpers';
// Context
import BriefContext from 'pages/Brief/Context';
// MUI Components
import { Box, Divider, IconButton, Modal, Zoom, Dialog } from '@mui/material';
// local component
import Header from 'pages/Brief/views/Header';
import Popup from 'pages/Brief/Components/Popup';
import ListSelection from 'pages/Brief/Components/ListSelection';
import ListAddSelection from 'pages/Brief/Components/ListAddSelection';
import VirtualListSelection from 'pages/Brief/Components/VirtualListSelection';
import TimerDateTimePicker from 'components/Common/TimerDateTimePicker';
import DateTimerPicker from 'pages/Brief/Components/DateTimePicker';
import CommentDialog from 'pages/Brief/Components/CommentDialog';
// Pages
import LeftPanel from 'pages/Brief/views/LeftPanel';
import RightPanel from 'pages/Brief/views/RightPanel';
import ResponseSummary from 'pages/Brief/Components/ResponseSummary';
import CommentViewHistoryDialog from 'pages/Brief/Components/CommentViewHistoryDialog';
// Styles
import { useStyles } from 'pages/Brief/styles';
import _ from 'lodash';
import 'react-reflex/styles.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Transition = forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function Main({ onCloseDialog }) {
  const classes = useStyles();

  const [isFullscreen, setIsFullscreen] = useState(true);
  const [width, setWidth] = useState(720);
  const isResizing = useRef(false);
  const initialMouseX = useRef(0);

  const handleMouseDown = (e) => {
    isResizing.current = true;
    initialMouseX.current = e.clientX;

    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);
    e.stopPropagation(); // Prevent other drag events from firing
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    setWidth(e.clientX);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.body.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    // Cleanup event listeners if the component unmounts while resizing
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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
  } = useContext(BriefContext);

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
      maxWidth="xl"
      fullScreen={isFullscreen}
      fullWidth={true}
      PaperProps={{
        sx: {
          overflow: 'hidden',
        },
      }}
    >
      <>
        <Box>
          <Header
            isAssignee={isAssignee}
            onOpen={handleOpen}
            onFavorite={handlePin}
            isFullscreen={isFullscreen}
            handleFullscreen={setIsFullscreen}
          />
          {/* {overview.status !== 'complete' &&
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
            )} */}

          <Divider />
          <Box
            display="flex"
            sx={{
              height: isFullscreen
                ? 'calc(100vh - 3.5em)'
                : 'calc(100vh - 10em)',
            }}
          >
            <Box width={width < 450 ? 450 : width}>
              <LeftPanel
                id={overview.id}
                isSubtask={!overview.is_parent}
                onCloseDialog={onCloseDialog}
              />
            </Box>
            <Box
              sx={{
                borderLeft: '1px solid #ececec',
              }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              minHeight="70vh"
            >
              <IconButton
                onMouseDown={handleMouseDown}
                sx={{ cursor: 'w-resize', width: '10px' }}
              >
                <MoreVertIcon
                  onMouseDown={handleMouseDown}
                  sx={{ fontSize: '25px', cursor: 'w-resize' }}
                />
              </IconButton>
            </Box>
            <Box
              sx={{
                borderLeft: '1px solid #ececec',
                width: 'calc(100% - 510px)',
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
            ['assignees', 'watchers'].includes(optionType) ? (
              <VirtualListSelection
                taskId={overview.id}
                option={
                  optionType === 'watcher'
                    ? _.filter(
                        option,
                        (opt) =>
                          !_.map(overview.assignees, (assignee) =>
                            Number(assignee.id)
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
            ['campaign_end_date', 'campaign_launch_date'].includes(
                optionType
              ) ? (
              <DateTimerPicker
                type={optionType}
                selected={
                  selected === '1970/01/01 08:01:00' ||
                  selected === '1970/01/01 08:00:00'
                    ? new Date()
                    : selected
                }
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
