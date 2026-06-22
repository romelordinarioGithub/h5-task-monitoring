import React from 'react';
// Context
import { AdminPanelProvider } from './context';

import Main from 'pages/AdminPanel/views/Main';

export default function AdminPanel() {
  return (
    <AdminPanelProvider>
      <Main />
    </AdminPanelProvider>
  );
}
