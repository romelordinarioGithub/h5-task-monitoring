import { TimerSheetProvider } from 'pages/TimerSheet/Context';

// Components
import Main from 'pages/TimerSheet/views/Main';

export default function TimerSheet() {
  return (
    <TimerSheetProvider>
      <Main />
    </TimerSheetProvider>
  );
}
