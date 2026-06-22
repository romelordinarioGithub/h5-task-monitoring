import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function MultiSelectPopover({
  options = [],
  value = [],
  onChange,
  onClose,
  searchPlaceholder,
  emptyText,
  isAllowAdd = false,
  onAdd,
  onSearch,
  isShowAddHelper = false,
}) {
  const [newItem, setNewItem] = useState('');
  const [filter, setFilter] = useState('');

  const matchOption = (term) => {
    const norm = String(term || '').trim().toLowerCase();
    if (!norm) return null;
    return (options || []).find((o) => {
      const val = String(o.value || '').toLowerCase();
      const id = String(o.id || '').toLowerCase();
      return val === norm || id === norm;
    });
  };

  const toggle = (id) => {
    const set = new Set(value || []);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange(Array.from(set));
  };

  const handleAdd = () => {
    const text = String(newItem || '').trim();
    if (!text) return;
    if (typeof onAdd === 'function') onAdd(text);
    setNewItem('');
    setFilter('');
    onClose();
  };

  return (
    <Box overflow="hidden" sx={{ minWidth: 280 }}>
      {!isAllowAdd && (
        <Box p={1} sx={{ borderBottom: '1px solid #ececec' }}>
          <TextField
            size="small"
            fullWidth
            placeholder={searchPlaceholder}
            value={filter}
            onChange={(e) => {
              const next = e.target.value;
              setFilter(next);
              if (typeof onSearch === 'function') onSearch(next);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const match = matchOption(filter);
                if (match) {
                  toggle(match.id);
                  onClose?.();
                }
              }
            }}
          />
        </Box>
      )}
      {isAllowAdd && (
        <Box p={1} sx={{ borderBottom: '1px solid #f2f2f2' }}>
          <Stack>
            <TextField
              size="small"
              fullWidth
              placeholder={searchPlaceholder}
              value={newItem}
              onChange={(e) => {
                const next = e.target.value;
                setNewItem(next);
                if (typeof onSearch === 'function') onSearch(next);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const match = matchOption(newItem);
                  if (match) {
                    toggle(match.id);
                    setNewItem('');
                    setFilter('');
                    onClose?.();
                    return;
                  }

                  handleAdd();
                }
              }}
            />

            {/* <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block' }}
            >
              Press enter for custom input
            </Typography> */}
          </Stack>
        </Box>
      )}
      {(() => {
        // When allow-add mode is on, reuse the input as the search term too
        const norm = (isAllowAdd ? newItem : filter).trim().toLowerCase();
        const visibleOptions = norm
          ? options.filter((o) =>
            String(o.value || o.id || '')
              .toLowerCase()
              .includes(norm)
          )
          : options;
        return visibleOptions.length === 0 ? (
          <Stack alignItems="center" p={2}>
            <Typography variant="body2" color="text.secondary">
              {emptyText || 'No results'}
            </Typography>
            {isShowAddHelper ? (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                Save custom input by pressing Enter
              </Typography>
            ) : null}
          </Stack>
        ) : (
          <Box maxHeight={270} overflow="auto">
            <List dense>
              {visibleOptions.map((o) => {
                const selected = (value || []).includes(o.id);
                return (
                  <ListItem
                    key={o.id}
                    disablePadding
                    secondaryAction={
                      selected ? <CheckIcon color="secondary" /> : null
                    }
                  >
                    <ListItemButton onClick={() => toggle(o.id)}>
                      <ListItemText primary={o.value || String(o.id)} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        );
      })()}
      {onClose && (
        <Box
          p={1}
          display="flex"
          justifyContent="flex-end"
          sx={{ borderTop: '1px solid #ececec' }}
        >
          <Button size="small" onClick={onClose} sx={{ fontWeight: 700 }}>
            Apply
          </Button>
        </Box>
      )}
    </Box>
  );
}

MultiSelectPopover.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ),
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  emptyText: PropTypes.string,
  isAllowAdd: PropTypes.bool,
  onAdd: PropTypes.func,
  onSearch: PropTypes.func,
  isShowAddHelper: PropTypes.bool,
};
