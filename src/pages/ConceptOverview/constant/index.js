import { Box, styled } from '@mui/material';
import { appColors } from 'theme/variables';
import google from 'assets/smartly/icons/googleIconGray.svg';
import meta from 'assets/smartly/icons/metaIconGray.svg';
import youtube from 'assets/smartly/icons/youtubeIconGray.svg';
import googleChannel from 'assets/smartly/icons/google.svg';
import metaChannel from 'assets/smartly/icons/meta.svg';
import youtubeChannel from 'assets/smartly/icons/youtube.svg';

import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';

import { channelIcons } from 'constants/widgets';

const StyledBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

export const googleDisplay = (
  <StyledBox>
    <img style={{ width: '15px' }} src={google} alt="google display" />{' '}
    <ImageTwoToneIcon sx={{ color: '#7d6d9b' }} />
  </StyledBox>
);
export const googleVideo = (
  <StyledBox>
    <img style={{ width: '15px' }} src={google} alt="google video" />{' '}
    <VideocamTwoToneIcon sx={{ color: '#7d6d9b' }} />
  </StyledBox>
);
export const metaStatic = (
  <StyledBox>
    <img style={{ width: '15px' }} src={meta} alt="meta static" />{' '}
    <ImageTwoToneIcon sx={{ color: '#7d6d9b' }} />
  </StyledBox>
);
export const metaVideo = (
  <StyledBox>
    <img style={{ width: '15px' }} src={meta} alt="meta video" />{' '}
    <VideocamTwoToneIcon sx={{ color: '#7d6d9b' }} />
  </StyledBox>
);
export const youtubeVideo = (
  <StyledBox>
    <img style={{ width: '15px' }} src={youtube} alt="youtube" />{' '}
    <VideocamTwoToneIcon sx={{ color: '#7d6d9b' }} />
  </StyledBox>
);

export const channels = [
  {
    label: 'google',
    content: (
      <img style={{ width: '15px' }} src={googleChannel} alt="google channel" />
    ),
  },
  {
    label: 'facebook',
    content: (
      <img style={{ width: '15px' }} src={metaChannel} alt="meta channel" />
    ),
  },
  {
    label: 'youtube',
    content: (
      <img
        style={{ width: '15px' }}
        src={youtubeChannel}
        alt="youtube channel"
      />
    ),
  },
];

export const campaignTable = [
  {
    label: '',
    width: 27,
    slug: '',
    type: '',
    align: '',
    tooltip: null,
  },
  {
    label: 'Name',
    width: 300,
    slug: 'name',
    type: 'link',
    align: 'left',
    tooltip: null,
  },
  {
    label: 'Status',
    width: 100,
    slug: 'status',
    type: 'buttonSelection',
    align: 'center',
    tooltip: null,
  },
  {
    label: 'Channels',
    width: 80,
    slug: 'channel',
    type: 'image',
    align: 'center',
    tooltip: null,
  },
  // {
  //   label: 'Watchers',
  //   width: 150,
  //   slug: 'followers',
  //   type: 'avatar',
  //   align: 'center',
  // },
  // {
  //   label: 'Tags',
  //   width: 150,
  //   slug: 'tags',
  //   type: 'chip',
  //   align: 'center',
  // },
  {
    label: 'Delivery Type',
    width: 120,
    slug: 'delivery_type',
    type: 'colorTag',
    align: 'center',
    tooltip: null,
  },
  {
    label: 'Delivery Date',
    width: 180,
    slug: 'delivery_date',
    type: 'date',
    align: 'center',
    tooltip:
      'Use this to keep the team and stakeholders aligned on expected timelines.',
  },
  {
    label: 'Date Created',
    width: 180,
    slug: 'date_created',
    type: 'textDate',
    align: 'center',
    tooltip:
      'The date the task was added to Ad-weave or initiated by the requestor.',
  },
  {
    label: 'Launch Date',
    width: 180,
    slug: 'launch_date',
    type: 'date',
    align: 'center',
    tooltip: null,
  },
  {
    label: 'Personalization Type',
    width: 150,
    slug: 'personalization_type',
    type: 'text',
    align: 'center',
    tooltip: null,
  },
];

export const taskTable = [
  {
    label: '',
    width: 27,
    slug: '',
    type: '',
    align: '',
    tooltip: null,
  },
  {
    label: 'Parent Task Name',
    width: 300,
    slug: 'name',
    type: 'link',
    align: 'left',
    tooltip: null,
  },
  {
    label: 'Status',
    width: 100,
    slug: 'status',
    type: 'buttonSelection',
    align: 'center',
    tooltip: null,
  },
  {
    label: 'Assignee',
    width: 150,
    slug: 'assignee',
    type: 'avatar',
    align: 'center',
    tooltip: null,
  },
  // {
  //   label: 'Tags',
  //   width: 150,
  //   slug: 'tags',
  //   type: 'chip',
  //   align: 'center',
  // },
  {
    label: 'Due Date',
    width: 180,
    slug: 'due_date',
    type: 'date',
    align: 'center',
    tooltip: 'The deadline for task completion per the SLA requirements.',
  },
  {
    label: 'Delivery Date',
    width: 180,
    slug: 'delivery_date',
    type: 'date',
    align: 'center',
    tooltip:
      'Use this to keep the team and stakeholders aligned on expected timelines.',
  },
  // {
  //   label: 'Watchers',
  //   width: 150,
  //   slug: 'watchers',
  //   type: 'avatar',
  //   align: 'center',
  // },
  {
    label: 'Date Created',
    width: 180,
    slug: 'date_created',
    type: 'textDate',
    align: 'center',
    tooltip:
      'The date the task was added to Ad-weave or initiated by the requestor.',
  },
];

export const campaignTaskTable = [
  {
    label: '',
    width: 27,
    slug: '',
    type: '',
    align: '',
    tooltip: null,
  },
  {
    label: 'Parent Task Name',
    width: 272,
    slug: 'name',
    type: 'link',
    align: 'left',
    tooltip: null,
  },
  {
    label: 'Status',
    width: 100,
    slug: 'status',
    type: 'buttonSelection',
    align: 'center',
    tooltip: null,
  },
  {
    label: 'Assignee',
    width: 220,
    slug: 'assignee',
    type: 'avatar',
    align: 'center',
    tooltip: null,
  },
  // {
  //   label: 'Tags',
  //   width: 232,
  //   slug: 'tags',
  //   type: 'chip',
  //   align: 'center',
  // },
  {
    label: 'Due Date',
    width: 200,
    slug: 'due_date',
    type: 'date',
    align: 'center',
    tooltip: 'The deadline for task completion per the SLA requirements.',
  },
  {
    label: 'Delivery Date',
    width: 200,
    slug: 'delivery_date',
    type: 'date',
    align: 'center',
    tooltip:
      'Use this to keep the team and stakeholders aligned on expected timelines.',
  },
  // {
  //   label: 'Watchers',
  //   width: 232,
  //   slug: 'watchers',
  //   type: 'avatar',
  //   align: 'center',
  // },
  {
    label: 'Date Created',
    width: 180,
    slug: 'date_created',
    type: 'textDate',
    align: 'center',
    tooltip:
      'The date the task was added to Ad-weave or initiated by the requestor.',
  },
];

export const subtaskTable = [
  {
    label: '',
    width: 10,
    slug: '',
    type: '',
    align: '',
    tooltip: null,
  },
  {
    label: 'Sub-Task Name',
    width: 290,
    slug: 'name',
    type: 'link',
    align: 'left',
    tooltip: null,
  },
  {
    label: 'Status',
    width: 100,
    slug: 'status',
    type: 'buttonSelection',
    align: 'center',
    tooltip: null,
  },
  {
    label: 'Assignee',
    width: 150,
    slug: 'assignee',
    type: 'avatar',
    align: 'center',
    tooltip: null,
  },
  // {
  //   label: 'Tags',
  //   width: 150,
  //   slug: 'tags',
  //   type: 'chip',
  //   align: 'center',
  // },
  {
    label: 'Due Date',
    width: 180,
    slug: 'due_date',
    type: 'date',
    align: 'center',
    tooltip: 'The deadline for task completion per the SLA requirements.',
  },
  {
    label: 'Delivery Date',
    width: 180,
    slug: 'delivery_date',
    type: 'date',
    align: 'center',
    tooltip:
      'Use this to keep the team and stakeholders aligned on expected timelines.',
  },
  // {
  //   label: 'Watchers',
  //   width: 150,
  //   slug: 'watchers',
  //   type: 'avatar',
  //   align: 'center',
  // },
  {
    label: 'Date Created',
    width: 180,
    slug: 'date_created',
    type: 'textDate',
    align: 'center',
    tooltip:
      'The date the task was added to Ad-weave or initiated by the requestor.',
  },
];

export const campaignSubtaskTable = [
  {
    label: '',
    width: 10,
    slug: '',
    type: '',
    align: '',
    tooltip: null,
  },
  {
    label: 'Sub-Task Name',
    width: 262,
    slug: 'name',
    type: 'link',
    align: 'left',
    tooltip: null,
  },
  {
    label: 'Status',
    width: 100,
    slug: 'status',
    type: 'buttonSelection',
    align: 'center',
    tooltip: null,
  },
  {
    label: 'Assignee',
    width: 220,
    slug: 'assignee',
    type: 'avatar',
    align: 'center',
    tooltip: null,
  },
  // {
  //   label: 'Tags',
  //   width: 232,
  //   slug: 'tags',
  //   type: 'chip',
  //   align: 'center',
  // },
  {
    label: 'Due Date',
    width: 200,
    slug: 'due_date',
    type: 'date',
    align: 'center',
    tooltip: 'The deadline for task completion per the SLA requirements.',
  },
  {
    label: 'Delivery Date',
    width: 200,
    slug: 'delivery_date',
    type: 'date',
    align: 'center',
    tooltip:
      'Use this to keep the team and stakeholders aligned on expected timelines.',
  },
  // {
  //   label: 'Watchers',
  //   width: 232,
  //   slug: 'watchers',
  //   type: 'avatar',
  //   align: 'center',
  // },
  {
    label: 'Date Created',
    width: 180,
    slug: 'date_created',
    type: 'textDate',
    align: 'center',
    tooltip:
      'The date the task was added to Ad-weave or initiated by the requestor.',
  },
];

export const templateTable = [
  {
    id: 0,
    label: '',
    width: 30,
    slug: '',
    type: '',
    align: '',
    position: 'sticky',
    left: '0px',
  },
  {
    id: 1,
    label: 'Order',
    width: 50,
    slug: 'name',
    type: 'link',
    align: 'left',
    position: 'sticky',
    left: '30px',
  },
  {
    id: 2,
    label: 'Milestone',
    width: 300,
    slug: 'status',
    type: 'buttonSelection',
    align: 'center',
    position: 'sticky',
    left: '77px',
  },
  {
    id: 3,
    label: 'Status',
    width: 100,
    slug: 'status',
    type: 'status',
    align: 'center',
  },
  {
    id: 4,
    label: 'Health',
    width: 100,
    slug: 'health',
    type: 'selection',
    align: 'center',
  },
  {
    id: 5,
    label: 'Owner Type',
    width: 152,
    slug: 'owner_type',
    type: 'text',
    align: 'center',
  },
  {
    id: 6,
    label: 'Duration(Days)',
    width: 100,
    slug: 'duration',
    type: 'text',
    align: 'center',
  },
  {
    id: 7,
    label: 'Original Start Date',
    width: 155,
    slug: 'start_date',
    type: 'date',
    align: 'center',
  },
  {
    id: 8,
    label: 'Original Due Date',
    width: 155,
    slug: 'original_due_date',
    type: 'date',
    align: 'center',
  },
  {
    id: 9,
    label: 'Adjusted Start Date',
    width: 152,
    slug: 'adjusted_start_date',
    type: 'date',
    align: 'center',
  },
  {
    id: 10,
    label: 'Adjusted Due Date',
    width: 152,
    slug: 'original_date',
    type: 'date',
    align: 'center',
  },
  {
    id: 11,
    label: 'Visibility',
    width: 150,
    slug: 'visibility',
    type: 'text',
    align: 'center',
  },
];

export const templateSubTable = [
  {
    label: 'Status',
    width: 100,
    slug: 'status',
    type: 'status',
    align: 'center',
  },
  {
    label: 'Health',
    width: 100,
    slug: 'health',
    type: 'selection',
    align: 'center',
  },
  {
    label: 'Duration(Days)',
    width: 100,
    slug: 'duration',
    type: 'text',
    align: 'center',
  },
  {
    label: 'Original Start Date',
    width: 150,
    slug: 'start_date',
    type: 'date',
    align: 'center',
  },
  {
    label: 'Original Due Date',
    width: 150,
    slug: 'original_due_date',
    type: 'date',
    align: 'center',
  },
  {
    label: 'Adjusted Start Date',
    width: 150,
    slug: 'adjusted_start_date',
    type: 'date',
    align: 'center',
  },
  {
    label: 'Adjusted Due Date',
    width: 150,
    slug: 'adjusted_due_date',
    type: 'date',
    align: 'center',
  },
  {
    label: 'Owner Type',
    width: 150,
    slug: 'owner_type',
    type: 'text',
    align: 'center',
  },
];

export const milestoneHealths = [
  { id: 1, name: 'On Track' },
  { id: 2, name: 'Delayed' },
];

export const milestoneStatuses = [
  { id: 1, name: 'Active' },
  { id: 2, name: 'Inactive' },
];

export const milestoneOwnerTypes = [
  { id: 1, name: 'internal' },
  { id: 2, name: 'external' },
];

export const visibilityTypes = [
  { id: 1, name: 'internal' },
  { id: 2, name: 'public' },
];

export const milestoneChannel = [
  {
    id: 1,
    name: 'Meta Static',
    icon: channelIcons.facebook,
    progressColor: appColors?.social?.facebook,
    color: '#0048ff',
  },
  {
    id: 2,
    name: 'Meta Video',
    icon: channelIcons.facebook,
    progressColor: appColors?.social?.facebook,
    color: '#0048ff',
  },
  {
    id: 3,
    name: 'Google Display',
    icon: channelIcons.google,
    progressColor: appColors?.social?.google,
    color: '#24c275',
  },
  {
    id: 4,
    name: 'Google Video',
    icon: channelIcons.google,
    progressColor: appColors?.social?.google,
    color: '#24c275',
  },
  {
    id: 5,
    name: 'Youtube',
    icon: channelIcons.youtube,
    progressColor: appColors?.social?.youtube,
    color: '#ec1313',
  },
];

// export const chart_filter_list = [
//   {
//     name: 'Daily',
//     data: {
//       hour: 24,
//       month: 0,
//       label: 'DD ddd',
//       unit: 'day',
//       timeStep: 7,
//     },
//   },
//   {
//     name: 'Weekly',
//     data: {
//       hour: 24,
//       month: 0,
//       label: 'DD ddd',
//       unit: 'day',
//       timeStep: 30,
//     },
//   },
//   {
//     name: 'Monthly',
//     data: {
//       hour: 24,
//       month: 1,
//       label: 'MMM',
//       unit: 'month',
//       timeStep: 3,
//     },
//   },
// ];

export const chart_filter_list = ['Day', 'Week', 'Month'];
