import { useContext } from 'react';

import moment from 'moment';

import PropTypes from 'prop-types';

import _ from 'lodash';

import { useDispatch } from 'react-redux';

import { getData } from 'store/reducers/manualTaskCreation';

// Context
import TaskCreationContext from 'components/TaskCreation/Context';
import { getChannelDisplayName } from 'components/TaskCreation/utils';

// MUI Components
import { Box, Stack, Button, Divider, styled } from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';

// MUI lab
import { TimelineDot } from '@mui/lab';

// MUI ICons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SaveIcon from '@mui/icons-material/Save';

const NextButton = styled(LoadingButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  font-weight: 700;
  line-height: 1.71429;
  font-size: 0.875rem;
  text-transform: capitalize;
  min-width: 50px;
  padding: 6px 16px;
  border-radius: 8px;
  color: rgb(255, 255, 255);
  box-shadow: #f2207633 0px 8px 16px 0px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const BackButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  font-weight: 700;
  line-height: 1.71429;
  font-size: 0.875rem;
  text-transform: capitalize;
  min-width: 50px;
  padding: 6px 16px;
  border-radius: 8px;
`;

const backSteps = (i) => {
  let back = '';

  switch (i) {
    case 1:
      back = 'Classification';
      break;

    case 2:
      back = 'Configuration';
      break;

    case 3:
      back = 'Details';
      break;
    case 4:
      back = 'References';
      break;
    case 5:
      back = 'Additional Info';
      break;
  }

  return back;
};

const nextStep = (i) => {
  let next = '';

  switch (i) {
    case 0:
      next = 'Configuration';
      break;
    case 1:
      next = 'Details';
      break;
    case 2:
      next = 'References';
      break;
    case 3:
      next = 'Additional Info';
      break;
    case 4:
      next = 'Create Task';
  }

  return next;
};

const Footer = ({ step, setIndex, isLoading }) => {
  const dispatch = useDispatch();
  const formData = new FormData();

  const {
    team,
    taskType,
    taskName,
    partner,
    channel,
    concept,
    subTask,
    campaign,
    asset,
    sizes,
    referenceLinks,
    additionalInformation,
    deliveryDate,
    isRefresh,
    tags,
    validateTaskType,
    fetchingCampaign,
  } = useContext(TaskCreationContext);

  const handleNext = () => {
    setIndex((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const isDesignConsultationTask =
    taskType?.name?.toLowerCase() === 'design consultation';

  const handleSubmit = () => {
    // Files
    for (const a of asset) {
      formData.append('files[]', a.file);
    }

    // Tags
    for (const t of tags) {
      formData.append(
        'tags[]',
        _.isUndefined(t.inputValue) ? t.title : t.inputValue
      );
    }

    // Sizes
    for (const s of Object.keys(sizes).map((key) => sizes[key])) {
      formData.append('sizes[]', s);
    }

    // Reference Links
    const extractedReferenceLinks = [
      ...additionalInformation.matchAll(
        /<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi
      ),
    ].map(([, url, name]) => ({
      url,
      name,
    }));

    // Users
    const extractedMentionedUsers = [
      ...additionalInformation.matchAll(/data-mention="(@\d+)">(@[^<]+)/g),
    ].map(([, id, name]) => ({ id, name }));
    const mentionedUsersIds = extractedMentionedUsers?.map((m) =>
      m.id.replace(/\D/g, '')
    );

    !_.isUndefined(subTask?.id) && formData.append('subTask', subTask?.id);

    formData.append(
      'name',
      `${
        !_.isEmpty(subTask?.name)
          ? subTask?.name
          : !_.isEmpty(taskType?.name)
          ? taskType?.name
          : ''
      }${
        _.isEmpty(concept?.name)
          ? ' - Untitled'
          : _.isEmpty(campaign?.name)
          ? ` - ${concept?.name}`
          : ` - ${campaign?.name}`
      }${
        _.isEmpty(channel?.name)
          ? ''
          : ` - ${getChannelDisplayName(channel?.name)}`
      }`
    );

    formData.append('team', team?.id);
    formData.append('taskType', taskType?.id);
    formData.append('partner', partner?.id ?? null);
    (_.isEqual(partner?.name?.toLowerCase(), 'uncategorized') ||
      _.isEqual(campaign?.name?.toLowerCase(), 'uncategorized') ||
      _.isEqual(channel?.name?.toLowerCase(), 'uncategorized')) &&
      formData.append('task_name', taskName);
    //formData.append('concept', concept?.uuid ?? concept?.id);
    formData.append('concept', concept?.id ?? null);
    formData.append('campaign', campaign?.uuid ?? null);
    formData.append('channel', channel?.name ?? null);
    formData.append('additionalInfo', additionalInformation);
    formData.append('comment', additionalInformation);
    formData.append('isRefresh', isRefresh);
    formData.append(
      'deliveryDate',
      moment(deliveryDate).format('MM/DD/YYYY h:mm A')
    );

    formData.append(
      'links',
      JSON.stringify(
        partner?.name !== 'Uncategorized' &&
          concept?.name !== 'Uncategorized' &&
          channel?.name !== 'Uncategorized' &&
          campaign?.name !== 'uncategorized'
          ? referenceLinks
              .map((rl) => ({
                name: rl.name,
                url: _.isEmpty(rl.url) ? rl.name : rl.url,
              }))
              .concat(extractedReferenceLinks)
          : []
      )
    );
    if (!_.isEmpty(mentionedUsersIds))
      formData.append('tag_user', mentionedUsersIds);
    // For debugging purposes
    // console.log('partner: ', partner);
    // console.log('campaign: ', campaign);
    // console.log('concept: ', concept);
    // console.log('formdata: ', formData);
    dispatch(getData('add_task', formData));
  };

  return (
    <Box>
      <Divider />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={1}
      >
        <Box width={220}>
          <BackButton
            disabled={step <= 0}
            variant="text"
            size="large"
            onClick={handleBack}
            startIcon={step > 0 ? <ChevronLeftIcon /> : null}
          >
            {step > 0 ? backSteps(step) : null}
          </BackButton>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{ position: 'relative', right: '1em' }}
        >
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Box key={i}>
                {i === step ? (
                  <TimelineDot
                    color="secondary"
                    sx={{ boxShadow: 'none', borderWidth: 1 }}
                  />
                ) : i > step ? (
                  <TimelineDot sx={{ boxShadow: 'none', borderWidth: 1 }} />
                ) : (
                  <TimelineDot
                    color="primary"
                    sx={{ boxShadow: 'none', borderWidth: 1 }}
                  />
                )}
              </Box>
            ))}
        </Stack>
        <Box width={220} display="flex" justifyContent="flex-end">
          <NextButton
            color="secondary"
            variant="contained"
            disableElevation
            loading={isLoading}
            size="large"
            onClick={step === 4 ? handleSubmit : handleNext}
            startIcon={
              step === 4 ? (
                <SaveIcon sx={{ width: '0.8em', height: '0.8em' }} />
              ) : null
            }
            endIcon={step === 4 ? null : <ChevronRightIcon />}
            disabled={
              step === 1
                ? fetchingCampaign ||
                  _.isEmpty(team) ||
                  _.isEmpty(taskType) ||
                  (validateTaskType && _.isEmpty(subTask)) ||
                  ((_.isEqual(partner?.name?.toLowerCase(), 'uncategorized') ||
                    _.isEqual(campaign?.name?.toLowerCase(), 'uncategorized') ||
                    _.isEqual(channel?.name?.toLowerCase(), 'uncategorized')) &&
                    _.isEmpty(taskName))
                : step === 0
                ? isDesignConsultationTask
                  ? false
                  : _.isEmpty(partner) ||
                    _.isEmpty(channel) ||
                    _.isEmpty(concept)
                : step === 2
                ? _.isNull(deliveryDate) || _.isNull(isRefresh)
                : step === 4
                ? additionalInformation === ''
                : false
            }
          >
            {nextStep(step)}
          </NextButton>
        </Box>
      </Stack>
    </Box>
  );
};

Footer.propTypes = {
  step: PropTypes.number,
  setIndex: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default Footer;
