import * as React from 'react';
import { Typography, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

import PropTypes from 'prop-types';

const StyledCard = styled(Card)({
  padding: '1em 2em',
  borderRadius: '10px',
  boxShadow:
    'rgba(159, 162, 191, 0.18) 0px 9px 16px, rgba(159, 162, 191, 0.32) 0px 2px 2px',
});

export default function PieGraph({ data }) {
  return (
    <StyledCard
    sx={{
      backgroundColor: data.color,
      color: '#fff',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${data.bg ?? null})`,
      backgroundSize: '74px',
      backgroundPosition: 'right',
      backgroundPositionX: '90%',
      backgroundPositionY: '0.8em',
    }}
    >
    <Typography
      variant="button"
      fontWeight={700}
      textTransform="capitalize"
      noWrap
    >
      {data.title}
    </Typography>
    <Typography variant="h4" fontWeight={800}>
      {data.data ?? '00:00:00'}
    </Typography>
    </StyledCard>
  );
}

PieGraph.propTypes = {
  data: PropTypes.any,
};
