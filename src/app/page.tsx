import { HomeProject } from '@/components/home/HomeProject'
import { HomeAbout } from '@/components/home/HomeAbout'
import { ArchiveTable } from '@/components/home/ArchiveTable'
import { LogoLoader } from '@/components/shared/LogoLoader'
import { Menu } from '@/components/shared/Menu'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { Footer } from '@/components/shared/Footer'

// Example project data
const projectsData = [
  {
    id: 'project-aa',
    title: 'AA (The Automobile Association)',
    tagline: 'Streamlining the AA app from sign up to breakdown reporting.',
    description: 'People that acquired AA memberships from third parties such as banks, abandoned the mobile app sign up quickly and frustrated. The perks they offered weren\'t hardly redeemed. The breakdown bookings in the app were low which incurred in high call center costs.',
    pillsLabel: '2018',
    year: '2018',
    role: 'Project Lead',
    impact: '1. Reduced roadside assistance booking time by 66% (from 3min to <1min)\n2. Increased app adoption after signup rehaul\n3. Improved visibility of member perks and key information',
    impactUpArrowIndices: [1],
    impactTargetIndices: [2],
    label: ['Heuristic Evaluation', 'Workshop Facilitation', 'UX Design', 'Testing'],
    coverImage: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763477798/aa_cover_kwdihs.webp',
    images: [
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763482378/aa_final-screens_v2bxqg.png',
        alt: 'AA final screens',
        width: 1920,
        height: 1080
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_outcome1_seg1zx.gif',
        alt: 'Final Outcome',
        width: 420,
        height: 746
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764606418/aa_final-design_tr2f0r.webp',
        alt: 'AA final design',
        width: 1920,
        height: 1080
      }
    ]
  },
  {
    id: 'project-aet',
    title: 'AET',
    tagline: 'Clarifying the value proposition and streamlining the booking flow for a solo-run ski transfer website.',
    description: 'Before this project, the website felt fragmented and hard to navigate, so visitors struggled to understand the offer, find key information, or complete key actions. Most sessions ended without enquiries or bookings, mobile users dropped off quickly, and inconsistent visuals reduced trust. Weak SEO brought little qualified traffic, and the lack of clear analytics meant they couldn\'t see where people were abandoning the journey, so decisions were based on guesswork rather than data.',
    year: '2025',
    role: 'Web designer',
    impact: '1. Reduced time on review process,\n 2. Reduced website costs \n 3. Increased booking flow clarity',
    impactUpArrowIndices: [2],
    label: ['UI/UX design', 'Development(AI)', 'API integration', 'Email template design', 'Testing'],
    coverImage: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764176407/aet_cover_dg4vjj.png',
    images: [
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764255957/aet_home-full_vap1rm.png',
        alt: 'AET home page full design',
        width: 1920,
        height: 5688
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764255848/aet_contact-page_xqhj8h.png',
        alt: 'AET contact page design',
        width: 1920,
        height: 1080
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764255849/aet_routes-page_stys5l.png',
        alt: 'AET routes page design',
        width: 1920,
        height: 1080
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1764255849/aet_review-page_ci9akl.png',
        alt: 'AET review page design',
        width: 1920,
        height: 1080
      }
    ]
  },
  {
    id: 'project-epalwi-rebbo',
    title: 'Epàlwi-Rebbó',
    tagline: 'Turning a PDF into a language learning tool.',
    description: 'Ndowe is an endangered Bantu language with conflicting language normalisation branches, which is not supported by Google Translate and is not widely digitised. How can more people learn or consolidate their Ndowe with only a few speakers, far fewer writers, and just a dozen learning resources?',
    pillsLabel: '2025',
    year: '2025',
    role: 'Design Engineer',
    impact: 'Publishing the first digital Spanish-Ndowe translation dictionary.',
    impactSparklesIndices: [0],
    label: ['Data extraction', 'Schema Design', 'Data Validation', 'Web App design'],
    coverVideo: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1763383184/epalwi-video-homepage_pynpjb.mp4',
    coverImage: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763380529/epalwi-rebbo_cover_w1selc.webp',
    images: [
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1763380529/epalwi-rebbo_cover_w1selc.webp',
        alt: 'Epàlwi-Rebbó hero cover',
      }
      ,
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1765796735/epalwi-rebbo_iPhoneXR1_etagfi.webp',
        alt: 'Epàlwi-Rebbó mobile view',
      }
    ]
  },
  {
    id: 'project-3',
    title: 'Pillsure',
    tagline: 'Boosting adherence one pill at the time',
    description: 'Boosting adherence one pill at the time',
    pillsLabel: '2023- present',
    year: '2023 - present',
    role: 'Product Designer & Co-founder',
    impact: 'Piloting an adherence coach that nudges patients and caregivers, improving routine completion during ongoing trials.',
    label: ['User Research', 'Web Design', 'Market Research'],
    coverImage: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/pillsure_cover_tfjjac.png',
    images: [
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741710686/pillsure1_fm8ahw.mp4',
        alt: 'Pillsure Device 3D model',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/pillsure3_fclpsk.png',
        alt: 'Pillsure Landing Page',
      }
    ]
  },
  {
    id: 'project-1',
    title: 'Maserati',
    tagline: 'Creating a cohesive visual language',
    description: 'Building a story of legacy that turns heads',
    pillsLabel: '2018',
    year: '2018',
    role: 'Visual Design Lead',
    impact: 'Delivered a flexible campaign system that unified print, experiential, and digital touchpoints for global launches.',
    label: ['Campaign', 'UX/UI Design'],
    coverVideo: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1763484799/maserati_cover-video_tg1wxr.mp4',
    coverImage: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710564/hey-oko25/fevp6vacedvcujrvzbcu.png',
    images: [
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741710564/hey-oko25/xjvmy3xvpyabuxe8zwcs.mp4',
        alt: 'Design System Components',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710564/hey-oko25/ojbor4ojjzqoearv2bws.gif',
        alt: 'Color Palette',
        width: 1870,
        height: 1250
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710564/hey-oko25/ivjmizltxj0umvmg9adm.png',
        alt: 'Color Palette',
        width: 1870,
        height: 1250
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741710564/hey-oko25/oa7bxx9v6ln7vomkzcgb.mp4',
        alt: 'Color Palette',
        width: 1870,
        height: 1250
      }
    ]
  },
  {
    id: 'project-4',
    title: 'Archive',
    tagline: 'Crafting memorable experiences',
    description: 'Projects worth mentioning',
    pillsLabel: '2012 - present',
    year: '2012 - present',
    role: 'Independent Designer & Animator',
    impact: 'Collection of client and personal highlights that span app design, animation, illustration, and emerging tech experiments.',
    label: ['Mobile App design', 'Youtube', 'Animation', 'Illustration'],
    coverImage: '/images/projects/archive/archive_cover.jpg',
    images: [
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741607472/diccionario_gpxysb.png',
        alt: 'Archive',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741607472/dtb_hzreqc.gif',
        alt: 'South African Airlines',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741607472/crypto_qvsnvp.mp4',
        alt: 'crypto',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741607472/Emoji_oxmelp.mp4',
        alt: 'emojis you dont have',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741607472/Bunge_ofygjn.mp4',
        alt: 'bunge:agribusiness',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741607472/Amplify_g1lq1q.png',
        alt: 'amplify',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741607472/Rebel_play_kx602e.mp4',
        alt: 'amplify',
      },
    ]
  }
]

const featuredProjectsOrder = ['project-aa', 'project-aet', 'project-epalwi-rebbo']

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <LogoLoader />
      <Menu />
      <NavigationProgress />
      <CustomCursor />
      
      <div className="container mx-auto px-4">
        
        <section className="mt-10">
          {/* <h5>About</h5> */}
          <HomeAbout />
        </section>
        
        <section>
          <h5>Selected projects</h5>
          {/* Dynamic project components */}
          {projectsData
            .filter(project => featuredProjectsOrder.includes(project.id))
            .sort(
              (a, b) => featuredProjectsOrder.indexOf(a.id) - featuredProjectsOrder.indexOf(b.id)
            )
            .map((project) => (
            <HomeProject
              key={project.id}
              id={project.id}
              title={project.title}
              tagline={project.tagline}
              description={project.description}
              pillsLabel={project.pillsLabel}
              year={project.year}
              role={project.role}
              impact={project.impact}
              impactUpArrowIndices={project.impactUpArrowIndices}
              impactSparklesIndices={project.impactSparklesIndices}
              impactTargetIndices={project.impactTargetIndices}
              label={project.label}
              coverImage={project.coverImage}
              coverVideo={project.coverVideo}
              images={project.images}
            />
          ))}
        </section>

        <section className="mt-16 lg:mt-24">
          <ArchiveTable />
        </section>
      </div>

      <Footer />
    </main>
  )
}
