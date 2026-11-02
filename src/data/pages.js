// Full-site page copy from Website Content.md (Wave 1: Origin + Restore only).
import { formatINR, products, routes } from './content.js';

export const siteNav = [
  {
    label: 'Shop',
    href: '/shop',
    children: [
      { label: 'Origin', href: '/products/origin' },
      { label: 'Restore', href: '/products/restore' },
    ],
  },
  { label: 'Sequence', href: '/sequence' },
  { label: 'Science', href: '/science' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
];

export const utilityNav = [
  { label: 'Contact', href: '/contact' },
];

export const shopPage = {
  eyebrow: 'Shop',
  titleLines: ['Two products.', 'One sequence.'],
  sub: 'Origin for the morning you eat. Restore for the evening you choose.',
  strip: 'Origin in the morning. Restore in the evening. Never at the same time. Restore is optional.',
  // Same lifestyle crops as the homepage Shop packs
  cards: [
    {
      id: 'origin',
      href: '/products/origin',
      name: 'Origin',
      descriptor: 'Forever daily essentials · Morning',
      copy: 'One scoop when breakfast is eaten. Omega-3s, D3+K2, minerals, CoQ10, greens, probiotic.',
      image: 'origin-stir',
      tone: 'morning',
      prices: products.origin.sizes.map((s) => `${formatINR(s.price)} for ${s.days} days`),
      cta: 'Shop Origin',
    },
    {
      id: 'restore',
      href: '/products/restore',
      name: 'Restore',
      descriptor: 'Evening recovery · Optional',
      copy: 'Glycine, NAC, magnesium, KSM-66, myo-inositol. Taken at night if you want the evening covered.',
      image: 'restore-evening',
      tone: 'night',
      prices: products.restore.sizes.map((s) => `${formatINR(s.price)} for ${s.days} days`),
      cta: 'Shop Restore',
    },
  ],
  // Side-by-side comparison; every cell repeats a fact from the product pages
  compareTitle: ['Side by', 'side.'],
  compare: [
    { k: 'When', origin: 'Morning, with or after breakfast', restore: 'Evening, 30–60 minutes before bed' },
    { k: 'With food', origin: 'Yes. It sits with breakfast, it is not the meal', restore: 'With or without food' },
    { k: 'Serving', origin: 'One 20 g scoop in water or a smoothie', restore: 'One serving in the evening' },
    { k: 'Built for', origin: 'The daily nutrition floor', restore: 'Relaxation and recovery support' },
    { k: 'Required?', origin: 'The start of the sequence', restore: 'Optional. Many people use Origin alone' },
    { k: 'Taken together?', origin: 'Never', restore: 'Never' },
  ],
  bundleTitle: ['Both,', 'sequenced.'],
  bundleBody: 'Origin for the morning, Restore for the evening. Add both and the bundle saving applies in your cart.',
  dayTitle: ['One day,', 'two windows.'],
};

export const originPage = {
  name: 'Origin',
  descriptor: 'Forever daily essentials',
  oneLine: 'The morning scoop when breakfast is eaten.',
  prices: products.origin.sizes,
  primaryCta: 'Subscribe',
  secondaryCta: 'One-time purchase',
  whatItIs: 'Origin is the daily nutrition floor for mornings when you eat breakfast. It is not a protein shake and not a meal replacement. It supplies the essentials most people miss even when they eat well: omega-3 fatty acids (EPA and DHA), vitamin D3 with K2, a modest mineral floor, CoQ10, greens, prebiotic fibre and a probiotic. One scoop. Every morning you eat. Forever, not for 30 days.',
  ingredients: [
    'Omega-3s (EPA + DHA)',
    'Vitamin D3 + Vitamin K2',
    'Mineral floor (including calcium, magnesium, potassium)',
    'CoQ10',
    'Greens blend',
    'Prebiotic fibre (PHGG)',
    'Multi-strain probiotic',
  ],
  howToUse: 'Mix one scoop (20 g) in water or a smoothie after breakfast. Take every morning you eat. If you are sensitive, do not take on an empty stomach. Restore, if used, is taken in the evening, never at the same time.',
  isNot: [
    'Not a 30-day primer or temporary starter phase.',
    'Not a protein meal replacement.',
    'Not designed to be stacked with other morning powders.',
  ],
  // What Origin is instead, one per line above (wording from the page's own copy)
  isInstead: [
    'Forever daily essentials.',
    'It sits with breakfast. It is not the meal.',
    'One scoop covers the morning floor.',
  ],
  whyExists: 'Most “all-in-one” powders try to replace everything in one scoop. Origin does the opposite. It covers the morning floor so you do not need a cabinet of separate bottles for the basics. It assumes you eat breakfast. It does not try to be your meal. The goal is clarity, not complexity.',
  // Only questions the page does not already answer above
  faq: [
    { q: 'What if I skip breakfast?', a: 'Origin is designed for mornings when breakfast is eaten. If the scoop is your meal, this is not the right product for that day.' },
    { q: 'Is Origin vegetarian?', a: 'It depends on the omega-3 source (fish oil or algal oil). Check the FSSAI veg/non-veg symbol on the pack.' },
    { q: 'How long does a pack last?', a: 'A 30-day pack covers 30 mornings and a 15-day pack covers 15, at one scoop a day.' },
  ],
  disclaimer: 'These statements have not been evaluated by the Food and Drug Administration or equivalent authority. This product is not intended to diagnose, treat, cure, or prevent any disease. Food supplements should not be used as a substitute for a varied diet.',
  // Product page layout: gallery (turning jar first), quick facts, the ritual in three steps
  tag: 'Morning · Daily',
  scrub: '/video/origin-scrub.mp4',
  gallery: [
    { name: 'origin-jar', alt: 'The green Origin jar with its walnut lid beside a scoop of powder' },
    { name: 'origin-pour', alt: 'Origin powder pouring from a walnut scoop into a glass of water' },
    { name: 'sage-powder', alt: 'A mound of Origin powder with a walnut spoon' },
    { name: 'powder-pour', alt: 'Origin powder falling from a walnut scoop' },
  ],
  // Quick facts: each one says something the rest of the page does not
  facts: [
    { k: '20 g', v: 'One scoop' },
    { k: '7', v: 'Essentials' },
    { k: '0', v: 'Proprietary blends' },
  ],
  ingredientsTitle: ['What Origin', 'covers.'],
  ingredientsLead: 'Seven essentials most people miss even when they eat well.',
  ingredientsImage: 'origin-scoop',
  ritualTitle: ['The morning', 'ritual.'],
  // The ritual: titles only; the how-to text sits above them once
  ritual: [
    { title: 'Eat breakfast', image: 'food-bowl' },
    { title: 'Stir it in', image: 'origin-stir' },
    { title: 'Every morning you eat', image: 'origin-sachet' },
  ],
  notTitle: 'What Origin is not',
  faqTitle: 'Clear answers.',
  cross: { title: 'Add Restore if you want the night.', body: 'Restore is the optional evening formula. Never taken with Origin.', image: 'restore-evening', href: '/products/restore', label: 'See Restore' },
  // Unused on homepage (homepage uses origin-pour / origin-stir / origin-scoop / origin-sachet)
  hero: 'sage-powder',
  cutout: 'origin-jar-cutout',
  lifestyle: 'powder-pour',
  detail: 'powder-pour-cut',
};

export const restorePage = {
  name: 'Restore',
  descriptor: 'Evening recovery',
  oneLine: 'The optional night. Glycine, NAC, magnesium and ashwagandha.',
  prices: products.restore.sizes,
  primaryCta: 'Add to evening routine',
  whatItIs: 'Restore is an evening formula for people who want recovery support at the end of the day. It is not a sleep drug and not a sedative. It combines glycine, N-acetyl cysteine (NAC), magnesium, KSM-66 ashwagandha and myo-inositol. Take it if you want the night covered. Skip it if you do not. It is not required with Origin.',
  ingredients: [
    'Glycine',
    'N-Acetyl Cysteine (NAC)',
    'Magnesium',
    'KSM-66 Ashwagandha',
    'Myo-inositol',
  ],
  howToUse: 'Take in the evening, 30–60 minutes before bed, with or without food. Do not combine with other high-magnesium supplements on the same day. Origin remains the morning product.',
  notes: [
    'Evening only.',
    'Optional. Many people use Origin alone.',
    'Consult a physician if pregnant, nursing, or taking medication.',
  ],
  whyExists: 'Evening is a different biological window from morning. Restore is designed for that window. It does not try to be an all-day product. It does not compete with Origin. You decide whether the night needs covering.',
  faq: [
    { q: 'Is it a sleep aid?', a: 'No. It is not a sleep drug or sedative. It is an evening recovery formula.' },
    { q: 'How much magnesium is in Restore?', a: 'Restore is formulated so that the evening magnesium dose stays within common supplemental guidance when Origin is the only other product used.' },
  ],
  disclaimer: 'These statements have not been evaluated by the Food and Drug Administration or equivalent authority. This product is not intended to diagnose, treat, cure, or prevent any disease.',
  tag: 'Evening · Optional',
  scrub: '/video/restore-scrub.mp4',
  gallery: [
    { name: 'restore-jar', alt: 'The cream Restore jar with a walnut lid and a scoop of pale powder' },
    { name: 'restore-evening', alt: 'Restore jar, a glass of Restore and a sachet on a dark green table' },
    { name: 'restore-dusk', alt: 'A hand holding a glass of Restore beside the jar in warm lamplight' },
  ],
  facts: [
    { k: '30–60 min', v: 'Before bed' },
    { k: '5', v: 'Ingredients' },
    { k: '0', v: 'Proprietary blends' },
  ],
  ingredientsTitle: ['Five compounds.', 'One evening window.'],
  ingredientsLead: 'Built for the end of the day, and only for it.',
  ingredientsImage: 'ritual-set',
  ritualTitle: ['The evening', 'ritual.'],
  ritual: [
    { title: 'Wind down', image: 'fitness' },
    { title: 'Never with Origin', image: 'unboxing' },
    { title: 'Mind the magnesium', image: 'lab-droplet' },
  ],
  notTitle: 'Important notes',
  faqTitle: 'Before you add the night.',
  cross: { title: 'Start with Origin.', body: 'The morning floor. Many people use Origin alone.', image: 'origin-stir', href: '/products/origin', label: 'Shop Origin' },
  // Unused on homepage (homepage uses restore-evening / restore-dusk)
  hero: 'bottle-tilt',
  cutout: 'restore-jar-cutout',
  lifestyle: 'fitness',
  detail: 'bottle-tilt',
};

export const sequencePage = {
  eyebrow: 'The sequence',
  titleLines: ['Sequence,', "don't stack."],
  sub: 'One morning scoop. Optional evening recovery. Clarity instead of a cabinet.',
  rule: {
    title: 'The simple rule',
    body: 'If you eat breakfast, take Origin in the morning. If you want recovery support at night, take Restore in the evening. They are never taken together. Restore is optional. You do not need more than this to start.',
  },
  whyOrder: {
    title: 'Why this order',
    body: 'Morning is for covering daily essentials alongside food. Evening is for compounds that support the wind-down of the day.',
  },
  asa: {
    title: 'Assess · Sequence · Adapt',
    body: 'Assess how you eat and how you recover. Sequence Origin in the morning and Restore at night if desired. Adapt based on how the routine feels over weeks, not days. Nutrition should evolve as you do, starting with clarity, not complexity.',
  },
  routines: [
    { title: 'Breakfast eaten', body: 'Origin after breakfast. No Restore.' },
    { title: 'Breakfast + evening recovery', body: 'Origin morning, Restore evening.' },
    { title: 'No breakfast that day', body: 'Skip Origin. It is not designed as a meal.' },
  ],
  closing: 'Start with Origin. Add Restore only if the evening feels incomplete.',
  primary: 'Shop Origin',
  secondary: 'Shop Restore',
  // Same lifestyle crops as homepage How it works / DayLine
  morning: 'origin-stir',
  evening: 'restore-jar',
  windows: [
    {
      id: 'origin',
      tone: 'morning',
      kicker: 'Morning',
      name: 'Origin',
      body: 'With or after breakfast. The daily floor when you eat.',
      cta: 'Shop Origin',
      href: '/products/origin',
      image: 'origin-stir',
    },
    {
      id: 'restore',
      tone: 'night',
      kicker: 'Evening · Optional',
      name: 'Restore',
      body: '30–60 minutes before bed. Only if you want the night covered.',
      cta: 'Shop Restore',
      href: '/products/restore',
      image: 'restore-dusk',
    },
  ],
  asaSteps: [
    { n: '01', title: 'Assess', body: 'How you eat and how you recover.' },
    { n: '02', title: 'Sequence', body: 'Origin in the morning. Restore at night if desired.' },
    { n: '03', title: 'Adapt', body: 'Over weeks, not days, starting with clarity.' },
  ],
};

export const sciencePage = {
  eyebrow: 'Science',
  titleLines: ['Timing over', 'quantity.'],
  sub: 'Why sequence matters more than stacking more ingredients.',
  hero: 'lab-droplet',
  modules: [
    {
      n: '01',
      title: 'The cabinet problem',
      body: 'When multiple supplements are taken together, absorption can become competitive. Minerals can interfere with each other. Botanicals can overlap. The result is uncertainty. Sequencing reduces that uncertainty by separating morning essentials from evening recovery.',
      image: 'powder-pour',
      tone: 'day',
    },
    {
      n: '02',
      title: 'Why morning',
      body: 'Breakfast provides a food matrix that supports absorption of fat-soluble nutrients and omega-3s. Origin is designed to sit with that meal, not replace it. One scoop after breakfast is enough when the meal is already there.',
      image: 'sage-powder',
      tone: 'day',
    },
    {
      n: '03',
      title: 'Why evening',
      body: 'Certain compounds are commonly used in evening routines for relaxation and recovery support. Restore places those compounds in the evening window so they do not compete with the morning floor. The two products are designed for different times of day.',
      image: 'bottle-tilt',
      tone: 'night',
    },
    {
      n: '04',
      title: 'Magnesium total',
      body: 'Restore is formulated so that the evening magnesium dose stays within common supplemental guidance when Origin is the only other product used. This is one reason the two products are sequenced rather than stacked. Do not add other high-magnesium supplements on the same day.',
      image: 'fitness',
      tone: 'night',
    },
  ],
  quality: [
    'Third-party tested',
    'No proprietary blends',
    'Transparent high-level ingredients',
    'Manufactured for daily use',
  ],
  cta: { label: 'See the sequence', href: '/sequence' },
};

export const aboutPage = {
  eyebrow: 'About',
  titleLines: ['Nutrition should', 'evolve as you do.'],
  lead: 'PrimalOne exists because most nutrition advice adds complexity. We remove it. We sequence two products that do not fight each other and let the routine stay simple.',
  hero: 'fitness',
  story: {
    title: 'The story',
    body: 'The cabinet of bottles is a modern problem. People buy one thing for energy, another for gut, another for sleep, another for stress. Each product is marketed as essential. Few are designed to work together. PrimalOne started with a different question: what if the order mattered more than the number of products? Origin covers the morning floor. Restore covers the evening if you want it. Everything else can wait until the routine is clear.',
  },
  beliefs: [
    'Sequence is clearer than stacking.',
    'Timing matters more than quantity.',
    'A simple routine is more likely to be kept.',
    'Nutrition should evolve as you do, starting with clarity.',
  ],
  legal: 'Primalone Nutrition Pvt Ltd. Wave 1 products: Origin and Restore.',
};

// FAQs (shown on the Help & contact page): every question from the homepage and the old FAQ page, grouped. Answers repeat facts
// stated elsewhere on the site; subscription questions were dropped (packs are one-time only).
export const faqPage = {
  titleLines: ['Questions,', 'answered clearly.'],
  sub: 'Routine, products, orders, and how the sequence works.',
  groups: [
    {
      id: 'routine',
      label: 'Routine',
      items: [
        { q: 'Is Origin a 30-day program?', a: 'No. Origin is forever daily essentials. Take it every morning you eat breakfast.' },
        { q: 'Do I have to take Restore with Origin?', a: 'No. Restore is optional. Many people use Origin alone.' },
        { q: 'Can I take Origin and Restore at the same time?', a: 'No. Origin is morning. Restore is evening. Never together.' },
        { q: 'What if I skip breakfast?', a: 'Origin is designed for mornings when breakfast is eaten. If the scoop is your meal, this is not the right product for that day.' },
        { q: 'How do I mix Origin?', a: 'Mix one scoop (20 g) in water or a smoothie, with or after breakfast.' },
      ],
    },
    {
      id: 'origin',
      label: 'Origin',
      items: [
        { q: 'Is Origin a protein shake or meal replacement?', a: 'No. Origin contains no protein. It is a daily essentials scoop taken with or after breakfast.' },
        { q: 'Is Origin vegetarian?', a: 'It depends on the omega-3 source (fish oil or algal oil). Check the FSSAI veg/non-veg symbol on the pack.' },
        { q: 'How long does a pack last?', a: 'A 30-day pack covers 30 mornings and a 15-day pack covers 15, at one scoop a day.' },
      ],
    },
    {
      id: 'restore',
      label: 'Restore',
      items: [
        { q: 'Is Restore a sleep aid?', a: 'No. It is not a sleep drug or sedative. It is an evening recovery formula containing glycine, NAC, magnesium, KSM-66 ashwagandha and myo-inositol.' },
        { q: 'How much magnesium is in Restore?', a: 'Restore is formulated so that the evening magnesium dose stays within common supplemental guidance when Origin is the only other product used.' },
        { q: 'Can I take Restore with other magnesium supplements?', a: 'Do not combine Restore with other high-magnesium supplements on the same day.' },
        { q: "Can I take Restore if I'm pregnant, nursing, or on medication?", a: 'Consult a physician before taking Restore if you are pregnant, nursing, or on medication.' },
      ],
    },
    {
      id: 'quality',
      label: 'Ingredients & quality',
      items: [
        { q: 'Where are the products made?', a: 'In a facility certified to FSSAI, WHO-GMP, FSSC 22000, and NSF standards aligned with U.S. cGMP (21 CFR Part 111). The manufacturing site is U.S. FDA registered. Products are tested in an NABL-accredited laboratory.' },
        { q: 'Are the formulas disclosed in full?', a: 'High-level ingredients are shown. Full quantitative formulations are not published on the site.' },
        { q: 'Are there clinical studies on these exact formulas?', a: 'Individual ingredients have published research. These statements have not been evaluated by regulatory authorities.' },
        { q: 'Do you make disease claims?', a: 'No. These are food supplements. They are not intended to diagnose, treat, cure, or prevent any disease.' },
      ],
    },
    {
      id: 'orders',
      label: 'Orders & delivery',
      items: [
        { q: 'Do I need to subscribe?', a: 'No. Origin and Restore are sold as one-time 30-day or 15-day packs. Reorder whenever you need more.' },
        { q: 'Which payment methods do you accept?', a: 'UPI, cards and net banking. We do not offer cash on delivery.' },
        { q: 'How fast is delivery?', a: 'Orders typically process within 1–2 business days. Transit times vary by destination and are confirmed at checkout.' },
        { q: 'What is the returns policy?', a: 'If something arrives damaged or incorrect, contact us promptly with your order details. Opened food supplements are generally not returnable for hygiene reasons.' },
      ],
    },
  ],
};

export const journalPage = {
  eyebrow: 'Journal',
  titleLines: ['The thinking,', 'in longer form.'],
  sub: 'A clean editorial space for Origin, Restore, and the sequence philosophy. Inspired by clarity, not product launches.',
  articles: [
    {
      slug: 'why-sequencing-beats-stacking',
      title: 'Why Sequencing Beats Stacking',
      topic: 'Sequence',
      open: 'Most supplement advice adds another bottle. The cabinet grows. Clarity does not. Sequencing starts with a different premise: take fewer things, at the right time, and notice what happens. Origin in the morning. Restore in the evening if you choose it. The rest can wait.',
      body: [
        'Most supplement advice adds another bottle. The cabinet grows. Clarity does not. Sequencing starts with a different premise: take fewer things, at the right time, and notice what happens. Origin in the morning. Restore in the evening if you choose it. The rest can wait.',
        'Stacking assumes more coverage means better outcomes. In practice, vitamins can compete, minerals can interfere, and outcomes become harder to read. Sequencing separates the morning floor from evening recovery so each product has a clear job and a clear window.',
        'You do not need a cabinet to start. You need a rule you can keep: Origin after breakfast when you eat. Restore at night only if you want the evening covered. Never together.',
      ],
      image: 'ritual-duo',
    },
    {
      slug: 'the-morning-window-and-breakfast',
      title: 'The Morning Window and Breakfast',
      topic: 'Morning',
      open: 'Origin is designed for mornings when breakfast is eaten. The meal provides a food matrix. Fat-soluble nutrients and omega-3s sit more comfortably with food than on an empty stomach. One scoop after breakfast is the entire instruction.',
      body: [
        'Origin is designed for mornings when breakfast is eaten. The meal provides a food matrix. Fat-soluble nutrients and omega-3s sit more comfortably with food than on an empty stomach. One scoop after breakfast is the entire instruction.',
        'Origin is not a meal replacement and not a protein shake. It covers the essentials most people miss even when they eat well, then gets out of the way. If you skip breakfast that day, skip Origin. It is not designed as a meal.',
        'The morning window is about consistency. Forever daily essentials means the routine is meant to stay simple enough that you can keep it, not a 30-day phase that ends.',
      ],
      image: 'sage-powder',
    },
    {
      slug: 'evening-recovery-without-a-sleep-drug',
      title: 'Evening Recovery Without a Sleep Drug',
      topic: 'Evening',
      open: 'Restore is not a sleep aid. It is an evening formula containing glycine, NAC, magnesium, KSM-66 ashwagandha and myo-inositol. It is optional. It is taken at night. It does not compete with the morning product. You decide whether the evening needs covering.',
      body: [
        'Restore is not a sleep aid. It is an evening formula containing glycine, NAC, magnesium, KSM-66 ashwagandha and myo-inositol. It is optional. It is taken at night. It does not compete with the morning product. You decide whether the evening needs covering.',
        'Evening is a different biological window from morning. Restore is built for that window alone: 30 to 60 minutes before bed, with or without food. Do not combine it with other high-magnesium supplements the same day.',
        'Many people use Origin alone. That is intentional. Restore exists for the nights you want covered, not as a required second scoop.',
      ],
      image: 'bottle-tilt',
    },
    {
      slug: 'what-forever-daily-actually-means',
      title: 'What “Forever Daily” Actually Means',
      topic: 'Routine',
      open: 'Origin is not a 30-day primer. It is not a starter phase that ends. It is the daily essentials for mornings when you eat breakfast. The routine is meant to stay simple enough that you can keep it.',
      body: [
        'Origin is not a 30-day primer. It is not a starter phase that ends. It is the daily essentials for mornings when you eat breakfast. The routine is meant to stay simple enough that you can keep it.',
        'Subscription is the intended model for consistent daily use, with clear 30-day and 15-day options. One-time purchase is available. You can pause, skip, or cancel anytime.',
        'Nutrition should evolve as you do, starting with clarity, not complexity. Assess how you eat and recover. Sequence Origin and optional Restore. Adapt over weeks, not days.',
      ],
      image: 'powder-pour-cut',
    },
  ],
};

// Help & contact: one page. Search and browse the FAQs (faqPage.groups), then write to us.
export const contactPage = {
  titleLines: ['How can we', 'help?'],
  lead: 'Search the answers below, or write to us about your routine, an order, or a product.',
  faqTitle: 'Frequently asked',
  formTitleLines: ['Still need us?', 'Write to us.'],
  formLead: 'Tell us what it is about and we will reply by email.',
  medical: 'We do not provide medical advice. For health concerns, consult a qualified physician.',
  steps: [
    { title: 'You write', body: 'Pick a topic and add your order number if it is about an order.' },
    { title: 'We read it', body: 'A person on our team reads every message.' },
    { title: 'We reply by email', body: 'You hear back at the email you give us.' },
  ],
  // Support email is still to be supplied by the client.
  email: null,
  topics: ['An order', 'Origin', 'Restore', 'Delivery', 'Something else'],
  fields: {
    name: 'Your name',
    email: 'Email',
    order: 'Order number (optional)',
    message: 'Your message',
    submit: 'Send message',
  },
  thanks: {
    title: 'Message received.',
    body: 'Thank you. We will reply to your email as soon as we can.',
  },
};

export const legalPages = {
  shipping: {
    title: 'Shipping',
    body: [
      'Delivery timelines and carrier details are confirmed at checkout. We do not offer cash on delivery.',
      'Orders typically process within 1–2 business days. Transit times vary by destination.',
      'For shipment questions, contact us with your order reference.',
    ],
  },
  returns: {
    title: 'Returns',
    body: [
      'If something arrives damaged or incorrect, contact us promptly with your order details and photos where helpful.',
      'Unopened products may be eligible for return under our standard policy as stated at checkout and on pack.',
      'Food supplements that have been opened are generally not returnable for hygiene reasons.',
    ],
  },
  privacy: {
    title: 'Privacy',
    body: [
      'We collect only what we need to fulfill orders, support your account, and improve the site experience.',
      'We do not sell personal information. Payment processing is handled by trusted third-party providers.',
      'Contact us to request access, correction, or deletion of personal data we hold about you.',
    ],
  },
  terms: {
    title: 'Terms',
    body: [
      'By using this site and purchasing PrimalOne products, you agree to these terms and applicable law.',
      'Products are food supplements. They are not intended to diagnose, treat, cure, or prevent any disease.',
      'Pricing, availability, and pack sizes may change. Wave 1 products are Origin and Restore only.',
    ],
  },
};

export { routes, formatINR, products };

// Account and checkout (layout after seed.com). Help answers reuse facts already on the site.
export const accountPage = {
  title: 'Your account',
  sub: 'Sign in to see your orders, track deliveries, and reorder Origin and Restore.',
  help: [
    { q: 'When will my order ship?', a: 'Orders typically process within 1–2 business days. Transit times vary by destination.' },
    { q: 'How do I change my delivery details?', a: 'Contact us with your order reference and we will help.' },
    { q: 'Which payment methods do you accept?', a: 'UPI, cards and net banking. We do not offer cash on delivery.' },
  ],
};

export const checkoutPage = {
  payments: [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Credit / debit card' },
    { id: 'netbanking', label: 'Net banking' },
  ],
  assurances: ['One-time purchase, no commitment', 'Third-party tested · No proprietary blends', 'UPI · Cards · Net banking. No cash on delivery'],
};

// Anchor id for an FAQ question, so other pages can link straight to it (/contact#faq-...)
export const faqSlug = (q) => 'faq-' + q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
