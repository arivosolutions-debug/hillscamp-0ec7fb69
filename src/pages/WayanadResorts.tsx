import React from 'react';
import { LocationLanding } from './LocationLanding';

const FAQS = [
  {
    q: 'What kind of resorts in Wayanad does Hills Camp curate?',
    a: 'We hand-pick treehouse stays, plantation bungalows, riverside cottages, and glamping retreats across Wayanad — each chosen for a quiet, wilderness-first feel rather than mass-tourism resorts.',
  },
  {
    q: 'When is the best time to visit Wayanad?',
    a: "October to March is the popular dry season with cool, clear days. The monsoon (June–September) turns Wayanad's forests electric green and is ideal for travellers who love mist, rain, and slow days indoors.",
  },
  {
    q: 'How do I reach Wayanad?',
    a: 'The nearest airport is Calicut International (around 100 km / 3 hours by road). Kozhikode railway station is the closest major rail head. Most of our properties share door-to-door driving directions after booking.',
  },
  {
    q: 'Are Hills Camp Wayanad stays family-friendly?',
    a: 'Most are. Each listing notes max guests, child policy, and whether the terrain suits small children or elderly guests — check the individual property page before you book.',
  },
  {
    q: 'Can I book a Wayanad resort for a weekend getaway?',
    a: 'Yes — two-night weekend stays are the most common booking. A few of our smaller treehouses and cottages have a one-night option during off-season.',
  },
];

const WayanadResorts = () => (
  <LocationLanding
    path="/wayanad-resorts"
    placeName="Wayanad"
    locationQuery="wayanad"
    title="Resorts in Wayanad — Curated Wilderness Stays"
    description="Hand-picked resorts and wilderness stays in Wayanad — treehouses, plantation bungalows, and riverside cottages set deep in Kerala's Western Ghats."
    h1={'Resorts in Wayanad,\nset deep in the Western Ghats'}
    intro={
      <>
        Wayanad is Kerala's high plateau — cardamom forests, rice valleys, and old plantation country
        where the air still smells of rain. The Hills Camp shortlist skips the resort strip and points
        you to small, owner-run stays where the wilderness does most of the talking.
      </>
    }
    guide={
      <>
        <p>
          Most of our Wayanad properties sit between Kalpetta, Vythiri, and the edges of the Wildlife
          Sanctuary — close enough to safaris and Edakkal Caves, far enough that you fall asleep to
          cicadas instead of traffic.
        </p>
        <p>
          Expect long verandahs, plantation walks, and meals built around the day's catch from local
          farms. A two-night stay is the sweet spot; three lets the place actually slow you down.
        </p>
      </>
    }
    faqs={FAQS}
  />
);

export default WayanadResorts;