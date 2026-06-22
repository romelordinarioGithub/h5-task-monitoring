import { CampaignOverviewProvider } from 'pages/Campaign/context';
import { ConceptOverviewProvider } from 'pages/ConceptOverview/context';
import Main from 'pages/MilestonePublic/views/Main';

function MilestonePublic() {
  return (
    <ConceptOverviewProvider>
      <CampaignOverviewProvider>
        <Main />
      </CampaignOverviewProvider>
    </ConceptOverviewProvider>
  );
}

export default MilestonePublic;
