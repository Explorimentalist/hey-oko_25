export type ProcessMediaType = 'image' | 'video'

export interface ProcessSlide {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType?: ProcessMediaType;
  width?: number;
  height?: number;
}

export const processSlidesByProject: Record<string, ProcessSlide[]> = {
  'project-epalwi-rebbo': [
    {
      title: 'PDF format review',
      description: 'I reviewed the translation dictionary in PDF format written by my uncle and normalised by him and my dad, to understand the format and to write a prompt for GPT3 write a prompt to extract the dictionary entries.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763414326/epalwi-rebbo_diccionario-pdf_sup7ld.png'
    },
    {
      title: 'Prompt & Data cleaning criteria',
      description: 'Through conversations with GPT3, I defined and validated the prompt for data extraction rules, cleaning criteria, and schema alignment for structured entries. I used Cursor Agent to generate the entries in .json format.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763392640/epalwi-rebbo_data-cleaning-criteria-gpt_mifn0i.png'
    },
    {
      title: 'Web app development',
      description: 'I selected the coding frameworks, libraries and APIs with Chat GPT. I vibe coded with Cursor, Codex and Claude Code jumping from paper to prototype. To ensure a good result to my standards, I created functional testing and documented the components.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1763466884/epalwi-rebbo_components-video_ehnyhh.mp4',
      mediaType: 'video',
      width: 1920,
      height: 1080
    }
  ],
  'project-aa': [
    {
      title: 'Heuristic Evaluation & Workshop',
      description: 'We pointed the UI/UX flaws and Requirements in the sign up, perks and booking flows.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_workshop_results-large_pzl7a6.png'
    },
    {
      title: 'Ideation',
      description: 'Sketching flows for guided sign up, visible AA perks and quicker breakdown booking.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_sketches-large_xsyk2v.png'
    },
    {
      title: 'Testing',
      description: 'We selected the concepts winning concepts through A/B testing',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763478892/aa-test-large_hhyhst.png'
    },
    {
      title: 'Solution',
      description: '1. Designed an onboarding and added tooltips\n\n2. Incorporates a list of perks on the map view\n\n3. Transformed a tree selection into a max of 2 selection',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_before-after_tt5vzr.gif'
    }
  ],
  'project-aet': [
    {
      title: 'UX/UI Definition',
      description: 'I collected typography, components and visual inspiration in a moodboard to define the website style and solving the user experience issues.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764243373/aet_slide1_lxzdvg.png'
    },
    {
      title: 'Design & Implementation',
      description: 'V0 helped me to create initial prototypes of the booking system and other components that were brought to life in Cursor. The website was built with Next.js, Tailwind CSS, and Shadcn UI and hosted on Vercel for the client to review and approve.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764244100/aet_slide2_twhh3s.png'
    }
  ]
}
