/* eslint-disable padding-line-between-statements */
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Box,
  Stack,
  Button,
  ButtonBase,
  Typography,
  Paper,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Divider,
  Tooltip,
} from '@mui/material';
import cover from 'assets/smartly/ad-weave-patern.svg';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Swal from 'sweetalert2';
import schema from './schema';
import api from 'utils/api';
import Field from './components/Field';
import GlobalSnackbar from 'components/Common/SnackBar';
import {
  getVisiblePages,
  getVisibleFields,
  fieldRequired,
  validateField,
  scrollToTop,
  filterAnswersByVisibility,
  buildFieldGroupIndex,
  splitAnswersByGroup,
  mapFlagsToArrays,
  attachTemplateSizeSelections,
  omitEmptyStructuredMultiTextRows,
  omitEmptyToggleDates,
} from './utils';

const DEFAULT_DATE_VALUES = new Set([
  '1970-01-01 08:00:00',
  '1970-01-01 00:00:00',
  '1970-01-01T00:00:00Z',
]);

const ToastSuccess = Swal.mixin({
  toast: true,
  icon: 'success',
  width: 370,
  position: 'top-right',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const ToastError = Swal.mixin({
  toast: true,
  icon: 'error',
  width: 370,
  position: 'top-right',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const isDefaultDateValue = (val) => {
  if (!val) return false;
  const str = String(val).trim();
  if (!str) return false;
  if (DEFAULT_DATE_VALUES.has(str)) return true;
  return str.startsWith('1970-01-01');
};

const collectSchemaFieldIds = () =>
  new Set(
    (schema.pages || [])
      .flatMap((page) => (page.fields || []).map((field) => String(field.id)))
      .filter(Boolean)
  );

const collectToggleFieldIds = () =>
  new Set(
    (schema.pages || [])
      .flatMap((page) =>
        (page.fields || [])
          .map((field) => String(field?.toggleFieldId || ''))
          .filter(Boolean)
      )
  );

const collectDateFieldIds = () =>
  new Set(
    (schema.pages || [])
      .flatMap((page) =>
        (page.fields || [])
          .filter((field) => field.type === 'date' || field.type === 'date_time')
          .map((field) => String(field.id))
      )
      .filter(Boolean)
  );

const collectStepperTitles = () =>
  Array.from(
    new Set(
      (schema.pages || [])
        .map((page) => String(page?.stepperTitle || ''))
        .filter(Boolean)
    )
  );

const hasMeaningfulAnswer = (val) => {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') {
    return val.trim() !== '' && !isDefaultDateValue(val);
  }
  if (typeof val === 'number' || typeof val === 'boolean') return true;
  if (Array.isArray(val)) return val.some((entry) => hasMeaningfulAnswer(entry));
  if (typeof val === 'object') {
    if (Array.isArray(val.selections)) {
      const flagValues = Object.values(val.flags || {});
      return (
        val.selections.some((entry) => hasMeaningfulAnswer(entry)) ||
        flagValues.some((flag) => Boolean(flag))
      );
    }
    return Object.entries(val).some(([key, entry]) => {
      if (key === 'flags') {
        return Object.values(entry || {}).some((flag) => Boolean(flag));
      }
      return hasMeaningfulAnswer(entry);
    });
  }
  return false;
};

const pageHasProgress = (page, answers) =>
  getVisibleFields(page, answers).some(
    (field) =>
      hasMeaningfulAnswer(answers[field.id]) ||
      (field.toggleFieldId && Boolean(answers[field.toggleFieldId])) ||
      (field.checkboxFieldId && Boolean(answers[field.checkboxFieldId]))
  );

const pageIsComplete = (page, answers) => {
  const visibleFields = getVisibleFields(page, answers);
  if (visibleFields.length === 0) return false;
  return visibleFields.every(
    (field) => !validateField(field, answers[field.id], answers)
  );
};

const flattenPayloadToAnswers = (payload, allowedIds, groupedKeys, dateFieldIds) => {
  if (!payload || typeof payload !== 'object') return {};
  const entries = {};
  const skipKeys = new Set(groupedKeys);
  const normalizeValue = (val) => {
    if (Array.isArray(val)) return val.map((item) => normalizeValue(item));
    if (val && typeof val === 'object') {
      const next = {};
      Object.entries(val).forEach(([key, entry]) => {
        if (key === 'flags') return;
        next[key] = normalizeValue(entry);
      });
      if (Object.prototype.hasOwnProperty.call(val, 'flags')) {
        const flagsRaw = val.flags;
        const flagsObj = (() => {
          if (Array.isArray(flagsRaw)) {
            return Object.fromEntries(
              flagsRaw.map((key) => [String(key), true])
            );
          }
          if (flagsRaw && typeof flagsRaw === 'object') {
            return Object.fromEntries(
              Object.entries(flagsRaw).map(([key, flagVal]) => [
                String(key),
                Boolean(flagVal),
              ])
            );
          }
          return {};
        })();
        next.flags = flagsObj;
      }
      return next;
    }
    return val;
  };
  const assignFrom = (source) => {
    if (!source || typeof source !== 'object') return;
    Object.entries(source).forEach(([key, value]) => {
      const normKey = String(key);
      if (skipKeys.has(normKey)) return;
      if (allowedIds.has(normKey)) {
        if (dateFieldIds.has(normKey) && isDefaultDateValue(value)) return;
        entries[normKey] = normalizeValue(value);
      }
    });
  };
  assignFrom(payload);
  groupedKeys.forEach((key) => {
    const segment = payload?.[key];
    assignFrom(segment);
  });
  return entries;
};

const buildFieldGroupIndexMemo = () => buildFieldGroupIndex(schema);

// Page-level validation rules map
const pageRules = null;

// const pageRules = {
//   original_concept: (answers) => {
//     const disp = answers.display_channels;
//     const vid = answers.video_channels;
//     const hasDisp = Array.isArray(disp) && disp.length > 0;
//     const hasVid = Array.isArray(vid) && vid.length > 0;
//     if (!hasDisp && !hasVid) {
//       const msg = 'Select at least one: Display or Video channels.';
//       return { display_channels: msg, video_channels: msg };
//     }

//     return {};
//   },
// };

export default function PublicForm() {
  const formatDraftDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const [answers, setAnswers] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [prefillError, setPrefillError] = useState('');
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [draftsSearch, setDraftsSearch] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [canShowDraftButton, setCanShowDraftButton] = useState(true);
  const prefilledBriefIdRef = useRef(null);
  const history = useHistory();
  const location = useLocation();
  const { pathname, search } = location;
  const briefIdParam = useMemo(() => {
    const params = new URLSearchParams(search || '');
    const id = params.get('brief_id');
    return id || null;
  }, [search]);
  const { data: userData } = useSelector((state) => state.user);
  const visible = useMemo(() => getVisiblePages(schema, answers), [answers]);
  const schemaFieldIds = useMemo(() => collectSchemaFieldIds(), []);
  const toggleFieldIds = useMemo(() => collectToggleFieldIds(), []);
  const allowedFieldIds = useMemo(() => {
    const merged = new Set(schemaFieldIds);
    toggleFieldIds.forEach((id) => merged.add(id));
    return merged;
  }, [schemaFieldIds, toggleFieldIds]);
  const dateFieldIds = useMemo(() => collectDateFieldIds(), []);
  const fieldGroupIndex = useMemo(() => buildFieldGroupIndexMemo(), []);
  const stepTitles = useMemo(() => collectStepperTitles(), []);
  const groupedParentKeys = useMemo(
    () => Array.from(new Set(fieldGroupIndex.values())),
    [fieldGroupIndex]
  );
  const fromDraftFlow = useMemo(() => {
    if (location.state && location.state.fromDraft) return true;
    try {
      return sessionStorage.getItem('publicForm:fromDraft') === '1';
    } catch (err) {
      return false;
    }
  }, [location.state]);

  useEffect(() => {
    if (pageIndex > visible.length - 1) {
      setPageIndex(Math.max(0, visible.length - 1));
    }
  }, [visible.length, pageIndex]);

  useEffect(() => {
    if (briefIdParam) return;
    setCanShowDraftButton(true);
    try {
      sessionStorage.removeItem('publicForm:fromDraft');
      sessionStorage.removeItem('publicForm:loadedBriefMeta');
    } catch (err) {
      // ignore storage errors
    }
  }, [briefIdParam]);

  // Ensure we scroll to top whenever the page index changes
  useEffect(() => {
    scrollToTop(true);
  }, [pageIndex]);

  // Restore answers when returning from the review page.
  useEffect(() => {
    if (Object.keys(answers).length > 0) return;
    let pending = null;
    try {
      const raw = sessionStorage.getItem('publicForm:pendingReview');
      if (!raw) return;
      pending = JSON.parse(raw);
    } catch (err) {
      return;
    }
    if (!pending?.answers) return;
    const pendingBriefId = pending.briefId ?? null;
    if ((pendingBriefId || null) !== (briefIdParam || null)) return;
    setAnswers(pending.answers);
    setErrors({});
    setTouched({});
    if (Number.isFinite(pending.pageIndex)) {
      setPageIndex(pending.pageIndex);
    }
    if (briefIdParam) {
      prefilledBriefIdRef.current = briefIdParam;
    }
  }, [answers, briefIdParam]);

  // Ensure the public form can scroll vertically even if global CSS disables it
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  // Show toast after saving a draft from the review page
  useEffect(() => {
    try {
      if (sessionStorage.getItem('publicForm:draftSaved') === '1') {
        sessionStorage.removeItem('publicForm:draftSaved');
        setDraftSavedToast(true);
      }
    } catch (err) {
      // ignore storage errors
    }
  }, []);

  // Fetch drafts list
  useEffect(() => {
    const shouldLoad = draftsOpen || drafts.length === 0;
    if (!shouldLoad) return;
    let cancelled = false;
    (async () => {
      setDraftsLoading(true);
      try {
        const res = await api.callGet('admin/adweave-briefs', { draft: true });
        if (cancelled) return;
        const list =
          (Array.isArray(res?.data?.data) && res.data.data) ||
          (Array.isArray(res?.data?.briefs) && res.data.briefs) ||
          (Array.isArray(res?.data) && res.data) ||
          [];
        if (!cancelled) setDrafts(list);
      } catch (err) {
        if (!cancelled) setDrafts([]);
      } finally {
        if (!cancelled) setDraftsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [draftsOpen]);

  // Fetch partner list for company_name options
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api.callGet('admin/partner', { limit: 1000 });
      if (cancelled) return;
      const list =
        (Array.isArray(res?.data?.data) && res.data.data) ||
        (Array.isArray(res?.data?.partners) && res.data.partners) ||
        (Array.isArray(res?.data) && res.data) ||
        [];
      const excludedNames = new Set([
        'smartly v&d',
        'smartly v&d demo',
        'v&d demo',
        'v&d internal',
        'v&d sales',
        'v&d templates',
      ]);

      const mapped = list
        .filter((p) => {
          const sourceRaw = String(p?.data_source || '');
          const source = sourceRaw.toLowerCase().trim();
          if (!source) return false; // drop null/empty data_source

          const nameLower = String(
            p?.name ?? p?.value ?? p?.company_name ?? ''
          ).toLowerCase();

          if (source.includes('balham')) return false;
          if (excludedNames.has(nameLower)) return false;
          return true;
        })
        .map((p) => {
          const id = p?.id ?? p?._id ?? p?.partner_id ?? p?.value;
          const name = p?.name ?? p?.value ?? p?.company_name;
          if (!id || !name) return null;
          return { id: String(id), value: String(name) };
        })
        .filter(Boolean);
      setPartnerOptions(mapped);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Prefill the form if a brief_id query parameter is present
  useEffect(() => {
    const briefId = briefIdParam;
    if (!briefId || prefilledBriefIdRef.current === briefId) return;
    try {
      const pending = JSON.parse(
        sessionStorage.getItem('publicForm:pendingReview') || 'null'
      );
      if (pending?.briefId && pending.briefId === briefId) return;
    } catch (err) {
      // ignore pending review parse errors
    }

    prefilledBriefIdRef.current = briefId;
    let cancelled = false;
    setPrefillLoading(true);
    setPrefillError('');

    (async () => {
      const res = await api.callGet('admin/adweave-briefs', { id: briefId });
      if (cancelled) return;
      setPrefillLoading(false);
      if (res?.success && res?.data) {
        const isDraft = Boolean(res.data.is_draft !== false);
        setCanShowDraftButton(isDraft);
        try {
          sessionStorage.setItem(
            'publicForm:loadedBriefMeta',
            JSON.stringify({ briefId, isDraft })
          );
        } catch (err) {
          // ignore storage errors
        }
        const seededAnswers = flattenPayloadToAnswers(
          res.data,
          allowedFieldIds,
          groupedParentKeys,
          dateFieldIds
        );
        setAnswers(seededAnswers);
        setErrors({});
        setTouched({});
        setPageIndex(0);
      } else {
        const message = res?.message || 'Failed to load brief answers.';
        setPrefillError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [briefIdParam, allowedFieldIds, groupedParentKeys, dateFieldIds]);

  const current = visible[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === visible.length - 1;
  const stepItems = useMemo(() => {
    const byTitle = new Map(
      stepTitles.map((title, index) => [
        title,
        {
          title,
          index,
          pages: [],
          pageIndexes: [],
        },
      ])
    );

    visible.forEach((page, index) => {
      const title = String(page?.stepperTitle || '');
      const step = byTitle.get(title);
      if (!step) return;
      step.pages.push(page);
      step.pageIndexes.push(index);
    });

    return stepTitles.map((title, index) => {
      const step = byTitle.get(title);
      const isActive = step.pageIndexes.includes(pageIndex);
      const isVisible = step.pageIndexes.length > 0;
      const isStarted = step.pages.some((page) => pageHasProgress(page, answers));
      const isCompleted =
        step.pages.length > 0 &&
        step.pages.every((page) => pageIsComplete(page, answers));
      const firstPage = step.pages[0] || null;
      const subtitle = !isVisible
        ? 'This step will appear based on your selections.'
        : firstPage?.description
          ? String(firstPage.description)
          : `${step.pageIndexes.length} ${step.pageIndexes.length === 1 ? 'page' : 'pages'} in this section`;

      return {
        title,
        index,
        pages: step.pages,
        isActive,
        isVisible,
        isStarted,
        isCompleted,
        isAccessible: isActive || isStarted || isCompleted,
        pageCount: step.pageIndexes.length,
        subtitle,
        targetPageIndex:
          step.pageIndexes.length > 0 ? step.pageIndexes[0] : null,
      };
    });
  }, [answers, pageIndex, stepTitles, visible]);

  const onChange = (fid, val) =>
    setAnswers((prev) => ({ ...prev, [fid]: val }));

  const onBulkChange = (updates) =>
    setAnswers((prev) => {
      const next = { ...prev };
      Object.entries(updates || {}).forEach(([key, value]) => {
        if (value === undefined) delete next[key];
        else next[key] = value;
      });
      return next;
    });

  const onTouch = (fid) => setTouched((prev) => ({ ...prev, [fid]: true }));
  const canSaveDraft = Boolean(
    String(answers?.title ?? '').trim()
  );

  // Prefill email from authenticated user if available and field not yet edited
  useEffect(() => {
    const email = userData?.email;
    if (email && !answers.user_email && !touched.user_email) {
      setAnswers((prev) => ({ ...prev, user_email: email }));
    }
  }, [userData?.email, touched.user_email, answers.user_email]);

  // Validate current page fields, mark them touched, return true if valid
  const validateCurrentPage = () => {
    const page = visible[pageIndex];
    if (!page) return true;
    const nextErrors = {};
    getVisibleFields(page, answers).forEach((f) => {
      const msg = validateField(f, answers[f.id], answers);
      if (msg) nextErrors[f.id] = msg;
    });
    // Apply page-level rules, if any
    if (pageRules) {
      const ruleFn = pageRules[page.id];
      if (typeof ruleFn === 'function') {
        const ruleErrors = ruleFn(answers) || {};
        Object.assign(nextErrors, ruleErrors);
      }
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(
        getVisibleFields(page, answers).map((f) => [f.id, true])
      ),
    }));
    return Object.keys(nextErrors).length === 0;
  };

  // Go to next page if current page is valid
  const goNext = () => {
    if (validateCurrentPage()) {
      const freshVisible = getVisiblePages(schema, answers);
      setPageIndex((i) => Math.min(i + 1, freshVisible.length - 1));
      scrollToTop(true);
    }
  };

  // Remove answers/touched/errors for fields on the current page
  const clearCurrentPageState = () => {
    const page = visible[pageIndex];
    if (!page) return;
    const fieldIds = (page.fields || []).map((f) => f.id);

    setAnswers((prev) => {
      const next = { ...prev };
      fieldIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    setTouched((prev) => {
      const next = { ...prev };
      fieldIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      fieldIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
  };

  // Go to previous page
  const goPrev = () => {
    // clearCurrentPageState();
    setPageIndex((i) => Math.max(i - 1, 0));
  };

  const goToStep = (stepIndex) => {
    const step = stepItems.find((entry) => entry.index === stepIndex);
    if (!step || !step.isAccessible || step.targetPageIndex == null) return;
    if (step.isActive) return;
    setPageIndex(step.targetPageIndex);
    scrollToTop(true);
  };

  // Single path for final submit
  const validateAllPages = () => {
    const freshVisible = getVisiblePages(schema, answers);
    const aggregateErrors = {};
    freshVisible.forEach((p) => {
      getVisibleFields(p, answers).forEach((f) => {
        const msg = validateField(f, answers[f.id], answers);
        if (msg) aggregateErrors[f.id] = msg;
      });
      // Apply page-level rules for submission
      if (pageRules) {
        const ruleFn = pageRules[p.id];
        if (typeof ruleFn === 'function') {
          const ruleErrors = ruleFn(answers) || {};
          Object.assign(aggregateErrors, ruleErrors);
        }
      }
    });
    if (Object.keys(aggregateErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...aggregateErrors }));
      setTouched((prev) => ({
        ...prev,
        ...Object.fromEntries(
          freshVisible.flatMap((p) =>
            getVisibleFields(p, answers).map((f) => [f.id, true])
          )
        ),
      }));
      const firstErrorFieldId = Object.keys(aggregateErrors)[0];
      const pageIdx = freshVisible.findIndex((p) =>
        (p.fields || []).some((f) => f.id === firstErrorFieldId)
      );
      if (pageIdx >= 0) setPageIndex(pageIdx);
      return { ok: false, freshVisible };
    }
    return { ok: true, freshVisible };
  };

  const onContinueToReview = () => {
    const { ok } = validateAllPages();
    if (!ok) return;
    const filteredAnswers = filterAnswersByVisibility(schema, answers);
    try {
      sessionStorage.setItem(
        'publicForm:pendingReview',
        JSON.stringify({
          answers: filteredAnswers,
          ts: Date.now(),
          pageIndex,
          briefId: briefIdParam || null,
          fromDraft: fromDraftFlow || false,
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to store review answers', err);
    }
    const base = pathname.replace(/\/?success\/?$/, '').replace(/\/$/, '');
    history.push({
      pathname: `${base}/review`,
      search,
      state: { answers: filteredAnswers, fromDraft: fromDraftFlow },
    });
  };

  const handleSaveDraft = async () => {
    if (draftSaving) return;
    setDraftSaving(true);
    const filteredAnswers = filterAnswersByVisibility(schema, answers);
    const enrichedAnswers = attachTemplateSizeSelections(schema, filteredAnswers);
    const { base, grouped } = splitAnswersByGroup(
      enrichedAnswers,
      fieldGroupIndex
    );
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
        sessionStorage.removeItem('publicForm:pendingReview');
      } catch (err) {
        // ignore storage errors
      }
      setDraftSavedToast(true);
      setAnswers({});
      setErrors({});
      setTouched({});
      setPageIndex(0);
      setPrefillError('');
      setPrefillLoading(false);
      prefilledBriefIdRef.current = null;
      if (briefIdParam) {
        history.push({ pathname: '/form' });
      }
      scrollToTop(true);
    } else {
      ToastError.fire({
        title: res?.message || 'Failed to save draft. Please try again.',
      });
    }
    setDraftSaving(false);
  };

  // Ensure Next never triggers native submit
  const onNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    goNext();
    console.log('Answers: ', answers);
  };

  if (!current) return <div>No pages available.</div>;

  const filteredDrafts = drafts.filter((d) => {
    const name = String(d?.name ?? d?.title ?? '').toLowerCase();
    const term = draftsSearch.trim().toLowerCase();
    if (!term) return true;
    return name.includes(term);
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 6,
        px: 2,
        backgroundColor: 'whitesmoke',
        // Subtle white-to-whitesmoke with denser dot grid
        backgroundImage:
          'radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
        backgroundSize: '12px 12px, 12px 12px, 100% 100%',
        backgroundPosition: '0 0, 6px 6px, 0 0',
      }}
    >
      <Drawer
        anchor="right"
        open={draftsOpen}
        onClose={() => setDraftsOpen(false)}
        PaperProps={{ sx: { width: 360, p: 2 } }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          Drafts
        </Typography>
        <TextField
          size="small"
          fullWidth
          placeholder="Search drafts"
          value={draftsSearch}
          onChange={(e) => setDraftsSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Divider sx={{ mb: 1 }} />
        {draftsLoading ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Loading drafts…
          </Typography>
        ) : filteredDrafts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No drafts found.
          </Typography>
        ) : (
          <List dense>
            {filteredDrafts.map((draft) => (
              <ListItem
                key={draft.id || draft._id || draft.name}
                sx={{
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                  '&:hover .draft-remove': { opacity: 1 },
                }}
                onClick={() => {
                  const id =
                    draft.id ||
                    draft._id ||
                    draft.brief_id ||
                    draft.briefId;
                  if (!id) return;
                  setDraftsOpen(false);
                  try {
                    sessionStorage.setItem('publicForm:fromDraft', '1');
                  } catch (err) {
                    // ignore storage errors
                  }
                  history.push({
                    pathname: '/form',
                    search: `?brief_id=${encodeURIComponent(id)}`,
                    state: { fromDraft: true },
                  });
                }}
                secondaryAction={
                  <IconButton
                    size="small"
                    className="draft-remove"
                    sx={{ opacity: 0, transition: 'opacity .15s ease' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const id = draft.id || draft._id;
                      if (!id) return;
                      Swal.fire({
                        title:
                          '<p style="font-size: 0.85em">Do you want to delete this draft?</p>',
                        showDenyButton: false,
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        denyButtonText: 'No',
                        focusConfirm: false,
                        customClass: {
                          container: 'swal-container',
                        },
                      }).then(async (result) => {
                        if (!result.isConfirmed) return;
                        const res = await api.callPost(
                          `admin/adweave-briefs/delete?id=${encodeURIComponent(
                            id
                          )}`
                        );
                        if (res && res.success) {
                          setDrafts((prev) =>
                            prev.filter(
                              (d) =>
                                (d.id || d._id || d.name) !==
                                (draft.id || draft._id || draft.name)
                            )
                          );
                          ToastSuccess.fire({
                            title: 'Draft deleted.',
                          });
                        } else {
                          ToastError.fire({
                            title: res?.message || 'Failed to delete draft.',
                          });
                        }
                      });
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "14px" }} />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={draft.name || draft.title || 'Untitled Draft'}
                  secondary={
                    formatDraftDate(
                      draft.created_at ||
                      draft.createdAt ||
                      draft.updated_at ||
                      draft.updatedAt ||
                      ''
                    )
                  }
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Drawer>

      <Box sx={{ mx: -2 }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            px: { xs: 2, sm: 2.5, md: 4 },
            pt: { xs: 1.8, md: 2.2 },
            pb: { xs: 1.4, md: 1.6 },
            borderRadius: 0,
            color: '#ffffff',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #311062 100%)',
            boxShadow: '0 10px 30px -5px rgba(30, 27, 75, 0.25)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  mb: 0.35,
                }}
              >
                {schema.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.72)' }}
              >
                Navigate between completed steps without leaving the form.
              </Typography>
            </Box>
            <Tooltip
              title={`You have ${drafts.length} unfinished drafts`}
              arrow
              componentsProps={{
                tooltip: {
                  sx: { lineHeight: 1.2, maxWidth: 320, fontSize: 13 },
                },
              }}
            >
              <Badge
                color="secondary"
                badgeContent={drafts.length}
                overlap="circular"
                showZero={false}
                sx={{
                  '& .MuiBadge-badge': {
                    fontWeight: 700,
                    minWidth: 20,
                    height: 20,
                  },
                }}
              >
                <IconButton
                  color="inherit"
                  onClick={() => setDraftsOpen(true)}
                  sx={{
                    width: 42,
                    height: 42,
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    },
                  }}
                >
                  <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />
                </IconButton>
              </Badge>
            </Tooltip>
          </Stack>
        </Paper>
      </Box>

      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          mb: 4,
          mx: -2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            px: { xs: 2, sm: 2.5, md: 4 },
            py: { xs: 1.4, md: 1.8 },
            borderRadius: '0 0 24px 24px',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #311062 100%)',
            boxShadow: '0 10px 30px -5px rgba(30, 27, 75, 0.25)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 1.5, md: 2 }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${stepItems.length}, minmax(0, 1fr))`,
                  columnGap: { xs: 1, md: 1.5 },
                  alignItems: 'start',
                  pl: { xs: 0, md: '10%' },
                }}
              >
                {stepItems.map((step, index) => {
                  const accentColor = '#8f7cff';
                  const nodeColor = step.isCompleted
                    ? '#58c98b'
                    : step.isActive
                      ? '#ffffff'
                      : 'rgba(255, 255, 255, 0.24)';
                  const connectorColor = step.isCompleted
                    ? 'rgba(88, 201, 139, 0.65)'
                    : step.isActive
                      ? 'rgba(143, 124, 255, 0.6)'
                      : 'rgba(255, 255, 255, 0.16)';
                  const titleColor = step.isActive
                    ? '#ffffff'
                    : 'rgba(255, 255, 255, 0.82)';
                  const subtitleColor = step.isActive
                    ? 'rgba(255, 255, 255, 0.92)'
                    : 'rgba(255, 255, 255, 0.52)';

                  return (
                    <ButtonBase
                      key={step.title}
                      type="button"
                      onClick={() => goToStep(step.index)}
                      disabled={!step.isAccessible}
                      sx={{
                        width: '100%',
                        textAlign: 'left',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        opacity: step.isAccessible || step.isActive ? 1 : 0.5,
                        borderRadius: 2,
                        px: { xs: 0.2, md: 0.35 },
                        py: 0.2,
                      }}
                    >
                      <Box sx={{ width: '100%', minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: 18,
                            mb: 0.75,
                          }}
                        >
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: 8,
                              fontWeight: 800,
                              backgroundColor: nodeColor,
                              border: step.isActive
                                ? `2px solid ${accentColor}`
                                : '2px solid transparent',
                              boxShadow: step.isActive
                                ? '0 0 0 4px rgba(143, 124, 255, 0.26)'
                                : 'none',
                            }}
                          >
                            {step.isCompleted ? (
                              <CheckRoundedIcon sx={{ fontSize: 10 }} />
                            ) : null}
                          </Box>
                          {index < stepItems.length - 1 ? (
                            <Box
                              sx={{
                                flex: 1,
                                minWidth: 0,
                                height: 2,
                                ml: 0.8,
                                borderRadius: 999,
                                backgroundColor: connectorColor,
                              }}
                            />
                          ) : null}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            fontSize: { xs: 10, md: 10.5 },
                            lineHeight: 1.15,
                            color: subtitleColor,
                            mb: 0.2,
                            textTransform: 'uppercase',
                            letterSpacing: 0.9,
                          }}
                        >
                          Step {index + 1}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: 12, md: 13 },
                            color: titleColor,
                            lineHeight: 1.15,
                          }}
                        >
                          {step.title}
                        </Typography>
                      </Box>
                    </ButtonBase>
                  );
                })}
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>
      <Box sx={{ maxWidth: 840, mx: 'auto' }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <img
            src={smartlyLogo}
            alt="smartly-logo"
            style={{ width: 64, height: 'auto' }}
          />
        </Box> */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            backgroundColor: 'background.paper',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          }}
        >
          {/* <Box
            sx={{
              backgroundColor: '#25175a',
              color: '#fff',
              px: 4,
              pt: 7,
              height: 130,
              borderRadius: 2,
              backgroundImage: `url(${cover})`,
              backgroundSize: 'cover',
            }}
          >
            <Typography variant="h4" fontWeight={800}>
              {schema.title}
            </Typography>
          </Box> */}

          <Box sx={{ p: 4 }}>
            {prefillLoading ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Loading brief...
              </Typography>
            ) : null}
            {prefillError ? (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {prefillError}
              </Typography>
            ) : null}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="overline"
                sx={{ color: '#6b6681', letterSpacing: 1.1 }}
              >
                {current.stepperTitle}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {current.title}
              </Typography>
              {current.description && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {current.description}
                </Typography>
              )}
            </Box>

            {getVisibleFields(current, answers).map((field) => {
              const enrichedField =
                field.id === 'company_name' && partnerOptions.length > 0
                  ? { ...field, options: partnerOptions }
                  : field;
              const dividerConfig = field?.showDividerAfter;
              const showDivider = Boolean(dividerConfig);
              const dividerRawProps =
                dividerConfig && typeof dividerConfig === 'object'
                  ? dividerConfig
                  : {};
              const { sx: dividerSx, ...dividerProps } = dividerRawProps;
              return (
                <React.Fragment key={field.id}>
                  <Field
                    field={enrichedField}
                    value={answers[field.id]}
                    answers={answers}
                    onChange={onChange}
                    onBulkChange={onBulkChange}
                    onTouch={onTouch}
                    isRequired={fieldRequired(enrichedField)}
                    error={touched[field.id] ? errors[field.id] : ''}
                  />
                  {showDivider ? (
                    <Divider
                      {...dividerProps}
                      sx={{ my: 2, ...(dividerSx || {}) }}
                    />
                  ) : null}
                </React.Fragment>
              );
            })}

            <Stack
              direction="row"
              spacing={1.5}
              sx={{ mt: 2, justifyContent: 'flex-end' }}
            >
              <Button
                type="button"
                onClick={goPrev}
                disabled={isFirst}
                variant="outlined"
                color="primary"
              >
                Back
              </Button>
              {canShowDraftButton ? (
                <Button
                  type="button"
                  onClick={handleSaveDraft}
                  variant="outlined"
                  disabled={!canSaveDraft || draftSaving}
                >
                  {draftSaving ? 'Saving…' : 'Save as Draft'}
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={isLast ? onContinueToReview : onNextClick}
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                Next
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
      <GlobalSnackbar
        isOpen={draftSavedToast}
        onClose={() => setDraftSavedToast(false)}
        anchor={{ vertical: 'top', horizontal: 'center' }}
        alertType="success"
        alertHeader="Draft saved"
        alertContent="Your draft was saved successfully."
      />
    </Box>
  );
}
