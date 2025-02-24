import { HomeHero } from '@/components/home/HomeHero'
import { LogoLoader } from '@/components/shared/LogoLoader'
import { Menu } from '@/components/shared/Menu'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { Footer } from '@/components/shared/Footer'

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
        
        <section id="about" className="h-screen flex items-center justify-center bg-white">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-6">About Section</h2>
            <p className="text-xl text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          </div>
        </section>
        
        <section id="work" className="h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-6">Work Section</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold mb-4">Project 1</h3>
                <p className="text-gray-600">Brief description of the project goes here.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-bold mb-4">Project 2</h3>
                <p className="text-gray-600">Brief description of the project goes here.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
