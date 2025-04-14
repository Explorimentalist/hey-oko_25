import { HomeHero } from '@/components/home/HomeHero'
import { HomeProject } from '@/components/home/HomeProject'
import { HomeAbout } from '@/components/home/HomeAbout'
import { LogoLoader } from '@/components/shared/LogoLoader'
import { Menu } from '@/components/shared/Menu'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { Footer } from '@/components/shared/Footer'

// Example project data
const projectsData = [
  {
    id: 'project-aa',
    title: 'Streamlining the AA app from sign up to breakdown reporting',
    tagline: 'From ideation to implementation',
    label: ['Heuristic Evaluation', 'Prototyping', 'Workshop Facilitation'],
    coverImage: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_cover_kwdihs.png',
    images: [
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_workshop_results-large_pzl7a6.png',
        alt: 'Workshop Results',
        width: 1200,
        height: 720
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_sketches-large_xsyk2v.png',
        alt: 'Design Sketches',
        width: 1200,
        height: 900
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_before-after_tt5vzr.gif',
        alt: 'Before and After Comparison',
        width: 911,
        height: 512
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_outcome1_seg1zx.gif',
        alt: 'Final Outcome',
        width: 840,
        height: 1491
      }
    ]
  },
  {
    id: 'project-3',
    title: 'Boosting adherence one pill at the time',
    tagline: 'Crafting memorable experiences',
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
    title: 'Building a story of legacy that turns heads',
    tagline: 'Creating a cohesive visual language',
    label: ['Campaign', 'UX/UI Design'],
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
    id: 'project-2',
    title: 'Giving Ndowéÿé a place in the net',
    tagline: 'Crafting memorable experiences',
    label: ['Web Design', 'Illustration', 'App Design'],
    coverImage: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710641/calendario_cover_ubvlur.png',
    images: [
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710641/calendario2_pxxy2o.png',
        alt: 'Calendar',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741710641/sopu1_re3uoz.mp4',
        alt: 'Stationery Design',
      },
      {
        src: 'https://res.cloudinary.com/da4fs4oyj/video/upload/v1741710641/sopu2_gjm3ip.mp4',
        alt: 'Stationery Design',
      }
    ]
  },
  {
    id: 'project-4',
    title: 'Archive',
    tagline: 'Crafting memorable experiences',
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

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <LogoLoader />
      <Menu />
      <NavigationProgress />
      <CustomCursor />
      
      <div className="container mx-auto px-4">
        <section id="hero">
          <HomeHero />
        </section>
        
        <section className="mt-10">
          <HomeAbout />
        </section>
        
        {/* Dynamic project components */}
        {projectsData.map((project) => (
          <HomeProject
            key={project.id}
            id={project.id}
            title={project.title}
            tagline={project.tagline}
            label={project.label}
            coverImage={project.coverImage}
            images={project.images}
          />
        ))}
      </div>

      <Footer />
    </main>
  )
}
