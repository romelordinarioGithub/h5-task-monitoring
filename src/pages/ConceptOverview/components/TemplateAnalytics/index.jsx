import React from 'react';
import { Box, Stack } from '@mui/material';
import appTheme from 'theme';
import { appColors } from 'theme/variables';
import PropTypes from 'prop-types';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const generateOriginalDueDate = (subtasks) => {
  let duration = 0;
  subtasks
    .filter((filter) => filter?.status_id === 1)
    .forEach((data) => {
      duration += data?.original_duration;
    });
  return duration;
};

const templateChannel = (templates, analytics) => {
  switch (analytics.toLowerCase().replace(/ /g, '_')) {
    case 'google_display':
      return templates?.google_display;
    case 'google_video':
      return templates?.google_video;
    case 'meta_static':
      return templates?.facebook_static;
    case 'meta_video':
      return templates?.facebook_video;
    case 'youtube':
      return templates?.youtube;
  }
};

function TemplateAnalytics({ templates, analytics }) {
  const channel = templateChannel(templates, analytics);

  const dataBar = {
    labels: channel?.map((data) => `${data?.order}.0 ${data?.name}`),
    datasets: [
      {
        label: 'Original Duration',
        data: channel?.map((data) => generateOriginalDueDate(data?.subtasks)),
        borderColor: appTheme?.palette?.primary?.main,
        backgroundColor: appTheme?.palette?.primary?.main,
      },
      {
        label: 'Adjusted Duration',
        data: channel?.map((data) => data?.duration),
        borderColor: appTheme?.palette?.primary?.light,
        backgroundColor: appTheme?.palette?.primary?.light,
      },
    ],
  };

  const dataPie = {
    labels: channel?.map((data) => `${data?.order}.0 ${data?.name}`),
    datasets: [
      {
        label: 'Adjusted Duration',
        data: channel?.map((data) => data?.duration),
        borderColor: [
          appColors?.status?.notStarted,
          appColors?.status?.onHold,
          appColors?.status?.complete,
          appColors?.status?.inProgress,
          appColors?.status?.inDesign,
          appColors?.status?.awaitingFeedback,
          appColors?.status?.forTesting,
          appColors?.status?.forHandover,
        ],
        backgroundColor: [
          appColors?.status?.notStarted,
          appColors?.status?.onHold,
          appColors?.status?.complete,
          appColors?.status?.inProgress,
          appColors?.status?.inDesign,
          appColors?.status?.awaitingFeedback,
          appColors?.status?.forTesting,
          appColors?.status?.forHandover,
        ],
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          beginAtZero: true,
          stepSize: 1,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: analytics,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          pinch: {
            enabled: true, // Enable pinch zooming
          },
          wheel: {
            enabled: false, // Enable wheel zooming
          },
          mode: 'x',
        },
      },
    },
  };

  return (
    <Box>
      <Stack>
        <Box
          mt={3}
          sx={{
            border: 1,
            borderColor: '#bbb',
            borderRadius: '.5em',
            margin: '.5em',
            height: '35em',
            padding: '1em',
          }}
        >
          <Bar data={dataBar} options={options} />
        </Box>
        <Box
          mt={3}
          sx={{
            border: 1,
            borderColor: '#bbb',
            borderRadius: '.5em',
            margin: '.5em',
            height: '35em',
            padding: '1em',
          }}
        >
          <Pie data={dataPie} options={options} />
        </Box>
      </Stack>
    </Box>
  );
}

TemplateAnalytics.propTypes = {
  templates: PropTypes.any,
  analytics: PropTypes.string,
};

export default TemplateAnalytics;
