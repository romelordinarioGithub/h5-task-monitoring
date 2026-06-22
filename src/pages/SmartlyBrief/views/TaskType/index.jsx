import React, { useContext } from 'react';
import {
  Card,
  Typography,
  Box,
  Stack,
  TextField,
  Autocomplete,
} from '@mui/material';
import SmartlyBriefContext from 'pages/SmartlyBrief/context';
import InfoIcon from '@mui/icons-material/Info';
import { taskType_value } from 'pages/SmartlyBrief/constant';

export default function TaskType() {
  const { taskType, setTaskType } = useContext(SmartlyBriefContext);

  return (
    <Card style={{ padding: '2em' }}>
      <Stack spacing={2}>
        <Box>
          <Typography
            style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            Task Type
          </Typography>
        </Box>
        <Box
          sx={{
            padding: '1em',
            border: '1px solid #dedede54',
            borderRadius: '0.6em',
            backgroundColor: '#5025c421',
          }}
        >
          <Stack direction="row" fontWeight="700" sx={{ fontSize: '1.2em' }}>
            <InfoIcon color="primary" sx={{ fontSize: '2em' }} />
            &ensp;Guide when selecting a Task Type.
          </Stack>
          <Stack sx={{ padding: '1em', pl: '3em' }}>
            <Typography component="span">
              <Box fontWeight="700" display="inline" color="#f22076">
                Concept Design
              </Box>{' '}
              new or additional storyboards and Fix and Flex Guide.
            </Typography>
            <Typography component="span">
              <Box fontWeight="700" display="inline" color="#f22076">
                Concept Build
              </Box>{' '}
              new or additional templates based on approved storyboards.
            </Typography>
            <Typography component="span">
              <Box fontWeight="700" display="inline" color="#f22076">
                Creative Build
              </Box>{' '}
              new or additional creatives based on existing templates.
            </Typography>
          </Stack>
        </Box>
        <Autocomplete
          size="small"
          options={taskType_value}
          value={taskType}
          getOptionLabel={(option) => (option?.label ? option?.label : '')}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          onChange={(event, value) => setTaskType(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Task Type"
              placeholder="Select a task type"
            />
          )}
          autoComplete={false}
        />
      </Stack>
    </Card>
  );
}
