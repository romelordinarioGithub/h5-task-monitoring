import { memo, useEffect, useState } from 'react';

import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Stack,
  Tooltip,
  styled,
  CircularProgress,
} from '@mui/material';
import PropTypes from 'prop-types';
// Pages
import Brief from 'pages/Brief/views/LeftPanel/Brief';
import Overview from 'pages/Brief/views/LeftPanel/Overview';
import TimelogBrief from 'pages/Brief/views/LeftPanel/TimelogBrief';

//icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { buildFormSummaryCsv } from './formSummary';
import { googleDriveClientID, googleDriveApiKey } from 'config';
import { requestPricingCSV } from 'services/api/brief';
import {
  isGooglePopupClosedError,
  loadGoogleIdentityServices,
  requestGoogleAccessToken,
} from 'services/googleIdentity';
import Swal from 'sweetalert2';

// Context

const StyledToolTip = styled(Tooltip)`
lineHeight: 'normal',
marginTop: '0.4em !important',
`;

const ToastSuccess = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const ToastError = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  icon: 'error',
});

const GOOGLE_DRIVE_UPLOAD_URL =
  'https://www.googleapis.com/upload/drive/v3/files';
const GOOGLE_SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';
const GOOGLE_DRIVE_SCOPE =
  'profile email https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets';

const stripHtml = (value) => {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
};

const getOptionLabel = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => getOptionLabel(item))
      .filter(Boolean)
      .join(', ');
  }

  if (value && typeof value === 'object') {
    return value.value || value.label || value.name || value.email || '';
  }

  return value || '';
};

const getBriefCsvFileName = (data) => {
  const partner = getOptionLabel(data && data.company_name) || 'Partner';
  const title = stripHtml(data && data.title) || 'Form Summary';

  return `Brief ${
    data && data.id ? data.id : ''
  } - ${partner} - ${title} - Form Summary`
    .replace(/[\\/:*?"<>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const uploadCsvToGoogleDrive = async ({ accessToken, csv, name }) => {
  const params = new URLSearchParams({
    uploadType: 'multipart',
    fields: 'id,name,webViewLink',
  });

  if (googleDriveApiKey) {
    params.append('key', googleDriveApiKey);
  }

  const boundary = `adweave_csv_${Date.now()}`;
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

const csvResponseToText = async (response) => {
  if (response && response.success === false) {
    throw new Error(response.message || 'Unable to download scoping CSV');
  }

  if (typeof response === 'string') return response;

  if (response && typeof response.text === 'function') {
    const text = await response.text();

    if (response.type && response.type.includes('application/json')) {
      const parsed = JSON.parse(text || '{}');

      if (parsed && parsed.success === false) {
        throw new Error(parsed.message || 'Unable to download scoping CSV');
      }
    }

    return text;
  }

  if (response === null || response === undefined) return '';

  return String(response);
};

const downloadScopingCsv = async (briefId) => {
  const response = await requestPricingCSV(briefId);

  return csvResponseToText(response);
};

const renameSpreadsheetTab = async ({ accessToken, spreadsheetId, title }) => {
  const metadataParams = new URLSearchParams({
    fields: 'sheets.properties.sheetId',
  });

  const metadataResponse = await fetch(
    `${GOOGLE_SHEETS_API_URL}/${spreadsheetId}?${metadataParams}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!metadataResponse.ok) {
    const error = await metadataResponse.json().catch(() => ({}));
    throw new Error(
      (error && error.error && error.error.message) ||
        'Unable to read spreadsheet tab'
    );
  }

  const spreadsheet = await metadataResponse.json();
  const firstSheet =
    spreadsheet &&
    Array.isArray(spreadsheet.sheets) &&
    spreadsheet.sheets.length > 0
      ? spreadsheet.sheets[0]
      : null;
  const sheetId =
    firstSheet && firstSheet.properties
      ? firstSheet.properties.sheetId
      : undefined;

  if (sheetId === undefined || sheetId === null) return;

  const updateResponse = await fetch(
    `${GOOGLE_SHEETS_API_URL}/${spreadsheetId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId,
                title,
              },
              fields: 'title',
            },
          },
        ],
      }),
    }
  );

  if (!updateResponse.ok) {
    const error = await updateResponse.json().catch(() => ({}));
    throw new Error(
      (error && error.error && error.error.message) ||
        'Unable to rename spreadsheet tab'
    );
  }
};

const batchUpdateSpreadsheet = async ({
  accessToken,
  spreadsheetId,
  requests,
}) => {
  const response = await fetch(
    `${GOOGLE_SHEETS_API_URL}/${spreadsheetId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error && error.error && error.error.message) ||
        'Unable to update spreadsheet'
    );
  }

  return response.json();
};

const addCsvSpreadsheetTab = async ({
  accessToken,
  spreadsheetId,
  title,
  csv,
  index,
}) => {
  const addResult = await batchUpdateSpreadsheet({
    accessToken,
    spreadsheetId,
    requests: [
      {
        addSheet: {
          properties: {
            title,
            index,
          },
        },
      },
    ],
  });
  const sheetId =
    addResult &&
    addResult.replies &&
    addResult.replies[0] &&
    addResult.replies[0].addSheet &&
    addResult.replies[0].addSheet.properties
      ? addResult.replies[0].addSheet.properties.sheetId
      : undefined;

  if (sheetId === undefined || sheetId === null) {
    throw new Error('Unable to create scoping spreadsheet tab');
  }

  await batchUpdateSpreadsheet({
    accessToken,
    spreadsheetId,
    requests: [
      {
        pasteData: {
          coordinate: {
            sheetId,
            rowIndex: 0,
            columnIndex: 0,
          },
          data: csv,
          type: 'PASTE_NORMAL',
          delimiter: ',',
        },
      },
    ],
  });
};

const LeftPanel = ({ id, onCloseDialog }) => {
  const [value, setValue] = useState(0);
  const { overview: data } = useSelector((state) => state.briefs);
  const [exportingDrive, setExportingDrive] = useState(false);
  const briefId = id || (data && data.id);

  useEffect(() => {
    if (!googleDriveClientID) return;

    loadGoogleIdentityServices().catch((error) => {
      console.error('Failed to preload Google Identity Services', error);
    });
  }, []);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
  };

  const handleExportToGoogleDrive = async () => {
    if (!googleDriveClientID) {
      ToastError.fire({ title: 'Google Drive client ID is not configured' });
      return;
    }

    setExportingDrive(true);

    try {
      const googleResponse = await requestGoogleAccessToken({
        clientId: googleDriveClientID,
        scope: GOOGLE_DRIVE_SCOPE,
        prompt: 'consent',
      });
      const fileName = getBriefCsvFileName(data);
      const csv = buildFormSummaryCsv(data);
      const scopingCsv = await downloadScopingCsv(data.id);
      const uploadedFile = await uploadCsvToGoogleDrive({
        accessToken: googleResponse.accessToken,
        csv,
        name: fileName,
      });

      await renameSpreadsheetTab({
        accessToken: googleResponse.accessToken,
        spreadsheetId: uploadedFile.id,
        title: 'Overview',
      });

      await addCsvSpreadsheetTab({
        accessToken: googleResponse.accessToken,
        spreadsheetId: uploadedFile.id,
        title: 'Scoping',
        csv: scopingCsv,
        index: 1,
      });

      ToastSuccess.fire({
        icon: 'success',
        title: 'Exported to Google Drive',
      });

      if (uploadedFile && uploadedFile.webViewLink) {
        window.open(uploadedFile.webViewLink, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      if (!isGooglePopupClosedError(err)) {
        ToastError.fire({
          title: (err && err.message) || 'Unable to export to Google Drive',
        });
      }
    } finally {
      setExportingDrive(false);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Stack
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          padding: '0 1em',
          justifyContent: 'space-between',
        }}
        direction="row"
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Overview" disableRipple />
          <Tab label="Brief" disableRipple />
          <Tab label="Time log" disableRipple />
        </Tabs>
        <Stack direction="row">
          <Stack direction="row">
            <StyledToolTip
              title={
                exportingDrive
                  ? 'Exporting to Google Drive'
                  : 'Export to Google Drive'
              }
              arrow
            >
              <IconButton
                onClick={handleExportToGoogleDrive}
                disabled={exportingDrive || !googleDriveClientID}
              >
                {exportingDrive ? (
                  <CircularProgress color="inherit" size={22} />
                ) : (
                  <FileDownloadOutlinedIcon />
                )}
              </IconButton>
            </StyledToolTip>
            <StyledToolTip title={'Open Scoping'} arrow>
              <IconButton
                component={Link}
                to={briefId ? `/scoping/${briefId}` : '/scoping'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AssessmentOutlinedIcon />
              </IconButton>
            </StyledToolTip>
            <StyledToolTip title={'Edit Brief'} arrow>
              <IconButton
                component={Link}
                to={`/form?brief_id=${id}`}
                target="_blank"
              >
                <EditOutlinedIcon />
              </IconButton>
            </StyledToolTip>
          </Stack>
          {/* <StyledToolTip title="Delete Task">
            <IconButton onClick={() => handleDeleteTask(id, !isSubtask)}>
              {<DeleteOutlineIcon />}
            </IconButton>
          </StyledToolTip> */}
        </Stack>
      </Stack>
      <Box height="calc(100% - 49px)" overflow="auto" px={2} pb={2}>
        {value === 0 && <Overview onCloseDialog={onCloseDialog} />}
        {value === 1 && <Brief onCloseDialog={onCloseDialog} />}
        {value === 2 && <TimelogBrief />}
        {/* 
        {!isSubtask && value === 2 && <Revisions />}
        {value === 3 && <Escalation />} */}
      </Box>
    </Box>
  );
};

LeftPanel.propTypes = {
  id: PropTypes.any,
  isSubtask: PropTypes.any,
  onCloseDialog: PropTypes.any,
};

export default memo(LeftPanel);
