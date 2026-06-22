import { useState, useRef, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Card,
  Divider,
  styled,
  Tooltip,
  Button,
} from '@mui/material';
// MUI icons
import UnfoldLessOutlinedIcon from '@mui/icons-material/UnfoldLessOutlined';
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
// children
import Thread from 'pages/Ticket/Components/CommentPanel/Thread';
import ThreadInput from './ThreadInput';
import { CircularProgress } from '@material-ui/core';
import _ from 'lodash';

const StyleCard = styled(Card)({
  boxShadow: '0 1px 4px rgba(124, 58, 237, 0.07)',
  border: '1px solid #ede9fe',
  borderRadius: '16px',
  maxHeight: 'inherit !important',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
});

const CommentPanel = ({
  user,
  comment,
  commentRelType,
  threadRelType,
  ticketId,
  onSave,
  handleAttachments,
  hasNextPage,
  onPaginate,
}) => {
  const threadRef = useRef(null);

  const [isCollapseAll, setIsCollapseAll] = useState(false);

  const [isLoadingPagination, setIsLoadingPagination] = useState(false);

  const [, setthreadCount] = useState(0);

  const handleCollapseAll = () => {
    setIsCollapseAll(!isCollapseAll);
  };

  useEffect(() => {
    setthreadCount(comment?.length);
  });

  const handleOnPaginate = async () => {
    setIsLoadingPagination(true);
    await onPaginate();
    setIsLoadingPagination(false);
  };

  return (
    <Stack mt={2} spacing={1}>
      <ThreadInput
        ticketId={ticketId}
        user={user}
        threadRef={threadRef}
        commentRelType={commentRelType}
        threadRelType={threadRelType}
        handleThread={onSave}
        handleAttachments={handleAttachments}
      />
      <Stack direction="row" justifyContent="space-between">
        <Stack
          direction="row"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        ></Stack>
        <Box>
          <Tooltip title={!isCollapseAll ? 'Expand All' : 'Collapse All'} arrow>
            <IconButton size="small" onClick={handleCollapseAll}>
              {!isCollapseAll ? (
                <UnfoldMoreOutlinedIcon />
              ) : (
                <UnfoldLessOutlinedIcon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
      <StyleCard>
        <Divider />
        <Stack mt={2} justifyContent="space-between">
          {!_.isEmpty(comment) ? (
            comment.map((thread, index) => (
              <Thread
                key={index}
                thread={thread}
                threadComment={thread?.comment}
                commentRelType={commentRelType}
                threadRelType={threadRelType}
                isCollapseAll={isCollapseAll}
                user={user}
                ticketId={ticketId}
                handleThread={onSave}
                handleAttachments={handleAttachments}
              />
            ))
          ) : (
            <Card variant="outlined" sx={{ margin: '0.5em' }}>
              <Stack alignItems="center" p={2}>
                <IconButton>
                  <CommentsDisabledIcon />
                </IconButton>
                <Typography variant="caption">
                  No thread found for this task.
                </Typography>
              </Stack>
            </Card>
          )}
        </Stack>
      </StyleCard>
      {hasNextPage && (
        <Stack alignItems="center" spacing={-2.5} mt={1}>
          {isLoadingPagination ? (
            <Box alignItems="center">
              <CircularProgress color="primary" size={20} />
            </Box>
          ) : (
            <>
              <Button
                sx={{ fontSize: '0.7em', fontWeight: 600, pb: 1.8 }}
                onClick={handleOnPaginate}
              >
                See more
              </Button>
              <KeyboardArrowDownIcon />
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
};

CommentPanel.propTypes = {
  user: PropTypes.object.isRequired,
  section: PropTypes.any,
  comment: PropTypes.any,
  commentRelType: PropTypes.string,
  threadRelType: PropTypes.string,
  ticketId: PropTypes.any,
  handleAttachments: PropTypes.func,
  hasNextPage: PropTypes.bool,
  isCollapseEnabled: PropTypes.bool,
  onSave: PropTypes.func,
  onPaginate: PropTypes.func,
};

export default CommentPanel;
