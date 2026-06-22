import { useOnMount } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getConceptList } from 'store/reducers/projects';

import CircularLoader from 'components/Common/CircularLoader';

export default function Project() {
  const history = useHistory();
  const dispatch = useDispatch();

  const firstUpdate = useRef();

  const { conceptList, fetchConceptList } = useSelector(
    (state) => state.projects
  );

  const { data: user } = useSelector((state) => state.user);

  const params = {
    filter: {
      name: '',
      partner_uuid: user?.partner_id?.split(','),
      'userPartners.user_id': [],
      status: [],
      delivery_date: [],
    },
  };

  useOnMount(() => {
    dispatch(getConceptList(params, 1, 1));
  });

  useEffect(() => {
    // Doesn't render 1st update
    if (!firstUpdate.current) {
      firstUpdate.current = true;
      return;
    }

    const overview = !_.isEmpty(conceptList) && conceptList?.data[0];

    if (_.isEmpty(overview)) {
      const params = { filter: { ...params?.filter, partner_uuid: [] } };
      dispatch(getConceptList(params, 1, 1));
    } else
      history.push(
        `/projects/${overview?.partner_uuid}/concept/${overview?.uuid}/overview`
      );
  }, [conceptList]);

  return <>{fetchConceptList && <CircularLoader />}</>;
}
