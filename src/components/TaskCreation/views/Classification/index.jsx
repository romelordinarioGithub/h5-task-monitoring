import { useContext, Fragment } from 'react';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';

//Reducer
import {
  clearCampaign,
  clearConcept,
  getData,
  getUpdateCampaignList,
} from 'store/reducers/manualTaskCreation';

// Context
import TaskCreationContext from 'components/TaskCreation/Context';

import { Box, Stack, Typography, styled } from '@mui/material';

// Custom Component
//import TaskInput from 'components/TaskCreation/Components/TaskInput';
//import ContentSkeleton from 'pages/_Dashboard/views/DesignQADash/Components/Skeleton/ContentSkeleton';
import InfiniteAutoComplete from 'components/Common/InfiniteAutoComplete';

import cover from 'assets/smartly/smartly-patern.svg';

let delayDebounceFn;

const StyledTypography = styled(Typography)`
  background-image: linear-gradient(90deg, #e0238c, #f22076 47.43%, #5025c4);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
`;

const TaskClassification = () => {
  const dispatch = useDispatch();
  const {
    partner,
    setPartner,
    concept,
    setConcept,
    campaign,
    setCampaign,
    setTaskName,
    channel,
    setChannel,
    setSizes,
    loading,
    handleOnOpen,
    handleScroll,
    setPage,
    page,
    setTeam,
    setTaskType,
    setSubTask,
  } = useContext(TaskCreationContext);

  const {
    data: { partnerList, conceptList, campaignList, channelList, formatsList },
    loading: { fetchingCampaign },
  } = useSelector((state) => state.manualTaskCreation);

  const handleOnChange = (e, v) => {
    clearTimeout(delayDebounceFn);

    let data = campaignList?.data?.filter((x) => {
      if (x?.name) return x?.name.toLowerCase().includes(v.toLowerCase());
    });

    if (!_.isNull(v) && _.isEmpty(data) && _.size(campaignList.data) > 18)
      delayDebounceFn = setTimeout(() => {
        dispatch(getUpdateCampaignList(concept.id, partner.id, 1, v));
      }, 1000);
  };

  const onInputChange = (e, v, name) => {
    setTeam('');
    setTaskType('');
    setSubTask('');
    switch (name.toLowerCase().replace(/ /g, '_')) {
      case 'partner':
        setConcept('');
        setCampaign('');
        setChannel('');
        setTaskName('');
        setPage({ concept: 1, campaign: 1 });
        dispatch(clearConcept());
        dispatch(clearCampaign());
        _.isNull(v) ? setPartner(null) : setPartner(v);

        // dispatch(getData('get_concepts', v?.id));
        break;
      case 'concept':
        setCampaign('');
        setChannel('');
        setTaskName('');
        dispatch(clearCampaign());
        if (_.isNull(v)) {
          setConcept(null);
        } else {
          setConcept(v);
          dispatch(
            getData('get_concept_overview', {
              conceptId: v?.id,
              partnerId: partner.id,
              page: page.campaign,
            })
          );
          setPage({ ...page, campaign: 2 });
        }

        break;
      case 'campaign':
        setChannel('');
        setTaskName('');
        _.isNull(v) ? setCampaign(null) : setCampaign(v);
        break;

      case 'channel':
        setTaskName('');
        _.isNull(v) ? setChannel(null) : setChannel(v);
        switch (v?.name?.split(' ')[0].toLowerCase()) {
          case 'google':
            setSizes(
              _.merge(formatsList.google.display, formatsList.google.video)
            );
            break;
          case 'social':
            if (v?.name?.split(' ')[1].toLowerCase() === 'static') {
              setSizes(formatsList.facebook.static);
            } else if (v.name.split(' ')[1].toLowerCase() === 'video') {
              setSizes(formatsList.facebook.video);
            }

            break;
          case 'youtube':
            setSizes(formatsList.youtube.video);
            break;
        }

        break;
    }
  };

  return (
    <Fragment>
      <Box
        backgroundColor="#25175a"
        color="#fff"
        padding="100px 76px 8px"
        sx={{
          backgroundImage: `url(${cover})`,
          backgroundSize: 'cover',
        }}
      >
        <Stack direction="row">
          <Typography variant="h4" fontWeight={800}>
            Concept &amp; Campaign&nbsp;
          </Typography>
          <StyledTypography variant="h4" fontWeight={800}>
            Details
          </StyledTypography>
        </Stack>
      </Box>
      <Box
        padding="40px 60px"
        height="calc(100vh - 17em)"
        sx={{ overflowY: 'auto' }}
      >
        {/* <Stack direction="row">
        <Typography variant="h4" color="primary" fontWeight={800}>
          Concept &amp; Campaign&nbsp;
        </Typography>
        <StyledTypography variant="h4" fontWeight={800}>
          Details
        </StyledTypography>
      </Stack> */}
        <Box mb={4}>
          <Typography>Please fill the required fields below.</Typography>
        </Box>

        <InfiniteAutoComplete
          data={partnerList}
          name="Partner"
          defaultValue={partner}
          description="All fields will be enabled once a partner is selected."
          isRequired={true}
          onInputChange={onInputChange}
          onOpen={handleOnOpen('partner')}
          isLoading={loading.isPartner}
        />
        <InfiniteAutoComplete
          data={!_.isEmpty(conceptList.data) ? conceptList.data : []}
          name="Concept"
          defaultValue={concept}
          description={
            _.isEmpty(conceptList.data)
              ? 'This has been disabled, please select a Partner'
              : null
          }
          isRequired={true}
          isDisabled={_.isEmpty(partner) || _.isUndefined(partner)}
          onInputChange={onInputChange}
          onOpen={handleOnOpen('concept')}
          isLoading={loading.isConcept}
          handleScroll={handleScroll}
        />

        <InfiniteAutoComplete
          data={
            !_.isEmpty(_.uniq(campaignList.data))
              ? _.uniq(campaignList.data)
              : []
          }
          name="Campaign"
          defaultValue={campaign}
          description={
            _.isEmpty(_.uniq(campaignList.data))
              ? 'No campaign found in this concept.'
              : null
          }
          isRequired={false}
          isDisabled={
            _.isEmpty(concept) ||
            _.isUndefined(concept) ||
            _.isEmpty(_.uniq(campaignList.data))
          }
          onInputChange={onInputChange}
          handleScroll={handleScroll}
          isLoading={fetchingCampaign}
          onChange={handleOnChange}
        />

        <InfiniteAutoComplete
          data={
            !_.isEmpty(campaign) && campaign?.is_custom
              ? [
                  {
                    id: campaign?.channel_info?.id,
                    name:
                      campaign?.channel_info?.id === 5
                        ? 'Youtube'
                        : campaign?.channel_info?.name,
                  },
                ]
              : channelList
          }
          name="Channel"
          defaultValue={channel}
          isRequired={true}
          isLoading={fetchingCampaign}
          isDisabled={
            _.isEmpty(channelList) || _.isEmpty(concept) || fetchingCampaign
          }
          onInputChange={onInputChange}
        />
      </Box>
    </Fragment>
  );
};

export default TaskClassification;
