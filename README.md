# MA Estate Builder

Website I built for a construction/renovation company (MA Estate Builder). It's got pages for services, galleries with before-after pics, reviews, and a contact form that sends auto-replies.

**Live**: https://ma-estate-builder.co.uk (Vercel + GoDaddy domain)

## What It's About
I made this to practice Next.js while doing something useful for a real trades business. Started with the basic create-next-app setup, but changed pretty much everything—layout, colors (went for clean professional look), gallery for lots of photos, and the contact replies. Tested it on my phone a lot because clients would use mobile.

Used some AI for quick ideas/boilerplate, but I went through every file, tweaked it, and made sure it worked how I wanted. Added simple admin protection too (I asked client they  didn't want MFA )

## Main Features
- Home with services overview
- Pages for about, services, gallery, reviews, before-after, contact
- Contact form sends reply email (via Resend)
- Basic admin to see messages (password protected)
- Works well on phones

## Tech I Used
- Next.js (pages router)
- React/JS
- Supabase for any data
- Resend for emails
- Plain CSS (no frameworks—easier to customize)

## Run It Yourself
```bash
git clone https://github.com/Arshiarpmsl/ma-estate-builder.git
cd ma-estate-builder
npm install
npm run dev
