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
    id: 'project-1',
    title: 'Building a story of legacy that turns heads',
    tagline: 'Creating a cohesive visual language',
    label: ['Campaign', 'UX/UI Design'],
    coverImage: '/images/projects/maserati/maserati_cover.png',
    images: [
      {
        src: '/images/projects/maserati/maserati_1.mp4',
        alt: 'Design System Components',
        // width: 1870,
        // height: 1250
      },
      {
        src: '/images/projects/maserati/maserati_2.gif',
        alt: 'Color Palette',
        width: 1870,
        height: 1250
      },
      // {
      //   src: '/images/projects/maserati/maserati_3.png',
      //   alt: 'Color Palette',
      //   width: 1870,
      //   height: 1250
      // },
      {
        src: '/images/projects/maserati/maserati_4.png',
        alt: 'Color Palette',
        width: 1870,
        height: 1250
      },
      {
        src: '/images/projects/maserati/maserati_5.gif',
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
    coverImage: '/images/projects/ndowe/calendario_cover.png',
    images: [
      {
        src: '/images/projects/ndowe/calendario1.png',
        alt: 'Ndowe Calendar Likano la bolo nyama edition',
        // width: 1870,
        // height: 1250
      },
      {
        src: '/images/projects/ndowe/calendario2.png',
        alt: 'Calendar',
        // width: 1200,
        // height: 1350
      },
      // {
      //   src: '/images/projects/ndowe/calendario3.png',
      //   alt: 'Stationery Design',
      //   width: 1200,
      //   height: 1200
      // },
      // {
      //   src: '/images/projects/ndowe/calendario4.png',
      //   alt: 'Stationery Design',
      //   width: 1200,
      //   height: 1200
      // },
      {
        src: '/images/projects/ndowe/sopu1.mp4',
        alt: 'Stationery Design',
        // width: 1200,
        // height: 1200
      },
      {
        src: '/images/projects/ndowe/sopu2.mp4',
        alt: 'Stationery Design',
        // width: 1200,
        // height: 1200
      }
    ]
  },
  {
    id: 'project-3',
    title: 'Boosting adherence one pill at the time',
    tagline: 'Crafting memorable experiences',
    label: ['User Research', 'Web Design', 'Market Research'],
    coverImage: '/images/projects/pillsure/pillsure_cover.png',
    images: [
      {
        src: '/images/projects/pillsure/pillsure1.mp4',
        alt: 'Pillsure Device 3D model',
      },
      // {
      //   src: '/images/projects/pillsure/pillsure2.png',
      //   alt: 'Brand Guidelines',
      // },
      {
        src: '/images/projects/pillsure/pillsure3.png',
        alt: 'Pillsure Landing Page',
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
        src: '/images/projects/archive/diccionario.png',
        alt: 'Archive',
      },
      {
        src: '/images/projects/archive/dtb.gif',
        alt: 'South African Airlines',
      },
      {
        src: '/images/projects/archive/crypto.mp4',
        alt: 'crypto',
      },
      {
        src: '/images/projects/archive/emoji.mp4',
        alt: 'emojis you dont have',
      },
      {
        src: '/images/projects/archive/bunge.mp4',
        alt: 'bunge:agribusiness',
      },
      {
        src: '/images/projects/archive/amplify.png',
        alt: 'amplify',
      },
      {
        src: '/images/projects/archive/rebel play.mp4',
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
