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
      title: 'Dictionary source review',
      description: 'Validating the Spanish-Ndowe corpus and scanning the PDF dictionary to set the baseline.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763414326/epalwi-rebbo_diccionario-pdf_sup7ld.png'
    },
    {
      title: 'Data cleaning criteria',
      description: 'Defining extraction rules, cleaning criteria, and schema alignment for structured entries.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763392640/epalwi-rebbo_data-cleaning-criteria-gpt_mifn0i.png'
    },
    {
      title: 'Component exploration',
      description: 'Documenting interface components with motion tests to validate interactions for launch.',
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
      title: 'Research & Discovery',
      description: 'Deep diving into user needs, market research, and competitive analysis to understand the problem space.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764243373/aet_slide1_lxzdvg.png'
    },
    {
      title: 'Design & Implementation',
      description: 'Creating wireframes, high-fidelity designs, and interactive prototypes to validate the user experience.',
      mediaUrl: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764244100/aet_slide2_twhh3s.png'
    }
  ]
}
