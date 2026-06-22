import React, { useContext } from 'react';
import {
  Typography,
  Stack,
  Button,
  Box,
  Paper,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from '@mui/material';
import logo from 'assets/images/logo.svg';
import Loader from 'components/Common/CircularLoader';
import GeneralInfo from 'pages/SmartlyBrief/views/GeneralInfo';
import ImageFormat from 'pages/SmartlyBrief/views/ImageFormat';
import Assets from 'pages/SmartlyBrief/views/Assets';
import VideoFormat from 'pages/SmartlyBrief/views/VideoFormat';
import InstructionBox from 'pages/SmartlyBrief/components/InstructionBox';
import TaskType from 'pages/SmartlyBrief/views/TaskType';
import SmartlyBriefContext from 'pages/SmartlyBrief/context';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledAccordion = styled(Accordion)({
  '&.MuiAccordion-root:before': {
    backgroundColor: 'white',
  },
  borderRadius: '10px',
});

//   background-color: #17a6c9;

// .loading span:nth-child(3) {
//   border-radius: 50% 0 50% 50%;
//   background-color: #f6e748;
//   transform-origin: top right;
//   animation-delay: 1.5s;
// }

// .loading span:nth-child(4) {
//   border-radius: 0 50% 50% 50%;
//   background-color: #f16079;

const StyledAccordionSummary = styled(AccordionSummary)`
  border-radius: 10px;
  box-shadow: 0px;
`;

export default function Main() {
  const {
    handleSubmit,
    referenceDesign,
    referenceVideo,
    setReferenceDesign,
    setReferenceVideo,
    fetchingBrief,
    handleChangePanel,
    isExpanded,
  } = useContext(SmartlyBriefContext);

  return (
    <Box
      sx={{
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        overflowY: 'scroll',
        height: 'calc(100vh - 4em)',
        padding: '1em',
      }}
    >
      <Container fixed>
        <Paper
          sx={{
            padding: '2em',
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                Create a Task
              </Typography>
              <Box
                sx={{
                  backgroundImage: `url(${logo})`,
                  height: '3em',
                  width: '12em',
                  backgroundSize: '12em',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </Stack>
            <StyledAccordion
              expanded={isExpanded.isGeneral}
              disableGutters
              sx={{ backgroundColor: '#24285e' }}
              onChange={(event, value) =>
                handleChangePanel(event, value, 'general')
              }
            >
              <StyledAccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ fontSize: '1.4em', color: 'white' }} />
                }
              >
                <Typography fontWeight="700" color="white">
                  GENERAL INFORMATION
                </Typography>
              </StyledAccordionSummary>
              {isExpanded.isGeneral && (
                <AccordionDetails>
                  <GeneralInfo />
                </AccordionDetails>
              )}
            </StyledAccordion>
            <StyledAccordion
              expanded={isExpanded.isStatic}
              disableGutters
              sx={{ backgroundColor: '#17a6c9' }}
              onChange={(event, value) =>
                handleChangePanel(event, value, 'static')
              }
            >
              <StyledAccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ fontSize: '1.4em', color: 'white' }} />
                }
              >
                <Typography fontWeight="700" color="white">
                  STATIC
                </Typography>
              </StyledAccordionSummary>
              {isExpanded.isStatic && (
                <AccordionDetails>
                  <Stack spacing={2} my={2}>
                    <ImageFormat />
                    <InstructionBox
                      setText={setReferenceDesign}
                      text={referenceDesign}
                      title={'Build Instruction'}
                    />
                  </Stack>
                </AccordionDetails>
              )}
            </StyledAccordion>
            <StyledAccordion
              expanded={isExpanded.isVideo}
              disableGutters
              sx={{ backgroundColor: '#f6e748' }}
              onChange={(event, value) =>
                handleChangePanel(event, value, 'video')
              }
            >
              <StyledAccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ fontSize: '1.4em', color: 'white' }} />
                }
              >
                <Typography fontWeight="700" color="white">
                  VIDEO
                </Typography>
              </StyledAccordionSummary>
              {isExpanded.isVideo && (
                <AccordionDetails>
                  <Stack spacing={2} my={2}>
                    <TaskType />
                    <VideoFormat />
                    <InstructionBox
                      setText={setReferenceVideo}
                      text={referenceVideo}
                      title={'Build Instruction'}
                    />
                  </Stack>
                </AccordionDetails>
              )}
            </StyledAccordion>
            <StyledAccordion
              expanded={isExpanded.isAssets}
              disableGutters
              sx={{ backgroundColor: '#f16079' }}
              onChange={(event, value) =>
                handleChangePanel(event, value, 'assets')
              }
            >
              <StyledAccordionSummary
                expandIcon={
                  <ExpandMoreIcon sx={{ fontSize: '1.4em', color: 'white' }} />
                }
              >
                <Typography fontWeight="700" color="white">
                  ASSETS
                </Typography>
              </StyledAccordionSummary>
              {isExpanded.isAssets && (
                <AccordionDetails>
                  <Assets />
                </AccordionDetails>
              )}
            </StyledAccordion>
            <Box textAlign="center">
              <Button
                size="large"
                startIcon={<SendIcon />}
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
      {fetchingBrief && <Loader />}
    </Box>
  );
}
