import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Editor } from '@tinymce/tinymce-react';
import Editor from 'components/Common/Editor';
import {
  styled,
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { appColors } from 'theme/variables';
import CloseIcon from '@mui/icons-material/Close';
import _ from 'lodash';

const StyledButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  font-weight: 700;
  line-height: 1.71429;
  font-size: 0.875rem;
  text-transform: capitalize;
  min-width: 50px;
  padding: 6px 16px;
  border-radius: 8px;
  color: rgb(255, 255, 255);
  box-shadow: #f2207633 0px 8px 16px 0px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

function Notes({ open, data, onSave, onClose, isEditable }) {
  const [editorKey] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editorValue, setEditorValue] = useState(null);
  const [editorValueText, setEditorValueText] = useState(null);
  const [editorInitialValue, setEditorInitialValue] = useState(null);
  const [characterLimitsCounter, setCharacterLimitsCounter] = useState(0);
  // const editorRef = useRef(null);

  const CHARACTER_LIMIT = 1000;
  const isCharacterLimitsExceeded = characterLimitsCounter > CHARACTER_LIMIT;

  useEffect(() => {
    if (open) {
      setEditorInitialValue(data?.notes);
    } else {
      setIsEditing(false);
      setEditorValue(null);
      setEditorValueText(null);
      setEditorInitialValue(null);
      setCharacterLimitsCounter(0);
    }
  }, [open]);

  useEffect(() => {
    if (!_.isNull(editorValueText))
      setCharacterLimitsCounter(editorValueText.length);
  }, [editorValueText]);

  const handleOnClickSave = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditorInitialValue(editorValue);
      onSave({ id: data?.id, key: 'notes', value: editorValue });
    }
  };

  return (
    <Box sx={{ width: '600px', padding: 4, overflowX: 'hidden' }}>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        <CloseIcon sx={{ fontSize: '18px' }} />
      </IconButton>
      <Stack spacing={2}>
        <Stack spacing={0.3}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.8em' }}>
            Notes
          </Typography>
          <Stack flexDirection="row" sx={{ alignItems: 'center', height: 30 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                backgroundColor: appColors.green,
                borderRadius: 4,
                marginRight: 1,
              }}
            />
            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: 700, margin: 0 }}
            >
              {data?.task_name}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={0.5}>
          {isEditing ? (
            <Box sx={{ height: 300, width: '100%' }}>
              {/* <Editor
                key={editorKey}
                apiKey="pgc0maob7aff570ynl63iootu5qzruig3gsluq58e4ts7egn"
                init={{
                  resize: false,
                  height: '100%',
                  width: '100%',
                  menubar: false,
                  placeholder: 'Input your thoughts here!',
                  plugins: 'link image code fullscreen preview paste',
                  toolbar_location: 'top',
                  toolbar_mode: 'floating',
                  toolbar:
                    'undo redo | fontsize | select bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fullscreen preview media | forecolor backcolor emoticons | link | custom-linespacing',
                  branding: false,
                  link_quicklink: true,
                  content_style:
                    "@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600&display=swap'); body { font-family: Karla; line-height: 1.2;}",
                  link_default_target: '_blank',
                  forced_root_block: 'div',
                  relative_urls: false,
                  remove_script_host: false,
                  document_base_url: window.location.origin,
                }}
                onInit={(_, editor) => {
                  editorRef.current = editor;
                  setEditorValueText(editor.getContent({ format: 'text' }));
                  editor.on('Paste Change input Undo Redo', function () {
                    setEditorValue(editor.getContent());
                    setEditorValueText(editor.getContent({ format: 'text' }));
                  });
                }}
                initialValue={editorInitialValue}
              /> */}
              <Editor
                key={editorKey}
                initValue={editorInitialValue}
                onInit={(editor) => {
                  const div = document.createElement('div');
                  div.innerHTML = editor.getData();
                  const text = div.textContent || div.innerText || '';
                  setEditorValueText(text);
                }}
                onChange={(_, editor) => {
                  const div = document.createElement('div');
                  div.innerHTML = editor.getData();
                  const text = div.textContent || div.innerText || '';
                  setEditorValue(editor.getData());
                  setEditorValueText(text);
                }}
                height={260}
              />
            </Box>
          ) : (
            <Box
              className="ck-content"
              lineHeight="1.2"
              whiteSpace="pre-line"
              dangerouslySetInnerHTML={{
                __html:
                  editorValue ?? editorInitialValue ?? 'No notes available',
              }}
              sx={{ overflowWrap: 'break-word' }}
            />
          )}
          <Stack direction="row" justifyContent="space-between">
            {editorInitialValue && (
              <Typography
                variant="caption"
                sx={{ margin: 0, fontSize: '0.7em' }}
              >
                {data?.notes_last_edited}
              </Typography>
            )}
            {isEditing && (
              <Typography
                color={isCharacterLimitsExceeded ? 'error' : 'inherit'}
                variant="caption"
                sx={{
                  margin: 0,
                  fontSize: '0.8em',
                  // fontWeight: isCharacterLimitsExceeded ? 700 : 300,
                  fontWeight: 700,
                }}
              >
                {`${characterLimitsCounter}/${CHARACTER_LIMIT}`}
              </Typography>
            )}
          </Stack>
        </Stack>
        {isEditable && (
          <Stack
            direction="column"
            sx={{ alignItems: 'flex-end', paddingTop: 1 }}
          >
            <StyledButton
              color="secondary"
              variant="contained"
              disabled={isCharacterLimitsExceeded}
              sx={{ width: '90px' }}
              onClick={handleOnClickSave}
            >
              {isEditing ? 'Save' : 'Edit'}
            </StyledButton>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

Notes.propTypes = {
  open: PropTypes.any,
  data: PropTypes.any,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  isEditable: PropTypes.bool,
};

export default Notes;
