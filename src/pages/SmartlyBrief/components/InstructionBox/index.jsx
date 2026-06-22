import React, { memo, useState } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

function InstructionBox({ setText, title, text }) {
  const [editorKey] = useState(1);

  const onEditorChange = function (a, editor) {
    setText(editor.getContent());
  };

  return (
    <Card style={{ padding: '2em' }}>
      <Stack spacing={2}>
        <Box p={1}>
          <Typography
            style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <Editor
            init={{
              height: 300,
              width: '100%',
              menubar: false,
              placeholder: 'Write a comment...',
              plugins: 'link image code fullscreen preview',
              toolbar_location: 'top',
              toolbar_mode: 'floating',
              toolbar:
                'undo redo | fontsize | select bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | fullscreen preview media | forecolor backcolor emoticons | link',
              branding: false,
              content_style:
                "@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600&display=swap'); body { font-family: Karla; line-height: 1.2 }",
              link_default_target: '_blank',
              relative_urls: false,
              remove_script_host: false,
              document_base_url: window.location.origin,
            }}
            onEditorChange={onEditorChange}
            value={text}
            // onInit={(evt, editor) => {
            //   editorRef.current = editor;
            //   editor.on('Paste Change input Undo Redo', function () {
            //     setText(editor.getContent());
            //   });
            // }}
            key={editorKey}
            apiKey="pgc0maob7aff570ynl63iootu5qzruig3gsluq58e4ts7egn"
          />
        </Box>
      </Stack>
    </Card>
  );
}

export default memo(InstructionBox);

InstructionBox.propTypes = {
  setText: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
};
