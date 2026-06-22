import React from 'react';
// Context
import { SmartlyBriefProvider } from 'pages/SmartlyBrief/context';

import Main from 'pages/SmartlyBrief/views/Main';

export default function Smartly() {
  return (
    <SmartlyBriefProvider>
      <Main />
    </SmartlyBriefProvider>
  );
}
