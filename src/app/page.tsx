import { HomeHero } from "@/components/home/HomeHero"
import { HomeAbout } from "@/components/home/HomeAbout"
import { HomeProject } from "@/components/home/HomeProject"
import { Footer } from "@/components/shared/Footer"
import { CustomCursor } from "@/components/shared/CustomCursor"
import { Menu } from "@/components/shared/Menu"
import { NavigationProgress } from "@/components/shared/NavigationProgress"

export default function Page() {
  return (
    <>
      <CustomCursor />
      <Menu />
      <NavigationProgress />
      <main>
        <HomeHero />
        <HomeAbout />
        
        {/* AA Project */}
        <HomeProject
          id="project-aa"
          title="AA (The Automobile Association)"
          tagline="Streamlining the AA app from sign up to breakdown reporting"
          description="Redesigning the AA mobile app to improve user experience from sign-up through breakdown reporting, focusing on clarity and efficiency."
          pillsLabel="2018"
          label={["Heuristic Evaluation", "Prototyping", "Workshop Facilitation"]}
          coverImage="/images/projects/aa/AA_Hero_Video.mp4"
          images={[
            { src: "/images/projects/aa/AA_Hero_Video.mp4", alt: "AA App redesign video" }
          ]}
        />

        {/* Pillsure Project */}
        <HomeProject
          id="project-3"
          title="Pillsure"
          tagline="Boosting adherence one pill at the time"
          description="Designing a comprehensive pill adherence platform that helps users manage their medication schedules and improve health outcomes."
          pillsLabel="2023 - present"
          label={["User Research", "Web Design", "Market Research"]}
          coverImage="/images/projects/pillsure/pillsure_cover.png"
          images={[
            { src: "/images/projects/pillsure/pillsure1.mp4", alt: "Pillsure app interface" },
            { src: "/images/projects/pillsure/pillsure3.png", alt: "Pillsure dashboard" }
          ]}
        />

        {/* Maserati Project */}
        <HomeProject
          id="project-1"
          title="Maserati"
          tagline="Building a story of legacy that turns heads"
          description="Creating a digital experience that captures Maserati's heritage of luxury and performance through compelling visual storytelling."
          pillsLabel="2018"
          label={["Campaign", "UX/UI Design"]}
          coverImage="/images/projects/maserati/maserati_cover.png"
          images={[
            { src: "/images/projects/maserati/maserati_1.mp4", alt: "Maserati campaign video" },
            { src: "/images/projects/maserati/maserati_2.gif", alt: "Maserati interface animation" },
            { src: "/images/projects/maserati/maserati_3.png", alt: "Maserati design system" },
            { src: "/images/projects/maserati/maserati_4.png", alt: "Maserati mobile interface" },
            { src: "/images/projects/maserati/maserati_5.gif", alt: "Maserati interaction" }
          ]}
        />

        {/* Sópu & Elanji-Minnya Project */}
        <HomeProject
          id="project-2"
          title="Sópu & Elanji-Minnya"
          tagline="Making the first illustrated Ndowéÿé calendar and first online store for Ndowéÿé people"
          description="Creating the first digital platform for the Ndowéÿé community, featuring an illustrated calendar and e-commerce store celebrating cultural heritage."
          pillsLabel="2024"
          label={["Web Design", "Illustration", "App Design"]}
          coverImage="/images/projects/ndowe/calendario_cover.png"
          images={[
            { src: "/images/projects/ndowe/sopu1.mp4", alt: "Sópu platform video" },
            { src: "/images/projects/ndowe/sopu2.mp4", alt: "Elanji-Minnya interface" },
            { src: "/images/projects/ndowe/calendario1.png", alt: "Ndowéÿé calendar design" },
            { src: "/images/projects/ndowe/calendario2.png", alt: "Calendar illustration" },
            { src: "/images/projects/ndowe/calendario3.png", alt: "Calendar layout" },
            { src: "/images/projects/ndowe/calendario4.png", alt: "Calendar mobile view" }
          ]}
        />

        {/* Archive Project */}
        <HomeProject
          id="project-4"
          title="Archive"
          tagline="Projects worth mentioning"
          description="A collection of notable projects spanning mobile app design, YouTube content, animation, and illustration work across various industries and clients."
          pillsLabel="2012 - present"
          label={["Mobile App design", "Youtube", "Animation", "Illustration"]}
          coverImage="/images/projects/archive/archive_cover.jpg"
          images={[
            { src: "/images/projects/archive/Bunge.mp4", alt: "Bunge project" },
            { src: "/images/projects/archive/Emoji.mp4", alt: "Emoji animation" },
            { src: "/images/projects/archive/Rebel play.mp4", alt: "Rebel play project" },
            { src: "/images/projects/archive/crypto.mp4", alt: "Crypto project" },
            { src: "/images/projects/archive/Amplify.png", alt: "Amplify design" },
            { src: "/images/projects/archive/diccionario.png", alt: "Dictionary app" },
            { src: "/images/projects/archive/dtb.gif", alt: "DTB animation" }
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
