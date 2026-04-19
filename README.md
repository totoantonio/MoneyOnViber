# MoneyOnViber

![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?logo=github&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflarepages&logoColor=white)
![Viber](https://img.shields.io/badge/Viber-Rakuten%20Viber-7360F2?logo=viber&logoColor=white)
![Lightweight](https://img.shields.io/badge/Lightweight-Fast%20Static%20Site-111111)
![Website](https://img.shields.io/badge/Website-Mobile%20First-0A0A0A)

Mobile-first landing page for an ebook about making money on Viber. The site is designed for ad traffic, fast load times, and simple conversion flow, with an Apple-inspired visual direction and a light Viber accent.

## What This Website Is For

This website showcases and sells the ebook **Making Money on Viber — The Complete Playbook**.

Its job is to:

- present the ebook clearly on mobile and desktop
- explain why Viber is a strong commercial channel
- highlight the value of the book with proof points, methods, and chapter breakdown
- capture the buyer's email address
- hand the buyer off to a payment flow

The current repo is built as a lightweight static site for GitHub Pages and Cloudflare Pages. Cloudflare-specific backend pieces for email storage and payment integration are included separately under [`functions/`](./functions), but GitHub Pages is used only for front-end preview hosting.

## Ebook Summary

**Making Money on Viber — The Complete Playbook** is a **2026 edition**, **70-page** ebook available in **PDF** and **EPUB**.

It is written for:

- Filipino entrepreneurs
- home-based sellers
- freelancers
- coaches
- Southeast Asian small business operators

The ebook focuses on practical execution rather than theory, with verified data, case studies, realistic income ranges, and actionable steps.

## What’s Inside the Ebook

The ebook covers **10 income methods**, including:

- selling products through Viber communities
- freelance services and virtual assistance
- affiliate marketing on Viber
- paid Viber community memberships
- drop-shipping with Viber as storefront
- online tutoring and coaching
- digital products and info-products
- brand partnerships and sponsorships
- event promotions and ticket sales
- Viber chatbot services for businesses

It also includes:

- Viber account setup guidance
- realistic success expectations and income ranges
- case studies and financial projections
- content strategy and posting schedules
- payment setup guidance
- legal and compliance notes
- a 30-day action plan
- multi-platform funnel strategy
- references and citations

## Project Structure

```text
.
├── index.html
├── styles.css
├── script.js
├── favicon.svg
├── site.webmanifest
├── Cover-900.webp
├── functions/
│   └── api/
├── schema.sql
└── wrangler.toml.example
```

## Hosting Notes

- **GitHub Pages**: good for previewing the static site
- **Cloudflare Pages**: intended final hosting target
- **Cloudflare Functions + D1**: intended for storing email leads and payment state later

## Status

Frontend is ready for static hosting. Payment and email persistence still require final Cloudflare and payment-provider configuration.
