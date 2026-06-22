import { Fragment, useContext } from 'react';
import { useSelector } from 'react-redux';
// Context
import TicketContext from 'pages/Ticket/Context';
import { Stack, Box, styled, Chip } from '@mui/material';
import moment from 'moment';
// local component
import CommentPanel from 'pages/Ticket/Components/CommentPanel';
import _ from 'lodash';

const StyledBox = styled(Box)({
  fontSize: '0.8em',
  border: '1px solid #000',
  borderStyle: 'dashed',
  borderRadius: '.8em',
  padding: '0em 1em',
  fontWeight: 600,
  transition: '0.3s',
  cursor: 'pointer',
  ':hover': {
    border: '1px solid #25165b',
    borderStyle: 'dashed',
    backgroundColor: '#eeeeee',
  },
});

export default function Update() {
  const {
    handleOnSaveThread,
    handleAttachments,
    handleOnPaginate,
    threads,
    handleOpen,
  } = useContext(TicketContext);
  // Redux State
  const {
    overview: { task_type },
    //threads,
  } = useSelector((state) => state.tasks);

  const {
    ticket: { id, first_reply, task, partner, date_completed, tag },
    options,
  } = useSelector((state) => state.ticket);

  const { data: userData } = useSelector((state) => state.user);

  return (
    <Stack>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ paddingX: '0.5em' }}
        >
          <Stack direction="row" spacing={1}>
            <StyledBox variant="outline">Partner: {partner}</StyledBox>
            <StyledBox variant="outline">Task: {task}</StyledBox>
            {/* <StyledButton variant="outline">
              Ticket Age: {moment(created_at).fromNow()}
            </StyledButton> */}
            <StyledBox variant="outline">
              First Response Time:{' '}
              {first_reply ? moment(first_reply).fromNow() : 'N/A'}
            </StyledBox>
            <StyledBox variant="outline">
              Time To Complete: {date_completed ? date_completed : 'Not Set'}
            </StyledBox>
            <StyledBox
              onClick={(e) =>
                handleOpen(e, 'left', 'tag', options.tagsList, tag, 'ticket')
              }
            >
              Tags:{' '}
              {!_.isEmpty(tag) ? (
                <Fragment>
                  {tag.map(
                    (tag, index) =>
                      index < 3 && (
                        <Chip
                          key={index}
                          label={tag.title}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{
                            height: '20px',
                            fontSize: 10,
                            cursor: 'pointer',
                            marginRight: '1px',
                            fontWeight: 'normal',
                            maxWidth: '7em',
                          }}
                        />
                      )
                  )}
                  {_.size(tag) > 3 && (
                    <Chip
                      label={`+${_.size(tag) - 3}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{
                        height: '20px',
                        fontSize: 10,
                        cursor: 'pointer',
                      }}
                    />
                  )}
                </Fragment>
              ) : (
                'N/A'
              )}
            </StyledBox>
          </Stack>
        </Stack>
      </Box>
      {!_.isEmpty(threads) ? (
        <CommentPanel
          user={userData}
          ticketId={id}
          section={task_type}
          comment={threads?.data ?? []}
          commentRelType={'ticket'}
          handleAttachments={handleAttachments}
          isCollapseEnabled={true}
          hasNextPage={
            !_.isNull(threads?.next_page_url) && !_.isEmpty(threads?.data ?? [])
          }
          onSave={(relId, relType, comment, id, attachments) =>
            handleOnSaveThread(
              relId,
              relType,
              comment,
              id,
              attachments,
              'parent_task'
            )
          }
          onPaginate={() => handleOnPaginate('parent_task')}
        />
      ) : null}
    </Stack>
  );
}
