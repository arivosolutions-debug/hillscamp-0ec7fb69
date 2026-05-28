import React from 'react';
import { LocationLanding } from './LocationLanding';

const FAQS = [
  {
    q: 'What makes a Hills Camp homestay in Munnar different from a hotel?',
    a: 'Our Munnar homestays are small — usually two to six rooms — run by families or planters who live on-site. You get home-cooked Kerala meals, walks through tea estates with the host, and a far quieter stay than the resort belt around town.',
  },
  {
    q: 'When is the best time to visit Munnar?',
    a: 'September to March is peak season — cool nights, clear mountain views, and tea slopes at their brightest. Monsoon (June–August) is dramatic and uncrowded; January mornings can drop near single digits, so pack a layer.',
  },
  {
    q: 'How do I reach Munnar?',
    a: 'The nearest airport is Cochin International (around 110 km / 4 hours by winding hill road). Aluva railway station is the closest convenient rail head. Each property page includes the exact driving route after you book.',
  },
  {
    q: 'Are pets and children welcome at Munnar homestays?',
    a: 'Policies vary by property. Most welcome children with adult supervision; pet policy is listed on each individual stay page along with max guest count.',
  },
  {
    q: 'Can I book a Munnar homestay for just one night?',
    a: 'A two-night minimum is standard — Munnar is a long drive and one night rarely does it justice. Some smaller homestays open up single-night bookings in the off-season.',
  },
];

const MunnarHomestays = () => (
  <LocationLanding
    path="/munnar-homestays"
    placeName="Munnar"
    locationQuery="munnar"
    title="Homestays in Munnar — Tea-Country Stays"
    description="Curated homestays in Munnar — small, family-run properties on tea estates and mountain ridges, hand-picked for travellers who want quiet over resort crowds."
    h1={'Homestays in Munnar,\non the edge of the tea country'}
    intro={
      <>
        Munnar is at its best a few kilometres off the main road — in the planter's bungalow, the
        ridge-top cottage, the family homestay where dinner is cardamom-scented and the morning view
        is rows of tea disappearing into mist. These are the stays we keep going back to.
      </>
    }
    guide={
      <>
        <p>
          Our Munnar shortlist spans Devikulam, Chinnakanal, Anachal, and the lesser-walked ridges
          above town. Most properties sit on or beside working tea or cardamom estates, so the
          walking starts the moment you step off the verandah.
        </p>
        <p>
          Pack a fleece even in summer — evenings turn cold quickly above 5,000 feet. Two nights lets
          you do Eravikulam and the high-range viewpoints without rushing.
        </p>
      </>
    }
    faqs={FAQS}
  />
);

export default MunnarHomestays;