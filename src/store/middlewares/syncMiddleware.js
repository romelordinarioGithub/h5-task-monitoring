import { createStateSyncMiddleware } from 'redux-state-sync';

const config = {
  whitelist: [
    'activeTimer/setSelectedTaskCategory',
    'activeTimer/setSelectedPartner',
    'activeTimer/setSelectedCampaign',
    'activeTimer/setSelectedConcept',
    'activeTimer/setSelectedDate',
    'activeTimer/setFilterSelectedDates',
    'activeTimer/setTags',
    'activeTimer/setIsRunning',
    'activeTimer/setRequiredFields',
    'activeTimer/reset',
    // 'timer/initTimeLogs',
    // 'timer/initPaginatedTimeLogs',
    'timer/initTimelogSuccess',
    'timer/initPaginatedTimelogSuccess',
    'timer/initTimelogsFailed',
    'timer/initPartners',
    'timer/initPartnersSuccess',
    'timer/startTimerStart',
    'timer/stopTimerStart',
    'timer/startTimerSuccess',
    'timer/stopTimerSuccess',
    'timer/startTimerFailed',
    'timer/stopTimerFailed',
    'notifications/prevNotificationCountSuccess',
    'notifications/notificationCountSuccess',
    'notifications/counterSuccess',
    'dashboard/successPriorities',
    'dashboard/successMembers',
    'dashboard/successStatuses',
    'filters/setTimerSheetApplyFilterCooldownEndsAt',
  ],
};

const syncMiddleware = [createStateSyncMiddleware(config)];

export default syncMiddleware;
