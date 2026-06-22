import { Box, styled } from '@mui/material';

import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import PersonOffTwoToneIcon from '@mui/icons-material/PersonOffTwoTone';
import SpeakerNotesOffTwoToneIcon from '@mui/icons-material/SpeakerNotesOffTwoTone';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import VolunteerActivismTwoToneIcon from '@mui/icons-material/VolunteerActivismTwoTone';
import GradeTwoToneIcon from '@mui/icons-material/GradeTwoTone';
import HelpCenterTwoToneIcon from '@mui/icons-material/HelpCenterTwoTone';
import SupportAgentTwoToneIcon from '@mui/icons-material/SupportAgentTwoTone';
import google from 'assets/smartly/icons/googleIconGray.svg';
import meta from 'assets/smartly/icons/metaIconGray.svg';
import youtube from 'assets/smartly/icons/youtubeIconGray.svg';

import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import CasesTwoToneIcon from '@mui/icons-material/CasesTwoTone';

import pie from 'assets/icons/pie.svg';
import line from 'assets/icons/line.svg';
import bar from 'assets/icons/bar.svg';
import dot from 'assets/icons/dot.svg';
import _ from 'lodash';

const StyledBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const channelIcons = [
  {
    name: 'google - display',
    icon: (
      <StyledBox>
        <img style={{ width: '15px' }} src={google} alt="google display" />{' '}
        <ImageTwoToneIcon sx={{ color: '#7d6d9b' }} />
      </StyledBox>
    ),
  },
  {
    name: 'google - video',
    icon: (
      <StyledBox>
        <img style={{ width: '15px' }} src={google} alt="google video" />{' '}
        <VideocamTwoToneIcon sx={{ color: '#7d6d9b' }} />
      </StyledBox>
    ),
  },
  {
    name: 'facebook - static',
    icon: (
      <StyledBox>
        <img style={{ width: '15px' }} src={meta} alt="meta static" />{' '}
        <ImageTwoToneIcon sx={{ color: '#7d6d9b' }} />
      </StyledBox>
    ),
  },
  {
    name: 'facebook - video',
    icon: (
      <StyledBox>
        <img style={{ width: '15px' }} src={meta} alt="meta video" />{' '}
        <VideocamTwoToneIcon sx={{ color: '#7d6d9b' }} />
      </StyledBox>
    ),
  },
  {
    name: 'youtube',
    icon: (
      <StyledBox>
        <img style={{ width: '15px' }} src={youtube} alt="youtube" />{' '}
        <VideocamTwoToneIcon sx={{ color: '#7d6d9b' }} />
      </StyledBox>
    ),
  },
];

export const filterList = [
  {
    filter_key: 'assignee',
    label: 'Assignee',
  },
  {
    filter_key: 'priority',
    label: 'Priority',
  },
  {
    filter_key: 'status',
    label: 'Status',
  },
  {
    filter_key: 'smartly',
    label: 'Smartly',
  },
];

export const smartlyFilterList = [
  {
    name: 'Design',
    id: 3,
    color: '#402176',
    team_id: [3, 15],
  },
  {
    name: 'Video',
    id: 8,
    color: '#15a6c9',
    team_id: [8, 16],
  },
  {
    name: 'Design',
    id: 0,
    color: '#402176',
    team_id: [15],
  },
  {
    name: 'Video',
    id: 0,
    color: '#15a6c9',
    team_id: [16],
  },
  {
    name: 'Design & Video',
    id: 18,
    color: '#402176',
    team_id: [15, 16, 18],
  },
  // {
  //   name: 'Video',
  //   id: 18,
  //   color: '#15a6c9',
  //   team_id: [16,18],
  // },
  // {
  //   name: 'QA',
  //   id: 5,
  //   color: '#f16079',
  //   team_id: [5,15,16],
  // },
  // {
  //   name: 'PM',
  //   id: 2,
  //   color: '#f2b601',
  //   team_id: [1,2,15,16],
  // },
];

export const statusFlags = {
  1: 'Not Started',
  6: 'On Hold',
  7: 'For Handover',
  12: 'Completed',
  19: 'In Progress',
  20: 'Testing',
  21: 'Awaiting Feedback',
  22: 'Client Review',
};

export const ticketPriorityFlag = {
  0: '--',
  1: 'Urgent',
  2: 'High',
  3: 'Normal',
  4: 'Low',
};

export const cardStatus = [
  {
    label: 'Not Started',
    key: 'not_started',
    image: pie,
    color: '#402176',
  },
  {
    label: 'In-Progress',
    key: 'in_progress',
    image: line,
    color: '#15a6c9',
  },
  {
    label: 'Completed',
    key: 'completed',
    image: dot,
    color: '#f2b601',
  },
  {
    label: 'On-Hold',
    key: 'on_hold',
    image: bar,
    color: '#f16079',
  },
];

export const sideNavigation = [
  {
    label: 'All Tasks',
    search: '',
    icon: <FormatListBulletedTwoToneIcon />,
    key: 'dashboard',
    slug: 'all_task',
  },
  {
    label: 'SaaS Support',
    search: '?queue=saas-support',
    icon: <SupportAgentTwoToneIcon />,
    key: 'saas-support',
    slug: 'saas_support',
  },
  {
    label: 'Unassigned',
    search: '?queue=unassigned',
    icon: <PersonOffTwoToneIcon />,
    key: 'unassigned',
    slug: 'unassigned',
  },
  {
    label: 'Unanswered',
    search: '?queue=unanswered',
    icon: <SpeakerNotesOffTwoToneIcon />,
    key: 'unanswered',
    slug: 'unresponded',
  },
  {
    label: 'Uncategorized',
    search: '?queue=uncategorized',
    icon: <HelpCenterTwoToneIcon />,
    key: 'uncategorized',
    slug: 'uncategorized',
  },
  {
    label: 'Due Today',
    search: '?queue=due-today',
    icon: <TodayTwoToneIcon />,
    key: 'due-today',
    slug: 'due_today',
  },
  {
    label: 'My Tasks',
    search: '?queue=my-tasks',
    icon: <VolunteerActivismTwoToneIcon />,
    key: 'my-tasks',
    slug: 'my_tasks',
  },
  {
    label: 'Favorites',
    search: '?queue=favorites',
    icon: <GradeTwoToneIcon />,
    key: 'favorites',
    slug: 'favorites',
  },
  {
    label: 'Briefs',
    search: '?queue=briefs',
    icon: <CasesTwoToneIcon />,
    key: 'briefs',
    slug: 'briefs',
  },
];

export const sideTicketNavigation = [
  {
    label: 'All Ticket',
    search: '',
    icon: <FormatListBulletedTwoToneIcon />,
    key: 'dashboard',
    slug: 'all_ticket',
  },
  {
    label: 'Unassigned',
    search: '?queue=unassigned',
    icon: <PersonOffTwoToneIcon />,
    key: 'unassigned',
    slug: 'unassigned',
  },
  {
    label: 'Uncategorized',
    search: '?queue=uncategorized',
    icon: <HelpCenterTwoToneIcon />,
    key: 'uncategorized',
    slug: 'uncategorized',
  },
  {
    label: 'My Ticket',
    search: '?queue=my-ticket',
    icon: <VolunteerActivismTwoToneIcon />,
    key: 'my-ticket',
    slug: 'my_ticket',
  },
  {
    label: 'Favorites',
    search: '?queue=favorites',
    icon: <GradeTwoToneIcon />,
    key: 'favorites',
    slug: 'favorites',
  },
];

// Map user region to API region ID
const getRegionId = (userRegion) => {
  if (_.isEmpty(userRegion)) return '';
  const regionMap = {
    APAC: 'APAC',
    AU: 'APAC',
    EMEA: 'Europe',
    NAM: 'NorAm',
    DXB: 'MENA',
  };

  return regionMap[userRegion.toUpperCase()] || '';
};

export const getDefaultTableFilters = (queue, teamId, user = {}) => ({
  filter: {
    subtask: true,
    status: _.isEqual(teamId, 5) ? [1, 7, 19] : [1, 19],
    assignees: [],
    priority: [],
    team_id: null,
    threads: _.isNull(queue) && _.isEqual(teamId, 5) && true,
    smart_services: false,
    mss: false,
    partner: '',
    concept: '',
    campaign: '',
    channel: '',
  },
  // Brief-specific filters
  brief: {
    partner: _.filter(user.partners, (partner) => {
      return (
        partner.id !== '' && partner.partner_id !== '' && partner.name !== null
      );
    }),
    region: getRegionId(user.region),
    request_type: '',
    status: [],
    assignees: [],
    priority: [],
    sort: ['-created_at'],
  },
  sort:
    _.isEqual(teamId, 11) || _.isEqual(teamId, 21)
      ? ['-created_at']
      : ['due_date'],
});

export const resourceTeamCodeLookup = {
  1: 'client_service',
  2: 'project_management',
  3: 'design',
  4: 'production_h5',
  5: 'qa',
  6: 'reporting',
  7: 'product',
  8: 'production_video',
  9: 'client',
  10: 'agency',
  11: 'saas_support',
  12: 'admin',
  13: 'client_partner',
  14: 'art_director',
  15: 'design_smartly',
  16: 'video_smartly',
  17: 'project_management_smartly',
  18: 'creative_services_smartly',
  19: 'training',
  21: 'support',
  22: 'finance',
  23: 'smart_services',
  24: 'mss',
};
