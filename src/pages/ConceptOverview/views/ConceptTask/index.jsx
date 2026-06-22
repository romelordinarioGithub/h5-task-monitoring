import React, { useContext } from 'react';

import _ from 'lodash';

import ConceptOverviewContext from 'pages/ConceptOverview/context';

import ChannelTree from 'pages/ConceptOverview/components/ChannelTree';

export default function ConceptTask() {
  const {
    conceptOverview: {
      brief: { channels },
    },
    conceptTaskList: {
      googleDisplay,
      googleVideo,
      metaStatic,
      metaVideo,
      youtubeVideo,
    },
    handlePopover,
    handleChannelTask,
    handleOnStartMilestone,
    fetchConceptTaskList,
    milestone,
    user,
  } = useContext(ConceptOverviewContext);

  return (
    <>
      {channels?.google?.display && (
        <ChannelTree
          channel={googleDisplay}
          handlePopover={handlePopover}
          channelId={1}
          defaultCollapse={
            (channels?.google?.display === true
              ? 1
              : channels?.google?.video === true
              ? 2
              : channels?.facebook?.static === true
              ? 3
              : channels?.facebook?.video === true
              ? 4
              : 5) === 1
          }
          handleChannelTask={handleChannelTask}
          onStartMilestone={handleOnStartMilestone}
          fetchConceptTaskList={fetchConceptTaskList}
          hasMilestone={!_.isEmpty(milestone.templates.google_display)}
          user={user}
        />
      )}

      {channels?.google?.video && (
        <ChannelTree
          channel={googleVideo}
          handlePopover={handlePopover}
          channelId={2}
          defaultCollapse={
            (channels?.google?.display === true
              ? 1
              : channels?.google?.video === true
              ? 2
              : channels?.facebook?.static === true
              ? 3
              : channels?.facebook?.video === true
              ? 4
              : 5) === 2
          }
          handleChannelTask={handleChannelTask}
          onStartMilestone={handleOnStartMilestone}
          fetchConceptTaskList={fetchConceptTaskList}
          hasMilestone={!_.isEmpty(milestone.templates.google_video)}
          user={user}
        />
      )}

      {channels?.facebook?.static && (
        <ChannelTree
          channel={metaStatic}
          handlePopover={handlePopover}
          channelId={3}
          defaultCollapse={
            (channels?.google?.display === true
              ? 1
              : channels?.google?.video === true
              ? 2
              : channels?.facebook?.static === true
              ? 3
              : channels?.facebook?.video === true
              ? 4
              : 5) === 3
          }
          handleChannelTask={handleChannelTask}
          onStartMilestone={handleOnStartMilestone}
          fetchConceptTaskList={fetchConceptTaskList}
          hasMilestone={!_.isEmpty(milestone.templates.facebook_static)}
          user={user}
        />
      )}

      {channels?.facebook?.video && (
        <ChannelTree
          channel={metaVideo}
          handlePopover={handlePopover}
          channelId={4}
          defaultCollapse={
            (channels?.google?.display === true
              ? 1
              : channels?.google?.video === true
              ? 2
              : channels?.facebook?.static === true
              ? 3
              : channels?.facebook?.video === true
              ? 4
              : 5) === 4
          }
          handleChannelTask={handleChannelTask}
          onStartMilestone={handleOnStartMilestone}
          fetchConceptTaskList={fetchConceptTaskList}
          hasMilestone={!_.isEmpty(milestone.templates.facebook_video)}
          user={user}
        />
      )}

      {channels?.youtube?.video && (
        <ChannelTree
          channel={youtubeVideo}
          handlePopover={handlePopover}
          channelId={5}
          defaultCollapse={
            (channels?.google?.display === true
              ? 1
              : channels?.google?.video === true
              ? 2
              : channels?.facebook?.static === true
              ? 3
              : channels?.facebook?.video === true
              ? 4
              : 5) === 5
          }
          handleChannelTask={handleChannelTask}
          onStartMilestone={handleOnStartMilestone}
          fetchConceptTaskList={fetchConceptTaskList}
          hasMilestone={!_.isEmpty(milestone.templates.youtube)}
          user={user}
        />
      )}
    </>
  );
}
