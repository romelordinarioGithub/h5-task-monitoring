import React, { createContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNotificationCount,
  getNotificationAllRead,
  getNotification,
  setNotificationToRead,
  updateTimerCount,
  updatePrevUnread,
} from 'store/reducers/notifications';

import {
  addRecentSearches,
  addSavedSearches,
  getGlobalSearch,
  resetGlobalSearch,
  setIsSearching,
  resetNotification,
} from 'store/reducers/globalSearch';

import Notification from 'components/Common/Notification';
import Search from 'components/Common/Header/component/Search';
import GlobalDrawer from 'components/Common/Drawer';
import Notifications from 'components/Common/Header/component/Notifications';
import _ from 'lodash';
import TaskTimer from 'components/TaskTimer';
import TaskCreation from 'components/TaskCreation';
import GlobalPopper from 'components/Common/Popper';
import Sort from 'components/Common/Header/component/Sort';
import Notifier from 'react-desktop-notification';
import Swal from 'sweetalert2';

import Image from 'assets/icons/bell.png';
import { useOnMount } from 'hooks';
import { useLocation } from 'react-router-dom';

import { BroadcastChannel, createLeaderElection } from 'broadcast-channel';

const HeaderContext = createContext();

let timer;

export function HeaderProvider({ children }) {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [openPreset, setOpenPreset] = useState(false);
  const [notificationTab, setNotificationTab] = useState('all');
  const [openTaskCreation, setOpenTaskCreation] = useState(false);
  const [sort, setSort] = useState('desc');
  const [anchorEl, setAnchorEl] = useState(false);
  const [isBroadcastLeader, setIsBroadcastLeader] = useState(false);
  const { data: userData } = useSelector((state) => state.user);
  const [key, setKey] = useState(0);

  const channel = new BroadcastChannel('notifications');
  const elector = createLeaderElection(channel);

  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const notification = urlParams.get('notification');

  const {
    count: { all, read, unread },
    prev: { unread: prevUnread },
    list,
    fetchNotification,
    errorNotification,
    counter,
  } = useSelector((state) => state.notifications);

  const {
    savedSearches,
    recentSearches,
    concepts,
    campaigns,
    tasks,
    subTasks,
    fetchConcepts,
    fetchCampaigns,
    fetchTasks,
    fetchSubtasks,
    isSearching,
    isNotify,
    notify,
  } = useSelector((state) => state.globalSearch);

  const Toast = Swal.mixin({
    toast: true,
    iconHtml: `<img src=${Image} width='50' height='50' />`,
    iconColor: `#fff`,
    backdrop: `rgba(0,0,0,0.0)`,
    width: 340,
    position: 'bottom-right',
    showConfirmButton: false,
    showCloseButton: true,
    allowOutsideClick: true,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('click', (e) => {
        if (e.target.type !== 'button') handleOpenNotification();
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      });
    },
  });

  useEffect(() => {
    if (counter === 0) {
      isBroadcastLeader && dispatch(getNotificationCount('unread'));
      clearInterval(timer);
      dispatch(updateTimerCount(300));
    }

    elector.awaitLeadership().then((value) => {
      setIsBroadcastLeader(value);
    });

    elector.onduplicate = () => {
      setIsBroadcastLeader(false);
    };

    timer =
      counter > 0 &&
      setInterval(() => dispatch(updateTimerCount(0)), 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    if (unread !== prevUnread && !openNotification && unread !== 0 && key > 1) {
      isBroadcastLeader &&
        Notifier.start(
          'Ad-Weave',
          `You have ${unread} unread notification(s)`,
          `${window.origin}/?notification=true`,
          process.env.PUBLIC_URL + '/icons/logo-initial-white.png'
        );

      Toast.fire({
        html: ` <p><strong>Ad-Weave</strong><br/>
           You have ${unread} unread notification(s)</p>`,
      });
    }

    setKey(key + 1);
    dispatch(updatePrevUnread(unread));
  }, [unread]);

  useOnMount(() => {
    dispatch(getNotificationCount('unread'));
    notification === 'true' && handleOpenNotification();
  });

  const handleOpenNotification = () => {
    Swal.close();
    setOpenNotification(!openNotification);
    setSort('desc');
    if (!openNotification) {
      dispatch(getNotificationCount('read'));
      dispatch(getNotificationCount('unread'));
      dispatch(getNotificationCount('all'));
      dispatch(getNotification('all'));
      setNotificationTab('all');
    }
  };

  const handleOpenSearch = () => {
    setOpenSearch(!openSearch);
    dispatch(resetGlobalSearch());
  };

  const handleOpenPreset = () => {
    setOpenPreset(!openPreset);
  };

  const handleNotificationTab = (e, tabValue) => {
    e.preventDefault();
    setHasMore(true);
    setNotificationTab(tabValue);
    dispatch(getNotification(tabValue, 1, sort));
  };

  const handleMarkAllNotificationAsRead = () => {
    dispatch(getNotificationAllRead(notificationTab));
  };

  const handleNotificationScroll = () => {
    setHasMore(true);
    if (!_.isEmpty(list[notificationTab])) {
      const nextPage = list[notificationTab]?.current_page + 1;

      if (nextPage <= list[notificationTab]?.last_page) {
        dispatch(getNotification(notificationTab, nextPage, sort));
      } else {
        setHasMore(false);
      }
    }
  };

  const handleClickNotification = (notificationId, notificationStatus) => {
    notificationStatus === 'unread' &&
      dispatch(setNotificationToRead(notificationId, notificationTab));
  };

  const handleSearch = (searchString) => {
    if (!userData.is_smartly) {
      dispatch(getGlobalSearch('concept', searchString));
      dispatch(getGlobalSearch('campaign', searchString));
    }

    dispatch(getGlobalSearch('task', searchString));
    dispatch(getGlobalSearch('subtask', searchString));
    dispatch(setIsSearching(!_.isEmpty(searchString)));
    !_.isEmpty(searchString) && dispatch(addRecentSearches(searchString));
  };

  const handleAddSaveSearch = (value) => {
    dispatch(addSavedSearches(value));
  };

  const handleCloseNotification = () => {
    dispatch(resetNotification());
  };

  const handleTaskCreation = () => {
    setOpenTaskCreation(!openTaskCreation);
  };

  const handleSort = (value) => {
    setSort(value);
    dispatch(getNotification(notificationTab, 1, value));
    setAnchorEl(null);
  };

  const HandlePopper = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <HeaderContext.Provider
      value={{
        all,
        read,
        sort,
        unread,
        openSearch,
        openNotification,
        openPreset,
        notificationTab,
        list,
        fetchNotification,
        errorNotification,
        hasMore,
        savedSearches,
        recentSearches,
        concepts,
        campaigns,
        tasks,
        subTasks,
        fetchConcepts,
        fetchCampaigns,
        fetchTasks,
        fetchSubtasks,
        isSearching,
        openTaskCreation,
        handleTaskCreation,
        handleOpenNotification,
        handleOpenSearch,
        handleOpenPreset,
        handleNotificationTab,
        handleMarkAllNotificationAsRead,
        handleNotificationScroll,
        handleClickNotification,
        handleSearch,
        handleAddSaveSearch,
        handleSort,
        HandlePopper,
      }}
    >
      {children}
      <GlobalDrawer
        isOpen={openNotification}
        content={<Notifications />}
        name="notifications"
        width={550}
        anchor="right"
        onClose={handleOpenNotification}
      />

      <GlobalDrawer
        content={<TaskCreation onClose={handleTaskCreation} />}
        transitionDuration={{ enter: 300, exit: 0 }}
        name="manual-task-creation"
        width={600}
        isOpen={openTaskCreation}
        anchor="left"
        BackdropProps={{
          invisible: false,
          sx: {
            backdropFilter: 'blur(0)',
            pointerEvents: 'none',
          },
        }}
        hideBackdrop={false}
        disableEnforceFocus
      />

      {openSearch && (
        <Search open={openSearch} handleClose={handleOpenSearch} />
      )}

      <Notification
        handleCloseNotification={handleCloseNotification}
        isNotify={isNotify}
        notification={notify}
      />

      <GlobalPopper
        isOpen={Boolean(anchorEl)}
        anchorEl={anchorEl}
        content={<Sort />}
        onClose={() => setAnchorEl(null)}
      />

      {openPreset && (
        <TaskTimer isOpen={openPreset} handleClose={handleOpenPreset} />
      )}
    </HeaderContext.Provider>
  );
}

HeaderProvider.propTypes = {
  children: PropTypes.any,
};

export default HeaderContext;
