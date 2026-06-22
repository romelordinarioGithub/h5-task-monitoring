import React, { useState, useEffect, useContext, memo } from 'react';
import { Box } from '@mui/material';
import appTheme from 'theme';
import { appColors } from 'theme/variables';
import { milestoneChannel } from 'pages/ConceptOverview/constant';
import ConceptOverviewContext from 'pages/ConceptOverview/context';

// Utils
import PropTypes from 'prop-types';
import { Gantt, ViewMode } from 'gantt-task-react-adding-features';
import 'gantt-task-react-adding-features/dist/index.css';
import _ from 'lodash';
import moment from 'moment-timezone';
import { formatDate } from 'utils/date';

import TaskListHeader from './TaskListHeader';
import TaskListColumn from './TaskListColumn';

const generateMaxDate = (input, timeZone) => {
  return moment.max(
    input?.map((date) => {
      return moment(date?.end).tz(timeZone);
    })
  );
};

const generateMinDate = (input, timeZone) => {
  return moment.min(
    input?.map((date) => {
      return moment(date?.start).tz(timeZone);
    })
  );
};

const generateData = (data, isOriginal, items, id, isPublic, timeZone) => {
  let channelId = 0;

  const handleFilterSubtask = (input) => {
    return _.filter(input, (data) => data?.status_id === 1);
  };

  const handleProgressBar = (input) => {
    const { true: onTrack } = _.countBy(handleFilterSubtask(input), {
      milestone_health: 'On-Track',
    });
    const result = (onTrack / _.size(handleFilterSubtask(input))) * 100;
    return !_.isNaN(result) ? result : 0;
  };

  const handleChannelProgressBar = (input) => {
    let result = 0;
    input?.forEach((data) => (result += handleProgressBar(data?.subtasks)));
    return result / _.size(input);
  };

  const handleTimezone = (input) => {
    return moment(input).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
  };

  /******** Parent Milestone ********/
  data
    ?.filter((data) => data?.status_id === '1')
    ?.forEach((milestone) => {
      items.push({
        ...milestone,
        channelId: milestoneChannel[id].id,
        type: 'task',
        duration: milestone?.duration,
        name: `${milestone?.order}.0 ${milestone?.name}`,
        subtaskName: milestone?.subtasks?.map((sub) => {
          return `${sub?.order} ${sub?.task_name}`;
        }),
        progress: handleProgressBar(milestone?.subtasks),
        start: new Date(
          handleTimezone(
            isOriginal
              ? milestone?.original_start_date
              : milestone?.adjusted_start_date ?? milestone?.original_start_date
          )
        ),
        end: new Date(
          handleTimezone(
            isOriginal
              ? milestone?.original_due_date
              : milestone?.adjusted_due_date ?? milestone?.original_due_date
          )
        ),
        styles: {
          backgroundColor: isOriginal
            ? appColors?.darkGray
            : appTheme.palette.secondary.main,
          backgroundSelectedColor: isOriginal
            ? appColors?.darkGray
            : appTheme.palette.secondary.main,
          progressSelectedColor: isOriginal
            ? appColors?.lightGray
            : appTheme.palette.secondary.main,
          progressColor: isOriginal
            ? appColors?.lightGray
            : appTheme.palette.secondary.main,
        },
        isDisabled: true,
        parentTask: true,
        channel: false,
      });
      channelId++;

      /******** Milestone Subtask ********/
      handleFilterSubtask(milestone?.subtasks)?.forEach((subtask, index) => {
        const prevItem = _.nth(items, _.size(items) - (index === 0 ? 2 : 1));
        items.push({
          ...subtask,
          channelId: milestoneChannel[id].id,
          duration: subtask?.duration,
          type: 'task',
          project: milestone?.id,
          dependencies:
            channelId !== 1 &&
            subtask?.is_dependent &&
            !prevItem?.parentTask &&
            !prevItem?.channel
              ? [prevItem?.id]
              : [],
          name: `${subtask?.order} ${subtask?.task_name}`,
          styles: {
            backgroundColor:
              subtask?.rel_type === 'task' ? '#7c3aed' : '#ec5aa6',
            backgroundSelectedColor:
              isPublic || isOriginal
                ? subtask?.rel_type === 'task'
                  ? '#7c3aed'
                  : '#ec5aa6'
                : appTheme.palette.secondary.main,
          },
          start: new Date(
            handleTimezone(
              isOriginal
                ? subtask?.is_locked
                  ? subtask?.original_start_date
                  : subtask?.start_date
                : subtask?.adjusted_start_date ?? subtask?.start_date
            )
          ),
          end: new Date(
            handleTimezone(
              isOriginal
                ? subtask?.original_due_date
                : subtask?.adjusted_due_date ?? subtask?.original_due_date
            )
          ),
          parentTask: false,
          channel: false,
          isDisabled: isOriginal || isPublic,
        });
        channelId++;
      });
    });

  /******** Channel ********/
  items.splice(_.size(items) - channelId, 0, {
    id: 999999 + milestoneChannel[id].id,
    cId: milestoneChannel[id].id,
    type: 'task',
    name: `${milestoneChannel[id].name} ${isOriginal ? '(Original)' : ''}`,
    is_locked: _.first(data)?.is_locked,
    channel_id: _.first(data)?.channel_id,
    progress: handleChannelProgressBar(
      data?.filter((data) => data?.status_id === '1')
    ),
    start: new Date(
      generateMinDate(
        items?.filter(
          (data) =>
            data?.channelId === milestoneChannel[id].id && !data?.parentTask
        ),
        timeZone
      )
    ),
    end: new Date(
      generateMaxDate(
        items?.filter(
          (data) =>
            data?.channelId === milestoneChannel[id].id && !data?.parentTask
        ),
        timeZone
      )
    ),
    styles: {
      backgroundColor: milestoneChannel[id].color,
      backgroundSelectedColor: milestoneChannel[id].color,
      progressSelectedColor: milestoneChannel[id].progressColor,
      progressColor: milestoneChannel[id].progressColor,
    },
    isDisabled: true,
    parentTask: false,
    channel: true,
  });
};

const generatedChartItem = (templates, isOriginal, isPublic, timeZone) => {
  const items = [];

  if (!_.isEmpty(templates?.google_display))
    generateData(
      templates?.google_display,
      isOriginal,
      items,
      2,
      isPublic,
      timeZone
    );

  if (!_.isEmpty(templates?.google_video))
    generateData(
      templates?.google_video,
      isOriginal,
      items,
      3,
      isPublic,
      timeZone
    );

  if (!_.isEmpty(templates?.facebook_static))
    generateData(
      templates?.facebook_static,
      isOriginal,
      items,
      0,
      isPublic,
      timeZone
    );

  if (!_.isEmpty(templates?.facebook_video))
    generateData(
      templates?.facebook_video,
      isOriginal,
      items,
      1,
      isPublic,
      timeZone
    );

  if (!_.isEmpty(templates?.youtube))
    generateData(templates?.youtube, isOriginal, items, 4, isPublic, timeZone);

  return items;
};

function TemplateChart({
  filterChart,
  templates,
  handleUpdateChart,
  sidebar,
  originalDate,
  search,
  isPublic,
  timeZone,
  holidays,
  isHide,
  isHideParent,
  isHideChannel,
  setIsHide,
  setIsHideParent,
  setIsHideChannel,
  handleDependencyToggle,
  handleOnSubmitMilestoneSLA,
  handleUpdateOriginalTimeline,
  isCampaign,
}) {
  const [items, setItems] = useState(
    generatedChartItem(templates, originalDate, isPublic, timeZone)
  );
  const { handleDialogOpen } = useContext(ConceptOverviewContext);

  const day = moment(generateMinDate(items, timeZone)).day();

  useEffect(() => {
    setItems(generatedChartItem(templates, originalDate, isPublic, timeZone));
  }, [templates, originalDate, timeZone]);

  const view = _.isEqual(filterChart, 'Week')
    ? ViewMode.Week
    : _.isEqual(filterChart, 'Day')
    ? ViewMode.Day
    : ViewMode.Month;

  const handleHide = (id, channel) => {
    if (channel) {
      setIsHideChannel(
        !isHideChannel?.includes(id)
          ? [...isHideChannel, id]
          : isHideChannel?.filter((data) => data != id)
      );
    } else {
      setIsHide(
        !isHide?.includes(id)
          ? [...isHide, id]
          : isHide?.filter((data) => data != id)
      );
    }
  };

  const handleCollapse = () => {
    setIsHide(
      _.isEmpty(isHide)
        ? items?.filter((data) => data?.parentTask)?.map((data) => data?.id)
        : []
    );
  };

  const handleHideParent = () => {
    setIsHide([]);
    setIsHideParent(
      _.isEmpty(isHideParent)
        ? items?.filter((data) => data?.parentTask)?.map((data) => data?.id)
        : []
    );
  };

  return (
    <Box
      mt={3}
      sx={{
        border: 1,
        borderColor: '#bbb',
        borderRadius: '.5em',
        margin: '.5em',
      }}
    >
      <Gantt
        tasks={items.filter((data) => {
          if (
            isHide?.includes(data?.project) ||
            isHideChannel?.includes(data?.channelId) ||
            isHideParent?.includes(data?.id)
          ) {
            return false;
          } else {
            return (
              data?.name.toLowerCase().includes(search.toLowerCase()) ||
              data?.subtaskName?.some((value) =>
                value.toLowerCase().includes(search.toLowerCase())
              ) ||
              data?.channel
            );
          }
        })}
        viewMode={view}
        ganttHeight={'60vh'}
        timeStep={1000 * 60 * 60 * 24}
        onDateChange={(task) => {
          handleUpdateChart(
            formatDate(task?.start, 'YYYY-MM-DD HH:mm:ss'),
            formatDate(task?.end, 'YYYY-MM-DD HH:mm:ss'),
            task,
            items?.find((data) => data?.id === task?.id)
          );

          setItems(
            items.map((data) =>
              data?.id == task?.id
                ? {
                    ...data,
                    start: task?.start,
                    end: task?.end,
                  }
                : data
            )
          );
        }}
        preStepsCount={
          (day === 6 || day === 0) && _.isEqual(filterChart, 'Day') ? 2 : 0
        }
        onDelete={null}
        onProgressChange={null}
        onDoubleClick={(task) => {
          if (!isPublic && !originalDate && !task?.parentTask && !task?.channel)
            handleOnSubmitMilestoneSLA({
              id: task.id,
              value: task?.duration + 1,
            });
        }}
        TaskListTable={({ tasks, rowHeight, setOnHover, onHover }) =>
          TaskListColumn({
            tasks,
            rowHeight,
            hideChannel: isHideChannel,
            hide: isHide,
            handleDependencyToggle,
            handleDialogOpen,
            handleHide,
            setOnHover,
            onHover,
            isOriginal: originalDate,
            handleUpdateOriginalTimeline,
            isCampaign,
          })
        }
        TaskListHeader={({ headerHeight, rowWidth }) =>
          TaskListHeader({
            headerHeight,
            rowWidth,
            handleCollapse,
            handleHideParent,
            isHide,
            isHideParent,
          })
        }
        TooltipContent={() => null}
        listCellWidth={sidebar ? '290px' : ''}
        barCornerRadius={'.5em'}
        fontFamily="ProximaNova"
        weekendColor={_.isEqual(filterChart, 'Day') ? '#00000014' : '#11111100'}
        todayColor={'rgba(252, 248, 227, .6)'}
        holidayDates={holidays.map((data) => {
          return new Date(data.date);
        })}
        columnWidth={_.isEqual(filterChart, 'Day') ? 75 : 200}
        rowHeight={40}
      />
    </Box>
  );
}

TemplateChart.propTypes = {
  filterChart: PropTypes.any,
  templates: PropTypes.any,
  handleUpdateChart: PropTypes.any,
  sidebar: PropTypes.any,
  originalDate: PropTypes.any,
  search: PropTypes.string,
  isPublic: PropTypes.bool,
  timeZone: PropTypes.string,
  holidays: PropTypes.any,
  isHide: PropTypes.any,
  isHideParent: PropTypes.any,
  isHideChannel: PropTypes.any,
  setIsHide: PropTypes.any,
  setIsHideParent: PropTypes.any,
  setIsHideChannel: PropTypes.any,
  handleDependencyToggle: PropTypes.any,
  handleOnSubmitMilestoneSLA: PropTypes.any,
  handleUpdateOriginalTimeline: PropTypes.func,
  isCampaign: PropTypes.bool,
};

export default memo(TemplateChart, (prevProps, nextProps) => {
  return (
    prevProps.filterChart === nextProps.filterChart &&
    prevProps.templates === nextProps.templates &&
    prevProps.sidebar === nextProps.sidebar &&
    prevProps.originalDate === nextProps.originalDate &&
    prevProps.search === nextProps.search &&
    prevProps.isHide === nextProps.isHide &&
    prevProps.isHideParent === nextProps.isHideParent &&
    prevProps.isHideChannel === nextProps.isHideChannel &&
    prevProps.timeZone === nextProps.timeZone
  );
});
