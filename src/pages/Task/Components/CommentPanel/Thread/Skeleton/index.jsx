// MUI
import { Stack, Divider, Box } from '@mui/material';
// App Components
import CustomSkeletonLoader from 'components/Common/Skeleton';
// Utilities
import PropTypes from 'prop-types';

const SkeletonLoader = ({count}) => {
  return (
    <Box>
        {Array(count)
            .fill(0)
            .map((data, index) => (
                <Box
                key={index}>
                    <Stack
                    sx={{ padding: '0.55em 1em',  backgroundColor: index === 0 ? '#fafaf7' : 'inherit'  }}
                    direction="column"
                    spacing={.3}
                    alignItems="flex-start"
                    >
                        <Stack
                            spacing={1}
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                        >
                            <Stack spacing={2} direction="row" alignItems="center">
                                <Box sx={{ margin: '0.2em 0' }}>
                                    <CustomSkeletonLoader variant="circular" width={35} height={35}/>
                                </Box>
                                <Stack spacing={-0.7}>
                                    <CustomSkeletonLoader width={'7em'} height={"2em"}/>
                                    <CustomSkeletonLoader width={'10em'} height={".8em"}/>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Box pl={5.5}>
                            <CustomSkeletonLoader width={'36em'} height={"3.2em"} />
                        </Box>
                        
                    </Stack>
                    <Divider />
                </Box>
            ))}
    </Box>
  );
};

SkeletonLoader.propTypes = {
    count: PropTypes.number,
  };

export default SkeletonLoader;
