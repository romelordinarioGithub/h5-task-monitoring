import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  Divider,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import { useHistory, useLocation } from 'react-router-dom';
import slackIcon from '../../../assets/smartly/icons/slack.svg';
import schema from '../schema';
import {
  scrollToTop,
  filterAnswersByVisibility,
  getVisiblePages,
  getVisibleFields,
} from '../utils';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const normalizeMultiSelectSummary = (val) => {
  if (Array.isArray(val)) {
    return { selections: val, flags: {} };
  }

  if (val && typeof val === 'object') {
    const selections = Array.isArray(val.selections) ? val.selections : [];
    const flags = (() => {
      const raw = val.flags;
      if (Array.isArray(raw)) {
        return Object.fromEntries(raw.map((key) => [String(key), true]));
      }

      if (raw && typeof raw === 'object') return raw;

      return {};
    })();
    return { selections, flags };
  }

  return { selections: [], flags: {} };
};

export default function PublicFormSuccess() {
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const briefId = useMemo(() => {
    if (location.state && location.state.briefId) {
      return String(location.state.briefId);
    }

    try {
      const raw = sessionStorage.getItem('publicForm:lastSubmission');
      if (!raw) return '';
      const parsed = JSON.parse(raw);
      return String(parsed?.briefId || '');
    } catch (e) {
      return '';
    }
  }, [location.state]);

  const slackLink = useMemo(() => {
    if (location.state && location.state.slackLink) {
      return location.state.slackLink;
    }

    try {
      const raw = sessionStorage.getItem('publicForm:lastSubmission');
      if (!raw) return '';
      const parsed = JSON.parse(raw);
      return parsed?.slackLink || '';
    } catch (e) {
      return '';
    }
  }, [location.state]);

  const answers = useMemo(() => {
    if (location.state && location.state.answers) {
      return filterAnswersByVisibility(schema, location.state.answers);
    }

    try {
      const raw = sessionStorage.getItem('publicForm:lastSubmission');
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return filterAnswersByVisibility(schema, parsed?.answers || {});
    } catch (e) {
      return {};
    }
  }, [location.state]);

  const summary = useMemo(() => {
    const pages = getVisiblePages(schema, answers);
    const items = [];
    pages.forEach((p) => {
      const fields = getVisibleFields(p, answers).filter(
        (f) =>
          answers[f.id] !== undefined ||
          (f.toggleFieldId && Boolean(answers[f.toggleFieldId])) ||
          (f.checkboxFieldId && answers[f.checkboxFieldId] !== undefined)
      );
      if (fields.length === 0) return;
      items.push({ page: p, fields });
    });
    return items;
  }, [answers]);

  useEffect(() => {
    scrollToTop(false);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        px: 2,
        // Subtle white-to-whitesmoke with denser dot grid
        backgroundImage:
          'radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
        backgroundSize: '12px 12px, 12px 12px, 100% 100%',
        backgroundPosition: '0 0, 6px 6px, 0 0',
      }}
    >
      <Box sx={{ maxWidth: 840, mx: 'auto' }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img
            src={smartlyLogo}
            alt="smartly-logo"
            style={{ width: 64, height: 'auto' }}
          />
        </Box> */}
        <Box sx={{ maxWidth: 720, mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            }}
          >
            <Stack
              alignItems="center"
              spacing={2}
              sx={{ textAlign: 'center', mt: 6 }}
            >
              <CheckCircleRoundedIcon color="success" sx={{ fontSize: 64 }} />
              <Typography variant="h4">
                Thanks for completing the form!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We’ve received your responses. Our team will review and follow
                up shortly.
              </Typography>
              <Stack
                spacing={1.5}
                sx={{ mt: 2, width: '100%', alignItems: 'center' }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    justifyContent: 'center',
                    mx: 'auto',
                  }}
                >
                  {slackLink ? (
                    <Button
                      variant="contained"
                      href={slackLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={
                        <Box
                          component="img"
                          src={slackIcon}
                          alt=""
                          sx={{ width: 16, height: 16 }}
                        />
                      }
                      sx={{ flex: 1 }}
                    >
                      Open Slack
                    </Button>
                  ) : null}
                  {briefId ? (
                    <Button
                      variant="outlined"
                      onClick={() =>
                        history.push(
                          `/form?brief_id=${encodeURIComponent(briefId)}`
                        )
                      }
                      sx={{ flex: 1 }}
                    >
                      Edit Form
                    </Button>
                  ) : null}
                  {briefId ? (
                    <Button
                      variant="outlined"
                      onClick={() =>
                        history.push(`/scoping/${encodeURIComponent(briefId)}`)
                      }
                      sx={{ flex: 1 }}
                    >
                      Open Scoping
                    </Button>
                  ) : null}
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    justifyContent: 'center',
                    mx: 'auto',
                  }}
                >
                  <Button
                    sx={{ width: '100%' }}
                    variant="outlined"
                    onClick={() => history.push('/form')}
                  >
                    Submit New Form
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            {/* <Box sx={{ mt: 3 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Form Summary</Typography>
                <IconButton size="small" onClick={() => setOpen((v) => !v)}>
                  {open ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                </IconButton>
              </Stack>
              <Collapse in={open}>
                {summary.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    No answers available.
                  </Typography>
                ) : (
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    {summary.map(({ page, fields }) => (
                      <Box key={page.id}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {page.title}
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Stack spacing={1.25}>
                          {fields.map((f) => {
                            const val = answers[f.id];
                            let rendered = null;
                            if (
                              f.type === 'multiple' ||
                              f.type === 'multi_select' ||
                              f.type === 'multi_select_popup' ||
                              f.type === 'custom_multi_select_popover'
                            ) {
                              const { selections, flags } =
                                normalizeMultiSelectSummary(val);
                              const labelMap = new Map(
                                (f.options || []).flatMap((o) => {
                                  const lbl = o.value ?? String(o.id);
                                  const entries = [[o.id, lbl]];
                                  if (o.value !== undefined)
                                    entries.push([o.value, lbl]);
                                  return entries;
                                })
                              );
                              const checkboxLabelMap = new Map(
                                (f.checkboxes || []).map((cb) => [
                                  String(cb.id),
                                  cb.label || String(cb.id),
                                ])
                              );
                              const flagEntries = Object.entries(flags || {}).filter(
                                ([, checked]) => Boolean(checked)
                              );

                              if (
                                selections.length === 0 &&
                                flagEntries.length === 0
                              ) {
                                rendered = (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    No selections
                                  </Typography>
                                );
                              } else {
                                rendered = (
                                  <Box>
                                    {selections.length > 0 ? (
                                      <Box
                                        sx={{
                                          mb:
                                            flagEntries.length > 0 ? 1 : 0,
                                        }}
                                      >
                                        {selections.map((v) => {
                                          const vid =
                                            typeof v === 'object' ? v.id : v;
                                          const vval =
                                            typeof v === 'object'
                                              ? v.value
                                              : v;
                                          const durationLabel =
                                            typeof v === 'object' &&
                                              v.duration
                                              ? ` (${v.duration})`
                                              : '';
                                          const label =
                                            (labelMap.get(vid) || vval) +
                                            durationLabel;
                                          return (
                                            <Chip
                                              key={String(vid)}
                                              size="small"
                                              label={label}
                                              sx={{ mr: 0.5, mb: 0.5 }}
                                            />
                                          );
                                        })}
                                      </Box>
                                    ) : null}
                                    {flagEntries.length > 0 ? (
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{ display: 'block', mb: 0.25 }}
                                        >
                                          Additional flags
                                        </Typography>
                                        <Box>
                                          {flagEntries.map(([flagId]) => {
                                            const key = String(flagId);
                                            const label =
                                              checkboxLabelMap.get(key) ||
                                              key;
                                            return (
                                              <Chip
                                                key={`flag-${key}`}
                                                size="small"
                                                variant="outlined"
                                                label={label}
                                                sx={{ mr: 0.5, mb: 0.5 }}
                                              />
                                            );
                                          })}
                                        </Box>
                                      </Box>
                                    ) : null}
                                  </Box>
                                );
                              }
                            } else if (
                              f.type === 'single' ||
                              f.type === 'single_select' ||
                              f.type === 'single_select_popup'
                            ) {
                              const labelMap = new Map(
                                (f.options || []).flatMap((o) => {
                                  const lbl = o.value ?? String(o.id);
                                  const entries = [[o.id, lbl]];
                                  if (o.value !== undefined)
                                    entries.push([o.value, lbl]);
                                  return entries;
                                })
                              );
                              rendered = (
                                <Typography variant="body2">
                                  {typeof val === 'object'
                                    ? labelMap.get(val.id) || val.value
                                    : labelMap.get(val) || String(val)}
                                </Typography>
                              );
                            } else if (
                              f.type === 'text' ||
                              f.type === 'long_text'
                            ) {
                              const textContent =
                                val && typeof val === 'object'
                                  ? val.text ?? val.value ?? ''
                                  : String(val || '');
                              const flags = (() => {
                                if (val && typeof val === 'object') {
                                  const raw = val.flags;
                                  if (Array.isArray(raw)) {
                                    return Object.fromEntries(
                                      raw.map((key) => [String(key), true])
                                    );
                                  }

                                  if (raw && typeof raw === 'object') {
                                    return raw;
                                  }
                                }

                                return {};
                              })();
                              const flagEntries = Object.entries(
                                flags || {}
                              ).filter(([, checked]) => Boolean(checked));
                              const checkboxLabelMap = new Map(
                                (f.checkboxes || []).map((cb) => [
                                  String(cb.id),
                                  cb.label || String(cb.id),
                                ])
                              );

                              rendered = (
                                <Box>
                                  <Typography
                                    variant="body2"
                                    component="div"
                                    sx={{ '& img': { maxWidth: '100%' } }}
                                    dangerouslySetInnerHTML={{
                                      __html: textContent,
                                    }}
                                  />
                                  {flagEntries.length > 0 ? (
                                    <Box sx={{ mt: 0.5 }}>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', mb: 0.25 }}
                                      >
                                        Additional flags
                                      </Typography>
                                      <Box>
                                        {flagEntries.map(([flagId]) => {
                                          const key = String(flagId);
                                          const label =
                                            checkboxLabelMap.get(key) || key;
                                          return (
                                            <Chip
                                              key={`text-flag-${key}`}
                                              size="small"
                                              variant="outlined"
                                              label={label}
                                              sx={{ mr: 0.5, mb: 0.5 }}
                                            />
                                          );
                                        })}
                                      </Box>
                                    </Box>
                                  ) : null}
                                </Box>
                              );
                            } else if (
                              f.type === 'multi_text' &&
                              Array.isArray(val)
                            ) {
                              const isStructuredRows = val.some(
                                (item) =>
                                  item &&
                                  typeof item === 'object' &&
                                  !Array.isArray(item)
                              );
                              rendered = isStructuredRows ? (
                                <Stack spacing={1}>
                                  {val
                                    .filter(
                                      (row) =>
                                        row &&
                                        typeof row === 'object' &&
                                        (String(row.label || '').trim().length > 0 ||
                                          String(row.link || '').trim().length > 0)
                                    )
                                    .map((row, i) => (
                                      <Box key={`${f.id}-${i}`}>
                                        {String(row.label || '').trim() ? (
                                          <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600 }}
                                          >
                                            {String(row.label)}
                                          </Typography>
                                        ) : null}
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{ wordBreak: 'break-all' }}
                                        >
                                          {String(row.link || '')}
                                        </Typography>
                                      </Box>
                                    ))}
                                </Stack>
                              ) : (
                                <Box>
                                  {val
                                    .filter(
                                      (t) => String(t || '').trim().length > 0
                                    )
                                    .map((t, i) => (
                                      <Chip
                                        key={`${f.id}-${i}`}
                                        size="small"
                                        label={String(t)}
                                        sx={{ mr: 0.5, mb: 0.5 }}
                                      />
                                    ))}
                                </Box>
                              );
                            } else if (
                              f.type === 'date' ||
                              f.type === 'date_time'
                            ) {
                              const flagId =
                                f.toggleFieldId || f.checkboxFieldId;
                              const hasDateValue =
                                val !== undefined &&
                                val !== null &&
                                String(val).trim() !== '';
                              if (flagId && answers[flagId] && !hasDateValue) {
                                const label =
                                  f.toggleLabel ||
                                  f.checkboxLabel ||
                                  'Always on';
                                rendered = (
                                  <Typography variant="body2">
                                    {label}
                                  </Typography>
                                );
                              } else {
                                const iso = dayjs(val);
                                const parsed = iso.isValid()
                                  ? iso
                                  : dayjs(String(val), 'MM/DD/YYYY hh:mm:ss A');
                                const format =
                                  f.type === 'date'
                                    ? 'MMM D, YYYY'
                                    : 'MMM D, YYYY h:mm A';
                                const nice = parsed.isValid()
                                  ? parsed.format(format)
                                  : String(val || '');
                                rendered = (
                                  <Typography variant="body2">
                                    {nice}
                                  </Typography>
                                );
                              }
                            } else {
                              rendered = (
                                <Typography
                                  variant="body2"
                                  sx={{ whiteSpace: 'pre-wrap' }}
                                >
                                  {String(val || '')}
                                </Typography>
                              );
                            }

                            return (
                              <Box key={f.id}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, mb: 0.25 }}
                                >
                                  {f.label}
                                </Typography>
                                {rendered}
                              </Box>
                            );
                          })}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Collapse>
            </Box> */}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
