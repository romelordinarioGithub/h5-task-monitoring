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
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import CheckIcon from '@mui/icons-material/Check';
import { useHistory, useLocation } from 'react-router-dom';
import schema from '../schema';
import api from 'utils/api';
import {
  scrollToTop,
  filterAnswersByVisibility,
  getVisiblePages,
  getVisibleFields,
  buildFieldGroupIndex,
  splitAnswersByGroup,
  mapFlagsToArrays,
  attachTemplateSizeSelections,
  omitEmptyStructuredMultiTextRows,
  omitEmptyToggleDates,
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

export default function PublicFormReview() {
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [canShowDraftButton, setCanShowDraftButton] = useState(true);
  const { search } = location;
  const briefIdParam = useMemo(() => {
    const params = new URLSearchParams(search || '');
    const id = params.get('brief_id');
    return id || null;
  }, [search]);
  const fieldGroupIndex = useMemo(() => buildFieldGroupIndex(schema), []);

  const { rawAnswers, fromDraftFlow } = useMemo(() => {
    if (location.state && location.state.answers) {
      return {
        rawAnswers: location.state.answers,
        fromDraftFlow: Boolean(location.state.fromDraft),
      };
    }

    try {
      const raw = sessionStorage.getItem('publicForm:pendingReview');
      if (!raw) {
        return {
          rawAnswers: {},
          fromDraftFlow:
            sessionStorage.getItem('publicForm:fromDraft') === '1',
        };
      }

      const parsed = JSON.parse(raw);
      return {
        rawAnswers: parsed?.answers || {},
        fromDraftFlow: Boolean(parsed?.fromDraft),
      };
    } catch (e) {
      return {
        rawAnswers: {},
        fromDraftFlow:
          sessionStorage.getItem('publicForm:fromDraft') === '1',
      };
    }
  }, [location.state]);

  const answers = useMemo(
    () => filterAnswersByVisibility(schema, rawAnswers),
    [rawAnswers]
  );

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

  useEffect(() => {
    if (!briefIdParam) {
      setCanShowDraftButton(true);
      return;
    }

    try {
      const raw = sessionStorage.getItem('publicForm:loadedBriefMeta');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (String(parsed?.briefId || '') !== String(briefIdParam)) return;
      setCanShowDraftButton(Boolean(parsed?.isDraft !== false));
    } catch (e) {
      // ignore storage errors
    }
  }, [briefIdParam]);

  const handleBack = () => {
    history.push({ pathname: '/form', search });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    setDraftMessage('');
    const enrichedAnswers = attachTemplateSizeSelections(schema, answers);
    const { base, grouped } = splitAnswersByGroup(enrichedAnswers, fieldGroupIndex);
    const payload = omitEmptyToggleDates(
      omitEmptyStructuredMultiTextRows(
        mapFlagsToArrays({
          ...base,
          ...grouped,
          ...(fromDraftFlow ? { from_draft: true } : {}),
        }),
        schema
      ),
      schema
    );
    const endpoint = briefIdParam
      ? 'admin/adweave-briefs/update'
      : 'admin/adweave-briefs';
    const requestBody = briefIdParam
      ? { ...payload, brief_id: briefIdParam }
      : payload;
    const res = await api.callPost(endpoint, requestBody, {
      postLoginRedirect: `${location.pathname}${location.search || ''}`,
    });

    if (res && res.success) {
      const slackLink = res?.data?.slack_link || '';
      const briefId =
        res?.data?.brief_id ||
        res?.data?.id ||
        res?.data?._id ||
        res?.data?.brief?.id ||
        res?.data?.brief?.brief_id ||
        briefIdParam ||
        '';
      try {
        sessionStorage.setItem(
          'publicForm:lastSubmission',
          JSON.stringify({
            answers,
            slackLink,
            briefId,
            ts: Date.now(),
            schemaId: schema.id,
          })
        );
        sessionStorage.removeItem('publicForm:pendingReview');
        sessionStorage.removeItem('publicForm:fromDraft');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to store submission', err);
      }

      const base = location.pathname.replace(/\/review\/?$/, '');
      history.push({
        pathname: `${base}/success`,
        state: { answers, slackLink, briefId },
      });
    } else {
      const msg = res?.message || 'Failed to submit. Please try again.';
      setSubmitError(msg);
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (draftSaving) return;
    setDraftSaving(true);
    setSubmitError('');
    setDraftMessage('');
    const enrichedAnswers = attachTemplateSizeSelections(schema, answers);
    const { base, grouped } = splitAnswersByGroup(enrichedAnswers, fieldGroupIndex);
    const payload = omitEmptyToggleDates(
      omitEmptyStructuredMultiTextRows(
        mapFlagsToArrays({
          ...base,
          ...grouped,
          is_draft: true,
        }),
        schema
      ),
      schema
    );
    const endpoint = briefIdParam
      ? 'admin/adweave-briefs/update'
      : 'admin/adweave-briefs';
    const requestBody = briefIdParam
      ? { ...payload, brief_id: briefIdParam }
      : payload;
    const res = await api.callPost(endpoint, requestBody, {
      postLoginRedirect: `${location.pathname}${location.search || ''}`,
    });
    if (res && res.success) {
      try {
        sessionStorage.setItem('publicForm:draftSaved', '1');
        sessionStorage.removeItem('publicForm:pendingReview');
      } catch (err) {
        // ignore storage errors
      }

      history.push({ pathname: '/form' });
    } else {
      const msg = res?.message || 'Failed to save draft. Please try again.';
      setSubmitError(msg);
    }

    setDraftSaving(false);
  };

  if (!answers || Object.keys(answers).length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', py: 6, px: 2 }}>
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
            <Typography variant="h5" sx={{ mb: 1 }}>
              No answers to review.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please return to the form to continue.
            </Typography>
            <Button variant="contained" onClick={() => history.push('/form')}>
              Back to Form
            </Button>
          </Paper>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        px: 2,
        backgroundImage:
          'radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
        backgroundSize: '12px 12px, 12px 12px, 100% 100%',
        backgroundPosition: '0 0, 6px 6px, 0 0',
      }}
    >
      <Box sx={{ maxWidth: 840, mx: 'auto' }}>
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
            <Stack spacing={0.75} sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="h4">Review Your Responses</Typography>
              <Typography variant="body1" color="text.secondary">
                Ensure all information is accurate and complete before submitting.
              </Typography>
            </Stack>
            <Box sx={{ mt: 3 }}>
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
            </Box>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ mt: 3, justifyContent: 'flex-end' }}
            >
              <Button type="button" onClick={handleBack} variant="outlined">
                Back
              </Button>
              {canShowDraftButton ? (
                <Button
                  type="button"
                  onClick={handleSaveDraft}
                  variant="outlined"
                  disabled={draftSaving}
                >
                  {draftSaving ? 'Saving…' : 'Save as Draft'}
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={handleSubmit}
                variant="contained"
                color="secondary"
                disabled={submitting}
                endIcon={<CheckIcon />}
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </Button>
            </Stack>
            {submitError ? (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {submitError}
              </Typography>
            ) : null}
            {draftMessage ? (
              <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                {draftMessage}
              </Typography>
            ) : null}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
