/* eslint-disable padding-line-between-statements */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Editor from 'components/Common/Editor';
import DateTimerPicker from 'pages/Task/Components/DateTimePicker';
import Popup from 'pages/Task/Components/Popup';
import MultiSelectPopover from './MultiSelectPopover';
import api from 'utils/api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Switch from '@mui/material/Switch';
import metaIcon from 'assets/smartly/icons/meta.svg';
import tiktokIcon from 'assets/smartly/icons/tiktok.svg';
import youtubeIcon from 'assets/smartly/icons/youtube.svg';
import googleIcon from 'assets/smartly/icons/google.svg';
import pinterestIcon from 'assets/smartly/icons/pinterest.svg';
import snapchatIcon from 'assets/smartly/icons/snapchat.svg';
import googleAdsIcon from 'assets/smartly/icons/google_ads.svg';
import amazonIcon from 'assets/smartly/icons/amazon.svg';
import yahooIcon from 'assets/smartly/icons/yahoo.svg';
import tradeDeskIcon from 'assets/smartly/icons/trade_desk.svg';

dayjs.extend(customParseFormat);

const OptionButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
  width: '100%',
  textAlign: 'left',
  border: `2px solid ${selected
    ? theme.palette.primary.main
    : alpha(theme.palette.primary.main, 0.4)
    }`,
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.1)
    : alpha(theme.palette.primary.main, 0.04),
  color: theme.palette.text.primary,
  padding: '10px 14px',
  minHeight: 52,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  transition:
    'background-color .15s ease, border-color .15s ease, box-shadow .15s ease',
  outline: 'none',
  font: 'inherit',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: selected
      ? alpha(theme.palette.primary.main, 0.14)
      : alpha(theme.palette.primary.main, 0.08),
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.08)} inset`,
  },
}));

const Letter = styled('span', {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
  width: 28,
  height: 28,
  borderRadius: 6,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 14,
  border: `2px solid ${selected
    ? theme.palette.primary.main
    : alpha(theme.palette.primary.main, 0.4)
    }`,
  color: selected
    ? theme.palette.primary.contrastText
    : theme.palette.primary.main,
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  flexShrink: 0,
}));

// Removed alphabetical index badges for options

const extractMultiSelectValues = (val) => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object' && Array.isArray(val.selections)) {
    return val.selections;
  }
  return [];
};

const extractFlags = (val) => {
  if (!val || Array.isArray(val) || typeof val !== 'object') return {};
  const raw = val.flags;
  if (Array.isArray(raw)) {
    return Object.fromEntries(raw.map((key) => [String(key), true]));
  }
  if (raw && typeof raw === 'object') {
    return Object.fromEntries(
      Object.entries(raw).map(([key, flagVal]) => [String(key), Boolean(flagVal)])
    );
  }
  return {};
};

const extractTextValue = (val) => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const textLike = val.text ?? val.value;
    return textLike != null ? String(textLike) : '';
  }
  return val != null ? String(val) : '';
};

const shapeOptionSelection = (opt) => {
  if (!opt || typeof opt !== 'object') return opt;
  return {
    ...opt,
    id: String(opt.id ?? opt.value ?? ''),
    value: String(opt.value ?? opt.id ?? ''),
  };
};

const normalizeStructuredMultiTextRows = (val, rowFields) => {
  if (!Array.isArray(rowFields) || rowFields.length === 0) return [];

  return (Array.isArray(val) ? val : []).map((item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return Object.fromEntries(
        rowFields.map((rowField) => [
          rowField.key,
          String(item?.[rowField.key] ?? ''),
        ])
      );
    }

    const stringValue = String(item ?? '');
    return Object.fromEntries(
      rowFields.map((rowField, index) => [
        rowField.key,
        rowField.key === 'link' || index === rowFields.length - 1
          ? stringValue
          : '',
      ])
    );
  });
};

export default function Field({
  field,
  value,
  onChange,
  onBulkChange,
  error,
  isRequired,
  onTouch,
  answers,
}) {
  const { id, type, label, options, description } = field;
  const flagFieldId = field?.toggleFieldId;
  const flagLabel = field?.toggleLabel;
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateOnlyTemp, setDateOnlyTemp] = useState(null);
  const [otherActive, setOtherActive] = useState(false);
  const [customText, setCustomText] = useState('');
  const [dateFlagChecked, setDateFlagChecked] = useState(
    Boolean(flagFieldId && answers?.[flagFieldId])
  );
  const isWatcherMultiSelect =
    type === 'multi_select_popup' && String(id) === 'watchers';
  const [watcherSearch, setWatcherSearch] = useState('');
  const [watcherOptions, setWatcherOptions] = useState([]);
  const [watcherLoading, setWatcherLoading] = useState(false);
  const watcherRequestIdRef = useRef(0);
  const allowCustom =
    (type === 'single_select' || type === 'multi_select') &&
    Boolean(field?.allowCustom);
  const isCompact = Boolean(field?.isCompact);
  const compactColumns = (() => {
    if (
      typeof field?.isCompact === 'object' &&
      Number.isFinite(Number(field?.isCompact?.columns))
    ) {
      const specified = Number(field.isCompact.columns);
      return specified > 0 ? specified : 3;
    }
    return 3;
  })();

  // Shared helpers for custom multi-select (computed regardless of branch; cheap)
  // suggestions removed – no global storage key
  const optionValueSet = new Set(
    (options || []).map((o) => String(o.value ?? o.id))
  );
  const optionIdSet = new Set((options || []).map((o) => String(o.id)));

  // Seed custom input from existing custom values (no suggestions)
  useEffect(() => {
    if (type !== 'multi_select') return;

    const existingCustom = extractMultiSelectValues(value)
      .filter((v) => {
        if (typeof v === 'object') {
          const id = String(v.id ?? '');
          const val = String(v.value ?? id);
          return !optionIdSet.has(id) && !optionValueSet.has(val);
        }
        const s = String(v);
        return !optionIdSet.has(s) && !optionValueSet.has(s);
      })
      .map((v) =>
        typeof v === 'object' ? String(v.value ?? v.id) : String(v)
      );
    if (existingCustom.length > 0) {
      setCustomText(existingCustom.join(', ') + ', ');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, options, value]);

  // Keep checkbox state in sync if sibling value changes externally
  useEffect(() => {
    if (flagFieldId) {
      setDateFlagChecked(Boolean(answers?.[flagFieldId]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, flagFieldId]);

  // Ensure date toggle flag defaults to false in answers when enabled
  useEffect(() => {
    if (
      (type === 'date' || type === 'date_time') &&
      flagFieldId &&
      answers?.[flagFieldId] === undefined
    ) {
      onChange(flagFieldId, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, flagFieldId, answers?.[flagFieldId]]);

  useEffect(() => {
    if (!isWatcherMultiSelect) return undefined;
    const term = String(watcherSearch || '').trim();
    if (!term) {
      setWatcherOptions([]);
      setWatcherLoading(false);
      return undefined;
    }
    const requestId = ++watcherRequestIdRef.current;
    const timer = setTimeout(() => {
      (async () => {
        setWatcherLoading(true);
        const res = await api.callGet('admin/user/user-emails', {
          search: term,
        });
        if (watcherRequestIdRef.current !== requestId) return;
        if (res?.success && Array.isArray(res?.data?.data)) {
          const mapped = res.data.data
            .map((u) => {
              const uid = u?.id ?? u?._id ?? u?.user_id;
              const email = u?.email ?? u?.value ?? u?.name;
              if (!uid || !email) return null;
              return { id: String(uid), value: String(email) };
            })
            .filter(Boolean);
          setWatcherOptions(mapped);
        } else {
          setWatcherOptions([]);
        }
        setWatcherLoading(false);
      })();
    }, 350);
    return () => clearTimeout(timer);
  }, [isWatcherMultiSelect, watcherSearch]);

  const iconFor = (name) => {
    const key = String(name || '').toLowerCase();
    switch (key) {
      case 'meta':
        return (
          <Box
            component="img"
            src={metaIcon}
            alt="meta"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'tiktok':
        return (
          <Box
            component="img"
            src={tiktokIcon}
            alt="tiktok"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'youtube':
        return (
          <Box
            component="img"
            src={youtubeIcon}
            alt="youtube"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'google':
        return (
          <Box
            component="img"
            src={googleIcon}
            alt="google"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'pinterest':
        return (
          <Box
            component="img"
            src={pinterestIcon}
            alt="pinterest"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'snapchat':
        return (
          <Box
            component="img"
            src={snapchatIcon}
            alt="snapchat"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'google_ads':
        return (
          <Box
            component="img"
            src={googleAdsIcon}
            alt="google_ads"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'amazon':
        return (
          <Box
            component="img"
            src={amazonIcon}
            alt="amazon"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'yahoo':
        return (
          <Box
            component="img"
            src={yahooIcon}
            alt="yahoo"
            sx={{ width: 22, height: 22 }}
          />
        );
      case 'trade_desk':
        return (
          <Box
            component="img"
            src={tradeDeskIcon}
            alt="trade_desk"
            sx={{ width: 22, height: 22 }}
          />
        );
      default:
        return null;
    }
  };

  const renderHeader = () => (
    <>
      {label ? (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {iconFor(field.startIcon)}
          <Typography sx={{ fontSize: '1rem', fontWeight: 600 }}>
            {label}
            {isRequired ? '*' : ''}
          </Typography>
          {field.infoTooltip ? (
            <Tooltip
              title={field.infoTooltip}
              arrow
              componentsProps={{
                tooltip: { sx: { lineHeight: 1.2, maxWidth: 360, fontSize: 13 } },
              }}
            >
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: 'text.secondary' }}
              />
            </Tooltip>
          ) : null}
        </Stack>
      ) : null}
      {description ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, mt: label ? 0.5 : 0 }}
        >
          {description}
        </Typography>
      ) : null}
    </>
  );

  // Helpers for option rendering and selection
  const optionText = (opt) => String(opt?.value ?? opt?.id ?? '');
  const isSelectedObj = (sel, opt) => {
    if (!sel || !opt) return false;
    if (typeof sel === 'object') return String(sel.id) === String(opt.id);
    if (typeof sel === 'string')
      return sel === (opt.value ?? opt.id) || sel === String(opt.id);
    return false;
  };
  // toggleSelectObj is declared inside multi_select to access isCustomActive

  if (type === 'alert') {
    return (
      <Box sx={{ mb: 3 }}>
        <Alert severity={field.severity || 'info'} sx={{ width: '100%' }}>
          {field.alertText ||
            field.description ||
            ""}
        </Alert>
      </Box>
    );
  }

  if (type === 'long_text') {
    const validators = Array.isArray(field.validators) ? field.validators : [];
    const validatorMax = (() => {
      const rule = validators.find((v) =>
        String(v).toLowerCase().startsWith('maxchars')
      );
      if (!rule) return null;
      const parts = String(rule).split(':');
      if (parts.length === 2) {
        const n = Number(parts[1]);
        return Number.isFinite(n) && n > 0 ? n : null;
      }
      return null;
    })();
    const effMaxChars = validatorMax || Number(field.maxChars || 0) || null;
    const checkboxOptions = Array.isArray(field?.checkboxes)
      ? field.checkboxes
      : [];
    const hasCheckboxes = checkboxOptions.length > 0;
    const checkboxIdSet = new Set(
      checkboxOptions.map((opt) => String(opt.id))
    );
    const checkboxState = hasCheckboxes
      ? Object.fromEntries(
        Object.entries(extractFlags(value)).filter(
          ([key, val]) => checkboxIdSet.has(String(key)) && Boolean(val)
        )
      )
      : {};
    const textValue = extractTextValue(value);

    const commitRichText = (nextText, nextFlags = checkboxState) => {
      if (hasCheckboxes) {
        onChange(id, {
          text: nextText,
          flags: nextFlags,
        });
      } else {
        onChange(id, nextText);
      }
    };

    const onCheckboxToggle = (checkboxId, checked) => {
      if (!hasCheckboxes) return;
      const normalizedId = String(checkboxId);
      const nextFlags = { ...checkboxState };
      if (checked) nextFlags[normalizedId] = true;
      else delete nextFlags[normalizedId];
      commitRichText(textValue, nextFlags);
      onTouch?.(id);
    };

    return (
      <Box sx={{ mb: 3 }}>
        {renderHeader()}
        <Box sx={{ mt: 1 }}>
          <Editor
            initValue={textValue || ''}
            placeholder={field.placeholder || 'Type your answer here...'}
            maxChars={effMaxChars || undefined}
            isCharCountVisible={true}
            onChange={(_, editor) => {
              commitRichText(editor.getData());
              onTouch?.(id);
            }}
          />
          {hasCheckboxes ? (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {checkboxOptions.map((cb) => {
                const cbId = String(cb.id);
                const tooltip =
                  cb.tooltip ||
                  (cbId === 'needs_iterations'
                    ? 'Variation could include the adjustment of existing fixed elements, adding animation to existing elements, updating text layouts, adjusting template for new background imagery, etc.'
                    : null);
                const labelNode = tooltip ? (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <span>{cb.label || cbId}</span>
                    <Tooltip
                      title={tooltip}
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: { lineHeight: 1.2, maxWidth: 420, fontSize: 11 },
                        },
                      }}
                    >
                      <InfoOutlinedIcon
                        fontSize="small"
                        sx={{ color: 'text.secondary' }}
                      />
                    </Tooltip>
                  </Stack>
                ) : (
                  cb.label || cbId
                );
                return (
                  <FormControlLabel
                    key={cbId}
                    control={
                      <Checkbox
                        size="small"
                        checked={Boolean(checkboxState[cbId])}
                        onChange={(e) => onCheckboxToggle(cbId, e.target.checked)}
                      />
                    }
                    label={labelNode}
                  />
                );
              })}
            </Stack>
          ) : null}
          {error && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.75, display: 'block' }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  if (type === 'multi_select_popup') {
    const rawArr = Array.isArray(value) ? value : [];
    const normalizeWatcherItem = (item) => {
      if (item === undefined || item === null) return null;
      if (typeof item === 'object') {
        const id =
          item.id ??
          item.user_id ??
          item.watcher_id ??
          item.value ??
          item.email;
        if (!id) return null;
        const label =
          item.value ??
          item.email ??
          item.name ??
          item.label ??
          id;
        return { id: String(id), value: String(label) };
      }
      const str = String(item);
      if (!str) return null;
      return { id: str, value: str };
    };
    const arr = isWatcherMultiSelect
      ? rawArr.map(normalizeWatcherItem).filter(Boolean)
      : rawArr;
    const openPicker = (e) => setAnchorEl(e.currentTarget);
    const closePicker = () => {
      setAnchorEl(null);
      if (isWatcherMultiSelect) setWatcherSearch('');
    };
    const baseOptions = options || [];
    const popupOptions = (() => {
      if (!isWatcherMultiSelect) return baseOptions;
      if (watcherSearch.trim()) return watcherOptions;
      const merged = new Map();
      baseOptions.forEach((o) => {
        if (!o) return;
        const key = String(o.id ?? '');
        if (!key) return;
        merged.set(key, { id: String(o.id), value: String(o.value ?? o.id) });
      });
      arr.forEach((item) => {
        if (!item || typeof item !== 'object') return;
        const key = String(item.id ?? '');
        if (!key || merged.has(key)) return;
        merged.set(key, {
          id: key,
          value: String(item.value ?? item.id ?? key),
        });
      });
      return Array.from(merged.values());
    })();

    const labelMap = new Map(
      (popupOptions || []).flatMap((o) => {
        const lbl = o.value ?? String(o.id);
        const list = [[String(o.id), lbl]];
        if (o.value) list.push([String(o.value), lbl]);
        return list;
      })
    );
    arr.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const itemId = String(item.id ?? '');
      const itemValue = String(item.value ?? item.id ?? '');
      if (itemId && !labelMap.has(itemId)) {
        labelMap.set(itemId, itemValue);
      }
    });
    const summary = arr
      .map((v) => {
        const vid = typeof v === 'object' ? v.id : v;
        const lbl = typeof v === 'object' ? v.value : v;
        return labelMap.get(vid) || lbl;
      })
      // .slice(0, 3)
      .join(', ');
    const more = arr.length > 10 ? ` +${arr.length - 10}` : '';

    return (
      <Box sx={{ mb: 3 }}>
        {renderHeader()}
        <Box sx={{ mt: 1 }}>
          <OptionButton
            type="button"
            onClick={openPicker}
            selected={arr.length > 0}
            aria-haspopup="dialog"
          >
            <Typography sx={{ flex: 1 }}>
              {arr.length > 0
                // ? `${summary}${more}`
                ? `${summary}`
                : field.placeholder || 'Select options'}
            </Typography>
          </OptionButton>
          <Popup
            anchorEl={anchorEl}
            handleClose={closePicker}
            horizontal="left"
            content={
              <MultiSelectPopover
                options={popupOptions}
                value={arr.map((v) => (typeof v === 'object' ? v.id : v))}
                onChange={(next) => {
                  const map = new Map(
                    (popupOptions || []).map((o) => [
                      String(o.id),
                      shapeOptionSelection(o),
                    ])
                  );
                  arr.forEach((item) => {
                    if (!item || typeof item !== 'object') return;
                    const itemId = String(item.id ?? '');
                    if (!itemId || map.has(itemId)) return;
                    map.set(itemId, shapeOptionSelection(item));
                  });
                  const objs = (next || []).map((nid) => {
                    const key = String(nid);
                    return (
                      map.get(key) || {
                        id: key,
                        value: key,
                      }
                    );
                  });
                  onChange(id, objs);
                  onTouch?.(id);
                }}
                onClose={closePicker}
                searchPlaceholder={field.popupInputPlaceholder || 'Search'}
                emptyText={
                  watcherLoading ? 'Searching...' : field.emptyText || 'No results'
                }
                onSearch={
                  isWatcherMultiSelect ? setWatcherSearch : undefined
                }
                isShowAddHelper={Boolean(field?.showAddHelper)}
              />
            }
          />
          {error && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.75, display: 'block' }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  if (type === 'single_select_popup') {
    const sel = (() => {
      if (value === undefined || value === null) return null;
      if (typeof value === 'object') {
        const rawId =
          value.id ??
          value.value ??
          value.label ??
          value.name;
        const rawValue =
          value.value ??
          value.label ??
          value.name ??
          value.id;
        if (rawId === undefined && rawValue === undefined) return null;
        const id = rawId !== undefined && rawId !== null
          ? String(rawId)
          : String(rawValue ?? '');
        const display =
          rawValue !== undefined && rawValue !== null
            ? String(rawValue)
            : id;
        if (!id) return null;
        return { id, value: display };
      }
      const str = String(value);
      if (!str) return null;
      return { id: str, value: str };
    })();
    const openPicker = (e) => setAnchorEl(e.currentTarget);
    const closePicker = () => setAnchorEl(null);

    const labelMap = new Map(
      (options || []).flatMap((o) => {
        const lbl = o.value ?? String(o.id);
        const list = [[String(o.id), lbl]];
        if (o.value) list.push([String(o.value), lbl]);
        return list;
      })
    );
    const summary = sel
      ? labelMap.get(String(sel.id)) || sel.value || sel.id
      : '';

    return (
      <Box sx={{ mb: 3 }}>
        {renderHeader()}
        <Box sx={{ mt: 1 }}>
          <OptionButton
            type="button"
            onClick={openPicker}
            selected={Boolean(sel)}
            aria-haspopup="dialog"
          >
            <Typography sx={{ flex: 1 }}>
              {sel ? summary : field.placeholder || 'Select option'}
            </Typography>
          </OptionButton>
          <Popup
            anchorEl={anchorEl}
            handleClose={closePicker}
            horizontal="left"
            content={
              <MultiSelectPopover
                options={options || []}
                value={sel ? [String(sel.id)] : []}
                onChange={(next) => {
                  const prev = sel ? [String(sel.id)] : [];
                  const setPrev = new Set(prev);
                  // find the id that was added (if any)
                  const added = (next || []).find(
                    (id) => !setPrev.has(String(id))
                  );
                  const chosenId =
                    added || (next && next.length === 0 ? undefined : prev[0]);
                  if (!chosenId) {
                    onChange(id, null);
                    onTouch?.(id);
                    return;
                  }
                  const map = new Map(
                    (options || []).map((o) => [
                      String(o.id),
                      shapeOptionSelection(o),
                    ])
                  );
                  const obj =
                    map.get(String(chosenId)) || {
                      id: String(chosenId),
                      value: String(chosenId),
                    };
                  onChange(id, obj);
                  onTouch?.(id);
                  closePicker();
                }}
                isAllowAdd={Boolean(field?.allowCustom)}
                onAdd={(text) => {
                  const t = String(text || '').trim();
                  if (!t) return;
                  const obj = { id: 'custom', value: t };
                  onChange(id, obj);
                  onTouch?.(id);
                }}
                onClose={closePicker}
                searchPlaceholder={field.popupInputPlaceholder || 'Search'}
                emptyText={field.emptyText}
                isShowAddHelper={Boolean(field?.showAddHelper)}
              />
            }
          />
          {error && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.75, display: 'block' }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  if (type === 'text' || type === 'text_only') {
    const validators = Array.isArray(field.validators) ? field.validators : [];
    const validatorMax = (() => {
      const rule = validators.find((v) =>
        String(v).toLowerCase().startsWith('maxchars')
      );
      if (!rule) return null;
      const parts = String(rule).split(':');
      if (parts.length === 2) {
        const n = Number(parts[1]);
        return Number.isFinite(n) && n > 0 ? n : null;
      }
      return null;
    })();
    const maxChars = validatorMax || Number(field.maxChars || 0) || null;
    const checkboxOptions = Array.isArray(field?.checkboxes)
      ? field.checkboxes
      : [];
    const hasCheckboxes = checkboxOptions.length > 0;
    const checkboxIdSet = new Set(
      checkboxOptions.map((opt) => String(opt.id))
    );
    const checkboxState = hasCheckboxes
      ? Object.fromEntries(
        Object.entries(extractFlags(value)).filter(
          ([key, val]) => checkboxIdSet.has(String(key)) && Boolean(val)
        )
      )
      : {};
    const textValue = extractTextValue(value);
    const currentLength = textValue.length;

    const commitValue = (nextText, nextFlags = checkboxState) => {
      if (hasCheckboxes) {
        onChange(id, {
          text: nextText,
          flags: nextFlags,
        });
      } else {
        onChange(id, nextText);
      }
    };

    const onCheckboxToggle = (checkboxId, checked) => {
      if (!hasCheckboxes) return;
      const normalizedId = String(checkboxId);
      const nextFlags = { ...checkboxState };
      if (checked) {
        nextFlags[normalizedId] = true;
      } else {
        delete nextFlags[normalizedId];
      }
      commitValue(textValue, nextFlags);
      onTouch?.(id);
    };

    return (
      <Box sx={{ mb: 3 }}>
        {renderHeader()}
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            value={textValue}
            error={Boolean(error)}
            helperText={error || ''}
            onBlur={() => onTouch?.(id)}
            placeholder={field.placeholder || 'Type your answer here...'}
            inputProps={maxChars ? { maxLength: maxChars } : undefined}
            onChange={(e) => {
              const next = e.target.value || '';
              if (maxChars && next.length > maxChars) {
                commitValue(next.slice(0, maxChars));
              } else {
                commitValue(next);
              }
            }}
          />
          {maxChars ? (
            <Box mt={0.5} display="flex" justifyContent="flex-end">
              <Typography
                variant="caption"
                color={
                  currentLength > maxChars * 0.98 ? 'error' : 'text.secondary'
                }
              >
                {currentLength} / {maxChars}
              </Typography>
            </Box>
          ) : null}
          {hasCheckboxes ? (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {checkboxOptions.map((cb) => {
                const cbId = String(cb.id);
                const tooltip =
                  cb.tooltip ||
                  (cbId === 'needs_iterations'
                    ? 'Variation could include the adjustment of existing fixed elements, adding animation to existing elements, updating text layouts, adjusting template for new background imagery, etc.'
                    : null);
                const labelNode = tooltip ? (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <span>{cb.label || cbId}</span>
                    <Tooltip title={tooltip} arrow>
                      <InfoOutlinedIcon
                        fontSize="small"
                        sx={{ color: 'text.secondary' }}
                      />
                    </Tooltip>
                  </Stack>
                ) : (
                  cb.label || cbId
                );
                return (
                  <FormControlLabel
                    key={cbId}
                    control={
                      <Checkbox
                        size="small"
                        checked={Boolean(checkboxState[cbId])}
                        onChange={(e) =>
                          onCheckboxToggle(cbId, e.target.checked)
                        }
                      />
                    }
                    label={labelNode}
                  />
                );
              })}
            </Stack>
          ) : null}
        </Box>
      </Box>
    );
  }

  if (type === 'title') {
    return (
      <Box sx={{ mb: 3 }}>
        {label ? (
          <Typography sx={{ fontSize: '1.15rem', fontWeight: 700 }}>
            {label}
          </Typography>
        ) : null}
        {description ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: label ? 0.5 : 0 }}
          >
            {description}
          </Typography>
        ) : null}
      </Box>
    );
  }

  if (type === 'multi_text') {
    const validators = Array.isArray(field.validators) ? field.validators : [];
    const validatorMax = (() => {
      const rule = validators.find((v) =>
        String(v).toLowerCase().startsWith('maxchars')
      );
      if (!rule) return null;
      const parts = String(rule).split(':');
      if (parts.length === 2) {
        const n = Number(parts[1]);
        return Number.isFinite(n) && n > 0 ? n : null;
      }
      return null;
    })();
    const maxChars = validatorMax || Number(field.maxChars || 0) || null;
    const rowFields = Array.isArray(field.rowFields)
      ? field.rowFields.filter((rowField) => rowField?.key)
      : [];
    const isStructuredRows = rowFields.length > 0;
    const emptyStructuredRow = () =>
      Object.fromEntries(
        rowFields.map((rowField) => [rowField.key, ''])
      );
    const arr = isStructuredRows
      ? normalizeStructuredMultiTextRows(value, rowFields)
      : Array.isArray(value)
        ? value
        : value
          ? [String(value)]
          : [];
    const renderRows = arr.length === 0
      ? [isStructuredRows ? emptyStructuredRow() : '']
      : arr;
    const normalizeStructuredRows = (rows) =>
      rows
        .map((row) =>
          Object.fromEntries(
            rowFields.map((rowField) => [
              rowField.key,
              String(row?.[rowField.key] ?? ''),
            ])
          )
        )
        .filter((row) =>
          rowFields.some((rowField) => String(row[rowField.key] || '').trim())
        );

    const updateAt = (idx, nextVal) => {
      if (isStructuredRows) return;
      const next = [...arr];
      next[idx] = nextVal;
      onChange(id, next);
    };

    const updateStructuredAt = (idx, key, nextVal) => {
      if (!isStructuredRows) return;
      const next = [...renderRows];
      next[idx] = {
        ...(next[idx] || emptyStructuredRow()),
        [key]: nextVal,
      };
      onChange(id, normalizeStructuredRows(next));
    };

    const addItem = () => {
      const next = [...arr, isStructuredRows ? emptyStructuredRow() : ''];
      onChange(id, next);
      onTouch?.(id);
    };

    const removeAt = (idx) => {
      const next = arr.filter((_, i) => i !== idx);
      onChange(id, next);
      onTouch?.(id);
    };

    return (
      <Box sx={{ mb: 3 }}>
        {renderHeader()}
        <Alert
          severity="info"
          sx={{ width: '100%' }}
          action={
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              sx={{ textTransform: 'capitalize' }}
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  'https://docs.google.com/document/d/18CNF3BBSxZ8zfMoQATcyquKENPogipvgtttyZ-PZMu4/edit?tab=t.0',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
            >
              View Requirements
            </Button>
          }
        >
          For asset requirements, kindly visit the link.
        </Alert>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          {renderRows.map((val, idx) => {
            return (
              <Box key={idx}>
                {isStructuredRows ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr auto',
                        sm: `repeat(${rowFields.length}, minmax(0, 1fr)) auto`,
                      },
                      gap: 1,
                      alignItems: 'start',
                    }}
                  >
                    {rowFields.map((rowField) => {
                      const currentValue = String(val?.[rowField.key] || '');
                      const currentLen = currentValue.length;
                      return (
                        <Box key={rowField.key}>
                          <TextField
                            fullWidth
                            label={rowField.label}
                            value={currentValue}
                            onBlur={() => onTouch?.(id)}
                            placeholder={
                              rowField.placeholder ||
                              field.placeholder ||
                              'Type your answer here...'
                            }
                            inputProps={
                              maxChars ? { maxLength: maxChars } : undefined
                            }
                            onChange={(e) => {
                              const nextVal = e.target.value || '';
                              updateStructuredAt(
                                idx,
                                rowField.key,
                                maxChars && nextVal.length > maxChars
                                  ? nextVal.slice(0, maxChars)
                                  : nextVal
                              );
                            }}
                          />
                          {maxChars ? (
                            <Box
                              mt={0.5}
                              display="flex"
                              justifyContent="flex-end"
                            >
                              <Typography
                                variant="caption"
                                color={
                                  currentLen > maxChars * 0.98
                                    ? 'error'
                                    : 'text.secondary'
                                }
                              >
                                {currentLen} / {maxChars}
                              </Typography>
                            </Box>
                          ) : null}
                        </Box>
                      );
                    })}
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ pt: { xs: 0, sm: 0 }, minHeight: '100%' }}
                    >
                      <IconButton
                        aria-label="remove"
                        size="small"
                        onClick={() => removeAt(idx)}
                        disabled={
                          arr.length <= 1 &&
                          rowFields.every(
                            (rowField) =>
                              String(val?.[rowField.key] || '').trim() === ''
                          )
                        }
                      >
                        <RemoveCircleOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        value={val || ''}
                        error={Boolean(error) && arr.length === 0}
                        helperText={idx === arr.length - 1 ? error || '' : ''}
                        onBlur={() => onTouch?.(id)}
                        placeholder={
                          field.placeholder || 'Type your answer here...'
                        }
                        inputProps={
                          maxChars ? { maxLength: maxChars } : undefined
                        }
                        onChange={(e) => {
                          const nextVal = e.target.value || '';
                          if (maxChars && nextVal.length > maxChars) {
                            updateAt(idx, nextVal.slice(0, maxChars));
                          } else {
                            updateAt(idx, nextVal);
                          }
                        }}
                      />
                      {maxChars ? (
                        <Box mt={0.5} display="flex" justifyContent="flex-end">
                          <Typography
                            variant="caption"
                            color={
                              String(val || '').length > maxChars * 0.98
                                ? 'error'
                                : 'text.secondary'
                            }
                          >
                            {String(val || '').length} / {maxChars}
                          </Typography>
                        </Box>
                      ) : null}
                    </Box>
                    <Box sx={{ alignSelf: 'center' }}>
                      <IconButton
                        aria-label="remove"
                        size="small"
                        onClick={() => removeAt(idx)}
                        disabled={arr.length <= 1 && (val || '') === ''}
                      >
                        <RemoveCircleOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Stack>
                )}
              </Box>
            );
          })}

          <Box>
            <Button size="small" variant="text" onClick={addItem}>
              + Add more
            </Button>
          </Box>
        </Stack>

        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.75, display: 'block' }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  if (type === 'single_select') {
    const selectedFromOptions = (val, opt) => {
      if (!val) return false;
      if (typeof val === 'object') return String(val.id) === String(opt.id);
      return (
        String(val) === String(opt.value ?? opt.id) ||
        String(val) === String(opt.id)
      );
    };
    return (
      <Box sx={{ mb: 3 }}>
        {renderHeader()}
        {isCompact ? (
          <Box
            role="radiogroup"
            sx={{
              mt: 1,
              display: 'grid',
              gridTemplateColumns: `repeat(${compactColumns}, minmax(0, 1fr))`,
              gap: 1,
            }}
          >
            {(options || []).map((opt) => {
              const selected = selectedFromOptions(value, opt);
              return (
                <OptionButton
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  selected={selected}
                  onClick={() => {
                    onChange(id, opt);
                    onTouch?.(id);
                  }}
                >
                  <Typography sx={{ flex: 1 }}>{optionText(opt)}</Typography>
                  {selected && (
                    <CheckRoundedIcon color="primary" sx={{ ml: 1 }} />
                  )}
                </OptionButton>
              );
            })}
            {allowCustom &&
              (() => {
                const isCustomSelected =
                  typeof value === 'string' && value.startsWith('CUSTOM|');
                const customText = isCustomSelected
                  ? value.slice('CUSTOM|'.length)
                  : '';
                return (
                  <>
                    <OptionButton
                      type="button"
                      role="radio"
                      aria-checked={isCustomSelected}
                      selected={isCustomSelected}
                      onClick={() => {
                        onChange(id, `CUSTOM|${customText}`);
                        onTouch?.(id);
                      }}
                    >
                      <Letter selected={isCustomSelected}>O</Letter>
                      <Typography sx={{ flex: 1 }}>
                        {field.customLabel || 'Custom'}
                      </Typography>
                      {isCustomSelected && (
                        <CheckRoundedIcon color="primary" sx={{ ml: 1 }} />
                      )}
                    </OptionButton>
                    {isCustomSelected && (
                      <TextField
                        sx={{ mt: 1, gridColumn: `1 / span ${compactColumns}` }}
                        fullWidth
                        placeholder={
                          field.customPlaceholder || 'Please specify'
                        }
                        value={customText}
                        onBlur={() => onTouch?.(id)}
                        onChange={(e) => {
                          onChange(id, `CUSTOM|${e.target.value}`);
                        }}
                      />
                    )}
                  </>
                );
              })()}
          </Box>
        ) : (
          <Stack spacing={1.2} role="radiogroup" sx={{ mt: 1 }}>
            {(options || []).map((opt) => {
              const selected = selectedFromOptions(value, opt);
              return (
                <OptionButton
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  selected={selected}
                  onClick={() => {
                    onChange(id, opt);
                    onTouch?.(id);
                  }}
                >
                  <Typography sx={{ flex: 1 }}>{optionText(opt)}</Typography>
                  {selected && (
                    <CheckRoundedIcon color="primary" sx={{ ml: 1 }} />
                  )}
                </OptionButton>
              );
            })}
            {allowCustom && (
              <>
                {(() => {
                  const optionIds = new Set(
                    (options || []).map((o) => String(o.id))
                  );
                  const isCustomSelected =
                    (typeof value === 'object' &&
                      value &&
                      !optionIds.has(String(value.id))) ||
                    (typeof value === 'string' &&
                      !optionIds.has(String(value)));
                  const customText =
                    typeof value === 'object'
                      ? String(value.value || value.id || '')
                      : String(value || '');
                  return (
                    <>
                      <OptionButton
                        type="button"
                        role="radio"
                        aria-checked={isCustomSelected}
                        selected={isCustomSelected}
                        onClick={() => {
                          // Toggle custom; if turning on with empty text, do nothing until user types
                          if (!isCustomSelected) {
                            onChange(id, {
                              id: customText || 'custom',
                              value: customText || 'custom',
                            });
                          }
                          onTouch?.(id);
                        }}
                      >
                        <Letter selected={isCustomSelected}>O</Letter>
                        <Typography sx={{ flex: 1 }}>
                          {field.customLabel || 'Other'}
                        </Typography>
                        {isCustomSelected && (
                          <CheckRoundedIcon color="primary" sx={{ ml: 1 }} />
                        )}
                      </OptionButton>
                      {isCustomSelected && (
                        <TextField
                          sx={{ mt: 1 }}
                          fullWidth
                          placeholder={
                            field.customPlaceholder || 'Please specify'
                          }
                          value={customText}
                          onBlur={() => onTouch?.(id)}
                          onChange={(e) => {
                            const v = String(e.target.value || '').trim();
                            onChange(id, {
                              id: v || 'custom',
                              value: v || 'custom',
                            });
                          }}
                        />
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </Stack>
        )}
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.75, display: 'block' }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  if (type === 'date' || type === 'date_time') {
    const openPicker = (e) => setAnchorEl(e.currentTarget);
    const closePicker = () => setAnchorEl(null);
    const wantsDateOnly = type === 'date';
    const toggleLabels = [
      String(flagLabel || '').trim().toLowerCase(),
      'always on',
      'always-on',
      'alwayson',
    ].filter(Boolean);
    const isToggleSentinelValue = (raw) => {
      if (raw === undefined || raw === null) return false;
      const normalized = String(raw).trim().toLowerCase();
      return normalized ? toggleLabels.includes(normalized) : false;
    };
    const hasRealDateValue =
      value !== undefined &&
      value !== null &&
      String(value).trim() !== '' &&
      !isToggleSentinelValue(value);
    const minSelectableDate = dayjs().add(8, 'day').startOf('day');
    const fallbackMoment = (() => {
      if (hasRealDateValue) {
        const parsed = dayjs(value);
        if (parsed.isValid()) return parsed;
      }
      return minSelectableDate;
    })();

    const display = (() => {
      if (!hasRealDateValue) return '';
      const iso = dayjs(value);
      if (iso.isValid())
        return iso.format(wantsDateOnly ? 'MMM D, YYYY' : 'MMM D, YYYY h:mm A');
      const parsed = dayjs(String(value), 'MM/DD/YYYY hh:mm:ss A');
      return parsed.isValid()
        ? parsed.format(wantsDateOnly ? 'MMM D, YYYY' : 'MMM D, YYYY h:mm A')
        : String(value);
    })();

    return (
      <Box sx={{ mb: 3 }}>
        {renderHeader()}
        <Box sx={{ mt: 1 }}>
          <OptionButton
            type="button"
            onClick={dateFlagChecked ? undefined : openPicker}
            selected={hasRealDateValue}
            aria-haspopup="dialog"
            aria-disabled={dateFlagChecked}
            tabIndex={dateFlagChecked ? -1 : 0}
            sx={{ opacity: dateFlagChecked ? 0.6 : 1 }}
          >
            <CalendarMonthIcon color="primary" sx={{ fontSize: '20px' }} />
            <Typography sx={{ flex: 1 }}>
              {display || field.placeholder || 'Select date'}
            </Typography>
            {flagFieldId ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Typography variant="body2" color="text.secondary">
                  {flagLabel}
                </Typography>
                <Switch
                  size="small"
                  checked={dateFlagChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setDateFlagChecked(checked);
                    if (typeof onBulkChange === 'function') {
                      onBulkChange({
                        [id]:
                          checked || !hasRealDateValue
                            ? undefined
                            : value,
                        [flagFieldId]: checked,
                      });
                    } else {
                      if (checked) {
                        onChange(id, '');
                        closePicker();
                      } else if (!hasRealDateValue) {
                        onChange(id, undefined);
                      }
                      onChange(flagFieldId, checked);
                    }
                    if (checked) closePicker();
                  }}
                />
              </Stack>
            ) : null}
          </OptionButton>

          <Popup
            anchorEl={anchorEl}
            handleClose={closePicker}
            horizontal="left"
            content={
              wantsDateOnly ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack>
                    <StaticDatePicker
                      defaultValue={fallbackMoment}
                      onChange={(e) =>
                        setDateOnlyTemp(dayjs(e).format('YYYY-MM-DD'))
                      }
                      showToolbar={false}
                      className="static-date-picker"
                      minDate={minSelectableDate}
                    />
                    <Box mt={-4} mr="16px" mb="10px" alignSelf="flex-end">
                      <Button
                        onClick={() => {
                          const base = fallbackMoment.format('YYYY-MM-DD');
                          const picked = dateOnlyTemp || base;
                          const nextMoment = dayjs(picked);
                          const clamped = nextMoment.isBefore(
                            minSelectableDate,
                            'day'
                          )
                            ? minSelectableDate
                            : nextMoment;
                          // Store date-only in YYYY-MM-DD to avoid TZ shifts
                          onChange(id, clamped.format('YYYY-MM-DD'));
                          onTouch?.(id);
                          closePicker();
                        }}
                        sx={{ fontWeight: 700 }}
                      >
                        Apply
                      </Button>
                    </Box>
                  </Stack>
                </LocalizationProvider>
              ) : (
                <DateTimerPicker
                  type={id}
                  selected={value}
                  handleSave={({ value: v }) => {
                    // Store as ISO for consistency and reliable re-opening
                    const parsed = dayjs(String(v), 'MM/DD/YYYY hh:mm:ss A');
                    const iso = parsed.isValid() ? parsed.toISOString() : v;
                    onChange(id, iso);
                    onTouch?.(id);
                  }}
                  handleClose={closePicker}
                />
              )
            }
          />

          {/* Toggle is integrated inside the input */}

          {error && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.75, display: 'block' }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  if (type === 'multi_select') {
    const durationChoices = Array.isArray(field?.durationOptions)
      ? field.durationOptions.map((choice) => String(choice))
      : [];
    const requiresDuration = durationChoices.length > 0;
    const arrRaw = extractMultiSelectValues(value);
    const ensureSelectionObj = (item) => {
      if (typeof item === 'object') {
        const idStr = String(item.id ?? item.value);
        const valueStr = String(item.value ?? item.id ?? '');
        const next = {
          ...item,
          id: idStr,
          value: valueStr,
        };
        if (requiresDuration) {
          const dur = item.duration;
          if (Array.isArray(dur)) {
            next.duration = dur.map((d) => String(d));
          } else if (dur != null && dur !== '') {
            next.duration = [String(dur)];
          } else {
            next.duration = [];
          }
        }
        return next;
      }
      const str = String(item);
      if (requiresDuration) {
        return { id: str, value: str, duration: [] };
      }
      return { id: str, value: str };
    };
    const arr = requiresDuration ? arrRaw.map(ensureSelectionObj) : arrRaw;
    const checkboxOptions = Array.isArray(field?.checkboxes)
      ? field.checkboxes
      : [];
    const hasCheckboxes = checkboxOptions.length > 0;
    const checkboxIdSet = new Set(
      checkboxOptions.map((opt) => String(opt.id))
    );
    const checkboxState = hasCheckboxes
      ? Object.fromEntries(
        Object.entries(extractFlags(value)).filter(
          ([key, val]) => checkboxIdSet.has(String(key)) && Boolean(val)
        )
      )
      : {};

    const shapeSelections = (list) =>
      requiresDuration ? list.map((item) => ensureSelectionObj(item)) : list;

    const applySelections = (nextSelections, nextFlags = checkboxState) => {
      const shapedSelections = shapeSelections(nextSelections);
      if (hasCheckboxes) {
        onChange(id, {
          selections: shapedSelections,
          flags: { ...nextFlags },
        });
      } else {
        onChange(id, shapedSelections);
      }
    };

    // Determine if custom is active/selected
    const customValues = (arr || []).filter((v) => {
      if (typeof v === 'object') {
        const id = String(v.id ?? '');
        const val = String(v.value ?? id);
        return !optionIdSet.has(id) && !optionValueSet.has(val);
      }
      const s = String(v);
      return !optionIdSet.has(s) && !optionValueSet.has(s);
    });
    const isCustomSelected = customValues.length > 0;
    const isCustomActive = otherActive || isCustomSelected;

    const toggleSelectObj = (fid, opt) => {
      const idStr = String(opt.id);
      const valStr = String(opt.value ?? opt.id);
      const arrList = arr;
      const idx = arrList.findIndex((v) => {
        const vid = String(typeof v === 'object' ? v.id : v);
        const vval = String(typeof v === 'object' ? v.value ?? v.id : v);
        return vid === idStr || vval === valStr;
      });
      let next;
      if (idx >= 0) {
        next = arrList.filter((_, i) => i !== idx);
      } else {
        const baseSelection = shapeOptionSelection(opt);
        next = [
          ...arrList,
          requiresDuration ? { ...baseSelection, duration: [] } : baseSelection,
        ];
      }
      applySelections(next);
    };

    // Persistent custom entry history handled by top-level useEffect

    const splitTokens = (txt) =>
      String(txt || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

    // Suggestions/history removed

    const commitCustomText = (txt) => {
      const tokens = Array.from(new Set(splitTokens(txt)));
      const baseObjs = arr
        .filter((v) => {
          const vid = String(typeof v === 'object' ? v.id : v);
          const vval = String(typeof v === 'object' ? v.value ?? v.id : v);
          return optionIdSet.has(vid) || optionValueSet.has(vval);
        })
        .map((v) =>
          typeof v === 'object'
            ? ensureSelectionObj(v)
            : {
              id: String(v),
              value: String(v),
              ...(requiresDuration ? { duration: [] } : {}),
            }
        );
      const tokenObjs = tokens.map((t) => ({
        id: String(t),
        value: String(t),
        ...(requiresDuration ? { duration: [] } : {}),
      }));
      const dedup = new Map([
        ...baseObjs.map((o) => [String(o.id), o]),
        ...tokenObjs.map((o) => [String(o.id), o]),
      ]);
      const next = Array.from(dedup.values());
      applySelections(next);
      onTouch?.(id);
    };

    const onCustomKeyDown = (e) => {
      const key = e.key;
      if (key === 'Enter') {
        e.preventDefault();
        const lastPart = String(customText).split(',').pop() || '';
        if (lastPart.trim().length === 0) return;
        const updated = customText.endsWith(', ')
          ? customText
          : customText + ', ';
        setCustomText(updated);
        commitCustomText(updated);
      }
    };

    const onCustomChange = (e) => {
      setCustomText(e.target.value);
    };

    const onCustomBlur = () => {
      commitCustomText(customText);
    };

    const onCheckboxToggle = (checkboxId, checked) => {
      if (!hasCheckboxes) return;
      const normalizedId = String(checkboxId);
      const nextFlags = { ...checkboxState };
      if (checked) {
        nextFlags[normalizedId] = true;
      } else {
        delete nextFlags[normalizedId];
      }
      applySelections(arr, nextFlags);
      onTouch?.(id);
    };

    const setDurationFor = (selectionId, durationValue) => {
      if (!requiresDuration) return;
      const targetId = String(selectionId);
      const durationStr = String(durationValue || '');
      const next = arr.map((item) => {
        const obj = ensureSelectionObj(item);
        if (String(obj.id) !== targetId) return obj;
        const existing = Array.isArray(obj.duration) ? obj.duration : [];
        const has = existing.includes(durationStr);
        const updated = has
          ? existing.filter((d) => d !== durationStr)
          : [...existing, durationStr];
        return { ...obj, duration: updated };
      });
      applySelections(next);
    };

    const renderDurationControls = (option, selObj, isSelected) => {
      if (!requiresDuration) return null;
      const durationValue = selObj
        ? Array.isArray(selObj.duration)
          ? selObj.duration.map((d) => String(d))
          : selObj.duration
            ? [String(selObj.duration)]
            : []
        : [];
      const message = isSelected
        ? durationValue.length > 0
          ? `Durations: ${durationValue.join(', ')}`
          : 'Select one or more durations'
        : 'Select this option to set durations';
      return (
        <Box sx={{ mt: 0.5 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mb: 0.25 }}
          >
            {message}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {durationChoices.map((dur) => {
              const durationStr = String(dur);
              const isActive =
                isSelected && durationValue.includes(durationStr);
              return (
                <Button
                  key={`${option.id}-${durationStr}`}
                  size="small"
                  variant={isActive ? 'contained' : 'outlined'}
                  sx={{ minWidth: 40 }}
                  disabled={!isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected || !selObj) return;
                    setDurationFor(selObj.id, durationStr);
                    onTouch?.(id);
                  }}
                >
                  {durationStr}
                </Button>
              );
            })}
          </Stack>
        </Box>
      );
    };

    return (
      <Box sx={{ mb: 3 }}>
        {renderHeader()}
        {hasCheckboxes ? (
          <Stack spacing={0.5} sx={{ mt: description ? 0.5 : 1 }}>
            {checkboxOptions.map((cb) => {
              const cbId = String(cb.id);
              const tooltip =
                cb.tooltip ||
                (cbId === 'needs_iterations'
                  ? 'Variation could include the adjustment of existing fixed elements, adding animation to existing elements, updating text layouts, adjusting template for new background imagery, etc.'
                  : null);
              const labelNode = tooltip ? (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <span>{cb.label || cbId}</span>
                  <Tooltip
                    title={tooltip}
                    arrow
                    componentsProps={{
                      tooltip: {
                        sx: { lineHeight: 1.2, maxWidth: 420, fontSize: 12 },
                      },
                    }}
                  >
                    <InfoOutlinedIcon
                      fontSize="small"
                      sx={{ color: 'text.secondary' }}
                    />
                  </Tooltip>
                </Stack>
              ) : (
                cb.label || cbId
              );
              return (
                <FormControlLabel
                  key={cbId}
                  control={
                    <Checkbox
                      size="small"
                      checked={Boolean(checkboxState[cbId])}
                      onChange={(e) =>
                        onCheckboxToggle(cbId, e.target.checked)
                      }
                    />
                  }
                  label={labelNode}
                />
              );
            })}
          </Stack>
        ) : null}
        {isCompact ? (
          <Box
            role="group"
            sx={{
              mt: 1,
              display: 'grid',
              gridTemplateColumns: `repeat(${compactColumns}, minmax(0, 1fr))`,
              gap: 1,
            }}
          >
            {(options || []).map((opt) => {
              const selected = (arr || []).some((v) => isSelectedObj(v, opt));
              const selectionObj = selected
                ? ensureSelectionObj(
                  (arr || []).find((v) => isSelectedObj(v, opt))
                )
                : null;
              const label = optionText(opt);
              return (
                <Stack direction="row" spacing={1} key={opt.id}>
                  <OptionButton
                    type="button"
                    role="checkbox"
                    aria-checked={selected}
                    selected={selected}
                    onClick={() => {
                      toggleSelectObj(id, opt);
                      onTouch?.(id);
                    }}
                  >
                    <Typography sx={{ flex: 1 }}>{label}</Typography>
                    {selected && (
                      <CheckRoundedIcon color="primary" sx={{ ml: 0.2 }} />
                    )}
                  </OptionButton>
                  {renderDurationControls(opt, selectionObj, selected)}
                </Stack>
              );
            })}
            {allowCustom && (
              <>
                {compactColumns === 2 ? (
                  <Box sx={{ gridColumn: `1 / span ${compactColumns}` }}>
                    <OptionButton
                      type="button"
                      role="checkbox"
                      aria-checked={isCustomActive}
                      selected={isCustomActive}
                      onClick={() => {
                        if (isCustomActive) {
                          const base = arr
                            .filter((v) => {
                              const vid = String(typeof v === 'object' ? v.id : v);
                              const vval = String(
                                typeof v === 'object' ? v.value ?? v.id : v
                              );
                              return (
                                optionIdSet.has(vid) || optionValueSet.has(vval)
                              );
                            })
                            .map((v) =>
                              typeof v === 'object'
                                ? v
                                : { id: String(v), value: String(v) }
                            );
                          applySelections(base);
                          setOtherActive(false);
                        } else {
                          setOtherActive(true);
                        }
                        onTouch?.(id);
                      }}
                    >
                      <Typography sx={{ flex: 1 }}>
                        {field.customLabel || 'Custom'}
                      </Typography>
                      {isCustomActive && (
                        <CheckRoundedIcon color="primary" sx={{ ml: 1 }} />
                      )}
                    </OptionButton>
                  </Box>
                ) : (
                  <OptionButton
                    type="button"
                    role="checkbox"
                    aria-checked={isCustomActive}
                    selected={isCustomActive}
                    onClick={() => {
                      if (isCustomActive) {
                        const base = arr
                          .filter((v) => {
                            const vid = String(typeof v === 'object' ? v.id : v);
                            const vval = String(
                              typeof v === 'object' ? v.value ?? v.id : v
                            );
                            return (
                              optionIdSet.has(vid) || optionValueSet.has(vval)
                            );
                          })
                          .map((v) =>
                            typeof v === 'object'
                              ? v
                              : { id: String(v), value: String(v) }
                          );
                        applySelections(base);
                        setOtherActive(false);
                      } else {
                        setOtherActive(true);
                      }
                      onTouch?.(id);
                    }}
                  >
                    <Typography sx={{ flex: 1 }}>
                      {field.customLabel || 'Custom'}
                    </Typography>
                    {isCustomActive && (
                      <CheckRoundedIcon color="primary" sx={{ ml: 1 }} />
                    )}
                  </OptionButton>
                )}
                {isCustomActive && (
                  <Box sx={{ gridColumn: `1 / span ${compactColumns}` }}>
                    <TextField
                      sx={{ mt: 1 }}
                      fullWidth
                      value={customText}
                      placeholder={
                        field.customPlaceholder || 'Type and press enter'
                      }
                      onChange={onCustomChange}
                      onKeyDown={onCustomKeyDown}
                      onBlur={onCustomBlur}
                    />
                    {/* {!field.customPlaceholder && allowCustom ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block' }}
                      >
                        Press space/enter for new item
                      </Typography>
                    ) : null} */}
                  </Box>
                )}
              </>
            )}
          </Box>
        ) : (
          <Stack spacing={1.2} role="group" sx={{ mt: 1 }}>
            {(options || []).map((opt) => {
              const selected = (arr || []).some((v) => isSelectedObj(v, opt));
              const selectionObj = selected
                ? ensureSelectionObj(
                  (arr || []).find((v) => isSelectedObj(v, opt))
                )
                : null;
              const label = optionText(opt);
              return (
                <Stack direction="row" spacing={1} key={opt.id}>
                  <OptionButton
                    type="button"
                    role="checkbox"
                    aria-checked={selected}
                    selected={selected}
                    onClick={() => {
                      toggleSelectObj(id, opt);
                      onTouch?.(id);
                    }}
                  >
                    <Typography sx={{ flex: 1 }}>{label}</Typography>
                    {selected && (
                      <CheckRoundedIcon color="primary" sx={{ ml: 0.2 }} />
                    )}
                  </OptionButton>
                  {renderDurationControls(opt, selectionObj, selected)}
                </Stack>
              );
            })}
            {allowCustom && (
              <>
                <OptionButton
                  type="button"
                  role="checkbox"
                  aria-checked={isCustomActive}
                  selected={isCustomActive}
                  onClick={() => {
                    if (isCustomActive) {
                      const base = arr
                        .filter((v) => {
                          const vid = String(typeof v === 'object' ? v.id : v);
                          const vval = String(
                            typeof v === 'object' ? v.value ?? v.id : v
                          );
                          return (
                            optionIdSet.has(vid) || optionValueSet.has(vval)
                          );
                        })
                        .map((v) =>
                          typeof v === 'object'
                            ? v
                            : { id: String(v), value: String(v) }
                        );
                      applySelections(base);
                      setOtherActive(false);
                    } else {
                      setOtherActive(true);
                    }
                    onTouch?.(id);
                  }}
                >
                  {/* <Letter selected={isCustomActive}>O</Letter> */}
                  <Typography sx={{ flex: 1 }}>
                    {field.customLabel || 'Custom'}
                  </Typography>
                  {isCustomActive && (
                    <CheckRoundedIcon color="primary" sx={{ ml: 1 }} />
                  )}
                </OptionButton>
                {isCustomActive && (
                  <Box>
                    <TextField
                      sx={{ mt: 1 }}
                      fullWidth
                      value={customText}
                      placeholder={
                        field.customPlaceholder || 'Type and press enter'
                      }
                      onChange={onCustomChange}
                      onKeyDown={onCustomKeyDown}
                      onBlur={onCustomBlur}
                    />
                  </Box>
                )}
              </>
            )}
          </Stack>
        )}
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 0.75, display: 'block' }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
}

Field.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      'alert',
      'title',
      'text',
      'long_text',
      'multi_text',
      'textarea',
      'text_only',
      'single_select',
      'multi_select',
      'multi_select_popup',
      'single_select_popup',
      'date',
      'date_time',
    ]).isRequired,
    label: PropTypes.string,
    description: PropTypes.string,
    alertText: PropTypes.string,
    severity: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
    placeholder: PropTypes.string,
    dateOnly: PropTypes.bool,
    mode: PropTypes.oneOf(['date', 'datetime']),
    showTime: PropTypes.bool,
    allowCustom: PropTypes.bool,
    customLabel: PropTypes.string,
    customPlaceholder: PropTypes.string,
    popupInputPlaceholder: PropTypes.string,
    emptyText: PropTypes.string,
    addPlaceholder: PropTypes.string,
    validators: PropTypes.arrayOf(PropTypes.string),
    startIcon: PropTypes.string,
    infoTooltip: PropTypes.string,
    toggleLabel: PropTypes.string,
    toggleFieldId: PropTypes.string,
    maxChars: PropTypes.number,
    durationOptions: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    isCompact: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({ columns: PropTypes.number }),
    ]),
    rowFields: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string,
        placeholder: PropTypes.string,
      })
    ),
    showAddHelper: PropTypes.bool,
    checkboxes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        tooltip: PropTypes.string,
      })
    ),
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string,
      })
    ),
  }).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ id: PropTypes.string, value: PropTypes.string }),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string,
          link: PropTypes.string,
        }),
        PropTypes.shape({ id: PropTypes.string, value: PropTypes.string }),
      ])
    ),
    PropTypes.shape({
      selections: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({ id: PropTypes.string, value: PropTypes.string }),
        ])
      ),
      flags: PropTypes.objectOf(PropTypes.bool),
    }),
  ]),
  onChange: PropTypes.func.isRequired,
  onBulkChange: PropTypes.func,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
  onTouch: PropTypes.func,
  answers: PropTypes.object,
};
