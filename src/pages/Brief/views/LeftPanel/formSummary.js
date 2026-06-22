import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import schema from 'pages/PublicForm/schema';
import {
  buildFieldGroupIndex,
  filterAnswersByVisibility,
  getVisibleFields,
  getVisiblePages,
} from 'pages/PublicForm/utils';

dayjs.extend(customParseFormat);

const DEFAULT_DATE_VALUES = new Set([
  '1970-01-01 08:00:00',
  '1970-01-01 08:01:00',
  '1970-01-01 00:00:00',
  '1970-01-01T00:00:00Z',
]);

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
          .map((field) => String((field && field.toggleFieldId) || ''))
          .filter(Boolean)
      )
      .filter(Boolean)
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

const normalizePayloadValue = (val) => {
  if (Array.isArray(val)) {
    return val.map((item) => normalizePayloadValue(item));
  }

  if (val && typeof val === 'object') {
    const next = {};

    Object.entries(val).forEach(([key, entry]) => {
      if (key === 'flags') return;
      next[key] = normalizePayloadValue(entry);
    });

    if (Object.prototype.hasOwnProperty.call(val, 'flags')) {
      const flagsRaw = val.flags;

      next.flags = (() => {
        if (Array.isArray(flagsRaw)) {
          return Object.fromEntries(flagsRaw.map((key) => [String(key), true]));
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
    }

    return next;
  }

  return val;
};

const flattenPayloadToAnswers = (payload) => {
  if (!payload || typeof payload !== 'object') return {};

  const schemaFieldIds = collectSchemaFieldIds();
  const allowedFieldIds = new Set(schemaFieldIds);
  const toggleFieldIds = collectToggleFieldIds();
  const dateFieldIds = collectDateFieldIds();
  const fieldGroupIndex = buildFieldGroupIndex(schema);
  const groupedKeys = Array.from(new Set(fieldGroupIndex.values()));
  const skipKeys = new Set(groupedKeys);
  const entries = {};

  toggleFieldIds.forEach((id) => allowedFieldIds.add(id));

  const assignFrom = (source) => {
    if (!source || typeof source !== 'object') return;

    Object.entries(source).forEach(([key, value]) => {
      const normKey = String(key);

      if (skipKeys.has(normKey)) return;
      if (!allowedFieldIds.has(normKey)) return;
      if (dateFieldIds.has(normKey) && isDefaultDateValue(value)) return;

      entries[normKey] = normalizePayloadValue(value);
    });
  };

  assignFrom(payload);
  groupedKeys.forEach((key) => {
    assignFrom(payload[key]);
  });

  return entries;
};

export const normalizeMultiSelectSummary = (val) => {
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

export const stripHtml = (value) => {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

const getChoiceLabel = (field, value) => {
  const labelMap = new Map(
    (field.options || []).flatMap((option) => {
      const label =
        option.value !== undefined && option.value !== null
          ? option.value
          : String(option.id);
      const entries = [[option.id, label]];

      if (option.value !== undefined) entries.push([option.value, label]);

      return entries;
    })
  );

  if (value && typeof value === 'object') {
    const key = value.id !== undefined && value.id !== null ? value.id : value.value;
    const fallback = value.value !== undefined && value.value !== null ? value.value : key;

    return labelMap.get(key) || fallback || '';
  }

  return labelMap.get(value) || value || '';
};

const formatMultiSelectText = (field, val) => {
  const { selections, flags } = normalizeMultiSelectSummary(val);
  const checkboxLabelMap = new Map(
    (field.checkboxes || []).map((checkbox) => [
      String(checkbox.id),
      checkbox.label || String(checkbox.id),
    ])
  );
  const selectedLabels = selections
    .map((selection) => {
      const label = getChoiceLabel(field, selection);
      const duration =
        selection && typeof selection === 'object' && selection.duration
          ? ` (${selection.duration})`
          : '';

      return label ? `${label}${duration}` : '';
    })
    .filter(Boolean);
  const flagLabels = Object.entries(flags || {})
    .filter(([, checked]) => Boolean(checked))
    .map(([flagId]) => checkboxLabelMap.get(String(flagId)) || String(flagId));
  const labels = [...selectedLabels, ...flagLabels];

  return labels.length > 0 ? labels.join(', ') : 'No selections';
};

export const formatFieldValueText = (field, val, answers) => {
  if (
    field.type === 'multiple' ||
    field.type === 'multi_select' ||
    field.type === 'multi_select_popup' ||
    field.type === 'custom_multi_select_popover'
  ) {
    return formatMultiSelectText(field, val);
  }

  if (
    field.type === 'single' ||
    field.type === 'single_select' ||
    field.type === 'single_select_popup'
  ) {
    return String(getChoiceLabel(field, val));
  }

  if (field.type === 'text' || field.type === 'long_text') {
    const textContent =
      val && typeof val === 'object'
        ? val.text !== undefined && val.text !== null
          ? val.text
          : val.value !== undefined && val.value !== null
          ? val.value
          : ''
        : val || '';
    const text = stripHtml(textContent);
    const flags = val && typeof val === 'object' && val.flags ? val.flags : {};
    const checkboxLabelMap = new Map(
      (field.checkboxes || []).map((checkbox) => [
        String(checkbox.id),
        checkbox.label || String(checkbox.id),
      ])
    );
    const flagLabels = Object.entries(flags || {})
      .filter(([, checked]) => Boolean(checked))
      .map(([flagId]) => checkboxLabelMap.get(String(flagId)) || String(flagId));

    return [text, ...flagLabels].filter(Boolean).join('\n');
  }

  if (field.type === 'multi_text' && Array.isArray(val)) {
    const isStructuredRows = val.some(
      (item) => item && typeof item === 'object' && !Array.isArray(item)
    );

    if (isStructuredRows) {
      return val
        .filter(
          (row) =>
            row &&
            typeof row === 'object' &&
            (String(row.label || '').trim().length > 0 ||
              String(row.link || '').trim().length > 0)
        )
        .map((row) =>
          [String(row.label || '').trim(), String(row.link || '').trim()]
            .filter(Boolean)
            .join('\n')
        )
        .join('\n\n');
    }

    return val
      .filter((text) => String(text || '').trim().length > 0)
      .map((text) => String(text))
      .join(', ');
  }

  if (field.type === 'date' || field.type === 'date_time') {
    const flagId = field.toggleFieldId || field.checkboxFieldId;
    const hasDateValue =
      val !== undefined && val !== null && String(val).trim() !== '';

    if (flagId && answers[flagId] && !hasDateValue) {
      return field.toggleLabel || field.checkboxLabel || 'Always on';
    }

    const iso = dayjs(val);
    const parsed = iso.isValid()
      ? iso
      : dayjs(String(val), 'MM/DD/YYYY hh:mm:ss A');
    const format = field.type === 'date' ? 'MMM D, YYYY' : 'MMM D, YYYY h:mm A';

    return parsed.isValid() ? parsed.format(format) : String(val || '');
  }

  return String(val || '');
};

const fieldHasAnswer = (field, answers) =>
  answers[field.id] !== undefined ||
  (field.toggleFieldId && Boolean(answers[field.toggleFieldId])) ||
  (field.checkboxFieldId && answers[field.checkboxFieldId] !== undefined);

export const buildFormSummary = (briefData) => {
  const rawAnswers = flattenPayloadToAnswers(briefData);
  const answers = filterAnswersByVisibility(schema, rawAnswers);
  const pages = getVisiblePages(schema, answers);
  const summary = [];

  pages.forEach((page) => {
    const fields = getVisibleFields(page, answers).filter((field) =>
      fieldHasAnswer(field, answers)
    );

    if (fields.length === 0) return;

    summary.push({ page, fields });
  });

  return { answers, summary };
};

const normalizeCsvCell = (value) => {
  if (value === null || value === undefined) return '';

  return `"${String(value).replace(/"/g, '""')}"`;
};

export const buildFormSummaryCsv = (briefData) => {
  const { answers, summary } = buildFormSummary(briefData);
  const rows = [];

  summary.forEach(({ fields }) => {
    fields.forEach((field) => {
      rows.push([
        field.label || '',
        formatFieldValueText(field, answers[field.id], answers),
      ]);
    });
  });

  if (rows.length === 0) {
    rows.push(['No answers available.', '']);
  }

  return rows.map((row) => row.map(normalizeCsvCell).join(',')).join('\n');
};
