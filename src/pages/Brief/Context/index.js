// React
import { createContext, useState, useEffect, useRef } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useStopwatch } from 'react-timer-hook';
// Reducers
import {
  updateBriefByKey,
  threadComment,
  updateTags,
  deleteCommentAttachment,
  destroyTask,
  getBriefByid,
  getBriefTimelogById,
  getData,
  reset,
  startTimer,
  playTimer,
  pauseTimer,
  stopTimer,
  getCampaignList,
  getTeamList,
  updateOverviewByKey,
  getTimerActiveUsers,
  getThreadsList,
  getSubtasksList,
  getPaginatedThreadsList,
  getThreadReplyList,
  updateTimelogEnded,
  updateTimelogStart,
  getPricingCSV,
} from 'store/reducers/briefs';
import {
  getReferences,
  addReferenceLink,
  deleteReferenceLink,
  updateReferenceLink,
  updateBulkReferenceLink,
  getReferencesLinksLogs,
  resetReferenceLinks,
} from 'store/reducers/projects';
import GlobalDialog from 'pages/ConceptOverview/components/GlobalDialog';
import ReferenceContent from 'pages/ConceptOverview/components/ReferenceContent';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import CircularLoader from 'components/Common/CircularLoader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { getItemByKey } from 'utils/dictionary';
import { formatDate } from 'utils/date';
import { dateChecker } from 'pages/Brief/helpers';
import { task_error_messages } from 'pages/Brief/constant';
import _ from 'lodash';
import ReferenceLogs from 'pages/ConceptOverview/components/ReferenceLogs';
// MUI Components
import { Popper, Card, CardContent, Typography, Stack } from '@mui/material';

const BriefContext = createContext();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export function BriefProvider({ children }) {
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
  const [extraData, setExtraData] = useState(null);
  const [comment, setComment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [concept, setConcept] = useState(null);
  const [taskType, setTaskType] = useState(null);
  const [team, setTeam] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isParent, setIsParent] = useState(null);
  const [isEditingThread, setIsEditingThread] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTask, setIsTask] = useState(null);
  const [isSubtask, setIsSubtask] = useState(null);
  const [isEditOverview, setIsEditOverview] = useState(false);
  const [threadStatus, setThreadStatus] = useState(null);

  // reference links
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setValue] = useState(null);
  const [rowsLink, setRowsLink] = useState(10);
  const [searchLink, setSearchLink] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  const { briefId: briefIdFromParams } = useParams();

  // Thread user mention preview
  const [userMentionPreviewAnchorEl, setUserMentionPreviewAnchorEl] =
    useState(null);
  const [userMentionPreviewData, setUserMentionPreviewData] = useState(null);

  const {
    overview,
    timelogs,
    options,
    subtasks,
    isUpdatingTimer,
    isLoadingComments,
    isLoadingTimelog,
    isLoadingOverview,
    threads,
    overviewData: {
      conceptList,
      campaignList,
      taskTypeList,
      teamList,
      isFetchingCampaign,
    },
  } = useSelector((state) => state.briefs);

  const usersList = options?.usersList;
  const priorityList = options?.priorityList;
  const statusList = options?.statusList;

  const { referenceLinks, referenceLinksLogs } = useSelector(
    (state) => state.projects
  );

  const { data: userData } = useSelector((state) => state.user);

  const taskTimerStopwatch = useStopwatch({});

  const currentTimelog =
    overview?.timer_active_users?.find(
      (data) => data.user_id === userData.id
    ) ?? {};

  const timerDurationLimitInSeconds = 8 * 60 * 60; // 8 hours

  const dayJsNow = dayjs.utc();
  const dayJsCurrentTimelogStart = dayjs
    .tz(currentTimelog?.time_in, userData.timezone)
    .utc();

  const isTimerReached15Hours =
    dayJsNow.diff(dayJsCurrentTimelogStart, 's') >= timerDurationLimitInSeconds;

  const isAssignee = !_.isEmpty(
    getItemByKey('id', userData.id, overview.assignees)
  );

  const isOverdue = dateChecker(overview.due_date) === 'Overdue';
  const isTaskTimerStopped = currentTimelog?.status?.toLowerCase() === 'stop';
  const isTaskTimerRunning =
    currentTimelog?.status?.toLowerCase() === 'running';
  const isTaskTimerPaused = currentTimelog?.status?.toLowerCase() === 'paused';

  const hasScrolledThread = useRef(false);
  const hasExpandedThreadReply = useRef(false);
  const stopWatchConfigs = () => ({
    autoStart: isTaskTimerRunning,
    // Add offset
    offsetTimestamp:
      // Perform after succeeding pauses.
      isTimerReached15Hours
        ? dayJsNow.add(8, 'h').toDate()
        : dayJsNow
            .add(dayJsNow.diff(dayJsCurrentTimelogStart, 's'), 's')
            .toDate(),
  });

  const defaultPaginationLimit = 5;

  // Hooks
  useEffect(() => {
    // Get task data
    dispatch(
      getBriefByid(briefIdFromParams, (error, status) => {
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
  }, [briefIdFromParams]);

  useEffect(() => {
    if (hasScrolledThread.current || !threads) return;

    const urlParams = new URLSearchParams(location.search);
    const commentIdFromUrlParams = urlParams.get('comment_id');
    const threadIdFromUrlParams = urlParams.get('thread_id');
    const commentInsideThread = commentIdFromUrlParams !== '-1';

    const replyTriggerSelector = `#comment-trigger-${threadIdFromUrlParams}`;
    const replyTrigger = document.querySelector(replyTriggerSelector);

    let timeout;

    if (
      !hasExpandedThreadReply.current &&
      commentInsideThread &&
      replyTrigger
    ) {
      // If shared link is a nested comment, trigger reply button to expand thread
      timeout = setTimeout(() => {
        replyTrigger.click();
        hasExpandedThreadReply.current = true;
      }, 500);
    } else {
      // If shared link is a thread or root comment
      const targetId = commentInsideThread
        ? commentIdFromUrlParams
        : threadIdFromUrlParams;
      const targetElement = document.querySelector(`#${CSS.escape(targetId)}`);

      if (targetElement) {
        timeout = setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetElement.classList.add('flash-border');

          setTimeout(() => {
            targetElement.classList.remove('flash-border');
          }, 3000);

          hasScrolledThread.current = true;
        }, 1000);
      }
    }

    return () => clearTimeout(timeout);
  }, [threads]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (!_.isEmpty(subtasks)) {
      for (const subtask of subtasks) {
        dispatch(
          getThreadsList(
            'parent_task_subtask',
            {
              relId: subtask.id,
              relType: 'subtask',
              page: 1,
              limit:
                `${subtask.id}` === urlParams.get('id')
                  ? urlParams.get('comments_limit')
                  : defaultPaginationLimit,
            },
            subtask
          )
        );
      }
    }
  }, [subtasks]);

  useEffect(() => {
    setOpenDialog(
      !_.isEmpty(overview) &&
        !isLoadingOverview &&
        !isLoadingComments &&
        !_.isEmpty(usersList)
    );
  }, [isLoadingOverview, isLoadingComments, usersList]);

  useEffect(() => {
    if (_.isUndefined(overview.id)) return;

    // Get selections datasources
    dispatch(
      getData('tags', { relId: overview.id, relType: overview.rel_type })
    );
    dispatch(getTimerActiveUsers(overview.id));

    // Get threads
    const urlParams = new URLSearchParams(location.search);
    const threadIdFromUrlParams = urlParams.get('thread_id');
    const limit = urlParams.get('comments_limit')
      ? urlParams.get('comments_limit')
      : defaultPaginationLimit;

    dispatch(
      getThreadsList(
        overview.rel_type?.toLowerCase() === 'task' ? 'parent_task' : 'subtask',
        {
          relId: overview.id,
          relType: overview.rel_type,
          page: 1,
          limit,
          threadId: threadIdFromUrlParams,
        }
      )
    );

    setIsTask(overview.rel_type?.toLowerCase() === 'task');

    // Cache the data after first load
    if (_.isEmpty(priorityList)) dispatch(getData('priority_flag'));
    if (_.isEmpty(usersList)) dispatch(getData('users'));
    if (_.isEmpty(statusList)) dispatch(getData('status'));
    if (_.isEmpty(teamList)) dispatch(getTeamList());

    setConcept({
      id: overview.concept_id,
      partner_id: overview.partner_id,
      name: overview.concept,
    });
    setTeam(overview?.team);
    setTaskType({ id: overview?.task_type_id, name: overview?.task_type });
    setCampaign({ uuid: overview?.campaign_id, name: overview?.campaign_name });

    // // Handle empty delivery date
    // if (_.isNull(overview.delivery_date)) {
    //   Swal.fire({
    //     icon: 'warning',
    //     title: `<p style="font-size: 0.7em">Please set the delivery date</p>`,
    //     showCancelButton: false,
    //     confirmButtonText: 'Okay',
    //   });
    // }
  }, [overview.id]);

  useEffect(() => {
    document.title = !_.isEmpty(overview.name)
      ? `Brief ${overview.id} - ${overview.company_name?.value} - ${overview.title} | Ad-Weave`
      : 'Ad-Weave';
  }, [overview.name]);

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

  const ToastSuccess = Swal.mixin({
    toast: true,
    icon: 'success',
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

  const onOpenTimelogsTab = () => {
    // Get task time logs
    dispatch(getBriefTimelogById(overview.id));
  };

  const onInputChange = (e, v, name) => {
    switch (name) {
      case 'concept':
        if (!_.isNull(v)) {
          setConcept(v);
          dispatch(getCampaignList(v?.id, overview?.partner_id));
        } else {
          setConcept(null);
        }

        setCampaign(null);
        break;
      case 'campaign':
        _.isNull(v) ? setCampaign(null) : setCampaign(v);
        break;
      case 'team':
        _.isNull(v) ? setTeam(null) : setTeam(v);
        setTaskType(null);
        break;
      case 'task_type':
        _.isNull(v) ? setTaskType(null) : setTaskType(v);
        break;
    }
  };

  // Accordions
  const onChangeSubtasksAccordion = (id) => {
    dispatch(getSubtasksList(id));
  };

  // Pagination Handlers
  const handleOnPaginate = async (threadRelType) => {
    const limit = isTask
      ? Number(threads.task?.per_page)
      : Number(threads.subtask?.per_page);

    const page = threads.task.current_page + 1;
    await dispatch(
      getPaginatedThreadsList(threadRelType, {
        relId: overview.id,
        relType: overview.rel_type,
        page,
        limit,
      })
    );
  };

  const handleThreadReply = (threadRelType, commentId, taskId) => {
    dispatch(getThreadReplyList(threadRelType, commentId, taskId));
  };

  // Handlers
  const handlePlayPauseTaskTimer = () => {
    const activeTimeLogId = currentTimelog.timelog_id;

    if (isTaskTimerPaused) {
      dispatch(
        playTimer(
          overview.id,
          { id: activeTimeLogId },
          taskTimerStopwatch.start
        )
      );
    } else if (isTaskTimerRunning) {
      dispatch(
        pauseTimer(
          overview.id,
          {
            id: activeTimeLogId,
            time_out: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          },
          taskTimerStopwatch.pause
        )
      );
    } else {
      dispatch(
        startTimer(
          overview.id,
          {
            rel_id: overview.id,
            rel_type: overview.rel_type,
            status: overview.status,
            time_in: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          },
          () => {
            if (
              overview.status === 'not_started' ||
              overview.status_id === 1 ||
              overview.status === 'for_handover' ||
              overview.status_id === 7
            ) {
              const params = {
                id: overview.id,
                is_parent: isTask,
                key: 'status',
                value: 19,
              };
              // Updating task status to In Progress
              dispatch(updateBriefByKey(params));
            }

            dispatch(getTimerActiveUsers(overview.id));
            taskTimerStopwatch.start();
          }
        )
      );
    }
  };

  const handleStopTaskTimer = () => {
    const activeTimeLogId = currentTimelog.timelog_id;
    dispatch(
      stopTimer(
        overview.id,
        {
          id: activeTimeLogId,
          rel_type: overview.rel_type,
          rel_id: overview.id,
          time_out: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        },
        () => {
          dispatch(getTimerActiveUsers(overview.id));
          taskTimerStopwatch.reset(_, false);
        }
      )
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFetchTreads = async () => {
    const isForParentTaskSubtask = _.isArray(threads.subtask)
      ? !_.isEmpty(
          threads.subtask.filter((thread) => thread.data.id === selectedTaskId)
        )
      : false;

    // Fetch thread after successful thread/comment deletion
    if (isForParentTaskSubtask) {
      const threadToLoad = threads.subtask.filter(
        (thread) => thread.data.id === selectedTaskId
      )[0];
      const limit = threadToLoad.data.list.length;

      await dispatch(
        getThreadsList(
          'parent_task_subtask__modify',
          {
            relId: selectedTaskId,
            relType: 'subtask',
            page: 1,
            limit,
          },
          { id: selectedTaskId }
        )
      );
    } else {
      const type = isTask ? 'parent_task' : 'subtask';
      const limit = isTask
        ? threads.task?.data.length
        : threads.subtask?.data.length;

      await dispatch(
        getThreadsList(type, {
          relId: overview.id,
          relType: overview.rel_type,
          page: 1,
          limit,
        })
      );
    }
  };

  const handleSave = async (data) => {
    data = {
      ...data,
      channel: overview?.channel,
    };

    switch (data.key) {
      case 'tags':
        dispatch(updateTags(data));
        break;

      case 'assignees': {
        const hasRunningTimer = !_.isEmpty(currentTimelog);
        const isMe = userData.id === data?.selectedArr?.id;
        const isAssignee = _.find(selected, {
          id: data?.selectedArr?.id,
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
              updateTaskAssignees(data);
            }
          });
        } else {
          updateTaskAssignees(data);
        }

        break;
      }

      case 'date_ended': {
        const params = {
          brief_id: data.id,
          timelog_id: option.timeline_id,
          time_in: formatDate(data?.value ?? '', 'YYYY-MM-DD hh:mm:ss a'),
          time_out: formatDate(data?.limit ?? '', 'YYYY-MM-DD hh:mm:ss a'),
        };
        dispatch(updateTimelogEnded(params));
        break;
      }

      case 'date_started': {
        const params = {
          brief_id: data.id,
          timelog_id: option.timeline_id,
          time_in: formatDate(data?.value ?? '', 'YYYY-MM-DD hh:mm:ss a'),
          time_out: formatDate(data?.limit ?? '', 'YYYY-MM-DD hh:mm:ss a'),
        };
        dispatch(updateTimelogStart(params));
        break;
      }

      case 'assign_to_me':
        dispatch(updateBriefByKey({ ...data, key: 'assignees' }));
        break;

      case 'watchers':
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

        dispatch(updateBriefByKey(data));
        break;

      case 'status':
        dispatch(updateBriefByKey(data));
        if (data.value === 12 && isTaskTimerRunning) {
          handleStopTaskTimer();
        }

        break;

      case 'is_approved':
        dispatch(updateBriefByKey(data));
        break;

      case 'priority':
        dispatch(
          updateBriefByKey({
            ...data,
            value: priorityList.find(({ id }) => data.value === id).name,
          })
        );
        break;

      default:
        dispatch(
          updateBriefByKey(data, _, (error) => {
            ToastError.fire({
              title: error,
            });
          })
        );
        break;
    }

    setSelectedTaskId(null);
  };

  const handleOnSubmitQaResult = async (data) => {
    let isError = false;
    selected === 'thread_resolve'
      ? await dispatch(
          threadComment(
            'thread_resolve',
            {
              task_id: overview.id,
              comment_id: comment,
              rel_type: overview.rel_type,
              status: 1,
              report_link: data.reportLink,
              reason: data.reason,
              driven_type: !_.isEmpty(data.drivenType) ? data.drivenType : null,
              note: data.notes,
            },
            (error) => {
              isError = true;
              ToastError.fire({
                title: error,
              });
            }
          )
        )
      : await dispatch(
          threadComment(
            'thread_reject',
            {
              task_id: overview.id,
              comment_id: comment,
              rel_type: overview.rel_type,
              status: 2,
              note: data.notes,
              reason: data.reason,
              driven_type: data.drivenType,
              report_link: data.reportLink,
              others: data.others,
            },
            (error) => {
              isError = true;
              ToastError.fire({
                title: error,
              });
            }
          )
        );
    if (isError) return true;

    await dispatch(
      updateBriefByKey({
        is_parent: isTask,
        id: overview.id,
        key: 'assignees',
        value: userData.id,
      })
    );

    await dispatch(
      getData('qa_tags', { relId: overview.id, relType: overview.rel_type })
    );

    handleFetchTreads();

    if (isTaskTimerRunning) handleStopTaskTimer();
  };

  const handleOpen = (
    event,
    position,
    type,
    data,
    select,
    relType,
    taskId,
    extraData, // For edit history dialog etc
    limit, // For timelog
    threadStatus // for thread status
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
    setExtraData(extraData);
    setSelectedTaskId(taskId);
    setLimit(limit);
    setThreadStatus(threadStatus);
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
            await dispatch(
              threadComment(select, {
                id: selected,
              })
            );

            const isForParentTaskSubtask = _.isArray(threads.subtask)
              ? !_.isEmpty(
                  threads.subtask.filter(
                    (thread) => thread.data.id === selectedTaskId
                  )
                )
              : false;

            // Fetch thread after successful thread/comment deletion
            if (isForParentTaskSubtask) {
              await reloadParentTaskSubtaskThread(selectedTaskId, {
                id: selectedTaskId,
              });
            } else {
              const threadRelType = isTask ? 'parent_task' : 'subtask';
              await reloadTaskThread(threadRelType);
            }
          }
        });
        break;
      case 'thread_edit':
      case 'comment_edit':
        setIsEditingThread(true);
        break;
      case 'copy_link': {
        const fullUrl = `${
          window.location.origin
        }/brief/${selectedTaskId}?&thread_id=${
          extraData.parentThreadId ?? selected
        }&comment_id=${extraData.parentThreadId ? selected : -1}`;

        navigator.clipboard
          .writeText(fullUrl)
          .catch((err) => console.error('Failed to copy URL:', err));
        break;
      }
    }

    setIsEdit(select === 'edit_info' && true);
    setAnchorEl(null);
  };

  const handleOnSaveThread = async (
    relId,
    relType,
    comment,
    id,
    attachments,
    threadRelType,
    taskData
  ) => {
    const form = new FormData();

    const extractedMentionedUsers = [
      ...comment.matchAll(/data-mention="(@\d+)">(@[^<]+)/g),
    ].map(([, id, name]) => ({ id, name }));
    const mentionedUsersIds = extractedMentionedUsers?.map((m) =>
      m.id.replace(/\D/g, '')
    );

    const threadValue = {
      brief_id: relId,
      user_id: userData.id,
      comment: comment,
      reply_to: id ?? null,
    };

    if (isEditingThread) {
      // Thread edit
      const isEditingThread = selected !== 'comment_edit';

      form.append('id', isEditingThread ? id : id.commentId);
      form.append('comment', comment);
      if (!_.isEmpty(mentionedUsersIds)) form.append('tags', mentionedUsersIds);

      for (const attachment of attachments) {
        if (attachment.is_new ?? false)
          form.append('files_add[]', attachment.file);
      }

      // Perform edit
      await dispatch(threadComment('edit_thread_or_comment', form));

      // Fetch thread after successful edit
      if (threadRelType === 'parent_task_subtask') {
        await reloadParentTaskSubtaskThread(taskData.id, taskData);
      } else {
        await reloadTaskThread(threadRelType);
      }

      setIsEditingThread(false);
    } else {
      // Thread/Thread's comment creation
      form.append('rel_type', relType);
      form.append('comment', comment);
      if (!_.isEmpty(mentionedUsersIds)) form.append('tags', mentionedUsersIds);

      if (_.isNumber(id)) {
        // Thread's comment creation
        form.append('rel_id', relId);
        form.append('comment_id', id);

        // Perform add comment to thread
        await dispatch(threadComment('add_thread_comment', threadValue));

        // Fetch thread after successful comment creation
        if (threadRelType === 'parent_task_subtask') {
          await reloadParentTaskSubtaskThread(taskData.id, taskData);
        } else {
          await reloadTaskThread(threadRelType);
        }
      } else {
        // Thread creation
        const extractedReferenceLinks = [
          ...comment.matchAll(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi),
        ].map(([, url, name]) => ({
          url,
          name,
          rel_id: concept.id,
          rel_type: 1,
          task_type: relType === 'task' ? [relId.toString()] : [],
          category: relType === 'subtask' ? [relId.toString()] : [],
        }));

        form.append('rel_id', relId);

        // Perform adding a thread
        await dispatch(threadComment('add_thread', threadValue));

        if (
          overview?.concept?.toLowerCase() !== 'uncategorized' &&
          overview?.partner_group?.toLowerCase() !== 'uncategorized' &&
          overview?.campaign_name?.toLowerCase() !== 'uncategorized'
        ) {
          // Error message for 100 links
          if (extractedReferenceLinks?.length >= 100)
            ToastError.fire({
              title: 'You can only attach 100 links at a time',
            });
          // Add to reference links
          if (!_.isEmpty(extractedReferenceLinks))
            dispatch(
              addReferenceLink(
                concept.id,
                { links: extractedReferenceLinks.splice(0, 100) },
                1,
                rowsLink,
                {
                  rel_type: _.isEmpty(searchLink) ? overview.rel_type : null,
                  id: _.isEmpty(searchLink) ? overview.id : null,
                  key: !_.isEmpty(searchLink) ? searchLink : null,
                }
              )
            );
        }

        // Fetch thread after successful thread creation
        if (threadRelType === 'parent_task_subtask') {
          await reloadParentTaskSubtaskThread(taskData.id, taskData);
        } else {
          await reloadTaskThread(threadRelType);
        }
      }
    }
  };

  const handleAttachments = (attachment) => {
    dispatch(deleteCommentAttachment({ ids: attachment.id }));
  };

  const handleQATagsModal = async () => {
    await dispatch(
      getData('qa_tags_modal', {
        relId: overview.id,
        relType: overview.rel_type,
        thread_id: comment,
      })
    );
  };

  const handlePin = (id, type, isParent) => {
    dispatch(
      updateBriefByKey({
        is_parent: isParent,
        id: id,
        key: 'pin',
        value: '',
      })
    );
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

        Swal.fire({
          title: 'Saved!',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          willClose: () => {
            history.push({
              pathname: location.state.background.pathname,
              state: location.state,
            });

            window.location.replace(location.state.background.pathname);
          },
        });
      }
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleOnTransitionExit = () => {
    dispatch(reset());

    if (history.location.state.background.pathname.includes('task')) {
      history.replace('/');
    } else {
      history.replace({
        pathname: history.location.state.background.pathname,
        search: history.location.state.background.search,
      });
    }
  };

  const handleRedirectionToParent = (relType, relId) => {
    setOpenDialog(false);

    setTimeout(function () {
      history.replace({
        pathname: `/${
          relType.toLowerCase().includes('task') ? 'task' : 'campaign'
        }/${relId}`,
        search: history.location.search,
        state: {
          background: history.location,
          type: relType.toLowerCase().includes('task') ? relType : 'campaign',
          subtask: relType.toLowerCase().includes('subtask'),
        },
      });
    }, 500);
  };

  const handleEdit = () => {
    Swal.fire({
      icon: 'warning',
      title: `<p style="font-size: 0.7em">This feature is coming soon.</p>`,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    });
    // setIsEditOverview(!isEditOverview);
    // setConcept({
    //   id: overview.concept_id,
    //   partner_id: overview.partner_id,
    //   name: overview.concept,
    // });
    // setTeam(overview?.team);
    // setTaskType({ id: overview?.task_type_id, name: overview?.task_type });
    // setCampaign({ uuid: overview?.campaign_id, name: overview?.campaign_name });
    // if (!isEditOverview && !_.isNull(overview?.campaign_id))
    //   dispatch(getCampaignList(overview?.concept_id, overview?.partner_id));
  };

  const handleSaveEdit = () => {
    const title = ` ${taskType?.name} - ${
      _.isNull(overview?.campaign_id) ? concept?.name : campaign?.name
    } - ${overview?.channel?.replace(/-/g, '')}`;

    if (
      (_.isNull(campaign) && !_.isNull(overview?.campaign_id)) ||
      _.isNull(concept) ||
      _.isNull(taskType) ||
      _.isNull(team)
    )
      return ToastError.fire({
        title: 'Please enter all required fields',
      });

    Swal.fire({
      title:
        '<p style="font-size: 0.7em">Do you want to save your changes?</p>',
      text: '',
      icon: 'question',
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Update Concept
        if (!_.isEqual(concept?.id, overview?.concept_id))
          dispatch(
            updateOverviewByKey(
              {
                is_parent: overview.rel_type === 'task' ? 1 : 0,
                id: overview.id,
                key: `task_concept`,
                value: concept.id,
              },
              concept.name,
              title
            )
          );
        // Update Campaign
        if (
          !_.isEqual(campaign?.uuid, overview?.campaign_id) &&
          !_.isNull(overview?.campaign_id)
        )
          dispatch(
            updateOverviewByKey(
              {
                is_parent: overview.rel_type === 'task' ? 1 : 0,
                id: overview.id,
                key: `task_campaign`,
                value: campaign.uuid,
              },
              campaign.name,
              title
            )
          );
        // Update Team
        if (!_.isEqual(team, overview?.team))
          dispatch(
            updateOverviewByKey(
              {
                is_parent: overview.rel_type === 'task' ? 1 : 0,
                id: overview.id,
                key: `task_team`,
                value: team.id,
              },
              team.name
            )
          );
        // Update TaskType
        if (!_.isEqual(taskType?.id, overview?.task_type_id))
          dispatch(
            updateOverviewByKey(
              {
                is_parent: overview.rel_type === 'task' ? 1 : 0,
                id: overview.id,
                key: `task_task_type`,
                value: taskType.id,
              },
              taskType.name,
              title
            )
          );
        setIsEditOverview(false);
      }
    });
  };

  const updateTaskAssignees = (data) => {
    const isTask = data?.is_parent;

    if (isTask) {
      !_.find(selected, {
        id: data?.selectedArr?.id,
      })
        ? setSelected([...selected, data?.selectedArr])
        : setSelected(_.filter(selected, (s) => s.id != data?.selectedArr?.id));
    } else {
      const selectedData = {
        ...data?.selectedArr,
        user_id: data?.selectedArr?.id,
      };

      !_.find(selected, {
        user_id: data?.selectedArr?.id,
      })
        ? setSelected([...selected, selectedData])
        : setSelected(
            _.filter(selected, (s) => s.user_id != data?.selectedArr?.id)
          );
    }

    dispatch(updateBriefByKey(data));
  };

  const reloadParentTaskSubtaskThread = async (taskId, taskData) => {
    const threadToLoad = threads.subtask.filter(
      (thread) => thread.data.id === taskId
    )[0];
    const urlParams = new URLSearchParams(location.search);
    const threadIdFromUrlParams = urlParams.get('thread_id');
    const limit = threadToLoad.data.list.length;

    await dispatch(
      getThreadsList(
        'parent_task_subtask__modify',
        {
          relId: taskId,
          relType: 'subtask',
          page: 1,
          limit:
            limit < defaultPaginationLimit ? defaultPaginationLimit : limit,
          threadId: threadIdFromUrlParams,
        },
        taskData
      )
    );
  };

  const reloadTaskThread = async (threadRelType) => {
    const urlParams = new URLSearchParams(location.search);
    const threadIdFromUrlParams = urlParams.get('thread_id');
    const limit =
      threadRelType === 'parent_task'
        ? threads.task?.data.length
        : threads.subtask?.data.length;

    await dispatch(
      // parent_task | subtask
      getThreadsList(threadRelType, {
        relId: overview.id,
        relType: overview.rel_type,
        page: 1,
        limit: limit < defaultPaginationLimit ? defaultPaginationLimit : limit,
        threadId: threadIdFromUrlParams,
      })
    );
  };

  const handleDialogOpen = (_value, _type) => {
    setIsDialogOpen(!isDialogOpen);
    setDialogType(_type);
    setValue(_value);
  };

  const onOpenReferenceLink = () => {
    // const params = { rel_id: concept.id, page: 1, limit: 1000 };
    dispatch(resetReferenceLinks());
    dispatch(
      getReferences(concept.id, 1, rowsLink, {
        rel_type: overview.rel_type,
        id: overview.id,
      })
    );
    // dispatch(getInputDatasources(params));
  };

  const handleReferenceLinkTable = (page, row, search) => {
    setSelectedRows([]);
    setRowsLink(row);
    dispatch(
      getReferences(concept.id, page, row, {
        rel_type: _.isEmpty(search) ? overview.rel_type : null,
        id: _.isEmpty(search) ? overview.id : null,
        key: !_.isEmpty(search) ? search : null,
      })
    );
  };

  const handleAddReferenceLink = (inputs) => {
    const params = {
      links: inputs.map((data) => ({
        ...data,
        rel_id: concept.id,
        rel_type: 1,
        task_type:
          overview.rel_type.toLowerCase() === 'task'
            ? [overview.id.toString()]
            : [],
        category:
          overview.rel_type.toLowerCase() === 'subtask'
            ? [overview.id.toString()]
            : [],
      })),
    };

    setSelectedRows([]);
    dispatch(
      addReferenceLink(concept.id, params, 1, rowsLink, {
        rel_type: _.isEmpty(searchLink) ? overview.rel_type : null,
        id: _.isEmpty(searchLink) ? overview.id : null,
        key: !_.isEmpty(searchLink) ? searchLink : null,
      })
    );
  };

  const handleUpdateReferenceLink = (inputs) => {
    const params = { ...inputs, rel_id: concept.id, rel_type: 1 };
    setSelectedRows([]);
    if (_.isEmpty(selectedRows)) {
      dispatch(
        updateReferenceLink(concept.id, params, 1, rowsLink, {
          rel_type: _.isEmpty(searchLink) ? overview.rel_type : null,
          id: _.isEmpty(searchLink) ? overview.id : null,
          key: !_.isEmpty(searchLink) ? searchLink : null,
        })
      );
    } else {
      dispatch(
        updateBulkReferenceLink(
          concept.id,
          { ...params, link_id: selectedRows },
          1,
          rowsLink,
          {
            rel_type: _.isEmpty(searchLink) ? overview.rel_type : null,
            id: _.isEmpty(searchLink) ? overview.id : null,
            key: !_.isEmpty(searchLink) ? searchLink : null,
          }
        )
      );
    }
  };

  const handleDeleteReferenceLink = (referenceLinkId, page, limit) => {
    Swal.fire({
      title: `Do you want to delete ${
        _.isEmpty(selectedRows) ? 'this' : 'selected'
      } reference link?`,
      icon: 'warning',
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
      backdrop: '#25175aa3',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const params = {
          id: _.isEmpty(selectedRows) ? [referenceLinkId] : selectedRows,
        };
        setSelectedRows([]);
        dispatch(
          deleteReferenceLink(concept.id, params, page, limit, {
            rel_type: _.isEmpty(searchLink) ? overview.rel_type : null,
            id: _.isEmpty(searchLink) ? overview.id : null,
            key: !_.isEmpty(searchLink) ? searchLink : null,
          })
        );
      }
    });
  };

  const handleGetReferenceLinksLogs = (id) => {
    dispatch(getReferencesLinksLogs(id));
  };

  const handleOnChangeCheckbox = (id) => {
    if (_.some(selectedRows, (row) => row === id)) {
      // Remove the id from the selections if the id is already selected.
      setSelectedRows(selectedRows.filter((row) => row !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleOnChangeSelectAllCheckbox = (ids) => {
    if (_.difference(ids, selectedRows).length === 0) {
      // Deselect all rows if all rows are selected
      setSelectedRows(_.difference(selectedRows, ids));
    } else {
      setSelectedRows(_.uniq([...selectedRows, ...ids]));
    }
  };

  const handleOnHoverMention = (anchorEl, rawId) => {
    if (anchorEl) {
      const id = parseInt(rawId.replace(/\D/g, ''), 10);
      const userData = usersList?.filter((user) => user.id === id)[0];
      setUserMentionPreviewData(userData);
      setUserMentionPreviewAnchorEl(anchorEl);
    } else {
      setUserMentionPreviewData(null);
      setUserMentionPreviewAnchorEl(null);
    }
  };

  const handleDownloadPricingBriefCSV = () => {
    dispatch(getPricingCSV(overview.id));
  };

  return (
    <BriefContext.Provider
      value={{
        overview,
        timelogs,
        options,
        usersList,
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
        extraData,
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
        threadStatus,
        currentTimelog,
        handleSaveEdit,
        handleEdit,
        setIsTask,
        setIsEditingThread,
        handleClose,
        handleSave,
        handleOnSubmitQaResult,
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
        handleRedirectionToParent,
        handleOnPaginate,
        handleThreadReply,
        handleOnHoverMention,
        onInputChange,
        onOpenTimelogsTab,
        onChangeSubtasksAccordion,
        handleQATagsModal,
        referenceLinks,
        handleDialogOpen,
        handleAddReferenceLink,
        handleReferenceLinkTable,
        handleDeleteReferenceLink,
        handleUpdateReferenceLink,
        onOpenReferenceLink,
        handleOnChangeCheckbox,
        handleOnChangeSelectAllCheckbox,
        handleGetReferenceLinksLogs,
        selectedRows,
        rowsLink,
        setRowsLink,
        searchLink,
        setSearchLink,
        handleDownloadPricingBriefCSV,
      }}
    >
      {children}
      <GlobalDialog
        open={isDialogOpen}
        handleClose={() => handleDialogOpen(null)}
        content={
          dialogType?.toLowerCase().includes('logs') ? (
            <ReferenceLogs
              open={isDialogOpen}
              value={referenceLinksLogs}
              onClose={() => handleDialogOpen(null, dialogType)}
            />
          ) : (
            <ReferenceContent
              open={isDialogOpen}
              value={value}
              onClose={() => handleDialogOpen(null, dialogType)}
              handleAddReferenceLink={handleAddReferenceLink}
              handleUpdateReferenceLink={handleUpdateReferenceLink}
              selectedRows={selectedRows}
              isTask={true}
            />
          )
        }
      />
      <Popper
        id="mention-popper"
        open={Boolean(userMentionPreviewAnchorEl)}
        anchorEl={userMentionPreviewAnchorEl}
        placement="top"
        disablePortal={false}
        modifiers={[
          {
            name: 'offset',
            options: { offset: [0, 1] },
          },
        ]}
        sx={{ zIndex: 9999 }}
      >
        {userMentionPreviewData && (
          <Card sx={{ width: 250, paddingTop: '5px' }}>
            <CardContent
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 50,
                  height: 50,
                  color: 'white',
                  borderRadius: '50%',
                  backgroundColor: '#1e0032',
                  fontSize: '1.8em',
                }}
              >
                <img
                  src={userMentionPreviewData.profile_picture || '/*/'}
                  alt={userMentionPreviewData.fullname}
                  width="100%"
                  height="100%"
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                  onError={(e) => {
                    const initials = `${
                      userMentionPreviewData.fullname
                        ?.toUpperCase()
                        .split(' ')[0]?.[0] || ''
                    }${
                      userMentionPreviewData.fullname
                        ?.toUpperCase()
                        .split(' ')[1]?.[0] || ''
                    }`;
                    const parent = e.target.parentNode;
                    parent.innerHTML = initials;
                  }}
                />
              </Stack>
              <div>
                <Typography fontWeight="bold">
                  {userMentionPreviewData.fullname}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userMentionPreviewData.team_name}
                </Typography>
              </div>
            </CardContent>
          </Card>
        )}
      </Popper>
      {(_.isEmpty(overview) || isLoadingComments || _.isEmpty(usersList)) && (
        <CircularLoader />
      )}
    </BriefContext.Provider>
  );
}

BriefProvider.propTypes = {
  children: PropTypes.any,
};

export default BriefContext;
