import  React, {useContext} from 'react';
import {Box, Typography} from '@mui/material';
import Radio from '@mui/material/Radio';
import _ from 'lodash';

import HeaderContext from 'components/Common/Header/context';

export default function Sort() {
    const {
        sort,
        handleSort,
      } = useContext(HeaderContext);

  return (
    <Box
    sx={{
      width: '150px',
    }}>
        <Box px="12px">
        <Typography variant="button" fontWeight={800}>
            Sort
        </Typography>
        </Box>
        <Box
            py={0.8}
            pl="12px"
            display="flex"
            alignItems="center">
            <Radio
                size="small"
                value='desc'
                checked={_.isEqual(sort,'desc')}
                onChange={(event) => handleSort(event.target.value)}/>
            <Typography>Newest</Typography>
        </Box>
        <Box
            py={0.8}
            pl="12px"
            display="flex"
            alignItems="center">
            <Radio
                size="small"
                value='asc'
                checked={_.isEqual(sort,'asc')}
                onChange={(event) => handleSort(event.target.value)}/>
            <Typography>Oldest</Typography>
        </Box>
    </Box>
  );
}