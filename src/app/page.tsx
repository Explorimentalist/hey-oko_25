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
    title: 'Design System',
    tagline: 'Creating a cohesive visual language',
    label: 'UX/UI Design',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1920',
        alt: 'Design System Components',
        width: 1920,
        height: 1080
      },
      {
        src: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1920',
        alt: 'Color Palette',
        width: 1920,
        height: 1080
      }
    ]
  },
  {
    id: 'project-2',
    title: 'Brand Identity',
    tagline: 'Crafting memorable experiences',
    label: 'Branding',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2000',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1600439614353-c8265d621f96?q=80&w=1920',
        alt: 'Logo Design',
        width: 1920,
        height: 1080
      },
      {
        src: 'https://images.unsplash.com/photo-1600439614692-d386a9339608?q=80&w=1920',
        alt: 'Brand Guidelines',
        width: 1920,
        height: 1080
      },
      {
        src: 'https://images.unsplash.com/photo-1600439615406-45d3a342ce8a?q=80&w=1920',
        alt: 'Stationery Design',
        width: 1920,
        height: 1080
      }
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
        
        <section>
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
