// React
import { createContext, useState, useEffect } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useStopwatch } from 'react-timer-hook';
// Reducers
import {
  updateTaskByKey,
  deleteCommentAttachment,
  destroyTask,
  getSubtasksList,
} from 'store/reducers/tasks';
import {
  getTicketById,
  getThreadsList,
  getThreadReplyList,
  updateTags,
  getPaginatedThreadsList,
  threadComment,
  updateTicketAssignees,
  getData,
  updateTicketPriority,
  reset,
  getTicketTimelogById,
  getTimerActiveUsers,
  startTimer,
  stopTimer,
  updateTimelogEnded,
  updateTimelogStart,
  updateTicketStatus,
  updateTicketFavorite,
} from 'store/reducers/ticket';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import CircularLoader from 'components/Common/CircularLoader';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { getItemByKey } from 'utils/dictionary';
import { formatDate } from 'utils/date';
import { dateChecker } from 'pages/Task/helpers';
import { task_error_messages } from 'pages/Task/constant';

const TicketContext = createContext();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export function TicketProvider({ children }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [horizontal, setHorizontal] = useState('left');
  const [option, setOption] = useState([]);
  const [optionType, setOptionType] = useState(null);
  const [selected, setSelected] = useState(null);
  const [limit, setLimit] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [dialogData, setDialogData] = useState(null);
  const [comment, setComment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [campaign] = useState(null);
  const [concept] = useState(null);
  const [taskType] = useState(null);
  const [team] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isParent, setIsParent] = useState(null);
  const [isEditingThread, setIsEditingThread] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTask, setIsTask] = useState(null);
  const [isSubtask, setIsSubtask] = useState(null);
  const [isEditOverview] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const { ticketId: ticketIdFromParams } = useParams();

  const {
    overview,
    isUpdatingTimer,
    isLoadingTimelog,
    // isLoadingOverview,
    overviewData: {
      conceptList,
      campaignList,
      taskTypeList,
      teamList,
      isFetchingCampaign,
    },
  } = useSelector((state) => state.tasks);

  const {
    ticket,
    timelogs,
    isLoadingOverview,
    isLoadingComments,
    threads,
    options,
  } = useSelector((state) => state.ticket);

  const { data: userData } = useSelector((state) => state.user);

  const taskTimerStopwatch = useStopwatch({});

  const currentTimelog = ticket.current_timelog ?? {};

  const timerDurationLimitInSeconds = 15 * 60 * 60; // 15 hours

  const dayJsNow = dayjs.utc();
  const dayJsCurrentTimelogStart = dayjs
    .tz(currentTimelog.start, userData.timezone)
    .utc();

  const isTimerReached15Hours =
    dayJsNow.diff(dayJsCurrentTimelogStart, 's') >= timerDurationLimitInSeconds;

  const isAssignee = !_.isEmpty(
    getItemByKey('user_id', userData.id.toString(), ticket.assignee)
  );

  const isOverdue = dateChecker(overview.due_date) === 'Overdue';
  const isTaskTimerStopped = currentTimelog.status?.toLowerCase() === 'stop';
  const isTaskTimerRunning = currentTimelog.status?.toLowerCase() === 'running';
  const isTaskTimerPaused = currentTimelog.status?.toLowerCase() === 'paused';

  const stopWatchConfigs = () => ({
    autoStart: isTaskTimerRunning && !isTimerReached15Hours,
    // Add offset
    offsetTimestamp:
      // Perform after succeeding pauses.
      (!isTaskTimerStopped && currentTimelog.timeline?.length > 1) ||
      isTaskTimerPaused
        ? dayjs.duration(currentTimelog.total ?? '00:00:00').toDate()
        : // Perform after initially starting the timer.
        isTimerReached15Hours
        ? dayJsNow.add(15, 'h').toDate()
        : dayJsNow
            .add(dayJsNow.diff(dayJsCurrentTimelogStart, 's'), 's')
            .toDate(),
  });

  const defaultPaginationLimit = 10;

  // Hooks
  useEffect(() => {
    dispatch(
      getTicketById(ticketIdFromParams, (error, status) => {
        ToastError.fire({
          title: `${
            task_error_messages.reduce((data) => {
              return _.isEqual(data.key, error) &&
                _.isEqual(data.status, status)
                ? data
                : task_error_messages[2];
            })?.name
          }`,
        });
        handleOnTransitionExit();
      })
    );
  }, [ticketIdFromParams]);

  useEffect(() => {
    setOpenDialog(
      !_.isEmpty(ticket) &&
        !isLoadingOverview &&
        !isLoadingComments &&
        !_.isEmpty(options?.usersList)
    );
  }, [isLoadingOverview, isLoadingComments, options?.usersList]);

  useEffect(() => {
    if (optionType == 'tag') {
      setOption(options?.tagsList);
      setSelected(ticket?.tag);
    }
  }, [ticket?.tag, options?.tagsList]);

  useEffect(() => {
    if (_.isUndefined(ticket.id)) return;

    // Get selections datasources
    dispatch(getData('priority_flag'));
    dispatch(getData('users'));
    dispatch(getData('status'));
    dispatch(getData('tags', { relId: ticket.id, relType: 'ticket' }));

    // Get Active user timer
    dispatch(getTimerActiveUsers(ticket.id));

    // Get threads
    dispatch(
      getThreadsList({
        id: ticket.id,
        page: 1,
        limit: defaultPaginationLimit,
      })
    );
  }, [ticket.id]);

  useEffect(() => {
    document.title = !_.isEmpty(ticket.subject)
      ? `${ticket.subject} | Ad-Weave`
      : 'Ad-Weave';
  }, [ticket.subject]);

  useEffect(() => {
    if (!isLoadingTimelog && !_.isEmpty(currentTimelog)) {
      taskTimerStopwatch.reset(
        stopWatchConfigs().offsetTimestamp,
        stopWatchConfigs().autoStart
      );
    }
  }, [currentTimelog]);

  const ToastError = Swal.mixin({
    toast: true,
    icon: 'error',
    width: 370,
    position: 'top-right',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  // Accordions
  const onChangeSubtasksAccordion = (id) => {
    dispatch(getSubtasksList(id));
  };

  // Pagination Handlers
  const handleOnPaginate = async () => {
    const page = Math.ceil(threads.data.length / 10) + 1;
    await dispatch(
      getPaginatedThreadsList({
        id: ticket.id,
        page,
        limit: defaultPaginationLimit,
      })
    );
  };

  const handleThreadReply = (commentId, taskId) => {
    dispatch(getThreadReplyList(commentId, taskId));
  };

  const onOpenTimelogsTab = () => {
    // Get task time logs
    dispatch(getTicketTimelogById(ticket.id));
  };

  // Handlers
  const handlePlayPauseTaskTimer = () => {
    dispatch(
      startTimer(
        {
          ticket_id: ticket.id,
          time_in: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        },
        () => {
          if (
            ticket.status?.name === 'not_started' ||
            ticket.status?.id === 1
          ) {
            const params = {
              id: ticket.id,
              status: 19,
            };
            // Updating task status to In Progress
            dispatch(updateTicketStatus(params));
          }

          dispatch(getTimerActiveUsers(ticket?.id));
          taskTimerStopwatch.start();
        }
      )
    );
  };

  const handleStopTaskTimer = () => {
    const activeTimeLogId = currentTimelog.timelog_id;
    dispatch(
      stopTimer(
        ticket?.id,
        {
          id: activeTimeLogId,
          time_out: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        },
        () => {
          dispatch(getTimerActiveUsers(ticket.id));
          taskTimerStopwatch.reset(_, false);
        }
      )
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = (data) => {
    switch (data.key) {
      case 'tag':
        dispatch(updateTags(data));
        break;

      case 'assignees': {
        const isTask = data?.is_parent;
        const hasRunningTimer = !_.isEmpty(currentTimelog);
        const isMe = userData.id === data?.selectedArr?.id;
        const isAssignee = isTask
          ? _.find(selected, {
              id: data?.selectedArr?.id,
            })
          : _.find(selected, {
              user_id: data?.selectedArr?.id,
            });

        if (isMe && hasRunningTimer && isAssignee) {
          Swal.fire({
            icon: 'warning',
            title:
              '<p style="font-size: 0.7em">Do you want to proceed with unassigning this task while the timer is still running?</p>',
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
            focusConfirm: false,
          }).then((result) => {
            if (result.isConfirmed) {
              updateAssignees(data);
            }
          });
        } else {
          updateAssignees(data);
        }

        break;
      }

      case 'assign_to_me': {
        dispatch(updateTicketAssignees(data));
        break;
      }

      case 'date_ended': {
        const params = {
          task_id: data?.id,
          timeline_id: isSubtask,
          time_in: data?.limit,
          time_out: formatDate(data?.value ?? '', 'YYYY-MM-DD H:mm:ss'),
        };
        dispatch(updateTimelogEnded(params, isTask ? 'task' : 'subtask'));

        break;
      }

      case 'date_started': {
        const params = {
          task_id: data?.id,
          timeline_id: isSubtask,
          time_in: formatDate(data?.value ?? '', 'YYYY-MM-DD H:mm:ss'),
          time_out: data?.limit,
        };
        dispatch(updateTimelogStart(params, isTask ? 'task' : 'subtask'));

        break;
      }

      case 'watcher':
        !_.find(selected, {
          user_id: data?.selectedArr?.id,
        })
          ? setSelected([
              ...selected,
              { ...data?.selectedArr, user_id: data?.selectedArr?.id },
            ])
          : setSelected(
              _.filter(selected, (s) => s.user_id != data?.selectedArr?.id)
            );

        dispatch(updateTaskByKey(data));
        break;

      case 'status':
        dispatch(updateTicketStatus(data));
        if (data.value === 12 && isTaskTimerRunning) {
          handleStopTaskTimer();
        }

        break;

      case 'priority':
        dispatch(updateTicketPriority(data));
        break;
      default:
        dispatch(updateTaskByKey(data));
        break;
    }

    setSelectedTaskId(null);
  };

  const handleOpen = (
    event,
    position,
    type,
    data,
    select,
    relType,
    taskId,
    dialogData, // For edit history dialog
    limit // For timelog
  ) => {
    setIsParent(relType === 'task' ? 1 : 0);
    setIsSubtask(taskId);
    setComment(select);
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelected(select);
    setHorizontal(position);
    setOptionType(type);
    setOption(data);
    setDialogData(dialogData);
    setSelectedTaskId(taskId);
    setLimit(limit);
  };

  const handleOnClickOptions = async (e, select) => {
    e.preventDefault();

    setSelectedThreadId(selected);
    setSelected(select);

    switch (select) {
      case 'comment_delete':
      case 'thread_delete':
        Swal.fire({
          icon: 'warning',
          title: '<p style="font-size: 0.7em">Do you want to continue?</p>',
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: `No`,
          focusConfirm: false,
          customClass: {
            container: 'swal-container',
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            await dispatch(threadComment(select, selected));
            // Fetch thread after successful thread/comment deletion
            await reloadTicketThread();
          }
        });
        break;
      case 'thread_edit':
      case 'comment_edit':
        setIsEditingThread(true);
        break;
    }

    setIsEdit(select === 'edit_info' && true);
    setAnchorEl(null);
  };

  const handleOnSaveThread = async (
    relId,
    relType,
    comment,
    id,
    attachments
  ) => {
    const form = new FormData();

    if (isEditingThread) {
      // Thread edit
      const isEditingThread = selected !== 'comment_edit';

      form.append('id', isEditingThread ? id : id.commentId);
      form.append('rel_id', isEditingThread ? id : id.threadId);
      form.append('rel_type', relType);
      form.append('comment', comment);

      for (const attachment of attachments) {
        if (attachment.is_new ?? false)
          form.append('files_add[]', attachment.file);
      }

      // Perform edit
      await dispatch(threadComment('edit_thread_or_comment', form));

      // Fetch thread after successful edit
      await reloadTicketThread();

      setIsEditingThread(false);
    } else {
      // Thread/Thread's comment creation
      form.append('comment', comment);

      // Append attachments to form
      if (!_.isEmpty(attachments)) {
        for (const attachment of attachments) {
          form.append('files[]', attachment.file);
        }
      }

      if (_.isNumber(id)) {
        // Thread's comment creation
        form.append('ticket_id', relId);
        form.append('comment_id', id);

        // Perform add comment to thread
        await dispatch(threadComment('add_thread_comment', form));

        // Fetch thread after successful comment creation
        await reloadTicketThread();
      } else {
        // Thread creation
        form.append('ticket_id', relId);

        // Perform adding a thread
        await dispatch(threadComment('add_thread', form));

        // Fetch thread after successful thread creation
        await reloadTicketThread();
      }
    }
  };

  const handleAttachments = (attachment) => {
    dispatch(deleteCommentAttachment({ ids: attachment.id }));
  };

  const handlePin = (id) => {
    dispatch(updateTicketFavorite(id));
  };

  const handleModal = (type, isOpen, data) => {
    switch (type) {
      case 'attachment_preview':
        setAttachmentPreview(data);
        break;
      case 'response_summary':
        setModalData(data);
        break;
      default:
        break;
    }

    setModalType(isOpen ? type : null);
    setIsModalOpen(isOpen);
  };

  const handleDeleteTask = (relId, isTask) => {
    Swal.fire({
      icon: 'warning',
      title: `<p style="font-size: 0.7em">Do you want to delete this task? 
        ${
          !_.isEmpty(overview?.sub_categories)
            ? `All subtasks under this task will also be deleted.`
            : ''
        }</p>`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const params = {
          id: relId,
          rel_type: isTask ? 'task' : 'subtask',
        };

        dispatch(destroyTask(params));
        history.push({
          pathname: location.state.background?.pathname,
          state: location.state,
        });

        window.location.replace(location.state.background?.pathname);
        Swal.fire('Saved!', '', 'success');
      }
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleOnTransitionExit = () => {
    dispatch(reset());

    if (history.location.state.background.pathname.includes('ticket')) {
      history.replace('/');
    } else {
      history.replace({
        pathname: history.location.state.background.pathname,
        search: history.location.state.background.search,
      });
    }
  };

  const updateAssignees = (data) => {
    !_.find(selected, {
      user_id: data?.user_id.toString(),
    })
      ? setSelected([...selected, { user_id: data?.user_id.toString() }])
      : setSelected(
          _.filter(selected, (s) => Number(s.user_id) != data?.user_id)
        );

    dispatch(updateTicketAssignees(data));
  };

  const reloadTicketThread = async () => {
    const limit = threads.task?.data.length;
    await dispatch(
      getThreadsList({
        id: ticket.id,
        page: 1,
        limit: limit < defaultPaginationLimit ? defaultPaginationLimit : limit,
      })
    );
  };

  return (
    <TicketContext.Provider
      value={{
        ticket,
        threads,
        overview,
        timelogs,
        options,
        userData,
        openDialog,
        anchorEl,
        comment,
        horizontal,
        option,
        optionType,
        selected,
        limit,
        selectedThreadId,
        attachmentPreview,
        modalType,
        modalData,
        dialogData,
        selectedTaskId,
        taskTimerStopwatch,
        isLoadingOverview,
        isEdit,
        isParent,
        isEditingThread,
        isModalOpen,
        isSubtask,
        isTask,
        isUpdatingTimer,
        isLoadingTimelog,
        isTaskTimerRunning,
        isTaskTimerStopped,
        isTaskTimerPaused,
        isAssignee,
        isOverdue,
        isEditOverview,
        isFetchingCampaign,
        campaign,
        campaignList,
        conceptList,
        concept,
        taskTypeList,
        taskType,
        teamList,
        team,
        setIsTask,
        setIsEditingThread,
        handleClose,
        handleSave,
        handleOpen,
        handleOnClickOptions,
        handleOnSaveThread,
        handlePin,
        handleModal,
        handleAttachments,
        handleDeleteTask,
        handleCloseDialog,
        handleOnTransitionExit,
        handlePlayPauseTaskTimer,
        handleStopTaskTimer,
        handleOnPaginate,
        handleThreadReply,
        onChangeSubtasksAccordion,
        onOpenTimelogsTab,
      }}
    >
      {children}
      {_.isEmpty(ticket) ||
        isLoadingComments ||
        isLoadingComments ||
        (_.isEmpty(options?.usersList) && <CircularLoader />)}
    </TicketContext.Provider>
  );
}

TicketProvider.propTypes = {
  children: PropTypes.any,
};

export default TicketContext;
