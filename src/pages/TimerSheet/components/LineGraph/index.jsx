import {Stack} from '@mui/material';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { formatDate } from 'utils/date';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const generatedChartData = (data) => {
  let tempData = JSON.parse(JSON.stringify(data));
  let result; 

  if(_.isEmpty(data))
    return [];

  result = tempData.reduce((acc, curr) => {
    let item = acc.find(item => formatDate(item.created_at, 'ddd, MMM DD, yyyy') === formatDate(curr.created_at, 'ddd, MMM DD, yyyy'));
    if (item) {
      item.total_decmial = parseFloat(item.total_decmial) + parseFloat(curr.total_decmial);
    } else {
      acc.push(curr);
    }

    return acc;
  }, []);

  return result.map((c) => ({
    date: formatDate(c.created_at, 'ddd MMM DD, yyyy'),
    totalTime: parseFloat(c.total_decmial ?? '0.0'),
  })).reverse();
}


export default function LineGraph({chartData, title}) {

  const result = generatedChartData(chartData?.timesheet ?? []);
  
  const data = {
    labels: result.map((c) => c.date),
    datasets: [
      {
        label: 'Total Hours',
        data: result.map((c) => (parseFloat(c.totalTime ?? 0.0))),
        borderColor: '#402176',
        backgroundColor: '#402176'
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
      zoom: {
        pan: {
            enabled: true,
            mode: 'x'
        },
        zoom: {
            pinch: {
                enabled: true       // Enable pinch zooming
            },
            wheel: {
                enabled: false       // Enable wheel zooming
            },
            mode: 'x',
        }
      }
    },
  };
  return (
    <Stack spacing={3} sx={{ padding: '25px !important', overflowX: "auto", overflowY: "hidden", height: 590}}>
        <Line options={options} data={data} />
    </Stack>
  );
}

LineGraph.propTypes = {chartData: PropTypes.any, title: PropTypes.any};
