import React, { useContext } from 'react';

// import { convertToRaw } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';

import _ from 'lodash';

import { Box, Stack, Typography } from '@mui/material';

import { styled } from '@mui/material/styles';

// Context
import TaskCreationContext from 'components/TaskCreation/Context';
import { getChannelDisplayName } from 'components/TaskCreation/utils';
import Editor from 'components/Common/Editor';

const StyledTypography = styled(Typography)`
  background-image: linear-gradient(90deg, #e0238c, #f22076 47.43%, #f96666);
  background-size: 100%;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
`;

// const theme = createTheme({
//   overrides: {
//     MUIRichTextEditor: {
//       root: {
//         borderRadius: '1em',
//         border: '1px solid #ececec',
//       },
//       container: {
//         display: 'flex',
//         flexDirection: 'column-reverse',
//         height: '26em',
//       },
//       toolbar: {
//         display: 'flex',
//         justifyContent: 'space-evenly',
//         borderTop: '1px solid #ececec',
//         padding: '0.2em 0.5em',
//       },
//       placeHolder: {
//         position: 'absolute',
//         height: 'inherit',
//         padding: '0.5em 1em',
//         top: '14em',
//         width: '38em',
//       },
//       editor: {
//         padding: '0 1em',
//         height: '-webkit-fill-available',
//         overflow: 'auto',
//       },
//       editorContainer: {
//         height: '-webkit-fill-available',
//       },
//     },
//     DraftEditor: {
//       root: {
//         height: '-webkit-fill-available',
//       },
//       editorContainer: {
//         height: '-webkit-fill-available',
//       },
//     },
//   },
// });

const TaskInstruction = () => {
  const {
    subTask,
    taskName,
    taskType,
    concept,
    campaign,
    channel,
    setAdditionalInformation,
  } = useContext(TaskCreationContext);

  const handleChange = (state) => {
    setAdditionalInformation(state.getData());
  };

  return (
    <Box
      padding="40px 60px"
      height="calc(100vh - 7.2em)"
      sx={{ overflowY: 'auto' }}
    >
      <Stack direction="row">
        <Typography
          variant="h4"
          sx={{ wordBreak: 'break-word' }}
          color="primary"
          fontWeight={800}
        >
          {!_.isEmpty(subTask?.name)
            ? subTask?.name
            : !_.isEmpty(taskType?.name)
            ? taskType?.name
            : ''}
          {_.isEmpty(taskName)
            ? _.isEmpty(concept?.name)
              ? ' - Untitled'
              : _.isEmpty(campaign?.name)
              ? ` - ${concept?.name}`
              : ` - ${campaign?.name}`
            : ` - `}
          {_.isEmpty(taskName) && (_.isEmpty(channel?.name) ? '' : ` - `)}
          <StyledTypography
            variant="caption"
            fontSize={'1.9732142857142858rem'}
            lineHeight={1.3}
            fontWeight={800}
          >
            {_.isEmpty(taskName)
              ? _.isEmpty(channel?.name)
                ? ''
                : getChannelDisplayName(channel?.name)
              : `${taskName}`}
          </StyledTypography>
        </Typography>
      </Stack>
      <Box mb={4}>
        <Typography>Please include all necessary information.</Typography>
      </Box>
      <Typography variant="h6">Additional Information</Typography>
      <Box>
        <Editor
          key={1}
          initValue={''}
          onChange={(_, editor) => handleChange(editor)}
          placeholder="Write something..."
          height={400}
          isCreateTask={true}
          isUserMentionEnable={true}
          // disabled={isSaving}
        />
      </Box>
    </Box>
  );
};

export default TaskInstruction;
