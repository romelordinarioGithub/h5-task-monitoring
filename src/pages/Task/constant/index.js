import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import CopyLinkIcon from '@mui/icons-material/ContentCopy';

export const overview = [
  { key: 'id', name: 'Task ID', tooltip: null },
  { key: 'concept', name: 'Concept', tooltip: null },
  { key: 'campaign_name', name: 'Campaign', tooltip: null },
  { key: 'team', name: 'Team' },
  { key: 'task_type', name: 'Task Type', tooltip: null },
  { key: 'parent_task_name', name: 'Parent Task', tooltip: null },
  { key: 'partner_group', name: 'Partner Group', tooltip: null },
  { key: 'channel', name: 'Channel', tooltip: null },
  { key: 'refresh', name: 'Refresh', tooltip: null },
  { key: 'revision_round', name: 'Revision Round', tooltip: null },
  {
    key: 'date_created',
    name: 'Date Created',
    tooltip:
      'The date the task was added to Ad-weave or initiated by the requestor.',
  },
  {
    key: 'due_date',
    name: 'Due Date',
    tooltip: 'The deadline for task completion per the SLA requirements.',
  },
  {
    key: 'delivery_date',
    name: 'Delivery Date',
    tooltip:
      'Use this to keep the team and stakeholders aligned on expected timelines.',
  },
  { key: 'tags', name: 'Tags', tooltip: null },
  { key: 'triggers', name: 'Triggers' },
  { key: 'desktop_displays', name: 'Desktop Sizes', tooltip: null },
  { key: 'mobile_displays', name: 'Mobile Sizes', tooltip: null },
  { key: 'platform_link', name: 'Platform Link', tooltip: null },
];

export const smartly_overview = [
  ...overview.filter((i) => i.key != 'concept' && i.key != 'campaign_name'),
  { key: 'client', name: 'Client/Partner', tooltip: null },
  { key: 'market', name: 'Market', tooltip: null },
  { key: 'language', name: 'Language', tooltip: null },
  // { key: 'format', name: 'Formats' },
];

export const smartly_details = [
  // { key: 'client_name', name: 'Client Name' },
  { key: 'pm', name: 'PM' },
  { key: 'csm', name: 'CSM/CP' },
  { key: 'concept', name: 'Concept' },
  // { key: 'campaign_name', name: 'Campaign' },
  { key: 'design', name: 'Design/Copy/Motion' },
  // { key: 'copy', name: 'Copy' },
  { key: 'feedback_catalog_name', name: 'Feed/Catalog Name' },
  // { key: 'motion', name: 'Motion' },
  // { key: 'assets', name: 'Assets' },
  { key: 'gdrive_link', name: 'Google Drive' },
];

export const other_overview_info = [
  { key: 'subtask', name: 'Subtasks' },
  // { key: 'reference', name: 'References' },
  { key: 'templates', name: 'Templates' },
  // { key: 'revisions', name: 'Revisions' },
  // { key: 'checklist', name: 'Checklist' },
];

export const smartly_other_overview_info = [
  ...other_overview_info,
  { key: 'formats', name: 'Formats' },
  { key: 'details', name: 'Details' },
];

export const other_overview_info_for_concept_design = [
  { key: 'subtask', name: 'Subtasks' },
  // { key: 'reference', name: 'References' },
  // { key: 'revisions', name: 'Revisions' },
  // { key: 'checklist', name: 'Checklist' },
];

export const thread_opts_with_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const thread_opts_with_ownership = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
];

export const thread_opts_with_ownership_and_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
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
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
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
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
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
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
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
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
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

export const subtask_thread_opts = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'redirect_subtask', name: 'View Task', icon: <LaunchIcon /> },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const subtask_thread_opts_with_ownership = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
  { key: 'redirect_subtask', name: 'View Task', icon: <LaunchIcon /> },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const comment_opts_with_ownership = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'comment_edit', name: 'Edit comment', icon: <EditRoundedIcon /> },
  { key: 'comment_delete', name: 'Delete comment', icon: <DeleteIcon /> },
];

export const comment_opts_with_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'comment_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const comment_opts_with_ownership_and_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'comment_edit', name: 'Edit comment', icon: <EditRoundedIcon /> },
  { key: 'comment_delete', name: 'Delete comment', icon: <DeleteIcon /> },
  {
    key: 'comment_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const default_thread_comment_opts = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
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
