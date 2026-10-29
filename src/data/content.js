// All homepage copy, taken from PrimalOne_Homepage_Final_Content.md (v3).
// Components read from here; change copy in this file, not in JSX.
// Strings marked tbc are client facts still to confirm (see the "Review notes" in the brief).

// Show the yellow "To confirm" review tags. Set to false only once every tag is resolved.
export const SHOW_REVIEW_TAGS = true;

// Pages that sit outside this homepage. They do not exist in this project yet.
export const routes = {
  originLabel: '/products/origin#label',
  restoreLabel: '/products/restore#label',
  shipping: '/shipping',
  returns: '/returns',
  contact: '/contact',
  journal: '/journal',
  privacy: '/privacy',
  terms: '/terms',
};

export const announcements = [
  "Sequence, don't stack.",
  'Origin: daily essentials, one scoop with breakfast',
  'Restore: the optional evening',
  '30-day and 15-day packs available',
];

export const navLinks = [
  { label: 'Origin', href: '#origin', section: 'sequence' },
  { label: 'Restore', href: '#restore', section: 'sequence' },
  { label: 'How it works', href: '#how', section: 'how' },
  { label: 'Learn', href: '#learn', section: 'learn' },
  { label: 'FAQ', href: '#faq', section: 'faq' },
];

export const hero = {
  titleLines: ['One scoop', 'for the day', 'you have.'],
  sub: "Origin in the morning if you eat breakfast. Restore at night if you want the evening covered. Sequence, don't stack.",
  primary: 'Shop Origin',
  secondary: 'Learn the sequence',
  // The hero plays the day: morning (Origin), then the optional evening (Restore).
  scenes: [
    {
      id: 'morning',
      product: 'Origin',
      note: 'One scoop with or after breakfast',
      image: { name: 'origin-pour', alt: 'A walnut scoop pouring Origin powder into a glass of water in morning sunlight, beside the green Origin jar' },
    },
    {
      id: 'evening',
      product: 'Restore',
      note: '30 to 60 minutes before bed',
      image: { name: 'restore-evening', alt: 'The cream Restore jar, a glass of Restore and a sachet on a dark green table under a crescent moon' },
    },
  ],
};

export const sequence = {
  eyebrow: 'The sequence',
  titleLines: ['Two products.', 'Two times of day.', 'Never at once.'],
  // Shortened from the v3 brief's lead at the client's request so it fits on one line.
  lead: 'Morning: Origin with breakfast. Optional evening: Restore for recovery. Sequenced, not stacked.',
};

export const products = {
  origin: {
    id: 'origin',
    name: 'Origin',
    kicker: '01 · Morning',
    title: 'Daily essentials, one morning scoop.',
    paras: [
      'Origin is a daily nutrition floor: the essentials most people miss when they eat breakfast. Greens, omega-3s, vitamin D3 + K2, minerals, CoQ10, and a probiotic.',
      { text: 'One scoop with or after breakfast. Not a protein shake. ', strong: 'The daily if you eat.' },
    ],
    // Physician note in the Origin product block only (the brief lists it for Restore; Origin caution is still to confirm).
    blockSafety: true,
    // drift: the photo moves slowly in a small circle inside its fixed frame
    image: { name: 'origin-jar', video: '/video/origin.mp4', drift: true, alt: 'The green PrimalOne Origin jar with a walnut lid beside a scoop of powder' },
    containsTitle: 'Origin contains',
    contains: ['Omega-3s (EPA + DHA)', 'Vitamin D3 & K2', 'A modest mineral floor', 'CoQ10', 'Greens', 'Multi-strain probiotic', 'Prebiotic fibre (PHGG)'],
    meta: ['One 20 g scoop', 'in water or a smoothie'],
    labelHref: routes.originLabel,
    // Shop
    shopTitle: 'Origin',
    shopDescriptor: 'Forever daily essentials',
    shopCopy: 'The morning scoop when breakfast is eaten.',
    ctaPrefix: 'Buy Origin',
    shopImage: { name: 'origin-stir', alt: 'Origin jar beside a glass being stirred in morning light' },
    sizes: [
      { days: 30, price: 3499, perDay: 117 },
      { days: 15, price: 1999, perDay: 133 },
    ],
  },
  restore: {
    id: 'restore',
    name: 'Restore',
    kicker: '02 · Evening · Optional',
    title: 'Five ingredients, one optional evening.',
    paras: [
      'An evening formula to support relaxation and recovery at the end of the day. Take it if you want the night covered. Skip it if you do not.',
      { text: '30 to 60 minutes before bed, with or without food. ', strong: 'Many people use Origin alone.' },
    ],
    safety: true,
    image: { name: 'restore-jar', spin: true, alt: 'PrimalOne Restore jar with walnut scoop in evening light' },
    containsTitle: 'Restore contains',
    contains: ['Glycine (3 g)', 'NAC (600 mg)', 'Magnesium', 'KSM-66® ashwagandha', 'Myo-inositol'],
    meta: ['Evening only', 'never taken with Origin'],
    labelHref: routes.restoreLabel,
    shopTitle: 'Restore',
    shopDescriptor: 'Evening recovery',
    shopCopy: 'The optional night. Glycine, NAC, magnesium, and ashwagandha.',
    ctaPrefix: 'Add to evening routine',
    shopImage: { name: 'restore-evening', alt: 'PrimalOne Restore evening ritual with jar, sachet and glass' },
    sizes: [
      { days: 30, price: 3999, perDay: 133 },
      { days: 15, price: 2299, perDay: 153 },
    ],
  },
};

export const safetyNote = 'Consult a physician if pregnant, nursing, or on medication.';

export const why = {
  eyebrow: 'Why sequence',
  titleLines: ['Stacking creates competition.', 'Sequencing creates clarity.'],
  body: 'Most supplements are designed to be stacked: a bottle for every need, overlapping doses, and no clear rule for what to take when. The result is a cabinet of bottles and unclear outcomes. PrimalOne sequences two things that do not fight each other: a morning essential and an optional evening recovery.',
  bodyLines: [
    'Most supplements are designed to be stacked: a bottle for every need, overlapping doses, and no clear rule for what to take when.',
    'The result is a cabinet of bottles and unclear outcomes.',
    'PrimalOne sequences two things that do not fight each other: a morning essential and an optional evening recovery.',
  ],
  stacked: { label: 'Stacked' },
  sequenced: { label: 'Sequenced', morning: 'Origin', evening: 'Restore' },
};

export const how = {
  eyebrow: 'How it works',
  title: 'Origin covers the morning floor. Restore covers the night if you choose it.',
  titleLines: ['Origin covers the morning floor.', 'Restore covers the night if you choose it.'],
  lead: 'You take what matches the day you actually have.',
  steps: [
    {
      time: 'Morning, with or after breakfast',
      title: 'Origin.',
      body: 'One scoop (20 g) in water or a smoothie. Every morning you eat.',
      image: { name: 'origin-stir', alt: 'Origin being stirred into a glass in morning sunlight' },
      tone: 'morning',
    },
    {
      time: 'Through the day',
      title: 'Food does the rest.',
      body: 'No mid-day stack. No cabinet. Just the meals you already eat.',
      image: { name: 'origin-sachet', alt: 'A hand holding an Origin sachet over a canvas bag on a sunlit table' },
      tone: 'day',
    },
    {
      time: 'Evening, 30 to 60 min before bed',
      title: 'Restore.',
      optional: true,
      body: 'With or without food, if you want the night covered. Skip it if you do not.',
      image: { name: 'restore-dusk', alt: 'A hand holding a glass of Restore beside the cream Restore jar in warm lamplight' },
      tone: 'night',
      safety: true,
    },
  ],
};

export const benefits = {
  titleLines: ['What each scoop', 'is built to do.'],
  video: {
    // Golden figure on a flat sand ground (from assets/Color Matte_2.mp4, #ebe4d4).
    src: '/video/scoop-figure-2.mp4',
    label: 'Inside a PrimalOne scoop',
  },
  tabs: [
    {
      id: 'origin',
      label: 'Origin',
      when: 'Morning',
      safety: true,
      items: [
        'Supports daily nutrient intake alongside food*',
        'Provides EPA and DHA omega-3 fatty acids',
        'Includes vitamin D3 and vitamin K2',
        'Contains CoQ10 and a multi-strain probiotic',
        'Greens and PHGG for daily fibre support*',
      ],
    },
    {
      id: 'restore',
      label: 'Restore',
      when: 'Evening',
      safety: true,
      items: [
        'Provides glycine and magnesium, commonly used in evening routines',
        'Includes NAC and KSM-66® ashwagandha',
        'Designed for evening use only',
        'Optional: not required with Origin',
      ],
    },
  ],
};

export const learn = {
  titleLines: ['The thinking,', 'in three short reads.'],
  lead: 'You do not need a cabinet. You need the right thing at the right time.',
  image: {
    name: 'bottle-tilt-cutout',
    alt: 'PrimalOne bottle tilted beside a sage drink',
  },
  reads: [
    {
      n: '01',
      topic: 'Timing',
      title: 'Why morning and evening are different.',
      body: "Morning covers daily essentials with food. Evening supports wind-down. Origin's omega-3s and vitamins D3 and K2 are fat-soluble. Take with or after breakfast.",
    },
    {
      n: '02',
      topic: 'Magnesium',
      title: 'Why magnesium lives in the evening.',
      body: "Magnesium stays in Restore so the daily total stays within typical supplemental guidance. Don't stack it with other high-magnesium supplements the same day.",
    },
    {
      n: '03',
      topic: 'Method',
      title: 'Assess → Sequence → Adapt.',
      body: 'Assess how you eat and recover. Sequence Origin in the morning and Restore at night if you want it. Adapt over weeks, not days.',
    },
  ],
};

export const signal = {
  titleLines: ['What our beta', 'members told us.'],
  note: 'Self-reported · Not a clinical trial',
  stats: [
    { value: 91, text: 'said their energy felt steadier within 14 days*' },
    { value: 87, text: 'said their digestion felt better*' },
    { value: 84, text: 'said their focus felt clearer*' },
  ],
  quotes: [
    {
      text: "I've tried every major greens and longevity supplement on the market. Nothing else has made me feel the sequence actually working.",
      who: 'Beta participant',
      meta: '34 · Bengaluru',
      rating: 5,
      image: { name: 'unboxing', alt: 'PrimalOne premium ritual unboxing' },
    },
    {
      text: 'I stopped needing my afternoon coffee. That never happened with anything else I\'ve tried.',
      who: 'Beta participant',
      meta: '29 · Delhi',
      rating: 5,
      image: { name: 'origin-stir', alt: 'Origin being stirred into a morning glass' },
    },
    {
      text: 'As someone who was skeptical of supplements, the transparent labelling and no-hype approach is what won me over. The results were secondary. The integrity was the sale.',
      who: 'Beta participant',
      meta: '41 · Mumbai',
      rating: 5,
      image: { name: 'origin-scoop', alt: 'Origin powder in a walnut scoop' },
    },
  ],
  disclaimer: '*Self-reported by approximately 120 participants in a 30-day internal beta, June 2025. Not a clinical trial. Individual experiences vary and are not typical results.',
};

export const shop = {
  title: 'Pick your pack.',
  lead: 'Choose a 30-day or 15-day pack. One-time purchase, no commitment.',
};

export const faq = {
  title: 'Frequently asked questions.',
  lead: 'Clean answers about how Origin and Restore fit your day.',
  image: {
    name: 'ritual-set',
    alt: 'PrimalOne Origin, Restore and bottle on a light surface',
  },
  items: [
    { q: 'Is Origin vegetarian?', a: 'Depends on the omega-3 source (fish oil or algal oil). Check the FSSAI veg/non-veg symbol on the pack.' },
    { q: 'Is Origin a 30-day program?', a: 'No. Origin is forever daily essentials. Take it every morning you eat breakfast.' },
    { q: 'Is Origin a protein shake or meal replacement?', a: 'No. Origin has no protein. It is a daily essentials scoop to take with or after breakfast.' },
    { q: 'Do I have to take Restore with Origin?', a: 'No. Restore is optional. Many people use Origin alone.' },
    { q: 'Can I take Origin and Restore at the same time?', a: 'No. Origin is morning. Restore is evening.' },
    { q: 'What if I skip breakfast?', a: 'Origin is designed for mornings when breakfast is eaten. If the scoop is your meal, this is not the right product for that day.' },
    { q: 'What does Origin taste like, and how do I mix it?', a: 'Mix one scoop (20 g) in water or a smoothie with or after breakfast.' },
    { q: 'How long does a pack last?', a: 'A 30-day pack covers 30 mornings and a 15-day pack covers 15, at one scoop a day.' },
    { q: "Can I take Restore if I'm pregnant, nursing, or on medication?", safety: true },
    { q: 'How much magnesium is in Restore?', a: 'Restore is formulated so that the evening magnesium dose stays within common supplemental guidance when Origin is the only other product used.' },
    { q: 'Can I take Restore with other magnesium supplements?', a: 'Do not combine Restore with other high-magnesium supplements on the same day.' },
    { q: 'Are there clinical studies on these exact formulas?', a: 'Individual ingredients have published research. These statements have not been evaluated by regulatory authorities. This product is not intended to diagnose, treat, cure, or prevent any disease.' },
    { q: 'Do I need to subscribe?', a: 'No. Origin and Restore are sold as one-time 30-day or 15-day packs. Reorder whenever you need more.' },
    { q: 'How fast is delivery, and what is the returns policy?', a: 'Delivery timelines, cash-on-delivery availability, and returns details are listed at checkout and on our shipping page.' },
  ],
};

export const finalCta = {
  titleLines: ['Start with Origin.', 'Add Restore if you want the night.'],
  sub: 'Nutrition should evolve as you do, starting with clarity, not complexity.',
  primary: 'Shop Origin',
  secondary: 'Add Restore',
};

export const footer = {
  tagline: 'Nutrition should evolve as you do.',
  columns: [
    { title: 'Shop', links: [{ label: 'Origin', href: '#origin' }, { label: 'Restore', href: '#restore' }, { label: 'How it works', href: '#how' }] },
    { title: 'Help', links: [{ label: 'FAQ', href: '#faq' }, { label: 'Shipping', href: routes.shipping }, { label: 'Returns', href: routes.returns }, { label: 'Contact', href: routes.contact }] },
    { title: 'Learn', links: [{ label: 'Journal', href: routes.journal }] },
    { title: 'Legal', links: [{ label: 'Privacy', href: routes.privacy }, { label: 'Terms', href: routes.terms }] },
  ],
  manufacturer: 'Manufactured by Zeon Lifescience',
  fssai: 'FSSAI Lic. No.',
  payments: 'Payments: UPI · Cards · Net banking · COD',
  disclaimer: '*These statements have not been evaluated by the Food and Drug Administration or equivalent authority. This product is not intended to diagnose, treat, cure, or prevent any disease. Food supplements should not be used as a substitute for a varied diet.',
  legal: '© 2026 Primalone Nutrition Pvt Ltd',
  taxes: 'Prices in INR, inclusive of taxes',
};

export const formatINR = (n) => '₹' + n.toLocaleString('en-IN');
