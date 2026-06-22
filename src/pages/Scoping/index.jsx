import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Grid,
  Paper,
  Zoom,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Snackbar,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

import { useHistory } from 'react-router-dom';
import ScopingContext, { ScopingProvider } from './Context';
import { googleDriveApiKey, googleDriveClientID } from 'config';
import {
  isGooglePopupClosedError,
  loadGoogleIdentityServices,
  requestGoogleAccessToken,
} from 'services/googleIdentity';

const currencyFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
});

// Styling Tokens and CSS animations
const Page = styled(Box)({
  width: '100%',
  height: '100%',

  backgroundColor: '#f8fafc',
  fontFamily: 'Karla, Inter, Arial, sans-serif',
});

const HeaderBanner = styled(Paper)({
  background: 'linear-gradient(135deg, #1e1b4b 0%, #311062 100%)',
  color: '#ffffff',
  padding: '24px 32px',
  borderRadius: '0 0 24px 24px',
  boxShadow: '0 10px 30px -5px rgba(30, 27, 75, 0.25)',
  marginBottom: '24px',
});

const GOOGLE_DRIVE_UPLOAD_URL =
  'https://www.googleapis.com/upload/drive/v3/files';
const GOOGLE_DRIVE_SCOPE =
  'profile email https://www.googleapis.com/auth/drive.file';

const stripHtml = (value) => {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

const sanitizeFileName = (value) =>
  String(value || '')
    .replace(/[\\/:*?"<>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const csvCell = (value) => {
  const text = stripHtml(value);

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

const rowsToCsv = (rows) =>
  rows.map((row) => row.map(csvCell).join(',')).join('\r\n');

const uploadCsvToGoogleDrive = async ({ accessToken, csv, name }) => {
  const params = new URLSearchParams({
    uploadType: 'multipart',
    fields: 'id,name,webViewLink',
  });

  if (googleDriveApiKey) {
    params.append('key', googleDriveApiKey);
  }

  const boundary = `adweave_scoping_csv_${Date.now()}`;
  const delimiter = `--${boundary}\r\n`;
  const nextDelimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;
  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.spreadsheet',
  };
  const body =
    `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}` +
    `${nextDelimiter}Content-Type: text/csv\r\n\r\n` +
    `${csv}` +
    closeDelimiter;

  const response = await fetch(`${GOOGLE_DRIVE_UPLOAD_URL}?${params}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error && error.error && error.error.message) ||
        'Unable to export to Google Drive'
    );
  }

  return response.json();
};

// Inline Click-to-Edit Field
const getEditableValue = (value, lockedPrefix) => {
  if (!lockedPrefix) return value;

  const text = value === undefined || value === null ? '' : String(value);

  return text.startsWith(lockedPrefix) ? text.slice(lockedPrefix.length) : text;
};

const InlineEdit = ({
  value,
  onSave,
  label,
  isTextarea = false,
  isSelect = false,
  selectOptions = [],
  lockedPrefix = '',
  isSingleLine = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(() =>
    getEditableValue(value, lockedPrefix)
  );

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(getEditableValue(value, lockedPrefix));
    }
  }, [isEditing, lockedPrefix, value]);

  const buildSaveValue = (nextValue) =>
    lockedPrefix
      ? `${lockedPrefix}${getEditableValue(nextValue, lockedPrefix)}`
      : nextValue;

  const saveCurrentValue = () => {
    const nextValue = buildSaveValue(currentValue);

    setIsEditing(false);
    if (nextValue !== value) {
      onSave(nextValue);
    }
  };

  const handleBlur = () => {
    saveCurrentValue();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isTextarea) {
      saveCurrentValue();
    }

    if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(getEditableValue(value, lockedPrefix));
    }
  };

  const handleTextChange = (e) => {
    setCurrentValue(getEditableValue(e.target.value, lockedPrefix));
  };

  if (isEditing) {
    if (isSelect) {
      return (
        <Select
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(e.target.value);
            onSave(e.target.value);
            setIsEditing(false);
          }}
          onBlur={() => setIsEditing(false)}
          size="small"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          fullWidth
          sx={{
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            minHeight: '28px',
            backgroundColor: '#ffffff',
          }}
        >
          {selectOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      );
    }

    return (
      <TextField
        value={currentValue}
        onChange={handleTextChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        size="small"
        multiline={isTextarea}
        rows={isTextarea ? 3 : 1}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        fullWidth
        placeholder={label}
        variant="outlined"
        InputProps={{
          startAdornment: lockedPrefix ? (
            <InputAdornment
              position="start"
              disableTypography
              sx={{
                color: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
              }}
            >
              {lockedPrefix}
            </InputAdornment>
          ) : null,
          sx: {
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            backgroundColor: '#ffffff',
            p: isTextarea ? '8px' : '4px 8px',
          },
        }}
      />
    );
  }

  return (
    <Box
      onClick={() => setIsEditing(true)}
      sx={{
        cursor: 'pointer',
        borderRadius: '8px',
        padding: '4px 8px',
        margin: '-4px -8px',
        '&:hover': {
          backgroundColor: '#f1f5f9',
          boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.25)',
        },
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        width: '100%',
        minHeight: '28px',
      }}
    >
      <Typography
        variant="inherit"
        sx={{
          flexGrow: 1,
          whiteSpace: isSingleLine ? 'nowrap' : (isTextarea ? 'pre-wrap' : 'normal'),
          overflow: isSingleLine ? 'hidden' : 'visible',
          textOverflow: isSingleLine ? 'ellipsis' : 'clip',
        }}
      >
        {value || (
          <Box
            component="span"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              fontSize: '0.9em',
            }}
          >
            Add {label || 'details'}
          </Box>
        )}
      </Typography>
      <EditIcon
        sx={{
          fontSize: '0.8em',
          color: 'text.secondary',
          opacity: 0.2,
          '.MuiBox-root:hover &': { opacity: 0.8 },
        }}
      />
    </Box>
  );
};

InlineEdit.propTypes = {
  value: PropTypes.any,
  onSave: PropTypes.func.isRequired,
  label: PropTypes.string,
  isTextarea: PropTypes.bool,
  isSelect: PropTypes.bool,
  selectOptions: PropTypes.array,
  lockedPrefix: PropTypes.string,
  isSingleLine: PropTypes.bool,
};

// Read-only package includes preview. The title is editable, but package includes
// content is not directly edited on this page.
const PackageIncludesPreview = ({ formats = [] }) => {
  const visibleFormats = formats.filter(Boolean);

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      useFlexGap
      alignItems="flex-start"
      sx={{
        gap: 0.75,
        mt: 1.25,
        width: '100%',
      }}
    >
      {visibleFormats.length > 0 ? (
        visibleFormats.map((format, idx) => (
          <Box
            key={`${format}-${idx}`}
            component="span"
            sx={{
              px: 1.2,
              py: 0.4,
              borderRadius: '16px',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              minHeight: '32px',
              lineHeight: 1.2,
            }}
          >
            {String(format)}
          </Box>
        ))
      ) : (
        <Typography
          variant="caption"
          color="text.secondary"
          fontStyle="italic"
          sx={{ lineHeight: '32px' }}
        >
          No package includes
        </Typography>
      )}
    </Stack>
  );
};

PackageIncludesPreview.propTypes = {
  formats: PropTypes.array,
};

// Package Units Controller
const QuantityController = ({ value, onChange }) => {
  const parsedValue = parsePackageUnits(value);
  const hasIntegerValue = String(value || '').trim() !== '' && parsedValue > 0;

  const handleIncrement = (e) => {
    e.stopPropagation();
    onChange(String(parsedValue + 1));
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (parsedValue > 0) {
      onChange(String(parsedValue - 1));
    }
  };

  const active = String(value || '').trim() !== '';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: active ? '#6366f1' : '#cbd5e1',
        borderRadius: '24px',
        p: '2px',
        backgroundColor: active ? alpha('#6366f1', 0.05) : '#ffffff',
        boxShadow: active ? '0 4px 12px rgba(99, 102, 241, 0.12)' : 'none',
        transition: 'all 0.3s ease',
        width: '90px',
        '&:hover': {
          borderColor: '#6366f1',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.16)',
        },
      }}
    >
      <IconButton
        onClick={handleDecrement}
        disabled={!hasIntegerValue}
        size="small"
        sx={{
          p: '3px',
          color: active ? '#6366f1' : '#94a3b8',
          '&:hover': { backgroundColor: alpha('#6366f1', 0.1) },
        }}
      >
        <RemoveIcon sx={{ fontSize: '13px' }} />
      </IconButton>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="0"
        style={{
          border: 0,
          outline: 0,
          background: 'transparent',
          width: '46px',
          textAlign: 'center',
          fontWeight: active ? 700 : 500,
          color: active ? '#1e1b4b' : '#64748b',
          fontSize: '13px',
          fontFamily: 'inherit',
        }}
      />
      <IconButton
        onClick={handleIncrement}
        size="small"
        sx={{
          p: '3px',
          color: '#6366f1',
          '&:hover': { backgroundColor: alpha('#6366f1', 0.1) },
        }}
      >
        <AddIcon sx={{ fontSize: '13px' }} />
      </IconButton>
    </Box>
  );
};

QuantityController.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

const parseCurrency = (value) => {
  const normalized = String(value || '').replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? 0 : parsed;
};

const areQuantitiesEqual = (currentQuantities = {}, initialQuantities = {}) => {
  const keys = new Set([
    ...Object.keys(currentQuantities),
    ...Object.keys(initialQuantities),
  ]);

  return [...keys].every(
    (key) =>
      String(currentQuantities[key] || '').trim() ===
      String(initialQuantities[key] || '').trim()
  );
};

const getExplicitPackageTotal = (brief) => {
  if (
    brief.initialQuantities &&
    !areQuantitiesEqual(brief.quantities, brief.initialQuantities)
  ) {
    return null;
  }

  const totalValue = [
    brief.packageTotal,
    brief.package_total,
    brief.totalPrice,
    brief.total_price,
    brief.priceTotal,
    brief.price_total,
    brief.total,
    brief.price,
  ].find(
    (value) =>
      value !== undefined && value !== null && String(value).trim() !== ''
  );

  if (totalValue === undefined) return null;

  const normalized = String(totalValue).replace(/[^0-9.-]/g, '');
  const parsed = Number(normalized);

  return normalized && !Number.isNaN(parsed) ? parsed : null;
};

const parsePackageUnits = (value) => {
  const normalized = String(value || '').trim();

  if (!/^\d+$/.test(normalized)) return 0;

  return Number(normalized);
};

const formatCurrency = (value) => currencyFormatter.format(value);

const getUniquePackageId = (briefs, packageNumber) => {
  const existingIds = new Set(briefs.map((brief) => brief.id));
  const baseId = `package-${packageNumber}`;

  if (!existingIds.has(baseId)) return baseId;

  let suffix = 2;
  while (existingIds.has(`${baseId}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseId}-${suffix}`;
};

const getScopingCsvFileName = ({ briefId, sheetLabels, briefs }) => {
  const firstBriefTitle = briefs[0] && briefs[0].title ? briefs[0].title : '';
  const title = sheetLabels.masterRateCard || firstBriefTitle || 'Scoping';
  const briefLabel = briefId ? `Brief ${briefId}` : 'Brief';

  return sanitizeFileName(`${briefLabel} - ${title} - Scoping`);
};

const buildScopingCsv = ({ sheetLabels, groupedRows, briefs, totals }) => {
  const packageHeaders = briefs.map((brief) => brief.title || brief.id);
  const rows = [
    [sheetLabels.masterRateCard],
    [],
    [
      sheetLabels.serviceType,
      sheetLabels.serviceDescription,
      sheetLabels.price,
      ...packageHeaders,
    ],
    [
      'Package Description',
      '',
      '',
      ...briefs.map((brief) => brief.title || ''),
    ],
    [
      sheetLabels.packageIncludes,
      '',
      '',
      ...briefs.map((brief) =>
        (brief.formats || []).filter(Boolean).join(', ')
      ),
    ],
  ];

  groupedRows.forEach((section) => {
    rows.push([section.title]);

    section.rows.forEach((row) => {
      rows.push([
        row.serviceType,
        row.description,
        row.price,
        ...briefs.map((brief) => brief.quantities[row.id] || ''),
      ]);
    });
  });

  rows.push([
    sheetLabels.packageTotals,
    '',
    '',
    ...briefs.map((brief) => formatCurrency(totals[brief.id] || 0)),
  ]);

  return rowsToCsv(rows);
};

const ScopingMain = () => {
  const history = useHistory();
  const {
    briefId,
    rateCardRows,
    setRateCardRows,
    briefs,
    setBriefs,
    statusMessage,
    setStatusMessage,
    isLoadingScope,
    selectedTemplate,
    setSelectedTemplate,
    templateOptions = [],
    scopeError,
  } = useContext(ScopingContext);

  // UI state enhancers
  const [activeBriefId, setActiveBriefId] = useState(null);
  const [hoveredBriefId, setHoveredBriefId] = useState(null);
  const [sheetLabels, setSheetLabels] = useState({
    masterRateCard: 'MASTER RATE CARD',
    serviceType: 'SERVICE TYPE',
    serviceDescription: 'SERVICE DESCRIPTION',
    price: 'PRICE',
    packageIncludes: 'PACKAGE INCLUDES',
    packageTotals: 'Package Totals',
  });

  // Export Steps Dialog
  const [exportOpen, setExportOpen] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedFile, setExportedFile] = useState(null);
  const [exportFileName, setExportFileName] = useState('');
  const [isExportingDrive, setIsExportingDrive] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    if (!googleDriveClientID) return;

    loadGoogleIdentityServices().catch((error) => {
      console.error('Failed to preload Google Identity Services', error);
    });
  }, []);

  const totals = useMemo(
    () =>
      briefs.reduce((nextTotals, brief) => {
        const explicitPackageTotal = getExplicitPackageTotal(brief);

        if (explicitPackageTotal !== null) {
          return {
            ...nextTotals,
            [brief.id]: explicitPackageTotal,
          };
        }

        const total = rateCardRows.reduce((sum, row) => {
          if (row.type !== 'service') return sum;

          const quantity = parsePackageUnits(brief.quantities[row.id]);
          const price = parseCurrency(row.price);

          return sum + price * quantity;
        }, 0);

        return {
          ...nextTotals,
          [brief.id]: total,
        };
      }, {}),
    [briefs, rateCardRows]
  );

  const visibleTemplateOptions = useMemo(
    () => templateOptions.filter((option) => option.label === '2026 Rate Card'),
    [templateOptions]
  );

  const handleRateCardRowChange = (rowId, field, value) => {
    setRateCardRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  const handleBriefChange = (briefId, field, value) => {
    setBriefs((currentBriefs) =>
      currentBriefs.map((brief) =>
        brief.id === briefId
          ? {
              ...brief,
              [field]: value,
            }
          : brief
      )
    );
  };

  const handleAddPackage = () => {
    const packageNumber = briefs.length + 1;
    const newPackage = {
      id: getUniquePackageId(briefs, packageNumber),
      title: `Package ${packageNumber}`,
      platform: '',
      formats: [],
      quantities: {},
    };

    setBriefs((currentBriefs) => [...currentBriefs, newPackage]);
    setActiveBriefId(newPackage.id);
  };

  const handleQuantityChange = (briefId, rowId, value) => {
    setBriefs((currentBriefs) =>
      currentBriefs.map((brief) =>
        brief.id === briefId
          ? {
              ...brief,
              quantities: {
                ...brief.quantities,
                [rowId]: value,
              },
            }
          : brief
      )
    );
  };

  const handleSheetLabelChange = (field, value) => {
    setSheetLabels((currentLabels) => ({
      ...currentLabels,
      [field]: value,
    }));
  };

  const handleBack = () => {
    if (briefId) {
      history.push(`/brief/${briefId}`);
      return;
    }

    history.push('/');
  };

  const handleExportToGoogleDrive = async () => {
    if (!googleDriveClientID) {
      setStatusMessage('Google Drive client ID is not configured');
      return;
    }

    setExportOpen(true);
    setExportStep(0);
    setExportProgress(15);
    setExportError('');
    setExportedFile(null);
    setIsExportingDrive(true);

    try {
      const fileName = getScopingCsvFileName({
        briefId,
        sheetLabels,
        briefs,
      });
      const csv = buildScopingCsv({
        sheetLabels,
        groupedRows,
        briefs,
        totals,
      });

      setExportFileName(fileName);
      setExportStep(1);
      setExportProgress(35);

      const googleResponse = await requestGoogleAccessToken({
        clientId: googleDriveClientID,
        scope: GOOGLE_DRIVE_SCOPE,
        prompt: 'consent',
      });

      setExportStep(2);
      setExportProgress(60);

      setExportStep(3);
      setExportProgress(80);

      const uploadedFile = await uploadCsvToGoogleDrive({
        accessToken: googleResponse.accessToken,
        csv,
        name: fileName,
      });

      setExportedFile(uploadedFile);
      setExportStep(4);
      setExportProgress(100);
      setStatusMessage('Exported to Google Drive');
    } catch (err) {
      if (isGooglePopupClosedError(err)) {
        setExportOpen(false);
        return;
      }

      const message =
        (err && err.message) || 'Unable to export to Google Drive';

      setExportError(message);
      setStatusMessage(message);
    } finally {
      setIsExportingDrive(false);
    }
  };

  // Group rate card rows by section
  const groupedRows = useMemo(() => {
    let currentSection = { id: 'unassigned', title: 'General Items', rows: [] };
    const groups = [];

    rateCardRows.forEach((row) => {
      if (row.type === 'section') {
        if (
          currentSection.rows.length > 0 ||
          currentSection.id !== 'unassigned'
        ) {
          groups.push(currentSection);
        }

        currentSection = { id: row.id, title: row.title, rows: [] };
      } else {
        currentSection.rows.push(row);
      }
    });

    if (currentSection.rows.length > 0 || currentSection.id !== 'unassigned') {
      groups.push(currentSection);
    }

    return groups;
  }, [rateCardRows]);

  const packageColumnCount = Math.max(briefs.length, 1);
  const sheetColumnTemplate = `minmax(220px, 1.1fr) minmax(320px, 1.7fr) minmax(140px, 0.7fr) repeat(${packageColumnCount}, minmax(170px, 1fr))`;
  const sheetMinWidth = 720 + packageColumnCount * 170;
  const sheetCellSx = {
    p: 1.5,
    borderRight: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    minHeight: '74px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  };
  const sheetHeaderCellSx = {
    ...sheetCellSx,
    minHeight: '88px',
    backgroundColor: '#eef2ff',
  };
  const packageHeaderCellSx = {
    ...sheetCellSx,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    minHeight: '148px',
    p: 2,
  };
  const sheetFixedCellSx = {
    ...sheetCellSx,
    backgroundColor: '#f8fafc',
  };
  const sheetStickyTotalCellSx = {
    ...sheetFixedCellSx,
    position: 'sticky',
    bottom: 0,
    zIndex: 3,
    borderTop: '2px solid #c7d2fe',
    boxShadow: '0 -8px 18px rgba(15, 23, 42, 0.08)',
  };

  return (
    <Page>
      {/* Header Banner */}
      <HeaderBanner elevation={0}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={4}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                textTransform: 'none',
                px: 2.5,
                py: 1,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              Back
            </Button>
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ letterSpacing: '-0.02em', mb: 0.5 }}
              >
                <InlineEdit
                  value={sheetLabels.masterRateCard}
                  label="Master Rate Card Title"
                  onSave={(val) =>
                    handleSheetLabelChange('masterRateCard', val)
                  }
                />
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Global Brief - Edit Scoping - Export to Google Drive
                </Typography>
                {briefId && (
                  <Chip
                    label={
                      isLoadingScope
                        ? `Loading brief #${briefId}`
                        : `Brief #${briefId}`
                    }
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontWeight: 700,
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              size="small"
              inputProps={{ 'aria-label': 'Scoping template' }}
              sx={{
                minWidth: 190,
                height: 46,
                borderRadius: '14px',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                fontWeight: 700,
                textTransform: 'none',
                '& .MuiSelect-select': {
                  py: 1.25,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.18)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.34)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.48)',
                },
                '& .MuiSvgIcon-root': {
                  color: '#ffffff',
                },
              }}
            >
              {visibleTemplateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              startIcon={
                isExportingDrive ? (
                  <CircularProgress color="inherit" size={18} />
                ) : (
                  <DriveFileMoveOutlinedIcon />
                )
              }
              onClick={handleExportToGoogleDrive}
              disabled={isExportingDrive || isLoadingScope}
              sx={{
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                py: 1.25,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                },
              }}
            >
              {isExportingDrive ? 'Exporting...' : 'Export to Google Drive'}
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              disabled
              sx={{
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                py: 1.25,
                boxShadow: 'none',
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.55)',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                },
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </HeaderBanner>

      {isLoadingScope && (
        <LinearProgress
          sx={{
            flexShrink: 0,
            mx: 4,
            mt: -1.5,
            mb: 2,
            height: '6px',
            borderRadius: '999px',
            backgroundColor: '#e0e7ff',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
            },
          }}
        />
      )}

      {scopeError && !isLoadingScope && (
        <Box sx={{ px: 4, mt: -1, mb: 2, flexShrink: 0 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: '16px',
              borderColor: '#fecaca',
              backgroundColor: '#fef2f2',
            }}
          >
            <Typography variant="body2" fontWeight={700} color="#991b1b">
              {scopeError}
            </Typography>
          </Paper>
        </Box>
      )}

      <Box sx={{ px: 4, pb: 4, flex: 1, minHeight: 0, display: 'flex' }}>
        <Grid container spacing={4} sx={{ flex: 1, minHeight: 0 }}>
          {/* Rate Card sheet matrix */}
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
          >
            <Paper
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                maxHeight: 'calc(100vh - 175px)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  overflow: 'auto',
                  flex: 1,
                  minHeight: 0,
                  backgroundColor: '#ffffff',
                }}
              >
                <Box
                  sx={{
                    minWidth: sheetMinWidth,
                    display: 'grid',
                    gridTemplateColumns: sheetColumnTemplate,
                  }}
                >
                  <Box
                    sx={{
                      ...sheetHeaderCellSx,
                      gridColumn: '1 / -1',
                      minHeight: '76px',
                      background: '#f8fafc',
                    }}
                  >
                    <Typography variant="h6" fontWeight={850} color="#1e1b4b">
                      <InlineEdit
                        value={sheetLabels.masterRateCard}
                        label="Master Rate Card Title"
                        onSave={(val) =>
                          handleSheetLabelChange('masterRateCard', val)
                        }
                      />
                    </Typography>
                  </Box>

                  <Box sx={sheetHeaderCellSx}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={850}
                      color="#1e1b4b"
                    >
                      <InlineEdit
                        value={sheetLabels.serviceType}
                        label="Service Type Title"
                        onSave={(val) =>
                          handleSheetLabelChange('serviceType', val)
                        }
                      />
                    </Typography>
                  </Box>

                  <Box sx={sheetHeaderCellSx}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={850}
                      color="#1e1b4b"
                    >
                      <InlineEdit
                        value={sheetLabels.serviceDescription}
                        label="Service Description Title"
                        onSave={(val) =>
                          handleSheetLabelChange('serviceDescription', val)
                        }
                      />
                    </Typography>
                  </Box>

                  <Box sx={sheetHeaderCellSx}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={850}
                      color="#1e1b4b"
                    >
                      <InlineEdit
                        value={sheetLabels.price}
                        label="Price Title"
                        onSave={(val) => handleSheetLabelChange('price', val)}
                      />
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      ...sheetHeaderCellSx,
                      gridColumn: '4 / -1',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={850}
                          color="#1e1b4b"
                        >
                          <InlineEdit
                            value={sheetLabels.packageIncludes}
                            label="Package Includes Title"
                            onSave={(val) =>
                              handleSheetLabelChange('packageIncludes', val)
                            }
                          />
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={handleAddPackage}
                        disabled={isLoadingScope}
                        sx={{
                          borderRadius: '12px',
                          backgroundColor: '#4f46e5',
                          color: '#ffffff',
                          textTransform: 'none',
                          fontWeight: 800,
                          px: 1.5,
                          py: 0.75,
                          boxShadow: '0 6px 14px rgba(79, 70, 229, 0.22)',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            backgroundColor: '#4338ca',
                            boxShadow: '0 8px 18px rgba(79, 70, 229, 0.28)',
                          },
                        }}
                      >
                        Add Package
                      </Button>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      ...sheetFixedCellSx,
                      gridColumn: '1 / span 3',
                      backgroundColor: '#f8fafc',
                    }}
                  />

                  {briefs.map((brief) => {
                    const isActive = activeBriefId === brief.id;

                    return (
                      <Box
                        key={brief.id}
                        onClick={() =>
                          setActiveBriefId(isActive ? null : brief.id)
                        }
                        onMouseEnter={() => setHoveredBriefId(brief.id)}
                        onMouseLeave={() => setHoveredBriefId(null)}
                        sx={{
                          ...packageHeaderCellSx,
                          backgroundColor: isActive ? '#eef2ff' : '#ffffff',
                          boxShadow: isActive
                            ? 'inset 0 0 0 1px #6366f1'
                            : 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={850}
                          color="#1e1b4b"
                          sx={{ width: '100%' }}
                        >
                          <InlineEdit
                            value={brief.title}
                            label="Package Description"
                            onSave={(val) =>
                              handleBriefChange(brief.id, 'title', val)
                            }
                          />
                        </Typography>
                        <PackageIncludesPreview formats={brief.formats} />
                      </Box>
                    );
                  })}

                  {groupedRows.map((section) => (
                    <React.Fragment key={section.id}>
                      <Box
                        sx={{
                          ...sheetFixedCellSx,
                          gridColumn: '1 / -1',
                          minHeight: '48px',
                          backgroundColor: '#f1f5f9',
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{ width: '100%' }}
                        >
                          <Typography
                            variant="subtitle2"
                            fontWeight={850}
                            color="#1e1b4b"
                            sx={{ width: '100%' }}
                          >
                            <InlineEdit
                              value={section.title}
                              label="Section Title"
                              onSave={(val) =>
                                handleRateCardRowChange(
                                  section.id,
                                  'title',
                                  val
                                )
                              }
                            />
                          </Typography>
                        </Stack>
                      </Box>

                      {section.rows.map((row) => (
                        <React.Fragment key={row.id}>
                          <Box sx={sheetCellSx}>
                            <Typography
                              variant="body2"
                              fontWeight={800}
                              color="#1e1b4b"
                            >
                              <InlineEdit
                                value={row.serviceType}
                                label="Service Type"
                                onSave={(val) =>
                                  handleRateCardRowChange(
                                    row.id,
                                    'serviceType',
                                    val
                                  )
                                }
                              />
                            </Typography>
                          </Box>

                          <Box sx={{ ...sheetCellSx, minHeight: '112px' }}>
                            <Typography
                              variant="body2"
                              color="#334155"
                              sx={{ whiteSpace: 'pre-wrap' }}
                            >
                              <InlineEdit
                                value={row.description}
                                label="Service Description"
                                isTextarea
                                onSave={(val) =>
                                  handleRateCardRowChange(
                                    row.id,
                                    'description',
                                    val
                                  )
                                }
                              />
                            </Typography>
                          </Box>

                          <Box sx={sheetCellSx}>
                            <Typography
                              variant="body2"
                              fontWeight={850}
                              color="#1e1b4b"
                            >
                              <InlineEdit
                                value={row.price}
                                label="Price"
                                lockedPrefix="€"
                                onSave={(val) =>
                                  handleRateCardRowChange(row.id, 'price', val)
                                }
                              />
                            </Typography>
                          </Box>

                          {briefs.map((brief) => {
                            const isHighlighted =
                              activeBriefId === brief.id ||
                              hoveredBriefId === brief.id;
                            const quantityValue =
                              brief.quantities[row.id] || '';

                            return (
                              <Box
                                key={brief.id + '-' + row.id}
                                onMouseEnter={() => setHoveredBriefId(brief.id)}
                                onMouseLeave={() => setHoveredBriefId(null)}
                                sx={{
                                  ...sheetCellSx,
                                  alignItems: 'center',
                                  textAlign: 'center',
                                  backgroundColor: isHighlighted
                                    ? alpha('#818cf8', 0.06)
                                    : '#ffffff',
                                }}
                              >
                                <QuantityController
                                  value={quantityValue}
                                  onChange={(newVal) =>
                                    handleQuantityChange(
                                      brief.id,
                                      row.id,
                                      newVal
                                    )
                                  }
                                />
                              </Box>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}

                  <Box
                    sx={{
                      ...sheetStickyTotalCellSx,
                      gridColumn: '1 / span 3',
                      minHeight: '68px',
                      backgroundColor: '#eef2ff',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={900}
                      color="#3730a3"
                    >
                      {sheetLabels.packageTotals}
                    </Typography>
                  </Box>

                  {briefs.map((brief) => (
                    <Box
                      key={brief.id + '-total'}
                      sx={{
                        ...sheetStickyTotalCellSx,
                        minHeight: '68px',
                        alignItems: 'center',
                        textAlign: 'center',
                        backgroundColor: '#eef2ff',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={900}
                        color="#4f46e5"
                      >
                        {formatCurrency(totals[brief.id] || 0)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* High-Fidelity Google Drive Export Progress Modal */}
      <Dialog
        open={exportOpen}
        onClose={!isExportingDrive ? () => setExportOpen(false) : undefined}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1.5,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <DriveFileMoveOutlinedIcon
              sx={{ color: '#10b981', fontSize: '28px' }}
            />
            <Typography variant="h5" fontWeight={850} color="#1e1b4b">
              Export to Google Drive
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          {exportError ? (
            <Stack spacing={2.5} sx={{ py: 3 }}>
              <Typography variant="h6" fontWeight={850} color="#991b1b">
                Export failed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {exportError}
              </Typography>
            </Stack>
          ) : exportStep < 4 ? (
            <Stack spacing={4} sx={{ py: 2 }}>
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={650}
                  color="#1e1b4b"
                  sx={{ mb: 1 }}
                >
                  {exportStep === 0 && 'Preparing current scoping matrix...'}
                  {exportStep === 1 && 'Requesting Google Drive access...'}
                  {exportStep === 2 && 'Building the Google Sheets file...'}
                  {exportStep === 3 &&
                    'Uploading scoping data to Google Drive...'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please keep this window open while the scoping sheet is
                  created from the latest on-page edits.
                </Typography>
              </Box>

              <Box>
                <LinearProgress
                  variant="determinate"
                  value={exportProgress}
                  sx={{
                    height: '10px',
                    borderRadius: '5px',
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: '5px',
                      background:
                        'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    },
                  }}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mt: 1 }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                  >
                    {exportProgress}% COMPLETE
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Allocated data blocks:{' '}
                    {rateCardRows.filter((r) => r.type === 'service').length}{' '}
                    rows
                  </Typography>
                </Stack>
              </Box>

              <Stepper activeStep={exportStep} alternativeLabel>
                {[
                  'Scoping Matrix',
                  'Google Auth',
                  'Sheet Build',
                  'Drive Upload',
                ].map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Stack>
          ) : (
            <Zoom in={true}>
              <Stack
                spacing={3.5}
                alignItems="center"
                sx={{ py: 3, textAlign: 'center' }}
              >
                <CheckCircleOutlineIcon
                  sx={{
                    color: '#10b981',
                    fontSize: '80px',
                    filter: 'drop-shadow(0 8px 16px rgba(16, 185, 129, 0.2))',
                  }}
                />

                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={850}
                    color="#1e1b4b"
                    sx={{ mb: 1 }}
                  >
                    Scoping Card Exported!
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: '400px', mx: 'auto' }}
                  >
                    The current Campaign Scoping Matrix has been exported into
                    Google Sheets with the latest package quantities, pricing,
                    and totals.
                  </Typography>
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: '16px',
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    borderColor: '#cbd5e1',
                  }}
                >
                  <Grid container spacing={2} sx={{ textAlign: 'left' }}>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', fontWeight: 700 }}
                      >
                        FILE NAME
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={800}
                        color="#1e1b4b"
                      >
                        {(exportedFile && exportedFile.name) || exportFileName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', fontWeight: 700 }}
                      >
                        DESTINATION FOLDER
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={800}
                        color="#10b981"
                      >
                        My Drive
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Stack>
            </Zoom>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          {exportError ? (
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <Button
                variant="outlined"
                onClick={() => setExportOpen(false)}
                fullWidth
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.25,
                  borderColor: '#cbd5e1',
                  color: '#1e1b4b',
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleExportToGoogleDrive}
                fullWidth
                sx={{
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.25,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                  },
                }}
              >
                Try Again
              </Button>
            </Stack>
          ) : exportStep === 4 ? (
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <Button
                variant="outlined"
                onClick={() => setExportOpen(false)}
                fullWidth
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.25,
                  borderColor: '#cbd5e1',
                  color: '#1e1b4b',
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<OpenInNewIcon />}
                onClick={() => {
                  if (exportedFile && exportedFile.webViewLink) {
                    window.open(
                      exportedFile.webViewLink,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }
                }}
                disabled={!exportedFile || !exportedFile.webViewLink}
                fullWidth
                sx={{
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.25,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                  },
                }}
              >
                Open Google Sheet
              </Button>
            </Stack>
          ) : (
            <Button
              variant="text"
              disabled
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              Exporting to Google Drive... please wait
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={Boolean(statusMessage)}
        autoHideDuration={4000}
        onClose={() => setStatusMessage('')}
        message={statusMessage}
      />
    </Page>
  );
};

export default function Scoping() {
  return (
    <ScopingProvider>
      <ScopingMain />
    </ScopingProvider>
  );
}
