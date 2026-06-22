import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Collapse,
  Card,
  Divider,
  styled,
  Badge,
  Button,
} from '@mui/material';
// MUI icons
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
// children
import Thread from 'pages/Task/Components/CommentPanel/Thread';
import ThreadInput from './ThreadInput';
import { getItemByKey } from 'utils/dictionary';
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
  section,
  comment,
  commentRelType,
  threadRelType,
  taskId,
  onSave,
  handleAttachments,
  hasNextPage,
  isCollapseEnabled,
  onPaginate,
}) => {
  const threadRef = useRef(null);

  const [collapseThread, setCollapseThread] = useState(
    isCollapseEnabled ? true : !isCollapseEnabled
  );
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);

  const [threadCount, setthreadCount] = useState(0);

  const {
    overview: { assignees, watcher, is_parent },
  } = useSelector((state) => state.tasks);

  const handleCollapseThread = () => {
    setCollapseThread(!collapseThread);
  };

  const isAssignee = !_.isEmpty(
    getItemByKey(is_parent ? 'id' : 'user_id', user?.id, assignees)
  );

  useEffect(() => {
    setthreadCount(comment?.length);
  });

  const isWatcher =
    _.filter(watcher ?? [], (w) => w?.user_id === user?.id)?.length > 0;

  const handleOnPaginate = async () => {
    setIsLoadingPagination(true);
    await onPaginate();
    setIsLoadingPagination(false);
  };

  user?.team_id;

  return (
    <Stack mt={2}>
      {isCollapseEnabled && (
        <Stack direction="row" justifyContent="space-between" mt={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
          >
            {user?.team_id !== 11 && (
              <Stack display="flex" alignItems="center" flexDirection="row">
                <Typography fontWeight={700} color="primary" marginRight="14px">
                  {section}
                </Typography>
                <Badge
                  color="secondary"
                  overlap="circular"
                  badgeContent={threadCount}
                ></Badge>
              </Stack>
            )}
          </Stack>
          <Box>
            <IconButton size="small" onClick={handleCollapseThread}>
              {!collapseThread ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Box>
        </Stack>
      )}
      <Collapse in={collapseThread}>
        <StyleCard>
          <Stack>
            {/* Create a thread */}
            {(isAssignee || isWatcher) && (
              <ThreadInput
                taskId={taskId}
                user={user}
                threadRef={threadRef}
                commentRelType={commentRelType}
                threadRelType={threadRelType}
                handleThread={onSave}
                handleAttachments={handleAttachments}
              />
            )}
          </Stack>
          <Divider />
          <Stack mt={2} justifyContent="space-between">
            {!_.isEmpty(comment) ? (
              comment.map((thread, index) => (
                <Thread
                  key={index}
                  user={user}
                  taskId={taskId}
                  thread={thread}
                  threadComment={thread?.comment}
                  commentRelType={commentRelType}
                  threadRelType={threadRelType}
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
      </Collapse>
      {!collapseThread && <Divider />}
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
  taskId: PropTypes.any,
  handleAttachments: PropTypes.func,
  hasNextPage: PropTypes.bool,
  isCollapseEnabled: PropTypes.bool,
  onSave: PropTypes.func,
  onPaginate: PropTypes.func,
};

export default CommentPanel;
