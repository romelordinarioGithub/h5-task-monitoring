import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getData,
  getUpdateConceptList,
  getUpdateCampaignList,
} from 'store/reducers/manualTaskCreation';
import { getData as getUserData } from 'store/reducers/tasks';
import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import _ from 'lodash';

const TaskCreationContext = createContext();

export function TaskCreationProvider({ children }) {
  const [team, setTeam] = useState('');
  const [taskType, setTaskType] = useState('');
  const [taskName, setTaskName] = useState('');
  const [subTask, setSubTask] = useState('');
  const [partner, setPartner] = useState('');
  const [concept, setConcept] = useState('');
  const [campaign, setCampaign] = useState('');
  const [channel, setChannel] = useState('');
  const [sizes, setSizes] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [tags, setTags] = useState([]);
  const [isRefresh, setIsRefresh] = useState(null);
  const [asset, setAsset] = useState([]);
  const [referenceLinks, setReferenceLinks] = useState([]);
  const [additionalInformation, setAdditionalInformation] = useState('');
  const [validateTaskType, setValidateTaskType] = useState([]);
  const [validateSubTask, setValidateSubTask] = useState([]);
  const [loading, setLoading] = useState({
    isTeam: false,
    isTaskType: false,
    isPartner: false,
    isSubTask: false,
    isCampaign: false,
    isConcept: false,
  });
  const [page, setPage] = useState({ concept: 1, campaign: 1 });

  const dispatch = useDispatch();

  const { pathname } = useLocation();
  const isProjectPath = matchPath(pathname, {
    path: '/projects',
    exact: false,
  });
  const isCampaignPath = matchPath(pathname, {
    path: '/projects/:id/concept/:id/campaign',
    exact: false,
  });

  const {
    data: { campaignList, conceptList, channelList },
    loading: {
      fetchingTeam,
      fetchingTasktype,
      fetchingSubTask,
      fetchingPartner,
      fetchingCampaign,
    },
  } = useSelector((state) => state.manualTaskCreation);

  const { overview } = useSelector((state) => state.campaign);

  const { conceptOverview } = useSelector((state) => state.projects);

  const {
    options: { usersList },
  } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (!fetchingCampaign && !_.isEmpty(channelList) && overview.is_custom) {
      const channelInfo = _.find(
        channelList,
        (list) => list.id === overview.channel_info.id
      );
      setChannel({
        id: channelInfo.id,
        name: channelInfo.name,
      });
    }
  }, [fetchingCampaign]);

  useEffect(() => {
    if (!_.isEmpty(conceptOverview) && !_.isNull(isProjectPath)) {
      setPartner({
        id: conceptOverview.partner_uuid,
        name: conceptOverview.partner_name,
        data_source: null,
      });
      setConcept({
        id: conceptOverview.concept_id,
        partner_id: conceptOverview.partner_uuid,
        name: conceptOverview.name,
      });
      dispatch(getData('get_partners'));
      dispatch(
        getData('get_concepts', {
          partnerId: conceptOverview.partner_uuid,
          page: page.concept,
        })
      );
      dispatch(
        getData('get_concept_overview', {
          conceptId: conceptOverview.concept_id,
          partnerId: conceptOverview.partner_uuid,
          page: page.campaign,
        })
      );
      if (!_.isEmpty(overview) && !_.isNull(isCampaignPath)) {
        if (overview.is_custom) {
          setCampaign({
            uuid: overview.id,
            name: overview.name,
            is_custom: true,
            channel_info: overview.channel_info,
          });
        } else {
          setCampaign({ uuid: overview.id, name: overview.name });
        }
      }
    }

    if (_.isEmpty(usersList)) dispatch(getUserData('users'));
  }, []);

  const clearAll = () => {
    setTeam('');
    setTaskType('');
    setSubTask('');
    setPartner('');
    setConcept('');
    setChannel('');
    setAsset([]);
    setSizes([]);
    setReferenceLinks([]);
    setValidateSubTask([]);
    setValidateTaskType([]);
  };

  const handleOnOpen = (name) => async () => {
    switch (name) {
      case 'partner':
        if (fetchingPartner) {
          setLoading({ ...loading, isPartner: true });
          await dispatch(getData('get_partners'));
          setLoading({ ...loading, isPartner: false });
        }

        break;
      case 'concept':
        if (_.isEmpty(conceptList)) {
          setLoading({ ...loading, isConcept: true });
          await dispatch(
            getData('get_concepts', {
              partnerId: partner.id,
              page: page.concept,
            })
          );
          setLoading({ ...loading, isConcept: false });
          setPage({ ...page, concept: page.concept + 1 });
        }

        break;
      case 'campaign':
        if (_.isEmpty(campaignList)) {
          setLoading({ ...loading, isCampaign: true });
          await dispatch(
            getData('get_concept_overview', {
              conceptId: concept.id,
              partnerId: partner.id,
              page: page.campaign,
            })
          );
          setLoading({ ...loading, isCampaign: false });
          setPage({ ...page, campaign: page.campaign + 1 });
        }

        break;
      case 'team':
        if (fetchingTeam) {
          setLoading({ ...loading, isTeam: true });
          await dispatch(getData('get_teams'));
          setLoading({ ...loading, isTeam: false });
        }

        break;
      case 'task_type':
        if (fetchingTasktype) {
          setLoading({ ...loading, isTaskType: true });
          await dispatch(getData('get_active_task_type'));
          setLoading({ ...loading, isTaskType: false });
        }

        break;
      case 'sub_task':
        if (fetchingSubTask) {
          setLoading({ ...loading, isSubTask: true });
          await dispatch(getData('get_active_task_category'));
          setLoading({ ...loading, isSubTask: false });
        }

        break;
    }
  };

  const handleScroll = (event, name) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    if (listboxNode.scrollHeight - position <= 1) {
      switch (name.toLowerCase()) {
        case 'concept':
          if (!loading.isPartner && conceptList.last_page >= page.concept) {
            dispatch(
              getUpdateConceptList({
                partnerId: partner.id,
                page: page.concept,
              })
            );
            setPage({ ...page, concept: page.concept + 1 });
          }

          break;
        case 'campaign':
          if (!fetchingCampaign && campaignList.last_page >= page.campaign) {
            dispatch(
              getUpdateCampaignList(concept.id, partner.id, page.campaign)
            );
            setPage({ ...page, campaign: page.campaign + 1 });
          }

          break;
      }
    }
  };

  return (
    <TaskCreationContext.Provider
      value={{
        team,
        setTeam,
        taskType,
        setTaskType,
        taskName,
        setTaskName,
        subTask,
        setSubTask,
        partner,
        setPartner,
        concept,
        setConcept,
        campaign,
        setCampaign,
        channel,
        setChannel,
        asset,
        setAsset,
        sizes,
        setSizes,
        referenceLinks,
        setReferenceLinks,
        deliveryDate,
        setDeliveryDate,
        tags,
        setTags,
        isRefresh,
        setIsRefresh,
        validateTaskType,
        setValidateTaskType,
        validateSubTask,
        setValidateSubTask,
        additionalInformation,
        setAdditionalInformation,
        handleOnOpen,
        loading,
        setLoading,
        handleScroll,
        clearAll,
        setPage,
        page,
        fetchingCampaign,
      }}
    >
      {children}
    </TaskCreationContext.Provider>
  );
}

TaskCreationProvider.propTypes = {
  children: PropTypes.any,
};

export default TaskCreationContext;
