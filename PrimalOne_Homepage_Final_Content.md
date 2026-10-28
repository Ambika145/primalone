# PrimalOne Homepage: Final Content (v3)

**Source of truth:** *PrimalOne Website Content Brief: Origin & Restore* (client, 26 Oct 2026).

**v3 changes:** fixes from the homepage audit (positioning, conversion, SEO, compliance) are applied.

**Labels used in this document:**
- **[client]**: taken word for word from the brief
- **[client, edited]**: brief copy we changed, with the reason given underneath
- **[TO CONFIRM]**: a fact only the client can supply. These show as yellow "To confirm" tags in the HTML and must be filled in or removed before launch.

**Design reference:** seed.com for the look, agemate.com for the shop and benefit patterns.

---

## What changed from v2

| # | Change | Why |
|---|---|---|
| 1 | Hero eyebrow is now a category line: "Daily essentials powder + optional evening formula" | Visitors couldn't tell what the product was within 5 seconds |
| 2 | Hero trust strip: added, then removed at agency review | Kept the hero clean |
| 3 | Products come straight after the hero, in AgeMate-style 3-column blocks (text / pour visual / contains list); the Problem and Why sequence sections are merged into one | Removes repetition and gets to the product sooner |
| 4 | Problem copy no longer says ingredients "compete for absorption" | Origin itself combines vitamins, minerals and greens, so the old line contradicted the product. It was also an unsupported science claim |
| 5 | "What PrimalOne is not" section removed; fewer "Not…" lines in the product cards | Too defensive, and it introduced "30-day starter" to buyers who had never heard of it. The point is still covered in the FAQ |
| 6 | New benefits section built from the brief's approved structure/function points | The page said what the products aren't but never what they do |
| 7 | Price and buttons removed from the product blocks; pricing lives only in the Shop section (per-day cost shown under each pack) | Agency review: avoid repeating price and buttons |
| 8 | Restore safety note added on the product card and shop card | The brief requires it |
| 9 | "View full label" link added to products. Diet symbol, format/when/diet rows in shop cards, and guarantee/delivery/payment rows: removed at agency review | Kept the cards simple; diet and format still to be confirmed for product pages |
| 10 | Shop: subscription removed (no subscription process at launch). One-time 30/15-day packs only, plus guarantee, payment and delivery lines (to confirm) | Confirmed by the agency: no subscription option. The brief's "Subscription is primary" rule is overridden |
| 11 | FAQ grows from 8 to 14 questions | Covers buyer questions: diet, taste, pack life, missed days, pregnancy and medication, magnesium, delivery |
| 12 | SEO: keyword-rich title and meta, canonical, Open Graph, en-IN, JSON-LD (Organization, Product ×2, FAQPage) | The old head had no keywords and no structured data |
| 13 | Accessibility: SVG icons replace symbol characters, labels at least 12px, pause button on the scrolling bar, visible focus, correct heading order | WCAG basics |
| 14 | Mobile: sticky "Shop Origin" bar after the hero; cart icon in the menu bar | The shop section sits low on a long page |

---

## 0. Announcement bar (scrolling, with pause button)

- Sequence, don't stack.
- Origin: daily essentials, one scoop with breakfast
- Restore: the optional evening
- 30-day and 15-day packs available

## 0.1 Navigation

primalone · Origin · Restore · How it works · Learn · FAQ · [cart icon] · **[Shop Origin]**

---

## 1. Hero

**Eyebrow (category line):** Daily essentials powder + optional evening formula

**H1 [client]:** One scoop for the day you have.

**Subhead [client]:** Origin in the morning if you eat breakfast. Restore at night if you want the evening covered. Sequence, don't stack.

**Primary CTA [client]:** Shop Origin
**Secondary CTA [client]:** Learn the sequence

---

## 2. The sequence (products): AgeMate-style 3-column blocks, Origin first, then Restore

**Layout:** each product gets a full-width block, as on agemate.com:
- **Left:** headline, copy, price and button
- **Centre:** a scoop pouring into a shaker (illustration; replace with photography)
- **Right:** "contains" list

**Eyebrow:** The sequence

**H2:** Two products. Two times of day. Never at once.

**Lead [client, edited]:** One morning scoop: Origin if breakfast is eaten. Optional evening: Restore if you want recovery support at night. They are sequenced, not stacked.

### Block 1: Origin

**Kicker:** 01 · Morning

**H3:** Daily essentials, one morning scoop.

**Para 1 [client, Origin page "What it is"]:** Origin is a daily nutrition floor: the essentials most people miss when they eat breakfast. Greens, omega-3s, vitamin D3 + K2, minerals, CoQ10, and a probiotic.

**Para 2 [client]:** One scoop with or after breakfast. Not a protein shake. **The daily if you eat.**


**Visual:** Origin scoop pouring into a shaker of water

**Origin contains [client]:**
- Omega-3s (EPA + DHA)
- Vitamin D3 & K2
- A modest mineral floor
- CoQ10
- Greens
- Multi-strain probiotic
- Prebiotic fibre (PHGG)

**Under the list:** One 20 g scoop · in water or a smoothie · View full label & amounts →

### Block 2: Restore

**Kicker:** 02 · Evening · Optional

**H3:** Five ingredients, one optional evening.

**Para 1 [client]:** An evening formula to support relaxation and recovery at the end of the day. Take it if you want the night covered. Skip it if you do not.

**Para 2 [client]:** 30–60 minutes before bed, with or without food. **Many people use Origin alone.**

**Safety note [client]:** Consult a physician if pregnant, nursing, or on medication.


**Visual:** Restore scoop pouring into a shaker. This assumes Restore is a powder; if it is capsules, switch to a capsules-and-glass visual. **[TO CONFIRM]**

**Restore contains [client]:**
- Glycine (3 g)
- NAC (600 mg)
- Magnesium
- KSM-66® ashwagandha
- Myo-inositol

**Under the list:** Evening only · never taken with Origin · View full label & amounts →

---

## 3. Why sequence (merged Problem + Why)

**Eyebrow:** Why sequence

**H2 [client]:** Stacking creates competition. Sequencing creates clarity.

**Body [client, edited]:** Most supplements are designed to be stacked: a bottle for every need, overlapping doses, and no clear rule for what to take when. The result is a cabinet of bottles and unclear outcomes. PrimalOne sequences two things that do not fight each other: a morning essential and an optional evening recovery.
*Edit: removed "Vitamins, minerals, and botanicals compete for absorption." Origin itself contains vitamins, minerals and greens, so the line works against the product. As a general claim it would also need references.*

**Comparison visual:**
- **Stacked:** Everything, all at once. A bottle for every need. Overlapping doses.
- **Sequenced:** The right thing at the right time. Morning: Origin / Evening: Restore (optional)

---

## 4. How it fits your day (day-line)

**Eyebrow:** How it works

**H2 [client]:** Origin covers the morning floor. Restore covers the night if you choose it.

**Lead [client]:** You take what matches the day you actually have.

1. **Morning, with or after breakfast: Origin.** One scoop (20 g) in water or a smoothie. Every morning you eat. **[client]**
2. **Through the day: Food does the rest.** No mid-day stack. No cabinet. Just the meals you already eat.
3. **Evening, 30–60 min before bed: Restore (optional).** With or without food, if you want the night covered. Skip it if you do not. **[client]**

---

## 5. Benefits (new; structure/function, from the brief's product pages)

**Eyebrow:** What's inside, and why

**H2:** What each scoop is built to do.

**Origin (morning)** **[client]**
- Supports daily nutrient intake alongside food*
- Provides EPA and DHA omega-3 fatty acids
- Includes vitamin D3 and vitamin K2
- Contains CoQ10 and a multi-strain probiotic
- Greens and PHGG for daily fibre support*

**Restore (evening, optional)** **[client]**
- Provides glycine and magnesium, commonly used in evening routines
- Includes NAC and KSM-66® ashwagandha
- Designed for evening use only
- Optional: not required with Origin

---

## 6. Learn (education modules)

**Eyebrow:** Learn

**H2:** The thinking, in three short reads.

**Lead:** You do not need a cabinet. You need the right thing at the right time. **[client]**

**01 · Timing: Why morning and evening are different.**
Morning is for covering daily essentials alongside food. Evening is for compounds that support the wind-down of the day. **[client]** Origin's omega-3s and vitamins D3 and K2 are fat-soluble, which is why Origin is taken with or after breakfast and not on its own.

**02 · Magnesium total: Why magnesium lives in the evening.**
Magnesium is kept in the evening product so the daily total stays within typical supplemental guidance. **[client]** That's also why Restore shouldn't be combined with other high-magnesium supplements on the same day.

**03 · The method: Assess → Sequence → Adapt.**
Assess how you eat and how you recover. Sequence Origin in the morning and Restore at night if desired. Adapt based on how the routine feels over weeks, not days. **[client]**

---

## 7. Early signal (beta)

**Eyebrow:** Early signal

**H2:** What our beta members told us.

**Note:** Self-reported · Not a clinical trial

**Stats:**
- **91%** said their energy felt steadier within 14 days*
- **87%** said their digestion felt better*
- **84%** said their focus felt clearer*

**Quotes** (shortened, with participant approval needed):
1. "I've tried every major greens and longevity supplement on the market. Nothing else has made me feel the sequence actually working." (Beta participant, 34, Bengaluru)
2. "…I stopped needing my afternoon coffee. That never happened with anything else I've tried." (Beta participant, 29, Delhi)
3. "As someone who was skeptical of supplements, the transparent labelling and no-hype approach is what won me over. The results were secondary. The integrity was the sale." (Beta participant, 41, Mumbai)

**Disclaimer:** *Self-reported by approximately 120 participants in a 30-day internal beta, June 2025. Not a clinical trial. Individual experiences vary and are not typical results.*

> **Launch gate:** publish this section only if the beta used the current Origin/Restore formulas and every quoted participant has given written consent. Otherwise remove it until real customer reviews are available.

---

## 8. Shop

**Eyebrow:** Shop

**H2:** Pick your pack.

**Lead:** Choose a 30-day or 15-day pack. One-time purchase, no commitment.

*No subscription option: there is no subscription process at launch.*

### Origin: Forever daily essentials

The morning scoop when breakfast is eaten. **[client]**

| Option | Price | Per day |
|---|---|---|
| 30 days | ₹3,499 | ≈ ₹117 |
| 15 days | ₹1,999 | ≈ ₹133 |

**CTA:** Buy Origin · ₹3,499 (updates to ₹1,999 for the 15-day pack)

### Restore: Evening recovery

The optional night. Glycine, NAC, magnesium, and ashwagandha. **[client]**

| Option | Price | Per day |
|---|---|---|
| 30 days | ₹3,999 | ≈ ₹133 |
| 15 days | ₹2,299 | ≈ ₹153 |

**Safety note [client]:** Consult a physician if pregnant, nursing, or on medication.

**CTA [client]:** Add to evening routine · ₹3,999 (updates to ₹2,299 for the 15-day pack)

---

## 9. FAQ (14 questions)

**1. Is Origin vegetarian?**
**[TO CONFIRM]** Answer depends on the omega-3 source (fish oil or algal oil). State the FSSAI veg/non-veg symbol here.

**2. Is Origin a 30-day program?** [client]
No. Origin is forever daily essentials. Take it every morning you eat breakfast.

**3. Is Origin a protein shake or meal replacement?** [client]
No. Origin has no protein. It is a daily essentials scoop to take with or after breakfast.

**4. Do I have to take Restore with Origin?** [client]
No. Restore is optional. Many people use Origin alone.

**5. Can I take Origin and Restore at the same time?** [client]
No. Origin is morning. Restore is evening.

**6. What if I skip breakfast?** [client]
Origin is designed for mornings when breakfast is eaten. If the scoop is your meal, this is not the right product for that day.

**7. What does Origin taste like, and how do I mix it?**
Mix one scoop (20 g) in water or a smoothie after breakfast. **[client]** Flavour and sweetener: **[TO CONFIRM]**

**8. How long does a pack last?**
A 30-day pack covers 30 mornings and a 15-day pack covers 15, at one scoop a day.

**9. Can I take Restore if I'm pregnant, nursing, or on medication?** [client]
Consult a physician if pregnant, nursing, or on medication.

**10. How much magnesium is in Restore?** [client]
Restore is formulated so that the evening magnesium dose stays within common supplemental guidance when Origin is the only other product used.

**11. Can I take Restore with other magnesium supplements?** [client]
Do not combine Restore with other high-magnesium supplements on the same day.

**12. Are there clinical studies on these exact formulas?** [client]
Individual ingredients have published research. These statements have not been evaluated by regulatory authorities. This product is not intended to diagnose, treat, cure, or prevent any disease.

**13. Do I need to subscribe?**
No. Origin and Restore are sold as one-time 30-day or 15-day packs. Reorder whenever you need more.

**14. How fast is delivery, and what is the returns policy?**
**[TO CONFIRM]** Delivery timelines, COD availability and returns/guarantee terms.

---

## 10. Final CTA [client]

**Eyebrow:** Sequence, don't stack.

**H2:** Start with Origin. Add Restore if you want the night.

**Sub [client]:** Nutrition should evolve as you do, starting with clarity, not complexity.

**CTAs:** Shop Origin · Add Restore

---

## 11. Footer

**Tagline [client]:** Nutrition should evolve as you do.

**Links:**
- **Shop:** Origin · Restore · How it works
- **Help:** FAQ · Shipping · Returns · Contact
- **Learn:** Journal (blog)
- **Legal:** Privacy · Terms

**Trust line:** Manufactured by Zeon Lifescience · FSSAI Lic. No. **[TO CONFIRM]**

**Payments:** UPI · Cards · Net banking · COD **[TO CONFIRM]**

**Disclaimer [client]:** *These statements have not been evaluated by the Food and Drug Administration or equivalent authority. This product is not intended to diagnose, treat, cure, or prevent any disease. Food supplements should not be used as a substitute for a varied diet.*

**Legal line [client]:** © 2026 Primalone Nutrition Pvt Ltd · Sequence, don't stack.

---

---

## Safety warning: where it appears

The Restore warning uses one box style everywhere (info icon, rounded panel, "Consult a physician if pregnant, nursing, or on medication."):

1. Products section: Restore block
2. How it works: Restore step (dark version)
3. Benefits: Restore column
4. Shop: Restore card, above the button
5. FAQ: "Can I take Restore if I'm pregnant, nursing, or on medication?"

The brief gives this warning for Restore only. **[TO CONFIRM]** Does Origin also need a caution, for example for people on blood-thinning medication, given its vitamin K2 and omega-3s?

## SEO setup (in the HTML head)

- **Title (≈60 characters):** PrimalOne | Daily Essentials Powder & Evening Recovery | India
- **Meta description (≈150 characters):** Origin: greens, omega-3, D3+K2 and probiotic in one morning scoop, from ₹117/day. Restore: optional evening recovery. Sequence, don't stack.
- **Canonical:** https://primalone.in/
- **Language:** en-IN
- **Open Graph and Twitter tags:** title, description, image (pack shot needed)
- **JSON-LD:**
  - Organization (Primalone Nutrition Pvt Ltd)
  - Product: Origin, INR offers ₹1,999–₹3,499
  - Product: Restore, INR offers ₹2,299–₹3,999
  - FAQPage, covering only questions with confirmed answers

**Suggested Journal topics:**
- Best time to take magnesium
- Vitamin D3 with K2
- Vegetarian omega-3 sources
- What is KSM-66 ashwagandha
- Glycine and evening routines
- Greens powder in India
- Why take supplements with food

---

## Review notes for the client (not for the live page)

1. **Omega-3 source (fish or algal).** This decides the veg/non-veg symbol, FAQ 1 and the diet rows.
2. **FSSAI licence number.** Required on Indian food e-commerce sites; shown in the footer.
3. **Regulatory check.**
   - Confirm NAC and KSM-66 ashwagandha are permitted at these doses under the FSSAI Nutraceutical Regulations 2022.
   - Confirm whether the disclaimer should name FSSAI instead of the FDA.
   - We are not lawyers; this needs the client's regulatory adviser.
4. **Beta section.** Confirm which formula the beta used and get written consent for the shortened quotes. If either is missing, remove section 7.
5. **Magnesium in Origin.** "A modest mineral floor" and "magnesium is kept in the evening" need to agree. Does Origin contain any magnesium?
6. **Restore format.** Powder or capsules?
7. **Origin flavour and sweetener.**
8. **Commercial terms:**
   - Money-back guarantee
   - COD
   - Delivery timelines
   - Free-shipping threshold
9. **Optional idea:** a "Full day" Origin + Restore set at a small saving. It must be positioned as optional to stay within the brief.
10. **Photography:**
    - Pack shots on light backgrounds
    - Origin being mixed at breakfast
    - Restore on a bedside table
    - Ingredient flat-lay
    - The coded jars in the HTML are placeholders.
11. **Taken out compared with earlier versions:**
    - Waitlist
    - Blood testing / "Test. Take. Re-test."
    - Inside Origin five priorities
    - "100% whole-food / clinical-grade" claims
    - "What PrimalOne is not" section
