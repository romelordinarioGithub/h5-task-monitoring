/* eslint-disable padding-line-between-statements */

const extractTextString = (val) => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const textLike = val.text ?? val.value;
    return textLike != null ? String(textLike) : '';
  }
  return val != null ? String(val) : '';
};

const asMultiSelectArray = (val) => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object' && Array.isArray(val.selections)) {
    return val.selections;
  }
  return [];
};

const unwrapConditionValue = (val) => {
  if (val && typeof val === 'object' && Array.isArray(val.selections)) {
    return val.selections;
  }
  return val;
};

/**
 * Evaluates a showIf condition against the current answers map.
 *
 * Supported shapes:
 * - Logical groups
 *   - { all: [cond1, cond2, ...] }  -> every child condition must be true
 *   - { any: [cond1, cond2, ...] }  -> at least one child condition is true
 * - Leaf condition
 *   - { q: 'field_id', op: 'eq'|'in'|'contains'|'exists', value?: any }
 *
 * Operators:
 * - eq:       answers[q] === value
 * - in:       value must be an array; checks value.includes(answers[q])
 * - contains: when answers[q] is an array -> answers[q].includes(value)
 *             otherwise falls back to equality check answers[q] === value
 * - exists:   true when answers[q] is non-empty (arrays: length > 0,
 *             strings: not empty, anything else: not null/undefined)
 *
 * Returns true when cond is falsy to keep fields/pages visible by default.
 */
export function evalCondition(cond, answers) {
  if (!cond) return true;
  if (cond.all) return cond.all.every((c) => evalCondition(c, answers));
  if (cond.any) return cond.any.some((c) => evalCondition(c, answers));
  const value = unwrapConditionValue(answers[cond.q]);

  const normOne = (v) => {
    if (v && typeof v === 'object') {
      const id = v.id != null ? String(v.id) : undefined;
      const val = v.value != null ? String(v.value) : id;
      return { id, value: val };
    }
    if (v == null) return { id: undefined, value: undefined };
    const s = String(v);
    return { id: s, value: s };
  };
  const normMany = (arr) => (Array.isArray(arr) ? arr.map(normOne) : []);

  switch (cond.op) {
    case 'eq':
      if (Array.isArray(value)) {
        const items = normMany(value);
        const target = String(cond.value);
        return items.some((n) => n.id === target || n.value === target);
      } else {
        const n = normOne(value);
        const target = String(cond.value);
        return n.id === target || n.value === target;
      }
    case 'in': {
      if (!Array.isArray(cond.value)) return false;
      const set = new Set(cond.value.map((x) => String(x)));
      if (Array.isArray(value)) {
        const items = normMany(value);
        return items.some(
          (n) => (n.id && set.has(n.id)) || (n.value && set.has(n.value))
        );
      } else {
        const n = normOne(value);
        return (n.id && set.has(n.id)) || (n.value && set.has(n.value));
      }
    }
    case 'contains':
      if (Array.isArray(value)) {
        const items = normMany(value);
        const target = String(cond.value);
        return items.some((n) => n.id === target || n.value === target);
      } else {
        const n = normOne(value);
        const target = String(cond.value);
        return n.id === target || n.value === target;
      }
    case 'exists':
      if (Array.isArray(value)) return value.length > 0;
      if (value && typeof value === 'object') {
        const n = normOne(value);
        return Boolean(n.id || n.value);
      }
      return value !== undefined && value !== null && value !== '';
    default:
      return false;
  }
}

export function getVisiblePages(schemaObj, answers) {
  return (schemaObj.pages || []).filter(
    (p) => !p.showIf || evalCondition(p.showIf, answers)
  );
}

// Returns only fields on a page that should be visible given current answers
export function getVisibleFields(page, answers) {
  return (page.fields || []).filter(
    (f) => !f.showIf || evalCondition(f.showIf, answers)
  );
}

// Remove answers for fields that are currently hidden by their showIf rules.
export function filterAnswersByVisibility(schemaObj, answers) {
  const visiblePages = getVisiblePages(schemaObj, answers);
  const visibleIds = new Set();
  visiblePages.forEach((p) => {
    getVisibleFields(p, answers).forEach((f) => {
      visibleIds.add(f.id);
      // Preserve companion toggle fields (e.g., *_flag) when the parent field is visible.
      if (f.toggleFieldId) visibleIds.add(String(f.toggleFieldId));
    });
  });
  return Object.fromEntries(
    Object.entries(answers || {}).filter(([fid]) => visibleIds.has(fid))
  );
}

export function buildFieldGroupIndex(schemaObj) {
  const pages = schemaObj?.pages || [];
  const parentGroupIds = new Set(
    pages.map((p) => (p.parentId ? String(p.parentId) : null)).filter(Boolean)
  );
  const index = new Map();
  pages.forEach((page) => {
    const pageId = String(page.id);
    const parentId = page.parentId ? String(page.parentId) : null;
    let groupId = null;
    if (parentGroupIds.has(pageId)) {
      groupId = pageId;
    } else if (parentId && parentGroupIds.has(parentId)) {
      groupId = parentId;
    }
    if (!groupId) return;
    (page.fields || []).forEach((field) => {
      if (field?.id) index.set(String(field.id), groupId);
    });
  });
  return index;
}

export function splitAnswersByGroup(allAnswers, fieldGroupIndex) {
  const base = {};
  const grouped = {};
  Object.entries(allAnswers || {}).forEach(([key, value]) => {
    const groupId = fieldGroupIndex.get(String(key));
    if (groupId) {
      if (!grouped[groupId]) grouped[groupId] = {};
      grouped[groupId][key] = value;
    } else {
      base[key] = value;
    }
  });
  return { base, grouped };
}

export function mapFlagsToArrays(val) {
  if (Array.isArray(val)) return val.map((item) => mapFlagsToArrays(item));
  if (val && typeof val === 'object') {
    const next = {};
    Object.entries(val).forEach(([key, entry]) => {
      if (key === 'flags') return;
      next[key] = mapFlagsToArrays(entry);
    });
    if (Object.prototype.hasOwnProperty.call(val, 'flags')) {
      const flagsRaw = val.flags;
      const flagsArray = (() => {
        if (Array.isArray(flagsRaw)) {
          return flagsRaw.map((key) => String(key));
        }
        if (flagsRaw && typeof flagsRaw === 'object') {
          return Object.entries(flagsRaw)
            .filter(([, checked]) => Boolean(checked))
            .map(([key]) => String(key));
        }
        return [];
      })();
      next.flags = flagsArray;
    }
    return next;
  }
  return val;
}

const flattenConditions = (cond) => {
  if (!cond) return [];
  if (Array.isArray(cond)) return cond.flatMap((item) => flattenConditions(item));
  if (cond.all) return flattenConditions(cond.all);
  if (cond.any) return flattenConditions(cond.any);
  return [cond];
};

const cloneTemplateSizeSelections = (val) => {
  const selections = asMultiSelectArray(val);
  return mapFlagsToArrays(selections);
};

export function attachTemplateSizeSelections(schemaObj, answers) {
  if (!answers || typeof answers !== 'object') return answers;

  const nextAnswers = { ...answers };

  (schemaObj?.pages || []).forEach((page) => {
    (page.fields || []).forEach((field) => {
      const fieldId = String(field?.id || '');
      if (!fieldId.endsWith('_template_sizes')) return;

      const templateSizeSelections = cloneTemplateSizeSelections(answers[fieldId]);
      if (!Array.isArray(templateSizeSelections) || templateSizeSelections.length === 0) {
        return;
      }

      const templateFormatCondition = flattenConditions(field.showIf).find(
        (cond) =>
          cond &&
          cond.q &&
          String(cond.q).endsWith('_template_formats') &&
          (cond.op === 'contains' || cond.op === 'eq')
      );

      if (!templateFormatCondition) return;

      const templateFormatFieldId = String(templateFormatCondition.q);
      const templateFormatId = String(templateFormatCondition.value);
      const currentFormats = nextAnswers[templateFormatFieldId];

      if (!Array.isArray(currentFormats) || currentFormats.length === 0) return;

      nextAnswers[templateFormatFieldId] = currentFormats.map((format) => {
        if (!format || typeof format !== 'object') return format;

        const currentId = String(format.id ?? format.value ?? '');
        const currentValue = String(format.value ?? format.id ?? '');
        const isMatch =
          currentId === templateFormatId || currentValue === templateFormatId;

        if (!isMatch) return format;

        return {
          ...format,
          selections: templateSizeSelections,
        };
      });
    });
  });

  return nextAnswers;
}

export function omitEmptyToggleDates(payload, schemaObj) {
  if (!payload || typeof payload !== 'object') return payload;

  const toggleDateIds = new Set(
    (schemaObj?.pages || []).flatMap((page) =>
      (page.fields || [])
        .filter(
          (field) =>
            (field.type === 'date' || field.type === 'date_time') &&
            field.toggleFieldId
        )
        .map((field) => String(field.id))
    )
  );

  if (toggleDateIds.size === 0) return payload;

  const prune = (node) => {
    if (Array.isArray(node)) {
      return node.map((item) => prune(item));
    }

    if (!node || typeof node !== 'object') return node;

    const next = {};
    Object.entries(node).forEach(([key, value]) => {
      const normalizedKey = String(key);
      const isBlank =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '');

      if (toggleDateIds.has(normalizedKey) && isBlank) {
        return;
      }

      next[key] = prune(value);
    });

    return next;
  };

  return prune(payload);
}

export function omitEmptyStructuredMultiTextRows(payload, schemaObj) {
  if (!payload || typeof payload !== 'object') return payload;

  const structuredFieldMap = new Map(
    (schemaObj?.pages || []).flatMap((page) =>
      (page.fields || [])
        .filter(
          (field) =>
            field.type === 'multi_text' &&
            Array.isArray(field.rowFields) &&
            field.rowFields.length > 0
        )
        .map((field) => [
          String(field.id),
          field.rowFields
            .map((rowField) => String(rowField?.key || ''))
            .filter(Boolean),
        ])
    )
  );

  if (structuredFieldMap.size === 0) return payload;

  const prune = (node) => {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return node;

    const next = {};
    Object.entries(node).forEach(([key, value]) => {
      const rowKeys = structuredFieldMap.get(String(key));
      if (rowKeys && Array.isArray(value)) {
        next[key] = value
          .map((item) =>
            item && typeof item === 'object' && !Array.isArray(item)
              ? Object.fromEntries(
                rowKeys.map((rowKey) => [rowKey, String(item?.[rowKey] ?? '')])
              )
              : item
          )
          .filter((item) => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) {
              return String(item || '').trim().length > 0;
            }
            return rowKeys.some(
              (rowKey) => String(item?.[rowKey] || '').trim().length > 0
            );
          });
        return;
      }

      next[key] = prune(value);
    });

    return next;
  };

  return prune(payload);
}

export function fieldRequired(field) {
  return Boolean(field?.required ?? field?.isRequired);
}

export function validateField(field, value, answers) {
  if (!fieldRequired(field)) return '';

  if (
    field.type === 'text' ||
    field.type === 'text_only' ||
    field.type === 'long_text'
  ) {
    const resolvedValue = extractTextString(value);
    const isEmptyHtml = (val) => {
      if (val === undefined || val === null) return true;
      const text = String(val)
        // Strip HTML tags
        .replace(/<[^>]*>/g, '')
        // Convert non-breaking spaces to regular spaces
        .replace(/&nbsp;|\u00a0/g, ' ')
        // Collapse whitespace
        .replace(/\s+/g, ' ')
        .trim();
      return text.length === 0;
    };

    if (isEmptyHtml(resolvedValue)) return 'This field is required.';
    // Validators support for text; allows schema validators like ["url", "maxChars:200"]
    const validators = Array.isArray(field.validators) ? field.validators : [];
    const parseMaxFromValidators = () => {
      const maxRule = validators.find((v) =>
        String(v).toLowerCase().startsWith('maxchars')
      );
      if (!maxRule) return null;
      const parts = String(maxRule).split(':');
      if (parts.length === 2) {
        const n = Number(parts[1]);
        return Number.isFinite(n) && n > 0 ? n : null;
      }
      return null;
    };
    const effMax =
      parseMaxFromValidators() ??
      (field.maxChars ? Number(field.maxChars) : null);
    if (effMax) {
      const plain = String(resolvedValue || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;|\u00a0/g, ' ')
        .trim();
      if (plain.length > effMax) {
        return `Please keep under ${effMax} characters.`;
      }
    }

    // Additional validators
    const lower = validators.map((v) => String(v).toLowerCase());
    if (lower.includes('url')) {
      const str = String(resolvedValue || '').trim();
      let ok = false;
      try {
        const u = new URL(str);
        ok = u.protocol === 'http:' || u.protocol === 'https:';
      } catch (e) {
        ok = false;
      }
      if (!ok) return 'Please enter a valid URL (including http/https).';
    }

    return '';
  }

  if (field.type === 'multi_text') {
    const validators = Array.isArray(field.validators) ? field.validators : [];
    const rowFields = Array.isArray(field.rowFields)
      ? field.rowFields.filter((rowField) => rowField?.key)
      : [];
    const isStructuredRows = rowFields.length > 0;
    const arr = Array.isArray(value) ? value : [];
    const urlRowKey =
      rowFields.find((rowField) => rowField.key === 'link')?.key ||
      rowFields[rowFields.length - 1]?.key;
    if (isStructuredRows) {
      const nonEmptyRows = arr.filter(
        (row) =>
          row &&
          typeof row === 'object' &&
          rowFields.some((rowField) =>
            String(row?.[rowField.key] || '').trim().length > 0
          )
      );

      const hasLink = nonEmptyRows.some(
        (row) => String(row?.[urlRowKey] || '').trim().length > 0
      );
      if (!hasLink) return 'This field is required.';

      const missingLink = nonEmptyRows.find(
        (row) => String(row?.[urlRowKey] || '').trim().length === 0
      );
      if (missingLink) return 'Please enter a link for each row.';

      const parseMaxFromValidators = () => {
        const maxRule = validators.find((v) =>
          String(v).toLowerCase().startsWith('maxchars')
        );
        if (!maxRule) return null;
        const parts = String(maxRule).split(':');
        if (parts.length === 2) {
          const n = Number(parts[1]);
          return Number.isFinite(n) && n > 0 ? n : null;
        }
        return null;
      };
      const effMax =
        parseMaxFromValidators() ??
        (field.maxChars ? Number(field.maxChars) : null);
      if (effMax) {
        const over = nonEmptyRows.find((row) =>
          rowFields.some(
            (rowField) => String(row?.[rowField.key] || '').length > effMax
          )
        );
        if (over) return `Each entry must be under ${effMax} characters.`;
      }

      const lower = validators.map((v) => String(v).toLowerCase());
      if (lower.includes('url')) {
        const invalid = nonEmptyRows.find((row) => {
          const str = String(row?.[urlRowKey] || '').trim();
          try {
            const u = new URL(str);
            return !(u.protocol === 'http:' || u.protocol === 'https:');
          } catch (e) {
            return true;
          }
        });
        if (invalid) return 'Please enter valid URLs (including http/https).';
      }

      return '';
    }

    const hasText = arr.some((v) => String(v || '').trim().length > 0);
    if (!hasText) return 'This field is required.';
    const parseMaxFromValidators = () => {
      const maxRule = validators.find((v) =>
        String(v).toLowerCase().startsWith('maxchars')
      );
      if (!maxRule) return null;
      const parts = String(maxRule).split(':');
      if (parts.length === 2) {
        const n = Number(parts[1]);
        return Number.isFinite(n) && n > 0 ? n : null;
      }
      return null;
    };
    const effMax =
      parseMaxFromValidators() ??
      (field.maxChars ? Number(field.maxChars) : null);
    if (effMax) {
      const over = arr.find((v) => String(v || '').length > effMax);
      if (over) return `Each entry must be under ${effMax} characters.`;
    }

    const lower = validators.map((v) => String(v).toLowerCase());
    if (lower.includes('url')) {
      const invalid = arr
        .filter((v) => String(v || '').trim().length > 0)
        .find((v) => {
          const str = String(v || '').trim();
          try {
            const u = new URL(str);
            return !(u.protocol === 'http:' || u.protocol === 'https:');
          } catch (e) {
            return true;
          }
        });
      if (invalid) return 'Please enter valid URLs (including http/https).';
    }

    return '';
  }

  if (field.type === 'single_select' || field.type === 'single_select_popup')
    return value ? '' : 'Please select an option.';
  // If single_select supports custom, ensure custom text is provided when selected
  if (field.type === 'single_select' && field?.allowCustom) {
    if (typeof value === 'string' && value.startsWith('CUSTOM|')) {
      const text = value.slice('CUSTOM|'.length).trim();
      return text ? '' : 'Please specify a value.';
    }
  }

  if (
    field.type === 'multi_select' ||
    field.type === 'multi_select_popup' ||
    field.type === 'custom_multi_select_popover'
  ) {
    const arr = asMultiSelectArray(value);
    if (!Array.isArray(arr) || arr.length === 0) {
      return 'Please select at least one option.';
    }
    if (
      Array.isArray(field?.durationOptions) &&
      field.durationOptions.length > 0
    ) {
      const optionIdSet = new Set(
        (field.options || []).map((opt) => String(opt.id))
      );
      const hasMissing = arr.some((item) => {
        if (item && typeof item === 'object') {
          const itemId = String(item.id ?? '');
          if (!optionIdSet.has(itemId)) {
            // Skip validation for custom entries
            return false;
          }
          const duration = String(item.duration || '').trim();
          return duration.length === 0;
        }
        return true;
      });
      if (hasMissing) {
        return 'Please select a duration for each option.';
      }
    }
    return '';
  }

  if (field.type === 'date' || field.type === 'date_time') {
    // If this date has an associated toggle flag and it's ON, skip validation
    const flagId = field.toggleFieldId;
    if (flagId && answers && answers[flagId]) {
      return '';
    }
    if (!fieldRequired(field)) {
      return value ? '' : '';
    }
    return value ? '' : 'Please select a date.';
  }

  return '';
}

// (Removed) custom option caching helpers; no longer used

// Smoothly or instantly scroll the viewport to the top
export function scrollToTop(options = false) {
  try {
    const smooth =
      typeof options === 'boolean' ? options : Boolean(options?.smooth);
    const containerId =
      typeof options === 'object' && options?.containerId
        ? options.containerId
        : 'app-container';

    if (typeof document !== 'undefined') {
      const el = document.getElementById(containerId);
      if (el && typeof el.scrollTo === 'function') {
        el.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
        return;
      } else if (el) {
        el.scrollTop = 0;
        return;
      }
    }

    if (
      typeof window !== 'undefined' &&
      typeof window.scrollTo === 'function'
    ) {
      if (smooth) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }
    } else if (typeof document !== 'undefined') {
      (document.documentElement || document.body).scrollTop = 0;
    }
  } catch (err) {
    // no-op
  }
}
