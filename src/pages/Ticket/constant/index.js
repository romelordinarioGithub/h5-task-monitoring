import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

export const other_overview_info = [
  { key: 'reference', name: 'References' },
  { key: 'templates', name: 'Templates' },
  { key: 'subtask', name: 'Subtasks' },
  { key: 'revisions', name: 'Revisions' },
  { key: 'checklist', name: 'Checklist' },
];

export const thread_opts_with_edit_history = [
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const thread_opts_with_ownership = [
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
];

export const thread_opts_with_ownership_and_edit_history = [
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const thread_opts_for_assigned_teams = [
  {
    key: 'thread_resolve',
    name: 'Mark as Resolved',
    icon: <CheckCircleOutlineIcon color="success" />,
  },
  {
    key: 'thread_reject',
    name: 'Mark as Rejected',
    icon: <CancelIcon color="error" />,
  },
];

export const thread_opts_for_assigned_teams_with_edit_history = [
  {
    key: 'thread_resolve',
    name: 'Mark as Resolved',
    icon: <CheckCircleOutlineIcon color="success" />,
  },
  {
    key: 'thread_reject',
    name: 'Mark as Rejected',
    icon: <CancelIcon color="error" />,
  },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const thread_opts_for_assigned_teams_with_ownership = [
  {
    key: 'thread_resolve',
    name: 'Mark as Resolved',
    icon: <CheckCircleOutlineIcon color="success" />,
  },
  {
    key: 'thread_reject',
    name: 'Mark as Rejected',
    icon: <CancelIcon color="error" />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
];

export const thread_opts_for_assigned_teams_with_ownership_and_edit_history = [
  {
    key: 'thread_resolve',
    name: 'Mark as Resolved',
    icon: <CheckCircleOutlineIcon color="success" />,
  },
  {
    key: 'thread_reject',
    name: 'Mark as Rejected',
    icon: <CancelIcon color="error" />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const comment_opts_with_ownership = [
  { key: 'comment_edit', name: 'Edit comment', icon: <EditRoundedIcon /> },
  { key: 'comment_delete', name: 'Delete comment', icon: <DeleteIcon /> },
];

export const comment_opts_with_edit_history = [
  {
    key: 'comment_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const comment_opts_with_ownership_and_edit_history = [
  { key: 'comment_edit', name: 'Edit comment', icon: <EditRoundedIcon /> },
  { key: 'comment_delete', name: 'Delete comment', icon: <DeleteIcon /> },
  {
    key: 'comment_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const task_error_messages = [
  {
    key: `ID/UUID Not Found!`,
    status: 404,
    name: 'Task Not Found!',
  },
  {
    key: `Trying to get property 'campaign_id' of non-object`,
    status: 500,
    name: 'Subtask Not Found!',
  },
  {
    key: undefined,
    status: 0,
    name: `This might be an error on the server, please contact the administrator.`,
  },
  {
    key: undefined,
    status: 404,
    name: 'Task Not Found!',
  },
  {
    key: undefined,
    status: 408,
    name: `Request Timeout.`,
  },
  {
    key: undefined,
    status: 500,
    name: 'This might be an error on the server, please contact the administrator.',
  },
  {
    key: undefined,
    status: 504,
    name: `Gateway Timeout.`,
  },
];
