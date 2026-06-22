import React, { createContext, useState, useEffect } from 'react';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';
import PropTypes from 'prop-types';
import { postCreateSmartlyTask } from 'store/reducers/smartly';
import Swal from 'sweetalert2';

import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getSmartlyPartners } from 'store/reducers/smartly';

const SmartlyBriefContext = createContext();

export function SmartlyBriefProvider({ children }) {
  const [client, setClient] = useState(null);
  const [clientName, setClientName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [pm, setPM] = useState('');
  const [csmCp, setCsmCp] = useState('');
  const [conceptName, setConceptName] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [motion, setMotion] = useState('');
  const [design, setDesign] = useState('');
  const [copy, setCopy] = useState('');
  const [feedCatalog, setFeedCatalog] = useState('');
  const [market, setMarket] = useState(null);
  const [language, setLanguage] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [gdriveLink, setGdriveLink] = useState('');
  const [asset, setAsset] = useState([]);
  const [formatDesign, setFormatDesign] = useState([]);
  const [formatVideo, setFormatVideo] = useState([]);
  const [referenceDesign, setReferenceDesign] = useState(null);
  const [referenceVideo, setReferenceVideo] = useState(null);
  const [taskType, setTaskType] = useState(null);
  const [assetCheckedBox, setAssetCheckedBox] = useState([]);

  const [cards, setCards] = useState('');
  const [others, setOthers] = useState('');

  const [customDesignFormat, setCustomDesignFormat] = useState([]);
  const [customVideoFormat, setCustomVideoFormat] = useState([]);

  const [isExpanded, setIsExpanded] = useState({
    isGeneral: true,
    isStatic: false,
    isVideo: false,
    isAssets: false,
  });

  const dispatch = useDispatch();

  const { fetchingBrief, partners: partnersList } = useSelector(
    (state) => state.smartly
  );

  useEffect(() => {
    dispatch(getSmartlyPartners());
  }, []);

  const handleChangePanel = (event, value, name) => {
    switch (name) {
      case 'general':
        setIsExpanded({
          isGeneral: true,
          isStatic: false,
          isVideo: false,
          isAssets: false,
        });
        break;
      case 'static':
        setIsExpanded({
          isGeneral: false,
          isStatic: true,
          isVideo: false,
          isAssets: false,
        });
        break;
      case 'video':
        setIsExpanded({
          isGeneral: false,
          isStatic: false,
          isVideo: true,
          isAssets: false,
        });
        break;
      case 'assets':
        setIsExpanded({
          isGeneral: false,
          isStatic: false,
          isVideo: false,
          isAssets: true,
        });
        break;
    }
  };

  const handleFormatDesign = (event, name) => {
    if (name === 'Meta Image Carousel Ad (1x1)')
      if (event.target.checked) {
        if (_.isEmpty(cards)) {
          setFormatDesign([
            ...formatDesign,
            { name: name, size: `${1} card(s)` },
          ]);
          setCards(1);
        } else {
          setFormatDesign([
            ...formatDesign,
            { name: name, size: `${cards} card(s)` },
          ]);
        }
      } else {
        setFormatDesign(
          formatDesign.filter((data) => {
            if (_.isEqual(data.size, cards) && _.isEqual(data.name, name))
              return false;
            return true;
          })
        );
        setCards('');
      }
    else if (event.target.value === 'Others')
      if (event.target.checked)
        setFormatDesign([...formatDesign, { name: name, size: others }]);
      else {
        setFormatDesign(
          formatDesign.filter((data) => {
            if (_.isEqual(data.size, others) && _.isEqual(data.name, name))
              return false;
            return true;
          })
        );
        setOthers('');
      }
    else
      event.target.checked
        ? setFormatDesign([
            ...formatDesign,
            { name: name, size: event.target.value },
          ])
        : setFormatDesign(
            formatDesign.filter((data) => data.size != event.target.value)
          );
  };

  const handleFormatVideo = (event, name, size, all) => {
    let tempArr = [...formatVideo];
    const newItem = [
      { name: name, duration: '6s', size: event.target.value },
      { name: name, duration: '10s', size: event.target.value },
      { name: name, duration: '15s', size: event.target.value },
    ];

    if (all === 'all') {
      newItem.forEach((item) => {
        if (!_.some(tempArr, item)) tempArr.push(item);
      });
      event.target.checked
        ? setFormatVideo(tempArr)
        : setFormatVideo(
            formatVideo.filter((data) => {
              if (
                _.isEqual(data.size, event.target.value) &&
                _.isEqual(data.name, name)
              )
                return false;
              return true;
            })
          );
    } else
      event.target.checked
        ? setFormatVideo([
            ...formatVideo,
            { name: name, duration: event.target.value, size: size },
          ])
        : setFormatVideo(
            formatVideo.filter((data) => {
              if (
                _.isEqual(data.duration, event.target.value) &&
                _.isEqual(data.name, name) &&
                _.isEqual(data.size, size)
              )
                return false;
              return true;
            })
          );
  };

  const handleAssetsCheckedBox = (event, name) => {
    event.target.checked
      ? setAssetCheckedBox([...assetCheckedBox, name])
      : setAssetCheckedBox(assetCheckedBox.filter((data) => data !== name));
  };

  const handleCustomInput = (event, name) => {
    let tempArr = [];
    switch (name.toLowerCase().replace(/ /g, '_')) {
      case 'no._of_cards':
        tempArr = formatDesign.filter((data) => {
          if (
            _.isEqual(data.size, `${cards} card(s)`) &&
            _.isEqual(data.name, 'Meta Image Carousel Ad (1x1)')
          )
            return false;
          return true;
        });
        if (event.target.value > 0) setCards(event.target.value);
        else setCards('');

        if (!_.isEmpty(event.target.value) && event.target.value > 0)
          setFormatDesign([
            ...tempArr,
            {
              name: 'Meta Image Carousel Ad (1x1)',
              size: `${event.target.value} card(s)`,
            },
          ]);
        else setFormatDesign(tempArr);

        break;
      case 'others':
        tempArr = formatDesign.filter((data) => {
          if (
            _.isEqual(data.size, others) &&
            _.isEqual(data.name, 'Meta Static Image Ad')
          )
            return false;
          return true;
        });
        setOthers(event.target.value);

        if (!_.isEmpty(event.target.value) && !_.isEqual(event.target.value))
          setFormatDesign([
            ...tempArr,
            { name: 'Meta Static Image Ad', size: event.target.value },
          ]);
        else setFormatDesign(tempArr);

        break;
    }
  };

  const handleAddCustomVideoSpecs = (event, name) => {
    _.isEmpty(customVideoFormat)
      ? setCustomVideoFormat([{ name: name, duration: null, size: null }])
      : setCustomVideoFormat([
          ...customVideoFormat,
          { name: name, duration: '', size: '' },
        ]);
  };

  const handleDeleteCustomVideoSpecs = (event, name, index) => {
    const tempArr = customVideoFormat.filter((filter) => filter.name !== name);
    let filteredArr = customVideoFormat.filter(
      (filter) => filter.name === name
    );
    filteredArr.splice(index, 1);
    setCustomVideoFormat(_.concat(tempArr, filteredArr));
  };

  const handleOnChangeCustomVideoSpecs = (value, name, label, index) => {
    const tempArr = customVideoFormat.filter((filter) => filter.name !== name);
    let filteredArr = customVideoFormat.filter(
      (filter) => filter.name === name
    );

    switch (label) {
      case 'platform':
        filteredArr[index] = { ...filteredArr[index], name: value };
        break;
      case 'duration':
        filteredArr[index] = { ...filteredArr[index], duration: value };
        break;
      case 'size':
        filteredArr[index] = { ...filteredArr[index], size: value };
        break;
    }

    setCustomVideoFormat(_.concat(tempArr, filteredArr));
  };

  const handleChange = (state) => {
    setReferenceDesign(draftToHtml(convertToRaw(state.getCurrentContent())));
  };

  const handleOnInputChange = (value, name) => {
    switch (name) {
      case 'name':
        _.isNull(value) ? setTaskName(null) : setTaskName(value);
        break;
      case 'client':
        _.isNull(value) ? setClient(null) : setClient(value);
        break;
      case 'client_name':
        _.isNull(value) ? setClientName(null) : setClientName(value);
        break;
      case 'pm':
        _.isNull(value) ? setPM(null) : setPM(value);
        break;
      case 'csm_cp':
        _.isNull(value) ? setCsmCp(null) : setCsmCp(value);
        break;
      case 'campaign':
        _.isNull(value) ? setCampaignName(null) : setCampaignName(value);
        break;
      case 'motion':
        _.isNull(value) ? setMotion(null) : setMotion(value);
        break;
      case 'design':
        _.isNull(value) ? setDesign(null) : setDesign(value);
        break;
      case 'copy':
        _.isNull(value) ? setCopy(null) : setCopy(value);
        break;
      case 'feed_catalog_name':
        _.isNull(value) ? setFeedCatalog(null) : setFeedCatalog(value);
        break;
      case 'concept':
        _.isNull(value) ? setConceptName(null) : setConceptName(value);
        break;
      case 'gdriveLink':
        _.isNull(value) ? setGdriveLink(null) : setGdriveLink(value);
        break;
      case 'language':
        _.isNull(value) ? setLanguage(null) : setLanguage(value);
        break;
      case 'region_market':
        _.isNull(value) ? setMarket(null) : setMarket(value);
        break;
    }
  };

  const ToastError = Swal.mixin({
    toast: true,
    icon: 'error',
    width: 370,
    position: 'top-right',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  const ToastSuccess = Swal.mixin({
    toast: true,
    icon: 'success',
    width: 370,
    position: 'top-right',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  const handleSubmit = () => {
    const customDesign = customVideoFormat.filter((data) => {
      if (!_.isEqual(data?.name, null) && !_.isEqual(data?.size, null))
        return data;
    });

    const customVideo = customVideoFormat.filter((data) => {
      if (
        !_.isEqual(data?.name, null) &&
        !_.isEqual(data?.size, null) &&
        !_.isEqual(data?.duration, null)
      )
        return data;
    });

    const formData = new FormData();

    if (
      _.isEmpty(taskName) ||
      _.isEmpty(client) ||
      _.isEmpty(pm) ||
      _.isEmpty(csmCp) ||
      _.isEmpty(market) ||
      _.isEmpty(language) ||
      _.isEmpty(gdriveLink) ||
      _.isNull(dueDate) ||
      _.isEmpty(assetCheckedBox)
    )
      return ToastError.fire({
        title: 'Please enter all required fields',
      });

    if (
      (_.isEmpty(_.concat(formatDesign, customDesign)) ||
        _.isEmpty(referenceDesign)) &&
      (_.isEmpty(_.concat(formatVideo, customVideo)) ||
        _.isEmpty(referenceVideo) ||
        _.isEmpty(taskType))
    )
      return ToastError.fire({
        title: 'Needs at least 1 task before submitting',
      });

    if (
      _.isEmpty(_.concat(formatDesign, customDesign)) &&
      !_.isEmpty(referenceDesign)
    )
      return ToastError.fire({
        title: 'Please select a Static Creative Format/Specification',
      });

    if (
      !_.isEmpty(_.concat(formatDesign, customDesign)) &&
      _.isEmpty(referenceDesign)
    )
      return ToastError.fire({
        title: 'Please fill out the Build Instruction in Static',
      });

    if (
      (!_.isEmpty(_.concat(formatVideo, customVideo)) ||
        !_.isEmpty(referenceVideo)) &&
      _.isEmpty(taskType)
    )
      return ToastError.fire({
        title: 'Please select a Task Type in Video',
      });

    if (
      (!_.isEmpty(referenceVideo) || !_.isEmpty(taskType)) &&
      _.isEmpty(_.concat(formatVideo, customVideo))
    )
      return ToastError.fire({
        title: 'Please select a Video Creative Format/Specification',
      });

    if (
      (!_.isEmpty(_.concat(formatVideo, customVideo)) ||
        !_.isEmpty(taskType)) &&
      _.isEmpty(referenceVideo)
    )
      return ToastError.fire({
        title: 'Please fill out the Build Instruction in Video',
      });

    formData.append('name', taskName);
    formData.append('client', client?.name);
    formData.append('cliend_uuid', client?.id);
    formData.append('client_name', null);
    formData.append('concept_name', conceptName);
    formData.append('campaign_name', null);
    formData.append('csm_cp', csmCp);
    // formData.append('copy', copy);
    // formData.append('motion', motion);
    formData.append('region_market', market);
    formData.append('language', language);
    formData.append('due_date', moment(dueDate).format('YYYY-MM-DD hh:mm:ss '));
    formData.append('feedback_catalog_name', feedCatalog);
    formData.append('pm', pm);
    formData.append('gdrive_link', gdriveLink);
    formData.append('design', design);
    if (!_.isEmpty(_.concat(formatDesign, customDesign)))
      formData.append(
        'format_design',
        JSON.stringify(_.concat(formatDesign, customDesign))
      );
    if (!_.isEmpty(_.concat(formatVideo, customVideo))) {
      formData.append(
        'format_video',
        JSON.stringify(_.concat(formatVideo, customVideo))
      );
      formData.append('task_type', taskType?.value);
    }

    formData.append('build_instruction_design', referenceDesign);
    formData.append('build_instruction_video', referenceVideo);
    formData.append('check_list', JSON.stringify(assetCheckedBox));

    for (const a of asset) {
      formData.append('assets[]', a.file);
    }

    Swal.fire({
      title: 'Almost There! ',
      text: 'Please make sure that all data are correct, necessary assets, and brand guide are provided to avoid delays.',
      icon: 'warning',
      allowOutsideClick: false,
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'Cancel',
      backdrop: '#25175aa3',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          postCreateSmartlyTask(
            formData,
            () => {
              ToastSuccess.fire({
                title:
                  "The task created successfully and will be added to team's queue.",
              });
            },
            (error) => {
              ToastError.fire({
                title: error,
              });
            }
          )
        );

        setTaskName('');
        setClient(null);
        setClientName('');
        setPM('');
        setCsmCp('');
        setConceptName('');
        setCampaignName('');
        setMotion('');
        setDesign('');
        setCopy('');
        setCards('');
        setOthers('');
        setFeedCatalog('');
        setMarket(null);
        setLanguage(null);
        setGdriveLink('');
        setTaskType('');
        setDueDate(null);
        setFormatDesign([]);
        setFormatVideo([]);
        setAsset([]);
        setAssetCheckedBox([]);
        setCustomDesignFormat([]);
        setCustomVideoFormat([]);
        setReferenceDesign('');
        setReferenceVideo('');
        setIsExpanded({
          isGeneral: true,
          isStatic: false,
          isVideo: false,
          isAssets: false,
        });
      }
    });
  };

  const handleAddCustomFormat = () => {
    _.isEmpty(customDesignFormat)
      ? setCustomDesignFormat([{ name: '', size: '' }])
      : setCustomDesignFormat([...customDesignFormat, { name: '', size: '' }]);
  };

  const handleDeleteCustomFormat = (index) => {
    let tempArr = [...customDesignFormat];
    tempArr.splice(index, 1);
    setCustomDesignFormat(tempArr);
  };

  const handleCustomOnChange = (value, index, name) => {
    let tempArr = [...customDesignFormat];
    switch (name) {
      case 'name':
        tempArr[index] = { ...tempArr[index], name: value };
        break;
      case 'size':
        tempArr[index] = { ...tempArr[index], size: value };
        break;
    }

    setCustomDesignFormat(tempArr);
  };

  return (
    <SmartlyBriefContext.Provider
      value={{
        asset,
        client,
        taskName,
        clientName,
        pm,
        csmCp,
        conceptName,
        campaignName,
        motion,
        design,
        copy,
        feedCatalog,
        gdriveLink,
        market,
        language,
        dueDate,
        referenceDesign,
        referenceVideo,
        taskType,
        customDesignFormat,
        formatDesign,
        customVideoFormat,
        formatVideo,
        isExpanded,
        fetchingBrief,
        others,
        cards,
        assetCheckedBox,
        partnersList,
        handleChangePanel,
        handleAddCustomFormat,
        handleOnChangeCustomVideoSpecs,
        handleDeleteCustomVideoSpecs,
        handleAddCustomVideoSpecs,
        handleDeleteCustomFormat,
        handleCustomOnChange,
        handleFormatVideo,
        handleAssetsCheckedBox,
        setAsset,
        setDueDate,
        setReferenceDesign,
        setReferenceVideo,
        setTaskType,
        handleFormatDesign,
        handleCustomInput,
        handleChange,
        handleSubmit,
        handleOnInputChange,
      }}
    >
      {children}
    </SmartlyBriefContext.Provider>
  );
}

SmartlyBriefProvider.propTypes = {
  children: PropTypes.any,
};

export default SmartlyBriefContext;
