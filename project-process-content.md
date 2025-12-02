# Project Process Slides Content

This document captures the written content and image URLs from the ProjectProcess component slides across the 3 projects displayed on the homepage.

## Typography Specifications

**Title Font Size (`text-h5`):** 
- Mobile (320px): 14px
- Desktop (1920px): 24px
- Uses fluid scaling with line-height: 1.3

**Description Font Size (`text-small`):**
- Mobile (320px): 10.33px
- Desktop (1920px): 12px
- Uses fluid scaling with line-height: 1.5 and letter-spacing: 0.05rem

## Project 1: Epàlwi-Rebbó
**Project Title:** Epàlwi-Rebbó  
**Project ID:** project-epalwi-rebbo  
**Tagline:** Learning for a resilient tomorrow  
**Description:** Designing the first digital Spanish-Ndowe diccionary.

### Slide 1
- **Title:** Dictionary source review
- **Description:** Validating the Spanish-Ndowe corpus and scanning the PDF dictionary to set the baseline.
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/image/upload/v1763414326/epalwi-rebbo_diccionario-pdf_sup7ld.png

### Slide 2
- **Title:** Data cleaning criteria
- **Description:** Defining extraction rules, cleaning criteria, and schema alignment for structured entries.
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/image/upload/v1763392640/epalwi-rebbo_data-cleaning-criteria-gpt_mifn0i.png

### Slide 3
- **Title:** Component exploration
- **Description:** Documenting interface components with motion tests to validate interactions for launch.
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/video/upload/v1763466884/epalwi-rebbo_components-video_ehnyhh.mp4
- **Dimensions:** 1920x1080

---

## Project 2: AA (The Automobile Association)
**Project Title:** AA (The Automobile Association)  
**Project ID:** project-aa  
**Tagline:** Streamlining the AA app from sign up to breakdown reporting  
**Description:** The AA mobile app sign up experience was quickly abandoned by people that acquired memberships from third parties such as banks. The perks they offered weren't hardly redeemed. The breakdown bookings in the app were low which incurred in high callcenter costs.

### Slide 1
- **Title:** Heuristic Evaluation & Workshop
- **Description:** We pointed the UI/UX flaws and Requirements in the sign up, perks and booking flows.
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_workshop_results-large_pzl7a6.png

### Slide 2
- **Title:** Ideation
- **Description:** Sketching flows for guided sign up, visible AA perks and quicker breakdown booking.
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_sketches-large_xsyk2v.png

### Slide 3
- **Title:** Testing
- **Description:** We selected the concepts winning concepts through A/B testing
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/image/upload/v1763478892/aa-test-large_hhyhst.png

### Slide 4
- **Title:** Solution
- **Description:** 1. Designed an onboarding and added tooltips

2. Incorporates a list of perks on the map view

3. Transformed a tree selection into a max of 2 selection
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_before-after_tt5vzr.gif

---

## Project 3: AET
**Project Title:** AET  
**Project ID:** project-aet  
**Tagline:** Improving the experience of booking online ski transfers for an SME  
**Description:** Before this project, the website felt fragmented and hard to navigate, so visitors struggled to understand the offer, find key information, or complete key actions. Most sessions ended without enquiries or bookings, mobile users dropped off quickly, and inconsistent visuals reduced trust. Weak SEO brought little qualified traffic, and the lack of clear analytics meant they couldn't see where people were abandoning the journey, so decisions were based on guesswork rather than data.

### Slide 1
- **Title:** Research & Discovery
- **Description:** Deep diving into user needs, market research, and competitive analysis to understand the problem space.
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/image/upload/v1764243373/aet_slide1_lxzdvg.png

### Slide 2
- **Title:** Design & Implementation
- **Description:** Creating wireframes, high-fidelity designs, and interactive prototypes to validate the user experience.
- **Image URL:** https://res.cloudinary.com/da4fs4oyj/image/upload/v1764244100/aet_slide2_twhh3s.png

---

## Notes

- The ProjectProcess component is excluded from projects with IDs 'project-3' (Pillsure) and 'project-4' (Archive) as specified in the HomeProject component logic (line 423).
- Only the projects filtered in the homepage are displayed: Epàlwi-Rebbó, AA, and AET.
- Image URLs are hosted on Cloudinary (res.cloudinary.com).
- One slide contains a video file (.mp4) instead of a static image.
- The AA project's solution slide contains multi-line description with numbered points separated by double line breaks.