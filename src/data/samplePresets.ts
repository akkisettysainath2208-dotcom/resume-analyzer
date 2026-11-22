export interface SamplePreset {
  id: string;
  label: string;
  resumeLabel: string;
  resumeText: string;
  jobDescription: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "frontend-eng",
    label: "Frontend Engineer",
    resumeLabel: "Jordan_Lee_Frontend_Resume.pdf (Sample)",
    resumeText: `JORDAN LEE
Seattle, WA | jordan.lee@example.com | github.com/jordanlee

SUMMARY
Frontend Software Engineer with 4 years of experience building responsive React and TypeScript web applications, component libraries, and customer-facing analytics dashboards. Focused on web accessibility, performance profiling, and clean API integration.

EXPERIENCE
Frontend Engineer — Northwind Cloud (2023 – Present)
- Built and maintained a multi-tenant React 18 and TypeScript customer portal serving 45,000+ monthly active users.
- Migrated legacy CSS modules to Tailwind CSS and standardized 30+ accessible UI primitives using Radix UI and React Aria.
- Reduced initial bundle size by 28% via route-based code splitting and Vite build optimizations.
- Collaborated with backend engineers to integrate REST APIs and handle optimistic UI updates with TanStack Query.
- Wrote unit and integration tests using Vitest and React Testing Library, maintaining 82% component test coverage.

Junior Web Developer — Harbor Digital Studio (2021 – 2023)
- Developed marketing sites and interactive product configurators using JavaScript (ES6+), HTML5, CSS3, and React.
- Implemented WCAG 2.1 AA keyboard navigation and screen-reader landmarks across client storefronts.
- Partnered with designers in Figma to translate prototypes into production components.

EDUCATION
B.S. in Computer Science — University of Washington (2021)

SKILLS
Languages: TypeScript, JavaScript, HTML5, CSS3, SQL
Frameworks & Libraries: React, Next.js, Tailwind CSS, TanStack Query, Vitest, React Testing Library
Tools: Vite, Git, GitHub Actions, Figma, Chrome DevTools`,
    jobDescription: `Senior Frontend Engineer — FinLedger Platform

About the Role:
We are looking for a Senior Frontend Engineer to lead client-side architecture for our real-time treasury and reconciliation dashboard. You will partner closely with product design and platform engineering to build fast, reliable financial workflows.

Required Qualifications:
- 4+ years of production experience with React, TypeScript, and modern JavaScript.
- Strong command of state management, REST and GraphQL API integration, and real-time data updates (WebSockets or Server-Sent Events).
- Proven experience building accessible (WCAG 2.1 AA) UI systems and reusable design system components.
- Hands-on experience with automated end-to-end testing (Playwright or Cypress) alongside unit testing (Vitest or Jest).
- Experience optimizing rendering performance for large data tables and financial visualizations (e.g., virtualization, memoization).

Preferred Qualifications:
- Experience with Next.js App Router and server-side rendering.
- Familiarity with CI/CD pipelines, telemetry/observability tools (Sentry, Datadog), and strict TypeScript configurations.
- Background in fintech, B2B SaaS, or data-intensive enterprise applications.`,
  },
  {
    id: "data-analyst",
    label: "Product Data Analyst",
    resumeLabel: "Priya_Nair_Analyst_Resume.pdf (Sample)",
    resumeText: `PRIYA NAIR
Austin, TX | priya.nair@example.com

SUMMARY
Detail-oriented Data Analyst with 3 years of experience transforming product telemetry and operational datasets into executive KPI dashboards and funnel recommendations. Strong SQL, Python, and stakeholder communication skills.

EXPERIENCE
Product & Operations Analyst — ClearRoute Logistics (2023 – Present)
- Authored complex PostgreSQL queries (CTEs, window functions) to monitor order fulfillment SLAs across 12 regional hubs.
- Built automated Looker and Tableau dashboards tracking weekly retention, churn cohorts, and delivery exceptions.
- Partnered with product managers to evaluate checkout redesign experiments using hypothesis testing (t-tests, chi-square).
- Automated weekly CSV reconciliation workflows in Python (pandas), saving 6 hours of manual reporting per week.

Data Analyst Intern / Associate — BrightCart Retail (2022 – 2023)
- Cleaned and joined customer transaction tables in BigQuery to segment repeat buyers.
- Created Excel and Power BI revenue summary reports for regional merchandising leads.

EDUCATION
B.A. in Economics & Statistics — UT Austin (2022)

SKILLS
Data & Querying: SQL (PostgreSQL, BigQuery), Python (pandas, numpy, scipy), Excel
BI & Visualization: Tableau, Looker, Power BI
Analytics: Cohort Analysis, A/B Testing, Funnel Diagnostics, KPI Reporting`,
    jobDescription: `Product Data Analyst — Growth & Monetization

Responsibilities:
- Own product funnel instrumentation, self-serve analytics, and experiment readouts for onboarding and subscription conversion.
- Write clean, performant SQL models in dbt and Snowflake to establish single-source-of-truth growth metrics.
- Design and analyze multi-variant A/B tests, calculating statistical power, confidence intervals, and guardrail metric impacts.
- Build executive dashboards in Looker or Mode and present actionable product recommendations to leadership.

Requirements:
- 3+ years of experience as a Product Analyst or Data Analyst in a SaaS or consumer subscription company.
- Expert SQL proficiency; experience with modern data warehouses (Snowflake or BigQuery) and dbt modeling.
- Experience with Amplitude, Mixpanel, or similar event-tracking platforms and product telemetry schemas.
- Proficiency in Python or R for statistical analysis and experimentation.
- Strong storytelling skills with non-technical stakeholders.`,
  },
];
