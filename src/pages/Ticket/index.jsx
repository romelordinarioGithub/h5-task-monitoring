import { TicketProvider } from 'pages/Ticket/Context';

import Main from 'pages/Ticket/views/Main';

import '../../assets/css/concept/task/overide.css';

export default function Ticket() {
  return (
    <TicketProvider>
      <Main />
    </TicketProvider>
  );
}
