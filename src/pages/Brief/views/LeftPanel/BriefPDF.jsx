import React, { useMemo } from 'react';
import { Box, Stack, Typography, Divider, Chip, Link } from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
    buildFormSummary,
    normalizeMultiSelectSummary,
} from './formSummary';

dayjs.extend(customParseFormat);

export default function BriefPDF({ briefData }) {
    const { answers, summary } = useMemo(
        () => buildFormSummary(briefData),
        [briefData]
    );

    return (
        <Box sx={{ width: 800, padding: 4, backgroundColor: '#fff' }} id="pdf-content-wrapper">
            <Stack spacing={0.75} sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="h4">Smartly Creative Request Form</Typography>
                <Link href={window.location.href} underline="always" target="_blank" rel="noopener" variant="body1">
                    {window.location.href}
                </Link>
            </Stack>
            <Box sx={{ mt: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">Form Summary</Typography>
                </Stack>
                {summary.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        No answers available.
                    </Typography>
                ) : (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {summary.map(({ page, fields }) => (
                            <Box key={page.id}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
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
                                            const { selections, flags } = normalizeMultiSelectSummary(val);
                                            const labelMap = new Map(
                                                (f.options || []).flatMap((o) => {
                                                    const lbl = o.value !== undefined && o.value !== null ? o.value : String(o.id);
                                                    const entries = [[o.id, lbl]];
                                                    if (o.value !== undefined) entries.push([o.value, lbl]);
                                                    return entries;
                                                })
                                            );
                                            const checkboxLabelMap = new Map((f.checkboxes || []).map((cb) => [String(cb.id), cb.label || String(cb.id)]));
                                            const flagEntries = Object.entries(flags || {}).filter(([, checked]) => Boolean(checked));

                                            if (selections.length === 0 && flagEntries.length === 0) {
                                                rendered = <Typography variant="body2" color="text.secondary">No selections</Typography>;
                                            } else {
                                                rendered = (
                                                    <Box>
                                                        {selections.length > 0 ? (
                                                            <Box sx={{ mb: flagEntries.length > 0 ? 1 : 0 }}>
                                                                {selections.map((v) => {
                                                                    const vid = typeof v === 'object' ? v.id : v;
                                                                    const vval = typeof v === 'object' ? v.value : v;
                                                                    const durationLabel = typeof v === 'object' && v.duration ? ` (${v.duration})` : '';
                                                                    const label = (labelMap.get(vid) || vval) + durationLabel;
                                                                    return <Chip key={String(vid)} size="small" label={label} sx={{ mr: 0.5, mb: 0.5 }} />;
                                                                })}
                                                            </Box>
                                                        ) : null}
                                                        {flagEntries.length > 0 ? (
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                                                                    Additional flags
                                                                </Typography>
                                                                <Box>
                                                                    {flagEntries.map(([flagId]) => {
                                                                        const key = String(flagId);
                                                                        const label = checkboxLabelMap.get(key) || key;
                                                                        return <Chip key={`flag-${key}`} size="small" variant="outlined" label={label} sx={{ mr: 0.5, mb: 0.5 }} />;
                                                                    })}
                                                                </Box>
                                                            </Box>
                                                        ) : null}
                                                    </Box>
                                                );
                                            }
                                        } else if (f.type === 'single' || f.type === 'single_select' || f.type === 'single_select_popup') {
                                            const labelMap = new Map(
                                                (f.options || []).flatMap((o) => {
                                                    const lbl = o.value !== undefined && o.value !== null ? o.value : String(o.id);
                                                    const entries = [[o.id, lbl]];
                                                    if (o.value !== undefined) entries.push([o.value, lbl]);
                                                    return entries;
                                                })
                                            );
                                            rendered = (
                                                <Typography variant="body2">
                                                    {typeof val === 'object' ? labelMap.get(val.id) || val.value : labelMap.get(val) || String(val)}
                                                </Typography>
                                            );
                                        } else if (f.type === 'text' || f.type === 'long_text') {
                                            const textContent = val && typeof val === 'object' ? (val.text !== undefined && val.text !== null ? val.text : (val.value !== undefined && val.value !== null ? val.value : '')) : String(val || '');
                                            const flags = (() => {
                                                if (val && typeof val === 'object') {
                                                    const raw = val.flags;
                                                    if (Array.isArray(raw)) {
                                                        return Object.fromEntries(raw.map((key) => [String(key), true]));
                                                    }

                                                    if (raw && typeof raw === 'object') return raw;
                                                }

                                                return {};
                                            })();
                                            const flagEntries = Object.entries(flags || {}).filter(([, checked]) => Boolean(checked));
                                            const checkboxLabelMap = new Map((f.checkboxes || []).map((cb) => [String(cb.id), cb.label || String(cb.id)]));

                                            rendered = (
                                                <Box>
                                                    <Typography variant="body2" component="div" sx={{ '& img': { maxWidth: '100%' } }} dangerouslySetInnerHTML={{ __html: textContent }} />
                                                    {flagEntries.length > 0 ? (
                                                        <Box sx={{ mt: 0.5 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>Additional flags</Typography>
                                                            <Box>
                                                                {flagEntries.map(([flagId]) => {
                                                                    const key = String(flagId);
                                                                    const label = checkboxLabelMap.get(key) || key;
                                                                    return <Chip key={`text-flag-${key}`} size="small" variant="outlined" label={label} sx={{ mr: 0.5, mb: 0.5 }} />;
                                                                })}
                                                            </Box>
                                                        </Box>
                                                    ) : null}
                                                </Box>
                                            );
                                        } else if (f.type === 'multi_text' && Array.isArray(val)) {
                                            const isStructuredRows = val.some((item) => item && typeof item === 'object' && !Array.isArray(item));
                                            rendered = isStructuredRows ? (
                                                <Stack spacing={1}>
                                                    {val.filter((row) => row && typeof row === 'object' && (String(row.label || '').trim().length > 0 || String(row.link || '').trim().length > 0)).map((row, i) => (
                                                        <Box key={`${f.id}-${i}`}>
                                                            {String(row.label || '').trim() ? (
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{String(row.label)}</Typography>
                                                            ) : null}
                                                            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>{String(row.link || '')}</Typography>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            ) : (
                                                <Box>
                                                    {val.filter((t) => String(t || '').trim().length > 0).map((t, i) => (
                                                        <Chip key={`${f.id}-${i}`} size="small" label={String(t)} sx={{ mr: 0.5, mb: 0.5 }} />
                                                    ))}
                                                </Box>
                                            );
                                        } else if (f.type === 'date' || f.type === 'date_time') {
                                            const flagId = f.toggleFieldId || f.checkboxFieldId;
                                            const hasDateValue = val !== undefined && val !== null && String(val).trim() !== '';
                                            if (flagId && answers[flagId] && !hasDateValue) {
                                                const label = f.toggleLabel || f.checkboxLabel || 'Always on';
                                                rendered = <Typography variant="body2">{label}</Typography>;
                                            } else {
                                                const iso = dayjs(val);
                                                const parsed = iso.isValid() ? iso : dayjs(String(val), 'MM/DD/YYYY hh:mm:ss A');
                                                const format = f.type === 'date' ? 'MMM D, YYYY' : 'MMM D, YYYY h:mm A';
                                                const nice = parsed.isValid() ? parsed.format(format) : String(val || '');
                                                rendered = <Typography variant="body2">{nice}</Typography>;
                                            }
                                        } else {
                                            rendered = <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{String(val || '')}</Typography>;
                                        }

                                        return (
                                            <Box key={f.id}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>{f.label}</Typography>
                                                {rendered}
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );
}

import PropTypes from 'prop-types';

BriefPDF.propTypes = {
    briefData: PropTypes.any,
};
