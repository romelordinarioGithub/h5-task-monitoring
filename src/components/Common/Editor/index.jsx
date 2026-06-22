import { useState, useEffect, useRef, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { apiUrl } from 'config';
import { getToken } from 'utils/session';
import PropTypes from 'prop-types';

import {
  ClassicEditor,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontSize,
  Highlight,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  LinkImage,
  Mention,
  Paragraph,
  Indent,
  IndentBlock,
  TextTransformation,
  Underline,
  Undo,
  SimpleUploadAdapter,
  Fullscreen,
} from 'ckeditor5';

// import FullScreen from './component/Fullscreen';
import ResizableHeight from './component/Resizable';
import { useSelector } from 'react-redux';

function Editor({
  key = 0,
  height = 150,
  // Prefer isDisabled to satisfy boolean-prop-naming; keep legacy 'disabled' support
  isDisabled = false,
  placeholder = '',
  initValue,
  maxChars,
  onChange,
  onInit,
  isCreateTask = false,
  isUserMentionEnable = false,
  isCharCountVisible = false,
}) {
  const {
    options: { usersList },
  } = useSelector((state) => state.tasks);
  const usersListRef = useRef([]);

  const editorContainerRef = useRef(null);
  const editorWrapperRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const fileRepoCleanupRef = useRef(null);
  // const [mentionFeeds, setMentionFeeds] = useState(usersList || []);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const stripHtml = (html) =>
    String(html || '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;|\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  useEffect(() => {
    setIsLayoutReady(true);

    return () => {
      setIsLayoutReady(false);
      editorInstanceRef.current = null;
      if (fileRepoCleanupRef.current) {
        fileRepoCleanupRef.current();
        fileRepoCleanupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    usersListRef.current = usersList || [];
  }, [usersList]);

  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (!editor) return;
    const next = `${initValue ?? ''}`;
    const current = editor.getData();
    if (current !== next) {
      editor.setData(next);
    }

    setCharCount(stripHtml(next).length);
  }, [initValue, isEditorReady]);

  const filterMentionFeeds = async (queryText) => {
    const currentUsers = usersListRef.current;

    if (currentUsers.length === 0 || !isUserMentionEnable) return [];

    const filteredUsers = currentUsers
      .map((user) => ({
        id: `@${user.id}`,
        text: `@${user.fullname}`,
        fullname: user.fullname,
        profile_picture: user.profile_picture,
        team_name: user.team_name,
        email: user.email,
      }))
      .filter((user) =>
        user.fullname.toLowerCase().includes(queryText.toLowerCase())
      )
      .slice(0, 10);

    return Promise.resolve(filteredUsers);
  };

  const editorConfig = {
    licenseKey: 'GPL',
    toolbar: {
      items: [
        !isCreateTask ? 'undo' : '',
        !isCreateTask ? 'redo' : '',
        !isCreateTask ? '|' : '',
        'fontSize',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'alignment',
        '|',
        'outdent',
        'indent',
        '|',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'link',
        'fullscreen',
      ],
      shouldNotGroupWhenFull: true,
    },
    plugins: [
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      Bold,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontSize,
      Fullscreen,
      Highlight,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      ImageInsert,
      Italic,
      Link,
      LinkImage,
      Mention,
      Paragraph,
      TextTransformation,
      Underline,
      Undo,
      Indent,
      IndentBlock,
      ResizableHeight,
      SimpleUploadAdapter,
    ],
    mention: {
      feeds: [
        {
          marker: '@',
          feed: filterMentionFeeds,
          minimumCharacters: 1,
          itemRenderer: (item) => {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'row';
            container.style.alignItems = 'center';
            container.style.gap = '8px';

            // Avatar container
            const avatar = document.createElement('div');
            avatar.style.width = '25px';
            avatar.style.height = '25px';
            avatar.style.borderRadius = '50%';
            avatar.style.flexShrink = '0';
            avatar.style.overflow = 'hidden';
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            avatar.style.backgroundColor = '#ccc';
            avatar.style.fontSize = '0.9em';
            avatar.style.fontWeight = 'bold';
            avatar.style.textTransform = 'uppercase';
            avatar.style.color = '#fff';

            // Function to render initials
            const renderInitials = () => {
              avatar.innerHTML = '';
              const initials = document.createTextNode(
                `${item.fullname?.toUpperCase().split(' ')[0]?.[0] || ''}${item.fullname?.toUpperCase().split(' ')[1]?.[0] || ''
                }`
              );
              avatar.appendChild(initials);
            };

            // Show image if valid
            if (
              item.profile_picture &&
              item.profile_picture.split('/').pop() !== 'thumb_' &&
              item.profile_picture.trim() !== ''
            ) {
              const img = document.createElement('img');
              img.src = item.profile_picture;
              img.alt = item.fullname?.toUpperCase() || '';
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.objectFit = 'cover';

              // If image fails, fallback to initials
              img.onerror = () => {
                renderInitials();
              };

              avatar.appendChild(img);
            } else {
              renderInitials();
            }

            // Name text
            const name = document.createElement('span');
            name.textContent = `${item.fullname} • ${item.email}` || '';
            name.style.overflow = 'hidden';
            name.style.textOverflow = 'ellipsis';
            name.style.display = '-webkit-box';
            name.style.webkitLineClamp = '1';
            name.style.webkitBoxOrient = 'vertical';
            name.style.whiteSpace = 'nowrap';

            container.appendChild(avatar);
            container.appendChild(name);

            return container;
          },
        },
      ],
    },
    fontSize: {
      options: [8, 10, 12, 14, 18, 24, 36],
      supportAllValues: true,
    },
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage',
      ],
    },
    initialData: `${initValue ?? ''}`,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        openInNewTab: {
          mode: 'manual',
          label: 'Open in a new tab',
          defaultValue: true, // This option will be selected by default.
          attributes: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        },
      },
    },
    simpleUpload: {
      uploadUrl: `${apiUrl}/admin/task-comment/upload`,

      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    },
    ResizableHeight: {
      resize: true,
      height: `${height}px`,
      minHeight: `${height}px`,
      maxHeight: '2500px',
    },
    placeholder: placeholder,
  };

  const createReaderStub = () => ({
    error: null,
    read: () => Promise.reject('aborted'),
    abort: () => {},
  });

  const ensureSafeLoaderDestroy = (loader) => {
    if (!loader || loader.__awPatchedDestroy) return;
    loader.__awPatchedDestroy = true;
    const originalDestroy =
      typeof loader._destroy === 'function' ? loader._destroy.bind(loader) : null;
    if (!originalDestroy) return;
    loader._destroy = (...args) => {
      const result = originalDestroy(...args);
      if (!loader._reader) {
        loader._reader = createReaderStub();
      }

      return result;
    };
  };

  const patchFileRepository = (editor) => {
    if (!editor || fileRepoCleanupRef.current) return;
    const repository = editor.plugins?.get?.('FileRepository');
    if (!repository) return;
    const { loaders } = repository;
    const cleanups = [];

    const hasItem =
      loaders && typeof loaders.has === 'function'
        ? (arg) => loaders.has(arg)
        : (arg) => {
          const collection = loaders?._items;
          return Array.isArray(collection) && collection.includes(arg);
        };

    if (loaders && typeof loaders.remove === 'function') {
      const originalRemove = loaders.remove.bind(loaders);
      loaders.remove = (arg) => {
        try {
          if (typeof arg !== 'number' && arg && !hasItem(arg)) {
            return arg;
          }

          return originalRemove(arg);
        } catch (err) {
          return undefined;
        }
      };

      cleanups.push(() => {
        loaders.remove = originalRemove;
      });
    }

    if (loaders && typeof loaders.forEach === 'function') {
      loaders.forEach((loader) => ensureSafeLoaderDestroy(loader));
    }

    if (loaders && typeof loaders.on === 'function') {
      const applyPatch = (_, { item }) => ensureSafeLoaderDestroy(item);
      loaders.on('add', applyPatch);
      cleanups.push(() => {
        loaders.off?.('add', applyPatch);
      });
    }

    if (typeof repository.createLoader === 'function') {
      const originalCreateLoader = repository.createLoader.bind(repository);
      repository.createLoader = (...args) => {
        const loader = originalCreateLoader(...args);
        ensureSafeLoaderDestroy(loader);
        return loader;
      };

      cleanups.push(() => {
        repository.createLoader = originalCreateLoader;
      });
    }

    if (cleanups.length === 0) return;

    fileRepoCleanupRef.current = () => {
      cleanups.forEach((fn) => fn());
      fileRepoCleanupRef.current = null;
    };
  };

  return (
    <Box key={key}>
      <Box className="main-container">
        <Box
          className="editor-container editor-container_classic-editor"
          ref={editorContainerRef}
        >
          <Box className="editor-container__editor">
            <Box ref={editorWrapperRef}>
              {isLayoutReady && (
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  onReady={(editor) => {
                    if (fileRepoCleanupRef.current) {
                      fileRepoCleanupRef.current();
                    }

                    editorInstanceRef.current = editor;
                    patchFileRepository(editor);
                    try {
                      setCharCount(stripHtml(editor.getData()).length);
                      if (maxChars) {
                        const viewDoc = editor.editing.view.document;
                        viewDoc.on('keydown', (evt, data) => {
                          const rawKey =
                            data.key ||
                            (data.domEvent && data.domEvent.key) ||
                            '';
                          const key = String(rawKey).toLowerCase();
                          const keyCode =
                            data.keyCode ??
                            (data.domEvent && data.domEvent.keyCode);
                          const allowed = new Set([
                            'backspace',
                            'delete',
                            'arrowleft',
                            'arrowright',
                            'arrowup',
                            'arrowdown',
                            'meta',
                            'control',
                            'alt',
                            'shift',
                            'tab',
                            'escape',
                            'enter',
                          ]);
                          const current = stripHtml(editor.getData()).length;
                          const isAllowed =
                            allowed.has(key) || keyCode === 8 || keyCode === 46;
                          if (current >= maxChars && !isAllowed) {
                            if (typeof data.preventDefault === 'function') {
                              data.preventDefault();
                            } else if (
                              data.domEvent &&
                              typeof data.domEvent.preventDefault === 'function'
                            ) {
                              data.domEvent.preventDefault();
                            }

                            evt.stop();
                          }
                        });
                        viewDoc.on('clipboardInput', (evt, data) => {
                          const current = stripHtml(editor.getData()).length;
                          const dt = data.dataTransfer;
                          const incoming =
                            (dt && dt.getData('text/plain')) || '';
                          const remaining = Math.max(0, maxChars - current);
                          if (remaining <= 0) {
                            if (typeof data.preventDefault === 'function') {
                              data.preventDefault();
                            } else if (
                              data.domEvent &&
                              typeof data.domEvent.preventDefault === 'function'
                            ) {
                              data.domEvent.preventDefault();
                            }

                            evt.stop();
                            return;
                          }

                          if (incoming && incoming.length > remaining) {
                            if (typeof data.preventDefault === 'function') {
                              data.preventDefault();
                            } else if (
                              data.domEvent &&
                              typeof data.domEvent.preventDefault === 'function'
                            ) {
                              data.domEvent.preventDefault();
                            }

                            evt.stop();
                            const insert = incoming.slice(0, remaining);
                            editor.model.change((writer) => {
                              editor.model.insertContent(
                                writer.createText(insert)
                              );
                            });
                          }
                        });
                      }
                    } catch (e) {
                      // no-op
                    }

                    if (typeof onInit === 'function') onInit(editor);
                  }}
                  onChange={(evt, editor) => {
                    const data = editor.getData();
                    setCharCount(stripHtml(data).length);
                    if (typeof onChange === 'function') onChange(evt, editor);
                  }}
                  disabled={isDisabled}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {isCharCountVisible && maxChars ? (
        <Box mt={0.5} display="flex" justifyContent="flex-end">
          <Typography
            variant="caption"
            color={charCount > maxChars * 0.98 ? 'error' : 'text.secondary'}
          >
            {charCount} / {maxChars}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
}

Editor.propTypes = {
  key: PropTypes.number,
  height: PropTypes.number,
  placeholder: PropTypes.string,
  initValue: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onInit: PropTypes.func,
  users: PropTypes.array,
  maxChars: PropTypes.number,
  isDisabled: PropTypes.bool,
  isCreateTask: PropTypes.bool,
  isUserMentionEnable: PropTypes.bool,
  isCharCountVisible: PropTypes.bool,
};

export default memo(Editor);
