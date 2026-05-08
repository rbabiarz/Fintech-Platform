# Product Requirements Document
## Goals-Driven Fintech Platform

*Mindful spending, life-anchored finance, AI-guided alignment*

**Version 2.0 — Comprehensive Specification**
**Prepared:** May 2026
**Status:** Draft for Review

---

## Document Control

### Revision History

| Version | Date | Author | Summary of Changes |
|---------|------|--------|--------------------|
| 1.0 | May 2026 | Product Team | Initial draft: vision, four core features, design direction, baseline metrics. |
| 2.0 | May 2026 | Product Team | Comprehensive expansion: competitive analysis, regulatory framework (CFPB/SEC/FINRA), AI/ML specification, accessibility (WCAG 2.2 AA), monetization model, expanded acceptance criteria, open questions log, glossary. |

### Document Purpose

This Product Requirements Document (PRD) defines the vision, scope, functional and non-functional requirements, regulatory boundaries, and success criteria for a goals-driven personal finance platform. It is the single source of truth for cross-functional decisions during design, build, and launch.

Intended audience: product management, design, engineering, data science, compliance and legal counsel, marketing and growth, executive sponsors, and third-party partners (banking, investment, data aggregation).

### How to Read This Document

- Sections 1–4 establish strategic context: why the product exists, the market, and what success looks like.
- Sections 5–11 describe the product itself: users, principles, features, AI capabilities, design system, and accessibility.
- Sections 12–16 cover operational reality: technical architecture, security, regulatory compliance, monetization, and go-to-market.
- Sections 17–22 cover measurement, planning, and what remains uncertain: metrics, roadmap, risks, assumptions, open questions, and glossary.

---

## Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement & Market Opportunity](#2-problem-statement--market-opportunity)
3. [Competitive Landscape & Differentiation](#3-competitive-landscape--differentiation)
4. [Vision, Mission & Strategic Goals](#4-vision-mission--strategic-goals)
5. [Target Users, Personas & Jobs-to-be-Done](#5-target-users-personas--jobs-to-be-done)
6. [Product Principles](#6-product-principles)
7. [Information Architecture & Navigation](#7-information-architecture--navigation)
8. [Detailed Feature Requirements](#8-detailed-feature-requirements)
9. [AI/ML Capabilities Specification](#9-aiml-capabilities-specification)
10. [Design System & Visual Direction](#10-design-system--visual-direction)
11. [Accessibility & Inclusive Design](#11-accessibility--inclusive-design)
12. [Technical Architecture](#12-technical-architecture)
13. [Data, Privacy & Security](#13-data-privacy--security)
14. [Regulatory & Compliance Framework](#14-regulatory--compliance-framework)
15. [Monetization & Pricing](#15-monetization--pricing)
16. [Go-to-Market Strategy](#16-go-to-market-strategy)
17. [Success Metrics & KPIs](#17-success-metrics--kpis)
18. [Roadmap & Phasing](#18-roadmap--phasing)
19. [Risks & Mitigations](#19-risks--mitigations)
20. [Assumptions & Dependencies](#20-assumptions--dependencies)
21. [Open Questions & Decisions Needed](#21-open-questions--decisions-needed)
22. [Appendices: Glossary & Acceptance Criteria Templates](#22-appendices)

---

## 1. Executive Summary

### 1.1 The Product in One Paragraph

A goals-driven personal finance platform that reframes money management around the life a person is trying to build, rather than the accounts they happen to hold. By unifying banking, investing, and behavioral guidance into a single interface anchored by user-defined life milestones — home ownership, education, early retirement, family security — and applying transparent AI to translate everyday spending into goal impact, the platform addresses the emotional and behavioral gap that existing personal finance management (PFM) tools have left unfilled for over a decade.

### 1.2 Why Now

- **Open Banking has matured:** the CFPB's Personal Financial Data Rights rule (Section 1033) and the FDX standard make data aggregation safer, more durable, and less dependent on screen-scraping than at any prior point.
- **Generative and predictive AI** have crossed the threshold of being able to produce explainable, individualized financial guidance at unit cost low enough for a consumer product.
- **Consumer trust in legacy banking is fractured;** younger cohorts (Millennial, Gen Z) actively seek alternatives that reflect their values and reduce financial anxiety.
- **Regulatory clarity** around the line between financial information / education and personalized investment advice has improved, allowing well-designed guidance experiences to operate without triggering full advisor licensing — provided the line is maintained rigorously.

### 1.3 Strategic Bet

Existing PFM tools (Mint sunset 2024, YNAB, Monarch, Copilot, Empower, Rocket Money) compete primarily on either budgeting discipline or asset visibility. None has built a coherent product around a third axis: the felt connection between money behavior and personal aspirations. The strategic bet is that goal-anchoring plus compassionate AI guidance is a durable category, not a feature, and that owning that category creates pricing power and acquisition efficiency that pure budgeting and pure aggregation cannot match.

### 1.4 Scope of This Document

This V2 PRD covers the consumer mobile and web product through the first 18 months post-launch, including: Phase 0 foundations (compliance, infrastructure), Phase 1 MVP (Life-First Dashboard, Guided Accounts), Phase 2 Intelligence Layer (Predictive Guidance, Goal Alignment & Alerts), and Phase 3 Investing & Scale (Mindful Investing, partnerships). It does not yet cover business banking, lending products, insurance, tax preparation integration, or international expansion, though hooks are noted where relevant.

### 1.5 Top-Line Targets

| Dimension | 12-Month Target | 24-Month Target |
|-----------|-----------------|-----------------|
| Funded users | 50,000 | 250,000 |
| Avg linked accounts per user | ≥ 3.0 | ≥ 4.0 |
| Activation rate (≥1 goal + ≥2 linked accounts within 7 days) | 55% | 65% |
| Day-90 retention | 40% | 50% |
| Goal Alignment Score adoption (users actively engaging) | 60% of MAU | 75% of MAU |
| Net Promoter Score (NPS) | ≥ 40 | ≥ 55 |
| Premium tier conversion (free → paid) | 5% | 10% |

---

## 2. Problem Statement & Market Opportunity

### 2.1 The Core Problem

Most adults in developed economies have access to capable financial tools — banking apps, brokerage platforms, budget trackers, retirement calculators. Yet financial anxiety is at record highs, savings rates remain depressed relative to stated goals, and a majority of consumers report feeling that they are "not on track" without being able to articulate what "on track" would even mean.

The root cause is a structural mismatch between how finance is presented (accounts, balances, transactions, percentages) and how humans actually think about money (the life they want, the people they care for, the milestones they fear missing). This translation work — converting a $145 grocery bill into a position on a 30-year retirement trajectory — is left entirely to the user. Most users cannot do it, and the few who can find it exhausting.

### 2.2 Specific Unmet Needs

- **Coherent narrative across accounts.** Users hold an average of 3–7 financial accounts but have no single place that tells one story. Each app shows a slice; the user is the integrator.
- **Forward-looking framing.** Existing tools are overwhelmingly retrospective — what did you spend, where did you spend it. The question users want answered is forward: what does this mean for what I'm trying to achieve?
- **Compassionate framing.** Budgeting tools framed around deficits ("you overspent by $80") correlate with disengagement and shame-driven avoidance. Users want guidance that treats them as adults navigating trade-offs, not children violating rules.
- **Investing without expertise.** Most users do not want to pick stocks or read prospectuses. They want to know: "Is what I have invested matched to what I'm trying to achieve, and if not, what should change?"
- **Trusted automation.** AI nudges are everywhere, but their reasoning is rarely transparent. Users will accept automated guidance only when they understand the basis for it.

### 2.3 Market Sizing

| Layer | Definition | Estimated Size |
|-------|-----------|----------------|
| TAM — Total Addressable Market | U.S. adults aged 25–65 with at least one financial account who use a smartphone (the realistic universe of mobile-first PFM) | ≈ 165M individuals |
| SAM — Serviceable Addressable Market | Of TAM, those open to digital-first finance and earning $40K–$250K — high enough to have meaningful goals, mass-market enough for scale | ≈ 90M individuals |
| SOM — Serviceable Obtainable Market (5-year) | Realistic share given competition, marketing budget, and category development | 1.5M–3M users |

### 2.4 Trends Driving the Opportunity

- **Mint sunset (2024).** Intuit retired Mint in March 2024, displacing tens of millions of users into a fragmented set of replacements. Many remain dissatisfied. There is unusually high consumer willingness to switch.
- **CFPB Section 1033 (Personal Financial Data Rights).** Finalized in late 2024, this rule formalizes consumer-permissioned data access, accelerates the move from screen-scraping to standardized APIs, and creates a more durable foundation for aggregation-based products.
- **Generative AI in production.** Costs of high-quality language models have fallen by approximately an order of magnitude every 12–18 months, making personalized natural-language guidance economically viable in a freemium product.
- **Generational shift.** Millennials are the largest adult cohort, are entering peak earning and home-buying years, and have demonstrated willingness to pay for digital subscriptions in categories (mental health, fitness, productivity) that mirror this product's positioning.
- **Decline in traditional advisor accessibility.** Most human financial advisors require $250K+ in investable assets, leaving the mass market without personalized guidance. AI-led guidance with optional human escalation fills this gap.

---

## 3. Competitive Landscape & Differentiation

### 3.1 Competitive Map

The competitive set divides into five archetypes. Each addresses a slice of the user's financial life but none anchors on goals as the primary organizing principle, and none combines unified aggregation, transparent AI guidance, and goal-mapped investing in one product.

| Archetype | Examples | Strength | Gap We Exploit |
|-----------|----------|----------|----------------|
| Aggregator-PFM | Monarch, Copilot, Rocket Money, Quicken Simplifi | Unified account view, transaction tracking | Goal-anchored narrative is shallow or absent; AI guidance is rule-based, not learning |
| Budget-First | YNAB, Goodbudget, EveryDollar | Behavioral discipline, envelope methodology | Inflexible methodology; punitive framing; no investing integration |
| Wealth Aggregator | Empower (formerly Personal Capital), Kubera | Net-worth and investment visibility | Built for affluent users with advisor upsell; weak on daily spending behavior |
| Robo-Advisor | Betterment, Wealthfront, Schwab Intelligent Portfolios | Automated, low-cost investing tied to goals | Investment-only; no spending integration; goals are abstract sleeves not life narratives |
| Bank-Native | Chime, SoFi, Cash App, embedded bank apps | Low friction, direct deposit hooks | Single-institution view; no cross-account intelligence; no investment guidance |

### 3.2 Direct Competitors — Detailed View

#### Monarch
**Strengths:** Strong aggregation, clean UI, household/partner support, custom categorization.
**Gaps:** Goals are a side feature, not the spine. Investing tracking but no portfolio guidance. AI is limited to categorization assistance. Subscription pricing without a clear free tier creates an acquisition barrier.

#### YNAB (You Need A Budget)
**Strengths:** Devoted user base, methodology-driven behavior change, strong educational content.
**Gaps:** Methodology is rigid and works for a self-selecting minority. No investing. No AI. Mobile-second feel.

#### Empower (Personal Capital)
**Strengths:** Deep wealth visualization, retirement planner, strong investment tracking.
**Gaps:** Built primarily as a top-of-funnel for advisor services targeting affluent users; frequent advisor outreach annoys mass-market users. Spending side is secondary.

#### Copilot Money
**Strengths:** Beautiful design, iOS-first, ML-driven categorization, fast import.
**Gaps:** Apple-ecosystem only, narrow goal model, no investing guidance, no Android.

#### Rocket Money (formerly Truebill)
**Strengths:** Subscription cancellation as wedge, bill negotiation, good acquisition funnel.
**Gaps:** Identity is "cancel things" rather than "achieve things." Limited goal infrastructure.

### 3.3 Differentiation: Where We Win

Our defensibility rests on four dimensions, each of which exists in some competitor but none of which is integrated by any single competitor today.

1. **Goals as the spine, not a sidebar.** Every screen, every transaction, every nudge is rendered through the lens of "what does this mean for the life you said you wanted?" This is an information architecture decision, not a feature.
2. **Predictive Guidance with explainable AI.** Every nudge surfaces its reasoning ("we noticed X because Y, here's the math"). This is a hard requirement, not a stretch goal — it is also our regulatory and trust moat.
3. **Spending and investing as one continuous narrative.** Robo-advisors stop at portfolios; PFMs stop at transactions. We bridge them: reducing weekly dining spend by $30 surfaces the projected effect on the user's age-65 retirement balance, and vice versa.
4. **Compassionate, values-aligned framing.** Users self-define what alignment means. The product never imposes a normative budget. Tone is supportive, agency-respecting, and free of gamified shame patterns.

### 3.4 What We Are Deliberately Not

- We are not a bank. We do not hold deposits, issue cards, or originate loans (at MVP). Banking partners may be added later as embedded products.
- We are not a registered investment advisor at MVP. We provide information, education, and goal-aligned suggestions; specific buy/sell recommendations and discretionary management are explicitly out of scope until appropriate licensing is in place (see Section 14).
- We are not a debt-management or credit-repair service. We surface debt as one input to goal calculations but do not negotiate, consolidate, or repair credit at MVP.
- We are not a tax preparation product. We may surface tax-relevant signals (e.g., realized gains exposure) but defer preparation to integrated partners.

---

## 4. Vision, Mission & Strategic Goals

### 4.1 Vision

Every adult has a clear, calm, daily relationship between the money they have and the life they are building.

### 4.2 Mission

Build the financial companion that translates everyday money decisions into meaningful progress against personally defined life goals — using transparent AI, unified data, and compassionate design to replace anxiety with agency.

### 4.3 Strategic Goals (24 months)

| # | Strategic Goal | Definition of Success |
|---|----------------|----------------------|
| G1 | Establish category leadership in goals-anchored personal finance | Top-3 unaided awareness in the "mindful money" / "goals-based finance" category among Millennial cohort by month 24; press coverage positioning the brand as the category-defining product. |
| G2 | Achieve product-market fit on the Phase 1 MVP | Sean Ellis "very disappointed" score ≥ 40% in user research by end of month 9; Day-90 retention ≥ 40% by month 12. |
| G3 | Reduce financial anxiety in measurable, attributable ways | Validated wellbeing instrument (e.g., abbreviated PFWB scale or proprietary equivalent) shows ≥ 15-point lift among 6-month active users vs. baseline. |
| G4 | Build a trusted, transparent AI guidance system | ≥ 80% of users surveyed agree with the statement "I understand why the app made each suggestion"; complaint rate on AI guidance < 0.5% of impressions. |
| G5 | Reach sustainable unit economics | LTV:CAC ratio ≥ 3.0 by month 18; gross margin on premium tier ≥ 75%; freemium conversion ≥ 8% by month 24. |
| G6 | Establish regulatory and security trust as a durable moat | SOC 2 Type II by month 12; zero material data incidents; clean record with the CFPB and state regulators. |

### 4.4 Non-Goals for the First 24 Months

- International / non-U.S. expansion (regulatory complexity outweighs near-term revenue).
- Lending products (mortgages, personal loans, BNPL) — defer to partner integrations after core PFM PMF is established.
- Active discretionary investment management (requires RIA registration; defer to optional partner if/when justified).
- B2B / employer-sponsored channel (treat as a viable Phase 4 expansion, not a launch motion).
- Cryptocurrency portfolios as a primary integration (read-only support is fine; native trading is not).

---

## 5. Target Users, Personas & Jobs-to-be-Done

### 5.1 Target Segments

Three primary segments anchor product decisions. They overlap significantly in life stage but differ in posture toward money: how active they want to be, how anxious they currently feel, and what they want the product to do for them on an average day.

### 5.2 Primary Personas

#### Persona 1 — Sarah, the Aspiring Homeowner

| Attribute | Detail |
|-----------|--------|
| Age / stage | 29, partnered, no children, urban Toronto |
| Income / assets | $95K salary; $48K saved across HISA + brokerage; $0 invested for retirement beyond employer match |
| Financial posture | Disciplined, organized, anxious about whether her plan is "enough" |
| Tech comfort | High — comfortable with multiple SaaS tools, expects polish |
| Top JTBD | "When I am thinking about buying my first home, I want to know whether my saving and spending today actually adds up to a down payment on the timeline I want, so I can stop second-guessing every weekend brunch." |
| Needed jobs (functional) | Project savings to a target home price; show timeline impact of a change in saving rate; aggregate accounts in one view |
| Needed jobs (emotional) | Reassurance, validation that the plan is working; permission to enjoy money guilt-free when on track |
| Anti-goals | Doesn't want a budget that tells her she can't have lattes; doesn't want investment "advice" that feels like a sales funnel |
| Watch-outs | Will churn if the product feels like a budgeting app; sensitive to anything that pattern-matches to financial guilt |

#### Persona 2 — Marcus, the Values-Conscious Spender

| Attribute | Detail |
|-----------|--------|
| Age / stage | 38, married, two kids (ages 6 and 4), suburban Chicago |
| Income / assets | $135K HHI; $180K across 401(k) and IRA; $25K in liquid savings; mortgage on primary residence |
| Financial posture | Comfortable but feels his money "leaks" and isn't sure if he is on track for his children's education or his own retirement |
| Tech comfort | Medium — uses banking apps, hesitant about new fintech |
| Top JTBD | "When I make a discretionary purchase, I want to know what trade-off I'm actually making against the things I care about — kids' college, retiring at 60 — so I can spend with intention instead of guilt or denial." |
| Needed jobs (functional) | See impact of one transaction or one month's pattern on long-term goals; categorize complex household spending; flag subscriptions |
| Needed jobs (emotional) | Permission to spend without shame; clarity about whether his family is "okay" |
| Anti-goals | Doesn't want lectures; doesn't want a tool that frames everything as a problem; doesn't want to manage 27 categories |
| Watch-outs | Highest sensitivity to tone in nudges; will mute notifications quickly if framing is judgmental |

#### Persona 3 — Jordan, the Hands-Off Investor

| Attribute | Detail |
|-----------|--------|
| Age / stage | 47, married, kids in high school, suburban Atlanta |
| Income / assets | $220K HHI; $850K invested across 401(k), IRAs, taxable brokerage, ESPP, and 529 plans; rental property |
| Financial posture | Successful but cognitively overloaded; doesn't enjoy investing; outsources where possible but does not want to pay 1% AUM to an advisor |
| Tech comfort | Medium-high — values reliability over novelty |
| Top JTBD | "When I review my investments, I want to know whether my portfolio is actually configured for what I need it to do, without having to become an expert on asset allocation, so I can focus on my career and family." |
| Needed jobs (functional) | Aggregate portfolio across 6+ accounts; recommend allocation against goal timelines; surface drift; flag tax-inefficient positions |
| Needed jobs (emotional) | Confidence that the plan is sound; freedom from the cognitive load of monitoring |
| Anti-goals | Will not tolerate a product that requires daily attention; suspicious of anything that nudges him toward trades |
| Watch-outs | Highest scrutiny on regulatory boundary — must clearly understand what is information vs. advice |

### 5.3 Anti-Personas (Explicitly Not Targeted at MVP)

- **The Day Trader.** Wants execution speed, options chains, charting. Robinhood and broker-direct apps serve them; we will lose if we try to compete.
- **The Affluent Advised Investor.** Has $2M+, an existing wirehouse advisor, and a CPA. Their pain is different and their willingness to switch is low.
- **The Survival-Mode User.** Living paycheck to paycheck with negative net worth and active collections. They need different tools (cashflow management, debt counseling) and presenting goals as the spine could feel cruel. We may serve them in a future product line; we should not pretend to today.
- **The Pure Crypto-Native.** Their primary asset class is on-chain. Wallet aggregators serve them better.

### 5.4 Jobs-to-be-Done (Consolidated)

| # | Functional Job | Emotional / Social Job |
|---|----------------|------------------------|
| JTBD-1 | When my income or expenses change, help me see whether my goals are still reachable. | Reduce my anxiety about whether "everything is okay." |
| JTBD-2 | When I'm about to make a discretionary spend, help me decide if it's aligned with what I care about. | Let me spend without guilt, or skip without resentment. |
| JTBD-3 | When my investment portfolio drifts, tell me what to do — clearly, simply, with the math shown. | Make me feel competent without forcing me to become an expert. |
| JTBD-4 | When a goal becomes unrealistic, help me understand why, and what I could change. | Protect my self-image from the experience of failure. |
| JTBD-5 | When something matters in my financial life, surface it; when nothing matters, leave me alone. | Respect my attention; don't be another notification factory. |

---

## 6. Product Principles

Principles are decision-making tools. When two reasonable choices conflict in design or build, the principle is what breaks the tie. They are stable; features are not.

| Principle | Means | Tradeoff Accepted |
|-----------|-------|-------------------|
| Goals are the spine. | Every screen renders financial state through the lens of user-defined goals. Account balances exist; they just aren't the headline. | Some users initially expect a balance-first dashboard and need to acclimate. |
| Show the math. | Every nudge, projection, and recommendation surfaces its reasoning in plain language. | Higher engineering cost; some surface area looks "busier" than it would if we hid the work. |
| Compassion over shame. | No deficit framing. No leaderboards. No streaks that punish breakage. | We forgo some short-term engagement that gamification produces. |
| Respect attention. | Notifications are quiet by default and earn the right to be louder. Alerts have to be useful, not just frequent. | We will appear less "engaging" on vanity metrics like notification opens. |
| Information, not advice. | We provide guidance, projections, and education. We do not provide personalized investment advice unless / until appropriately licensed. | Some users want to be told what to do; we have to redirect that demand carefully. |
| Privacy is a product, not a footer. | Users see what data we have, why we have it, and can revoke access at any time, easily. | Increases UX surface area; reduces some flexibility in data use. |
| Inclusive by default. | WCAG 2.2 AA across mobile and web. Plain-language financial vocabulary. Multiple goal templates including non-traditional life paths. | Slower initial design throughput; harder design constraints. |
| One tap to action. | Every guidance surface has a single most-recommended next action, with deeper options accessible. | Some users will want more options upfront; we educate them into our model. |

---

## 7. Information Architecture & Navigation

### 7.1 Top-Level Navigation

The product uses a five-tab bottom navigation on mobile and an equivalent left rail on web. Order is deliberate: the user's life is the first thing they see, money flows are second, the future is third, and the system itself is last.

| Order | Tab | Purpose |
|-------|-----|---------|
| 1 | Goals | Life-First Dashboard. Goals as cards, alignment score, contextual next action. |
| 2 | Money | Guided Accounts. Unified transaction feed, account aggregates, predictive guidance inline. |
| 3 | Invest | Mindful Investing. Portfolios mapped to goals, allocation guidance, milestone projections. |
| 4 | Alerts | Goal Alignment & Alerts feed. Personalized nudges, celebrations, and out-of-sync flags. |
| 5 | Profile | Account, security, connected institutions, preferences, privacy controls, support. |

### 7.2 Hierarchy Rules

- Goals are referenced from every other tab. A transaction can be tapped to see goal impact; an investment account shows which goal(s) it serves; an alert deep-links to the goal it concerns.
- Money is bidirectional with Goals. Spending pulls forward into goal projections; goal changes recalculate spending allowances.
- Invest sits between Money and Goals — it consumes goal data (timeline, target) and produces inputs for Money projections (expected return assumptions).
- Alerts is read-only navigation — never the source of truth, always a launchpad to the relevant detail screen.
- Profile is intentionally last and includes a clear, non-buried path to data export and account deletion (regulatory and trust requirement).

### 7.3 Cross-Cutting Surfaces

- **Global search.** Searches across transactions, goals, institutions, holdings. Available from the top of every tab.
- **Quick add.** Floating action button in Goals and Money to create a goal, log a manual transaction, or link a new account.
- **Help & Reasoning drawer.** Anywhere a number or recommendation is displayed, a small "why?" affordance opens an explanation drawer. This is the single most distinctive interaction in the product.

### 7.4 Onboarding Flow (Initial Architecture)

1. Welcome and value-prop screens (3 cards) — establish goal-anchoring as the product premise.
2. Account creation (email + password OR SSO via Apple/Google).
3. Identity verification — minimum required for KYC where features require it (investing later); deferred for pure aggregation if regulatory analysis permits.
4. First goal definition (assisted) — at least one life goal with target amount, target date, optional photo/description.
5. Account linking via Plaid / Finicity (minimum 1; encouraged 3+).
6. Risk tolerance assessment — short instrument (5 questions, ~60 seconds), used for investment guidance posture.
7. Personalization — alert frequency preference, dashboard customization, optional partner/household setup.
8. Welcome dashboard — first projection rendered live, with explainability drawer auto-opened on first visit.

---

## 8. Detailed Feature Requirements

Each feature below specifies: purpose, user stories (As a / I want / So that), key elements, acceptance criteria for MVP, edge cases, dependencies, and priority. Priority codes: P0 (must ship at MVP), P1 (must ship within 6 months of MVP), P2 (post-MVP, on roadmap), P3 (exploratory, may be cut).

### 8.1 Life-First Dashboard (Goals Tab)

The product's home and the strongest surface for category differentiation. Users land here every session.

#### Purpose
Anchor the user's relationship with the product in their life goals, not their account balances. Provide an at-a-glance read on whether their current trajectory supports the life they've defined.

#### Primary User Stories
- As a goal-driven user, I want to see all my active goals on one screen so I can quickly understand whether I'm on track.
- As an anxious user, I want a single, simple read on my financial alignment so I don't have to interpret a dozen numbers myself.
- As a returning user, I want the dashboard to surface what changed since my last visit so I don't miss anything material.
- As a planner, I want to see the most impactful action I could take today so I can act with focus rather than feeling overwhelmed.

#### Key Elements

| Element | Behavior |
|---------|----------|
| Goal cards (hero) | Up to 3 primary goals visible without scroll. Each shows: target amount, current progress (absolute and %), projected completion date at current pace, status pill (On Track / Slightly Behind / At Risk / Ahead). Tap to deep-dive. |
| Goal Alignment Score | 0–100 composite of: savings rate consistency (30%), spending alignment with declared values (30%), investment allocation fit for goals (20%), debt trajectory (20%). Trend arrow vs. last month. Tap to see component breakdown. |
| Account aggregate strip | Compact horizontal strip of net worth, total liquid, total invested, total debt. Single-line, low visual weight. |
| This-month spend pulse | Donut or bar visual of current month spend by category, color-coded by alignment (aligned / neutral / out-of-sync). Tap any wedge to drill into the category in Money tab. |
| Next Action card | Single most-impactful action surfaced by the guidance engine, e.g., "Increase your monthly savings from $400 to $600 to hit your home-purchase goal 8 months sooner." Always includes a Why? affordance and a Defer / Dismiss option. |
| What's changed since last visit | Below the fold. Lightweight feed of material events (new transactions in flagged categories, milestones hit, allocation drift, goal projections updated). |

#### Acceptance Criteria (P0)
1. **AC-LFD-1:** User with ≥1 goal and ≥1 linked account sees a populated dashboard within 2 seconds of opening the app on a typical 4G connection (P95 ≤ 3s).
2. **AC-LFD-2:** Goal cards display correct progress and projected completion date based on the user's actual savings/contribution velocity over the trailing 90 days.
3. **AC-LFD-3:** Goal Alignment Score recalculates within 4 hours of any contributing event (new transaction, balance change, goal edit) and never displays a value older than 24 hours.
4. **AC-LFD-4:** Status pills correctly classify a goal as Ahead, On Track, Slightly Behind, or At Risk based on documented thresholds (see Section 9.5 algorithm spec).
5. **AC-LFD-5:** Next Action card surfaces an explanation drawer when tapped, showing the calculation behind the recommendation in plain language.
6. **AC-LFD-6:** Dashboard renders a graceful empty state for users with 0 goals (encouraging goal creation) and 0 linked accounts (encouraging linking).
7. **AC-LFD-7:** All elements pass WCAG 2.2 AA contrast and screen-reader requirements (see Section 11).

#### Edge Cases
- User has more than 3 goals: only top 3 show; rest accessible via "See all" on goal cards row. Top 3 chosen by user pinning, with default = nearest-deadline.
- User has linked accounts but no transactions yet (newly linked): show "Calibrating your dashboard" placeholder with 7-day expectation.
- Account-aggregator outage (Plaid down): show stale-data banner, last-updated timestamp, and offer manual refresh.
- Goal target date is in the past but goal not marked complete: prompt user to mark complete or update target.
- Net worth is negative: present without judgment ("Total liquid: -$2,300") and route to debt-aware guidance flow.

#### Dependencies
- Account aggregation service (Plaid + Finicity fallback).
- Categorization model (Section 9.2).
- Goal projection algorithm (Section 9.5).
- Alignment Score model (Section 9.6).

#### Priority
P0 — Must ship in MVP.

### 8.2 Guided Accounts (Money Tab)

#### Purpose
Provide a unified, intelligently categorized, goal-aware view of all connected financial accounts and transactions. This is the daily-use surface for users who want to see where their money is going and what it means for the bigger picture.

#### Primary User Stories
- As a user with multiple accounts, I want to see all transactions in one chronological feed so I don't have to log into each bank.
- As a user evaluating a recent purchase, I want to see what that transaction means for my goals so I can make better decisions next time.
- As a user reviewing a category, I want to understand whether my pace is sustainable so I can adjust before it becomes a problem.
- As a privacy-conscious user, I want clear control over what's categorized as "aligned" vs. "out of sync" so the system reflects my actual values, not someone else's.

#### Key Elements

| Element | Behavior |
|---------|----------|
| Unified transaction feed | Chronological feed across all linked accounts. Each row: merchant, amount, account, category, alignment indicator, date. Search and filter by account, category, alignment, date range, amount range. |
| Smart categorization | Each transaction auto-categorized using ML model (Section 9.2). Confidence threshold determines display: high confidence shows category directly; low confidence shows category with a "verify?" affordance. User overrides train the personal model. |
| Alignment indicator | Per-transaction visual: aligned (green dot), neutral (gray), out-of-sync (amber). Based on user-configured value mapping per category. Long-press for explanation. |
| Category drill-down | Tap a category to see: month-to-date and trailing-90-day spend, average month, projected month-end at current pace, alignment trajectory, and a Predictive Guidance card. |
| Predictive Guidance card | Inline guidance specific to the category being viewed, e.g., "Dining is trending 24% above your goal-aligned pace this month. At this rate, your home-down-payment timeline shifts ~6 weeks. Consider adjusting next month, or accept the trade and update your timeline." |
| Subscription detection | Recurring transaction detection. Flags subscriptions with: cost trend (increased? same?), last-used signal (where derivable), and one-tap reach to billing portal where available. |
| Manual transaction entry | For cash transactions or accounts not yet linked. Lightweight, optional. |

#### Acceptance Criteria (P0)
1. **AC-GA-1:** New transactions from linked accounts appear in the feed within 4 hours of post-date (P95).
2. **AC-GA-2:** Categorization confidence on consumer transactions ≥ 92% top-1 accuracy on internal validation set; user-override rate ≤ 8% in the trailing 30 days.
3. **AC-GA-3:** User can override any categorization in ≤ 2 taps, and the system never asks for the same override twice without learning.
4. **AC-GA-4:** Alignment indicators are configurable per category from a Profile setting; defaults are documented and conservative (most categories default to "neutral").
5. **AC-GA-5:** Predictive Guidance cards must show their reasoning when tapped; a card with no available reasoning is not displayed.
6. **AC-GA-6:** Subscription detection identifies ≥ 90% of common subscription types (streaming, SaaS, gym) within 90 days of a user linking the relevant account.

#### Edge Cases
- Joint or shared accounts: clear labeling that other parties may be transacting on the same account; alignment scoring based on the user's allocated share.
- Refunds and reversals: rendered as paired events; goal impact is net.
- Very large one-off transactions (e.g., $40,000 home purchase deposit): system asks user to classify as goal-aligned, expected lump, or unusual, before recalculating projections.
- Foreign currency transactions: converted at the institution's rate of record; original currency shown in detail.

#### Dependencies
- Aggregation provider (Plaid primary, Finicity / Akoya fallback).
- Categorization model and per-user fine-tune store.
- Predictive Guidance Engine.

#### Priority
P0 — Must ship in MVP.

### 8.3 Mindful Investing (Invest Tab)

#### Purpose
Translate the user's investment holdings into the language of their life goals. Show whether their portfolios are configured to support the timelines they've set, surface drift, and offer **guidance — not advice —** on alignment. The MVP is read-only and educational; trade execution and discretionary management are explicitly deferred until appropriate licensing is in place (see Section 14).

#### Primary User Stories
- As an investor with multiple accounts, I want to see one consolidated portfolio view across all of them so I understand my real exposure.
- As a goal-driven user, I want each portfolio (or sleeve of a portfolio) mapped to a specific life goal so I can see whether the allocation fits the timeline.
- As a hands-off investor, I want the system to flag when my actual allocation has drifted from a target so I can decide whether to rebalance.
- As a regulatorily-aware user, I want to clearly understand what is information vs. advice so I can trust the boundary.

#### Key Elements

| Element | Behavior |
|---------|----------|
| Consolidated portfolio view | Aggregated holdings across all linked investment accounts (401(k), IRA, Roth, taxable brokerage, ESPP, 529, HSA where applicable). Asset allocation breakdown: equities / fixed income / cash / alternatives. Geographic and style breakdowns secondary. |
| Goal-to-portfolio mapping | User assigns one or more accounts (or % shares of accounts) to specific goals. System provides a default mapping but always asks for user confirmation. |
| Target allocation reference | For each goal, an educational reference allocation based on time horizon and risk tolerance (e.g., "20-year horizon, moderate-aggressive: ~80% equities / 20% fixed income"). Always presented as a reference, never as a personalized recommendation absent appropriate licensing. |
| Allocation drift indicator | Visual diff between actual and reference allocation. Drift > 5% surfaces an educational note explaining the gap and what users in similar situations sometimes do. |
| Milestone projection | For each goal, project portfolio value at the target date under conservative, expected, and optimistic return assumptions. All assumptions disclosed. |
| Cost & tax visibility | Surface expense ratios across the user's holdings; flag positions with high expense ratios. Surface estimated tax drag on taxable accounts. Educational only at MVP. |
| No-trade environment (MVP) | No buy/sell execution. Clear hand-off to the user's broker for any action. Roadmap: in-app execution requires RIA registration or broker-dealer partnership. |

#### Acceptance Criteria (P0 / P1)
1. **AC-MI-1 (P0):** Consolidated portfolio view loads within 3 seconds for a user with up to 8 linked investment accounts and 200 holdings.
2. **AC-MI-2 (P0):** Reference allocations and any educational content are clearly labeled as "educational reference" with prominent disclosures (see Section 14).
3. **AC-MI-3 (P0):** User can map each investment account to one or more goals, with percentage splits.
4. **AC-MI-4 (P1):** Drift indicator surfaces when actual asset class allocation deviates from goal reference by ≥ 5 percentage points.
5. **AC-MI-5 (P1):** Milestone projection is reproducible — given a snapshot of inputs, the system produces the same projection ±0.5% rounding.
6. **AC-MI-6 (P0):** No screen offers, suggests, or facilitates a buy/sell of a specific security at MVP.

#### Edge Cases
- Holdings the system cannot identify (private placements, certain crypto, restricted stock): show as "unclassified" rather than guessing.
- Accounts with vesting schedules (RSUs/ESPPs): surface vested vs. unvested distinction; project vested value where data permits.
- Self-directed brokerage with options or margin: present the equity-equivalent picture; flag complexity for user awareness.

#### Dependencies
- Investment data provider for security master, expense ratios, returns history.
- Risk tolerance assessment (collected at onboarding).
- Compliance review of all reference content and disclosures (mandatory before launch).

#### Priority
P0 for read-only consolidation and goal mapping. P1 for drift indicators and milestone projections. P2 for trade execution (requires regulatory build).

### 8.4 Goal Alignment & Alerts (Alerts Tab)

#### Purpose
Proactively surface what matters: spending drift, milestone hits, allocation issues, subscription anomalies. Use AI to be useful, not loud. Every alert has a clear reason for existing.

#### Primary User Stories
- As a busy user, I want the product to tell me only what matters so I don't have to constantly check it.
- As a sensitive user, I want celebrations when I'm doing well, not just warnings when I'm not.
- As a control-oriented user, I want to choose what kinds of alerts I get and how often.

#### Alert Categories

| Category | Examples |
|----------|----------|
| Goal trajectory | "You're 3 weeks ahead of your home-down-payment goal — at this pace, you'll be ready by August 2027." |
| Spending pattern | "Dining spend is trending 24% above your goal-aligned pace this month. Want to look at what's driving it?" |
| Subscription | "Your annual subscription to X is renewing in 5 days at $189. Last login was 6 months ago." |
| Allocation drift | "Your retirement portfolio is 12% more conservative than the educational reference for your timeline. Tap to learn more." |
| Income anomaly | "A deposit of $4,200 was unusually large vs. your typical paycheck. Was this expected?" |
| Milestone celebration | "You just crossed 50% of your home-down-payment goal. That's a big one." |
| Friction reduction | "You've manually categorized 8 transactions from Trader Joe's as Groceries. Want me to do this automatically going forward?" |

#### Acceptance Criteria (P0 / P1)
1. **AC-AL-1 (P0):** Every alert displays a "Why am I seeing this?" affordance with a plain-language explanation in ≤ 3 sentences.
2. **AC-AL-2 (P0):** Alert frequency is configurable per category (off / weekly digest / as-they-happen) from Profile.
3. **AC-AL-3 (P0):** The system never sends more than 1 push notification per 24h unless the user has explicitly opted into higher frequency.
4. **AC-AL-4 (P0):** Alert content is never punitive in tone — adherence to Section 6 principles is reviewed in QA for every shipped alert template.
5. **AC-AL-5 (P1):** Users can dismiss an alert as "not useful" which feeds the relevance model and reduces similar future alerts.
6. **AC-AL-6 (P1):** Celebrations are at least 25% of the user's lifetime alert volume by month 6 of active use (measured cohort-wise).

#### Edge Cases
- New user with thin data: alerts deferred until baseline established (typically 30 days post first link).
- User in a difficult month (large drop in income, layoff signal): system suppresses "spend more efficiently" style alerts; surfaces supportive content and a "reset goals" affordance.
- Multiple simultaneous triggers: the system clusters into a single weekly digest rather than firing several alerts in a row.

#### Dependencies
- Predictive Guidance Engine (Section 9.3).
- Notification infrastructure with deliverability and unsubscribe compliance.
- Content review process (every alert template reviewed by content design + compliance before activation).

#### Priority
P0 — Must ship in MVP at minimum viability (3–5 alert categories live). Remaining categories phase in over P1.

---

## 9. AI/ML Capabilities Specification

AI is central to the product's category claim and to its competitive moat. It is also the most likely source of user, regulatory, and reputational risk. This section specifies what each AI/ML capability does, how it is governed, and how it is held accountable.

### 9.1 Capability Map

| Capability | Type | Purpose |
|------------|------|---------|
| Transaction categorization | Supervised classification | Map raw transactions to a stable category taxonomy with high accuracy and per-user adaptation. |
| Predictive Guidance Engine | Mixed: rule-based + LLM-generated | Generate and select goal-relevant nudges with explainable reasoning. |
| Goal projection | Deterministic + Monte Carlo | Project goal trajectory under conservative, expected, optimistic scenarios. |
| Goal Alignment Score | Composite score model | Synthesize behavior into a single, interpretable wellbeing-style metric. |
| Subscription detection | Sequence pattern recognition | Identify recurring transactions and surface anomalies. |
| Anomaly detection | Unsupervised + thresholding | Flag unusual income, spend, or balance events. |
| Conversational guidance (P2) | LLM with retrieval | Allow users to ask the product questions and receive grounded answers. |

### 9.2 Transaction Categorization

- **Approach:** Pre-trained transformer fine-tuned on labeled financial transaction data, with on-device or in-tenant fine-tune on a per-user basis from override signals.
- **Taxonomy:** ~80 leaf categories grouped under ~12 parents. Stable across versions; additions only with migration.
- **Accuracy targets:** ≥ 92% top-1 accuracy on internal benchmark; ≥ 85% on long-tail merchants. User-override rate trends down by month 3 post-link.
- **Privacy:** User-level adaptation runs per-user; no cross-user gradient leakage. Federated learning is on the long-term roadmap, not at MVP.
- **Failure mode:** On low confidence, transactions are tagged "Uncategorized" and surfaced for review rather than incorrectly classified.

### 9.3 Predictive Guidance Engine

This is the system that produces the contextual nudges, Next Action recommendations, and category insights. It is a hybrid: a rule-based eligibility layer determines which guidance scenarios apply to the user, and an LLM produces the final natural-language surface. Both stages are governed.

#### Pipeline

1. **Trigger detection:** Deterministic rules evaluate user state every 4 hours and on key events (new transaction, balance change, goal edit).
2. **Eligibility filtering:** Each candidate trigger checks user preferences, alert quotas, recent suppression history, and quality thresholds. Most candidates are filtered out.
3. **Reasoning generation:** For surviving candidates, the system computes the underlying numbers (impact on goal timeline, projected end-of-month spend, drift magnitude). These are deterministic.
4. **Natural language synthesis:** An LLM is prompted with a structured payload of facts and a tone-and-policy preamble. It generates user-facing copy and a one-paragraph reasoning explanation.
5. **Pre-publish validation:** Output passes a deterministic check that all referenced numbers match the source-of-truth payload (no fabrication). Out-of-policy outputs are dropped.
6. **Delivery:** Surface (dashboard card, alert, in-context cue) selected by destination logic; notification sent only if eligibility and frequency caps allow.

#### Governance

- Every prompt template is versioned and reviewed by content design and compliance.
- LLM outputs that fail the post-generation validator are logged for tuning, never shown.
- Random sampling of shipped guidance is reviewed weekly during the first 6 months.
- Users can rate guidance ("useful" / "not useful" / "wrong"). "Wrong" ratings open a structured feedback form and feed a regression dataset.

### 9.4 Subscription Detection

- Identify recurring patterns by merchant + amount + cadence with tolerance bands.
- Distinguish active vs. dormant by usage signals where derivable (companion product API integrations, in-app login data when partner-shared); else date-of-last-transaction proxies.
- Never auto-cancel; surface to user with one-tap navigation to cancellation portal where supported.

### 9.5 Goal Projection Algorithm

The mathematical backbone of the dashboard. Projections must be reproducible, conservative, and explicable.

- **Inputs:** current goal balance (sum of accounts mapped to the goal); average net contribution rate (trailing 90 days); expected return assumption (deterministic for cash/HISA, scenario-based for invested goals); target amount; target date.
- **Outputs:** expected completion date, % progress to date, status pill (Ahead / On Track / Slightly Behind / At Risk), and three-scenario projection for invested goals.
- **Status thresholds:** Ahead: projected completion ≥ 30 days earlier than target. On Track: within ±30 days. Slightly Behind: 31–120 days late. At Risk: > 120 days late or trajectory negative.
- **Edge handling:** If trailing-90-day contribution is zero, system flags "paused" rather than computing an infinite-horizon projection.
- **Disclosure:** All return assumptions surfaced in-context and in a dedicated Methodology page.

### 9.6 Goal Alignment Score

| Component | Weight | Definition |
|-----------|--------|------------|
| Savings rate consistency | 30% | How consistent is monthly net saving across the trailing 6 months, normalized to declared goal pace? |
| Spending alignment | 30% | What share of discretionary spending is in user-aligned categories vs. out-of-sync categories (trailing 90 days)? |
| Investment alignment | 20% | How close is actual asset allocation to the educational reference for the user's goals (composite drift across mapped accounts)? |
| Debt trajectory | 20% | Is debt declining at the rate implied by user's stated goals? Negative trajectory weighs heavily. |

- Score is rendered with trend arrow vs. last month and component breakdown on tap.
- Score is never compared to other users. There is no leaderboard. There are no cohort percentiles surfaced to users (we may use them internally for product diagnostics).

### 9.7 Explainability Requirements

- Every numeric output (score, projection, recommendation) has a source-traceable breakdown reachable in one tap.
- Every LLM-generated piece of copy has an attached reasoning paragraph that references only the structured payload it was given.
- No screen renders a black-box outcome. If we cannot explain it, we do not show it.

### 9.8 Bias, Fairness & Safety

- All training data sources are documented; demographic-correlated features (zip code, name) are not used as direct inputs to scoring or guidance.
- Fairness review of scoring distributions across known protected categories during build; pre-launch and quarterly post-launch.
- Red-team review of LLM prompts for vulnerabilities (jailbreak, prompt injection from transaction memo fields, etc.) before any new template ships.
- Hard policy: the system never makes statements about a user's character or worth, never moralizes a category of spending, and never compares the user to others.

---

## 10. Design System & Visual Direction

### 10.1 Brand Posture

The product's visual language is the second-strongest signal of category position, after the information architecture. Where most fintech reads as either institutional (deep blue, formal serif, dense data tables) or aggressively youthful (bright gradients, gamified UI), we hold a deliberate middle: calm, confident, warm, mature.

### 10.2 Aesthetic — "Calm & Trust"

- Soft teals as the brand's primary, signaling growth and steadiness.
- Deep navy as the secondary anchor, signaling stability and seriousness.
- Warm neutrals (off-white, sand) as the surface, never pure white. Reduces eye strain and pairs better with the warmer palette.
- Generous whitespace. Information is dense in financial products by default; we deliberately give content room to breathe.
- Rounded, friendly typography. Display: a humanist sans-serif. Body: a high-readability sans optimized for screens.

### 10.3 Color Tokens (Initial Palette)

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| primary-teal-600 | #2C7A7B | Primary brand | Goal cards, primary buttons, key affordances |
| primary-teal-100 | #B2DFDB | Primary tint | Backgrounds for goal cards, charts |
| navy-900 | #0F2A4A | Anchor | Headlines, top app bar, deep emphasis |
| sand-50 | #FAF7F2 | Surface | Page background |
| slate-700 | #334155 | Text | Primary text on light backgrounds |
| slate-500 | #64748B | Muted text | Captions, metadata |
| success-600 | #15803D | Aligned | Aligned indicator, celebrations |
| caution-600 | #B45309 | Out of sync | Misalignment indicator, drift warnings |
| error-600 | #B91C1C | Critical | Reserved for genuine errors only — never spend overruns |

### 10.4 Typography

- Display: humanist sans-serif (e.g., Source Sans Pro Variable, Inter, or commissioned).
- Body: optimized screen sans-serif. Minimum 16px on mobile body; 14px on metadata.
- Number tabular: tabular-figure variant always used for currency to prevent jitter when values change.
- Heading scale: 32 / 24 / 20 / 16 / 14 — kept tight to support content density without crowding.

### 10.5 Iconography & Imagery

- Icon set: rounded, 1.5px stroke. No emoji as primary UI signaling.
- Imagery: photography of real people in real life moments (a key in a hand, a moving box, a hospital bracelet on a newborn's wrist). Avoid stock "happy financial planning" imagery and avoid abstract growth metaphors.
- Goal cards may include an optional user-uploaded photo, treated as a first-class element, not a decoration.

### 10.6 Motion

- Calm. Eased curves, 200–280ms typical durations.
- Reserved meaningful animation for state transitions that warrant it (a goal moving from At Risk to On Track, a celebration moment).
- Reduce-motion preference fully respected: animations cross-fade or disable rather than translate/scale.

### 10.7 Component Library

- Built as a versioned design system with parity between Figma and code components from day one.
- Component categories: foundations (color, type, spacing, motion), primitives (buttons, inputs, sheets), domain components (goal card, transaction row, alignment indicator, projection chart, alert card).
- Governance: contributions reviewed by a design system owner; documented patterns; living documentation site.

---

## 11. Accessibility & Inclusive Design

Accessibility is a baseline requirement, not a polish item. Financial products carry an outsized obligation to be usable by people with disabilities, low literacy, English as a second language, and varying levels of financial literacy.

### 11.1 Standards

- WCAG 2.2 Level AA across all surfaces (mobile iOS, mobile Android, web).
- Section 508 alignment for any U.S. partner integrations.
- EN 301 549 alignment if EU expansion considered.

### 11.2 Specific Requirements

| Area | Requirement |
|------|-------------|
| Color contrast | Body text ≥ 4.5:1 against background; large text and UI components ≥ 3:1. Alignment indicators never rely on color alone — shape and label always present. |
| Touch targets | Minimum 44×44 pt on iOS, 48×48 dp on Android. Critical actions (Confirm, Dismiss) given extra spacing. |
| Screen reader | All interactive elements labeled. Charts and projections expose accessible data tables. Goal cards announce status changes when score changes meaningfully. |
| Keyboard navigation (web) | Full keyboard reachability with visible focus indicators. Tab order matches reading order. |
| Motion sensitivity | Honors OS-level reduce-motion preference. |
| Cognitive load | Plain-language financial vocabulary. No required reading at advanced levels. Where jargon is unavoidable, inline definitions available. |
| Localization-ready | All strings externalized. Number/currency/date formatting via locale APIs. Right-to-left layout structurally supported even if not launched. |
| Error states | Errors are descriptive ("We couldn't refresh your TD account — try again or contact support"), not codes. |
| Authentication | Biometric optional, never required. Strong password recovery for users without biometric devices. Family-friendly account recovery (no over-reliance on a single email). |

### 11.3 Inclusive Goal Templates

- Goal templates are deliberately broader than the typical "home / retirement / emergency fund" set. Includes: caring for aging parents; sabbatical; gender-affirming care; pet emergency reserve; immigration costs; supporting extended family abroad; non-traditional housing (cohousing, mobile, intentional community).
- Wedding template is opt-in, not a default. Children-related templates do not assume a partner.
- Retirement language avoids assumptions about working until 65 or owning a home.

### 11.4 Validation

- Independent accessibility audit before launch and annually thereafter.
- Recurring usability testing with users who use assistive technology, as part of standard research cadence (not as a one-off).

---

## 12. Technical Architecture

### 12.1 High-Level Architecture

The product is a mobile-first, cloud-hosted, microservices-oriented system. Native iOS and native Android clients for performance and platform feel; responsive web for parity on a smaller surface. A backend organized into bounded services around clear domain boundaries.

### 12.2 Service Decomposition

| Service | Responsibility |
|---------|----------------|
| Identity & access | User accounts, authentication (password + SSO + biometric), MFA, session management, KYC orchestration. |
| Aggregation gateway | Abstraction over Plaid (primary), Finicity (fallback), Akoya (FDX-native institutions). Handles consent, refresh, error normalization. |
| Accounts & transactions | Canonical store for accounts and transactions across all institutions. Source of truth for balances and history. |
| Categorization service | Hosts the categorization model and the per-user adaptation store. Stateless API. |
| Goals service | Goal definitions, account-to-goal mappings, projections, status. |
| Guidance engine | Trigger detection, eligibility, payload construction, LLM orchestration, post-validation, audit log. |
| Investing service | Holdings, portfolio composition, asset allocation, drift, projections. |
| Notifications service | Multi-channel delivery (push, email, in-app). Quotas, suppression, preference enforcement. |
| Audit & compliance log | Append-only log of guidance shown, user consent events, data access. Read-only by support; immutable. |

### 12.3 Data Stores

- Primary OLTP: PostgreSQL with row-level security; partitioned by tenant where applicable.
- Cache: Redis for session and hot-path data.
- Analytics warehouse: a columnar warehouse (Snowflake or BigQuery) for product analytics, fed via CDC. PII-tagged columns require explicit access; no production data in dev/test environments.
- ML training: separate, governed environment with access controls and dataset lineage tracking.

### 12.4 API Design Principles

- REST for public-facing client APIs; GraphQL evaluated for internal mobile gateway only if metrics justify it.
- Idempotency keys on all state-mutating endpoints.
- All endpoints versioned; deprecated endpoints maintained for ≥ 12 months.
- Rate limits explicit and visible to clients.

### 12.5 Mobile Client

- Native iOS (Swift/SwiftUI) and native Android (Kotlin/Compose) for performance, platform-correct biometrics, and accessibility primitives.
- React Native evaluated and rejected for the V1 client given UX-quality requirements; revisit after V1.
- Offline-tolerant: core dashboard renders with cached data when network is unavailable; clearly labeled stale.

### 12.6 Infrastructure

- Multi-region active-active where feasible; minimum active-passive with documented RTO/RPO.
- Infrastructure as code (Terraform or equivalent); no manual cloud changes in production.
- CI/CD with automated tests, security scans (SAST, dependency scan, secret scan), and deploy approvals.

### 12.7 Observability

- Three pillars: structured logs, metrics, distributed traces.
- Synthetic monitoring of critical user journeys (login, link account, view dashboard, view alert) every 5 minutes.
- On-call rotation; SLOs published internally with error budgets that constrain release velocity.

---

## 13. Data, Privacy & Security

### 13.1 Data Classification

| Class | Definition & Examples |
|-------|----------------------|
| Restricted | Information that, if exposed, causes material harm. SSN, full account/card numbers, government IDs. Encrypted at rest with HSM-backed keys; access strictly RBAC-gated; never logged. |
| Sensitive PII | Name + address, transaction details, goals, investment holdings. Encrypted at rest; access logged; minimization in non-production. |
| Internal | App configuration, model versions, internal logs without user identifiers. |
| Public | Marketing site content, public methodology pages. |

### 13.2 Encryption

- In transit: TLS 1.3 minimum. HSTS enforced. Certificate pinning on mobile clients.
- At rest: AES-256, envelope encryption with cloud KMS; HSM-backed CMKs for restricted data.
- Backup encryption: same standards; backups stored cross-region with key separation.

### 13.3 Authentication & Authorization

- MFA available at signup, strongly encouraged; required for high-risk actions (changing email, adding investment account, exporting data).
- Biometric login available on supported devices; never the only path to recovery.
- Step-up authentication on high-risk transactions even within an authenticated session.
- Session timeout: idle 15 min on mobile, 10 min on web; absolute 8 hours.

### 13.4 Privacy Controls

- Privacy dashboard: every user can see what data we have, why we have it, and revoke any item.
- Granular consent: aggregation, ML training on anonymized data, marketing communications, partner sharing all separately controlled.
- Data export: user can export their data in machine-readable format within 7 days of request.
- Data deletion: account deletion request honored within 30 days; certain regulatory retention exceptions documented and disclosed (e.g., transaction history for 7 years where required).

### 13.5 Compliance Programs

- SOC 2 Type II — initiated at MVP, certified by month 12 post-launch.
- PCI-DSS — only to the extent any cardholder data is processed; preferred posture is to not handle PAN at all (tokenized partner-issued cards if/when card products launch).
- CCPA / CPRA — full compliance from launch.
- GDPR — design alignment from launch; full compliance gated on EU expansion.

### 13.6 Incident Response

- Documented IR plan with named roles, rehearsed quarterly.
- Notification windows: regulatory and contractual obligations honored. Material user-affecting incidents communicated within 72 hours of confirmation.
- Bug bounty program post-launch.

---

## 14. Regulatory & Compliance Framework

This is the most critical section for the product's survivability. The line between "financial information / education / general guidance" and "personalized investment advice" is the line between an unlicensed app and one that requires registration as a Registered Investment Advisor (RIA), with the operational, capital, and compliance burden that entails. Crossing that line accidentally is the single biggest existential risk in the product.

### 14.1 U.S. Regulatory Surface (Material to MVP)

| Authority / Regime | What It Governs | Our Posture |
|-------------------|-----------------|-------------|
| CFPB — Reg E | Electronic fund transfers, error resolution | Applies to any P2P or money-movement features. None at MVP. Disclosed if added. |
| CFPB — Section 1033 | Personal financial data rights | We rely on consumer-permissioned access via FDX-aligned aggregators. Compliance baked into onboarding consent flow. |
| CFPB — UDAAP | Unfair, deceptive, abusive acts and practices | Tone, framing, fee disclosures, and dark-pattern review on every shipped surface. Standing review process. |
| SEC — Investment Advisers Act of 1940 | Personalized investment advice for compensation | We do not provide personalized investment advice at MVP. Education-and-information posture documented and reviewed by counsel. |
| FINRA / Broker-Dealer Rules | Securities transactions | No execution at MVP. Any later trade execution either via FINRA-registered partner or our own RIA + BD. |
| State Money Transmitter Laws | Movement and storage of funds | Avoided at MVP by not holding consumer funds. Re-evaluated if banking features launch. |
| FTC — GLBA Safeguards Rule | Safeguarding of consumer financial info | Aligned via SOC 2 + documented Information Security Program. Mandatory. |
| FTC — TCPA / CAN-SPAM | Marketing communications | All marketing channels honor opt-out and consent. Audit trail. |
| State privacy laws (CCPA, CPRA, etc.) | Personal data rights | Compliant from day one nationally. |

### 14.2 The "Information vs. Advice" Line

The product walks a deliberate path: present facts, projections, and educational reference allocations clearly tied to the user's stated goals and time horizons, without recommending specific securities or directing the user to buy or sell. Crossing into advice triggers RIA registration, which dramatically alters the product's economics and legal exposure.

- **Allowed (information / education):** "For a 25-year horizon with a moderate-aggressive risk profile, a commonly cited reference allocation is approximately 80% equities / 20% fixed income." Surfaced as educational content with clear disclosure.
- **Allowed (factual observation):** "Your current allocation is 50% equities / 50% fixed income, which is more conservative than the educational reference for your timeline." Factual statement, no recommendation.
- **Not allowed at MVP (personalized advice):** "You should buy more VTI." "You should sell SPY." "Move 30% from bonds into stocks." These constitute personalized investment advice and require RIA registration.
- **Disclosure:** Every screen displaying educational reference content carries a persistent disclosure: "Educational reference, not personalized investment advice. Consider your personal circumstances or consult a qualified financial professional before making investment decisions."

### 14.3 Compliance Operating Model

- In-house compliance counsel from pre-launch.
- Every alert template, projection, and educational content surface reviewed and version-controlled by compliance.
- Quarterly review of how users interpret guidance (research panel) — adjust language if interpretation drifts toward advice.
- Clear escalation for any feature concept that proposes personalized recommendations: gated by counsel sign-off and a documented decision log.

### 14.4 KYC / AML

- Aggregation-only features at MVP can operate with email-verified accounts.
- Any feature that involves money movement triggers KYC (CIP) and AML obligations: full identity verification, OFAC screening, transaction monitoring.
- KYC vendor selected for coverage and abandonment performance; verification flow designed for minimum friction.

### 14.5 Disclosures Inventory

- Standing terms of service, privacy policy, e-sign disclosure, electronic communication consent.
- Methodology page: how we calculate the Goal Alignment Score, projections, and reference allocations.
- Aggregation disclosures: which institutions, what data, who has access.
- AI disclosures: where AI is used, how it generates content, and our commitment to explainability.
- Per-screen disclosures where required (educational reference, hypothetical performance, etc.).

---

## 15. Monetization & Pricing

### 15.1 Model

Freemium subscription is the primary revenue model. Free tier delivers genuine value to ensure broad funnel and word-of-mouth growth; premium tier unlocks deeper guidance, advanced projections, partner perks, and (later) integrated investing services.

### 15.2 Tier Structure (Initial)

| Capability | Free | Premium |
|------------|------|---------|
| Account aggregation | Up to 6 linked accounts | Unlimited linked accounts |
| Goals | Up to 3 active goals | Unlimited goals + scenario modeling |
| Life-First Dashboard | Full | Full |
| Guided Accounts (transactions, categorization) | Full | Full + advanced filters and bulk rules |
| Predictive Guidance | Standard alerts | Personalized depth: scenario explorer, what-if planning |
| Mindful Investing (read-only) | Aggregate view | Per-goal allocation guidance, drift alerts, milestone projections |
| Subscription detection | Detection + manual cancel | Detection + assisted cancellation |
| Couples / household | Not included | Included |
| Data export | CSV | CSV + JSON + scheduled exports |
| Support | Help center + community | Priority support + 1:1 financial coaching sessions (P2) |
| Price | $0 | Target $14.99/mo or $119/year (TBD on willingness-to-pay research) |

### 15.3 Other Revenue Levers (Considered, Not Committed)

- **Affiliate / referral revenue from financial partners** (HISA, brokerage, mortgage). Acceptable only if (a) genuinely user-aligned, (b) clearly disclosed, (c) does not influence guidance content.
- **B2B / employer channel** as part of financial wellness benefits. Targeted Phase 4.
- **White-label for credit unions and community banks** where our category positioning fits. Targeted Phase 4.
- **Asset-management revenue** if/when we register as RIA and offer managed portfolios. Significant build; targeted Phase 5+.

### 15.4 Anti-Patterns We Reject

- No advertising of third-party financial products inside the core experience.
- No selling of user-level data, ever, in any form, including "anonymized" aggregates beyond what's needed for our own model improvement.
- No dark patterns in cancellation. Premium users can cancel in two taps, with no retention dialogs designed to manipulate.

### 15.5 Unit Economics Targets

- Blended ARPU (free + premium): target $24/year by month 18, $48/year by month 36.
- CAC: target $35 blended (organic-heavy mix), maximum $70.
- LTV (24-month): target ≥ $140 by month 18; LTV:CAC ≥ 3.0.
- Gross margin on premium subscription revenue: ≥ 75%.

---

## 16. Go-to-Market Strategy

### 16.1 Positioning Statement

"For people who want their money to support the life they're building — not just track what they spent — we are the financial companion that translates everyday decisions into progress against the goals that matter most. Unlike budget trackers and account aggregators, we treat goals as the spine, use AI you can actually trust, and never use shame to drive engagement."

### 16.2 Launch Sequence

- **Closed alpha (months 1–3 pre-launch):** 200–500 hand-recruited users from research panels and waitlist. Heavy qualitative feedback. Goal: validate core flows, find catastrophic UX or compliance issues.
- **Open beta (months 4–6 pre-launch):** Public waitlist activation. 5,000–15,000 users. Free during beta. Goal: pressure-test scale, refine onboarding, baseline activation and retention.
- **Public launch:** Full availability. Free + Premium tiers live. Coordinated press, content marketing, and influencer partnerships.

### 16.3 Acquisition Channels

- **Content & SEO:** Long-form, genuinely useful content on goal-based finance. Calculator tools that solve a problem and lead to product. Highest-LTV channel; slowest to ramp.
- **Influencer / creator partnerships:** Personal finance creators in the "mindful" or "values-aligned" space. Authentic integrations, not generic ads.
- **Paid social:** Instagram and TikTok with creative that demonstrates the product's distinct narrative (goal cards, transparent reasoning), not generic "budget app" creative.
- **Referral / invite:** Lightweight referral program. Both sides receive non-monetary value (e.g., extended free trial, additional goals).
- **PR / earned media:** Press positioning around the Mint sunset, the new CFPB rules, and the category-creating angle of mindful finance.

### 16.4 Trust-First Marketing

- All public claims about projections, returns, or outcomes are sourced or modeled, with methodology linkable. Marketing creative does not show fake users, fake numbers, or aspirational scenarios that the product cannot deliver.
- No "get rich" / "get out of debt fast" messaging. Tone matches the product.
- Customer stories used in marketing are consented and verified; no synthetic testimonials.

---

## 17. Success Metrics & KPIs

### 17.1 North Star Metric

Weekly Goal-Engaged Users (WGEU): users who, in the trailing 7 days, performed at least one of: viewed a goal detail, edited a goal, engaged with a guidance card, or marked a transaction goal-aligned. The metric is deliberately tied to the product's category claim — engagement specifically with goal-anchored behavior rather than generic app opens.

### 17.2 Metric Tree

| Layer | Type | Metrics |
|-------|------|---------|
| Acquisition | Lagging | New signups, CAC by channel, conversion from waitlist |
| Activation | Leading | % completing onboarding (≥1 goal + ≥2 linked accounts) within 7 days; time-to-activation |
| Engagement | Leading | WGEU; sessions per week; goal-detail views per active user; guidance card open rate |
| Retention | Lagging | D7, D30, D90 retention; resurrection rate |
| Trust & quality | Leading | % guidance rated "useful"; % flagged "wrong"; complaint rate; uninstall reasons |
| Financial impact (user) | Lagging | Average net savings rate change vs. pre-product baseline; goal completion rate; alignment score trend |
| Revenue | Lagging | Free→paid conversion; ARPU; LTV; gross margin |
| Wellbeing | Lagging | Validated wellbeing instrument (financial anxiety) deltas at 6 months |

### 17.3 Guardrail Metrics

Metrics that must hold within thresholds even when other metrics improve. They prevent improvements that come at user trust expense.

- Notification opt-out rate ≤ 8% trailing 30 days.
- Guidance "wrong" / "not useful" rate ≤ 5% trailing 30 days.
- Account-deletion-rate trend not increasing month-over-month for two consecutive months.
- App store rating ≥ 4.5 across both stores.
- Material data incidents: zero.
- Regulatory complaints (CFPB, state AGs): zero substantiated.

### 17.4 Measurement Discipline

- Every shipped feature has a pre-defined success criterion captured at spec time.
- Experiments require a written hypothesis and a metric of record before launch.
- Fortnightly product review across leading and guardrail metrics.
- Quarterly business review across full metric tree with exec stakeholders.

---

## 18. Roadmap & Phasing

The roadmap is structured around four phases, each with explicit entrance and exit criteria. Phase 0 is foundational — necessary before any user-facing software ships.

### 18.1 Phase 0 — Foundations (Months -3 to 0, pre-launch)

- Legal entity formation; counsel engaged; compliance program drafted.
- Aggregator partnerships executed (Plaid primary, Finicity fallback contracted).
- Core infrastructure stood up: identity service, encryption, observability.
- Brand identity, design system v0, content style guide finalized.
- Closed alpha cohort recruited.

### 18.2 Phase 1 — MVP (Months 1–4)

- **Scope:** Life-First Dashboard, Guided Accounts, basic Alerts (3–5 alert types), Goal Alignment Score v1, onboarding, account linking, native iOS + Android.
- **Out of scope:** Investing-tab depth, full Predictive Guidance Engine, partner integrations, premium tier.
- **Exit criteria:** Sean Ellis "very disappointed" ≥ 35%, D30 retention ≥ 35%, no material compliance issues, zero data incidents in beta.

### 18.3 Phase 2 — Intelligence Layer (Months 5–9)

- **Scope:** Full Predictive Guidance Engine with explainability, expanded alert categories, subscription detection, anomaly detection, premium tier launch.
- **Exit criteria:** Free→Premium conversion ≥ 4%; guidance "useful" rating ≥ 70%; D90 retention ≥ 35%; SOC 2 Type II in flight.

### 18.4 Phase 3 — Mindful Investing & Scale (Months 10–15)

- **Scope:** Mindful Investing tab full feature set (read-only), drift alerts, milestone projections, household / partner support, web parity, content & SEO machine running.
- **Exit criteria:** 150K+ funded users; LTV:CAC ≥ 2.5; SOC 2 Type II completed.

### 18.5 Phase 4 — Partnerships & Expansion (Months 16+)

- Affiliate integrations with selected high-fit partners, with disclosure-first design.
- Selected white-label deal with credit union or community bank.
- Evaluation of RIA registration for managed-portfolio offering.
- Evaluation of B2B / employer channel.

### 18.6 Always-On Tracks

- **Quality.** Bug burndown, performance, accessibility audits, content review.
- **Trust.** Security posture improvements, transparency reports, methodology updates.
- **Research.** Continuous user research; quarterly state-of-the-product synthesis.

---

## 19. Risks & Mitigations

Risks are categorized by domain. Severity reflects worst-case if unmitigated. Likelihood reflects probability over the first 24 months.

### 19.1 Risk Register

| Risk | Sev | Likely | Mitigation |
|------|-----|--------|------------|
| Crossing the information / advice line, triggering RIA enforcement | High | Med | Compliance gating on every guidance template; counsel review; documented decision log; staff training; quarterly user-interpretation research. |
| Aggregator outage or contract disruption | High | Med | Multi-aggregator architecture (Plaid + Finicity + FDX-direct where available); graceful stale-data UX; SLA monitoring. |
| AI nudge fatigue or perceived noise | Med | Med | Strict per-day quotas; per-category opt-in; relevance feedback loop; automated suppression after low engagement. |
| Material data incident | Critical | Low | Defense in depth; least privilege; encryption; SOC 2 Type II; bug bounty; rehearsed IR; cyber insurance. |
| Categorization model degradation as merchant data evolves | Med | High | Monitoring on accuracy; weekly retraining schedule; user override loop feeds training set. |
| LLM hallucination or out-of-policy output reaching a user | High | Med | Deterministic post-validation against source payload; out-of-policy detector; sample audit weekly; full audit log. |
| Acquisition cost inflation | Med | High | Channel diversification; content moat; referral program; brand building from day one. |
| Premium tier conversion below plan | Med | Med | Willingness-to-pay research before launch; iterative feature gating; preserve free-tier value. |
| Mint-replacement competitive surge | Med | Med | Different category positioning; do not chase feature parity with budget trackers. |
| Regulatory shift (Section 1033 implementation, CFPB enforcement priorities) | Med | Med | Active regulatory tracking; counsel relationships; design that does not depend on a single regulatory interpretation. |
| Founder/key-person concentration | Med | Low | Documented critical path; cross-training; succession plans for VP-level roles. |
| AI bias surfaces in guidance | High | Low | Fairness review pre-launch and quarterly; demographic-correlated features excluded from scoring; user feedback monitoring. |
| User wellbeing harm (e.g., shame triggering disengagement from finances) | Med | Low | Tone review on every shipped surface; wellbeing metric tracked; support resources for users in distress. |

---

## 20. Assumptions & Dependencies

### 20.1 Key Assumptions

- Users will link an average of 3+ financial accounts; under that, the goal-aggregation premise weakens significantly.
- Users will define and maintain at least one life goal — the entire product depends on this.
- AI-generated, explainable guidance is preferred to silence; users want help with framing, not just information.
- Compassion-first framing produces equal or better engagement than gamification, while creating durable trust. (To be validated in Phase 1.)
- Free tier with meaningful value is the right top-of-funnel for the category, despite cannibalization risk on premium revenue.
- Section 1033 implementation timeline holds; FDX-style standards will be available across major institutions by Phase 3.
- Major aggregator partners remain available; pricing remains predictable.

### 20.2 External Dependencies

- Plaid (primary aggregation), Finicity / Akoya (fallback) — coverage, uptime, pricing.
- Cloud infrastructure provider — reliability, compliance, region availability.
- LLM provider(s) — pricing, latency, availability, policy alignment with our use.
- Investment data provider — security master, returns, expense ratios.
- KYC vendor — coverage, friction, accuracy.
- Regulatory bodies — Section 1033 implementation timeline, CFPB enforcement priorities, state attorney-general actions.

### 20.3 Internal Dependencies

- Compliance counsel availability for review cycles.
- Design system maturity to support velocity beyond MVP.
- Data engineering capacity for analytics and ML pipelines.
- Hiring plan: critical roles (VP Compliance, ML Engineering Lead, Head of Content Design) filled before scale-up phases.

---

## 21. Open Questions & Decisions Needed

Questions material to the product strategy that require resolution. Each lists the decision-maker (DRI), latest acceptable date, and current state.

| # | Question | Latest By | Status |
|---|----------|-----------|--------|
| Q1 | Premium price point: $14.99/mo or split tier (Plus / Premier)? | Phase 1 mid | Pending willingness-to-pay research. |
| Q2 | Couples / household — is this a Phase 2 or Phase 3 feature? | Phase 1 end | Hypothesized P3; demand may pull it forward. |
| Q3 | Web app at MVP or web-first deferred to Phase 3? | Pre-Phase 1 | Strong recommendation: mobile-only at MVP, responsive web for landing pages, full web in Phase 3. |
| Q4 | Investing tab — read-only forever, or RIA registration in Phase 4? | Phase 3 mid | Open. Significant strategic decision; revisit with revenue, regulatory, and capital data in hand. |
| Q5 | Affiliate revenue — yes or no, and under what disclosure model? | Phase 2 end | Tentatively yes, only with disclosure-first UX and no influence on guidance content. |
| Q6 | Localization — Spanish-language support timeline? | Phase 2 end | Open. Likely Phase 3. |
| Q7 | Conversational guidance (chat with the product) — Phase 2 or Phase 4? | Phase 1 end | Defer to Phase 4 unless research shows strong demand. |
| Q8 | Native vs. cross-platform mobile — confirm native decision after Phase 1. | Phase 1 end | Decision: native. Revisit if velocity becomes a constraint. |
| Q9 | Wellbeing instrument — proprietary or licensed? (e.g., CFPB Financial Well-Being Scale) | Phase 1 mid | Lean toward CFPB scale for credibility and benchmarking. |
| Q10 | Data residency — single-region launch, or U.S. + Canada multi-region? | Pre-Phase 1 | Lean U.S.-only launch; Canada Phase 4. |

---

## 22. Appendices

### Appendix A — Glossary

| Term | Definition |
|------|------------|
| Aggregator | A third-party service (e.g., Plaid, Finicity) that connects to financial institutions on behalf of consumer-permissioned applications. |
| AUM | Assets under management. Used here as a directional metric for premium-user portfolio scale, not as a revenue source at MVP. |
| CAC | Customer acquisition cost. Total acquisition spend over a period divided by funded user signups attributable to the same period. |
| CCPA / CPRA | California Consumer Privacy Act and California Privacy Rights Act. |
| CFPB | Consumer Financial Protection Bureau. |
| FDX | Financial Data Exchange — industry standard for consumer-permissioned financial data sharing. |
| GLBA | Gramm-Leach-Bliley Act, including the Safeguards Rule for protecting consumer financial information. |
| JTBD | Jobs-to-be-Done — a framework that defines product needs in terms of progress users want to make in their lives. |
| KYC / CIP | Know Your Customer / Customer Identification Program — identity-verification obligations applicable to certain financial services. |
| LLM | Large Language Model — a class of machine learning model used to generate natural-language outputs. |
| LTV | Lifetime value. Expected revenue from a customer across their relationship with the product. |
| NPS | Net Promoter Score — a single-question survey measure of recommendation likelihood. |
| PFM | Personal Financial Management — the broad category of consumer finance applications focused on budgeting, aggregation, and tracking. |
| RIA | Registered Investment Adviser — entity registered with the SEC or state securities authorities that may provide personalized investment advice for compensation. |
| Section 1033 | The provision of the Dodd-Frank Act under which the CFPB has finalized the Personal Financial Data Rights rule. |
| SOC 2 | An audit framework (Type I = design; Type II = design + operating effectiveness over a period) for service organization controls. |
| UDAAP | Unfair, Deceptive, or Abusive Acts or Practices — a key area of CFPB and FTC enforcement authority. |
| WGEU | Weekly Goal-Engaged Users — the product's North Star metric (see Section 17). |

### Appendix B — Acceptance Criteria Template

Every shipped feature uses the following structure for its acceptance criteria, captured in the engineering ticket and reviewed at spec sign-off:

- Given [precondition], when [action], then [outcome].
- Specify quantitative thresholds where possible (response time, accuracy, error rate).
- Specify accessibility expectations (screen-reader behavior, keyboard reachability, contrast).
- Specify analytics events to be emitted and the schema.
- Specify failure-mode behavior (network unavailable, third-party degraded, etc.).
- Specify required disclosures or compliance review status.

### Appendix C — Related Artifacts

- User research synthesis (separate document, link in product wiki).
- Design system reference (Figma + code documentation, versioned).
- Engineering RFCs for material architectural decisions (versioned in repo).
- Compliance review log (controlled-access).
- AI/ML model documentation: training data lineage, evaluation, fairness analysis (controlled-access).

---

*— End of Document —*
