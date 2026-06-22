import { BriefProvider } from 'pages/Brief/Context';

import Main from 'pages/Brief/views/Main';

import '../../assets/css/concept/task/overide.css';

export default function Brief() {
  return (
    <BriefProvider>
      <Main />
    </BriefProvider>
  );
}
