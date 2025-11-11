import { CVList } from '@/components/shared/CVList'
import { Menu } from '@/components/shared/Menu'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { CustomCursor } from '@/components/shared/CustomCursor'
import { Footer } from '@/components/shared/Footer'
import { CVDownloadButton } from '@/components/cv/CVDownloadButton'
import Link from 'next/link'

export default function CVPage() {
  // Work Experience Data
  const workExperienceData = [
    [
      "Strategic Product Designer (Part-time)",
      "Pillsure",
      "Health Tech",
      "Jan 2024 – Present"
    ],
    [
      "Senior UX Design Contractor",
      "Class35",
      "Fintech Design Agency",
      "May 2021 – Feb 2023"
    ],
    [
      "Senior UX Designer / Product Designer",
      "TotallyMoney",
      "Fintech",
      "Jul 2018 – Dec 2020"
    ],
    [
      "Senior UX Design Contractor",
      "VCCP",
      "Advertising Agency",
      "Jan 2018 – Apr 2018"
    ],
    [
      "UX Designer",
      "Monitise Create | Big Radical",
      "Design & Strategy Agency",
      "Apr 2016 – Nov 2017"
    ],
    [
      "Interaction Designer",
      "Method",
      "Strategic Design Consultancy",
      "Mar 2013 – Apr 2016"
    ],
    [
      "Co-Head",
      "Fablab Umeå",
      "Digital Fabrication",
      "Mar 2012 – Apr 2014"
    ],
    [
      "Interaction Design Intern",
      "Electrolux, Smart Design, Designit",
      "Product Design",
      "Sep 2010 – Sep 2011"
    ],
    [
      "3D Design Software Consultant",
      "CT Activa",
      "CAD & PLM Consulting",
      "Jan 2008 – Aug 2008"
    ]
  ];

  // Education Data
  const educationData = [
    [
      "Master in Interaction Design",
      "Umeå Institute of Design",
      "Umeå, Sweden",
      "Sep 2009 – Jun 2012"
    ],
    [
      "Industrial Design Introduction Postgraduate", 
      "Umeå Institute of Design",
      "Umeå, Sweden",
      "Sep 2008 – Jun 2009"
    ],
    [
      "Bachelor of Arts Industrial Design Engineering",
      "Elisava / Pompeu Fabra",
      "Barcelona, Spain",
      "Jan 2002 – Dec 2005"
    ]
  ];

  // Certifications Data
  const certificationsData = [
    [
      "Strategic Foresight for Brands: Plan for Future Success",
      "DOMĚSTIKA",
      "Jun 2024"
    ],
    [
      "Copywriting for Copywriters",
      "DOMĚSTIKA",
      "Apr 2024"
    ],
    [
      "Foundation Training in Nonviolent Communication",
      "NVC Foundation",
      "Apr 2022"
    ],
    [
      "Forecasting Skills: See the Future Before it Happens",
      "Institute for the Future via Coursera",
      "Oct 2020"
    ],
    [
      "Simulation Skills: This is Your Brain on the Future",
      "Institute for the Future via Coursera",
      "Sep 2020"
    ]
  ];

  return (
    <main className="relative min-h-screen">
      <Menu />
      <CustomCursor />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-3 mb-8 text-lg font-normal text-zinc-300 hover:text-white transition-colors"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 12H5m0 0l7 7m-7-7l7-7" 
              />
            </svg>
            Back
          </Link>
          
          <h1 id="cv-heading" className="text-6xl font-light text-zinc-100 mb-16">CV</h1>
          
          <div className="space-y-16">
            {/* Work Experience */}
            <CVList
              title="Work Experience"
              columns={["Position", "Company Name", "Company Sector", "Period"]}
              data={workExperienceData}
              mobileHiddenColumns={[2]}
            />

            {/* Education */}
            <CVList
              title="Education"
              columns={["Degree", "Institution", "Location", "Period"]}
              data={educationData}
              mobileHiddenColumns={[2]}
            />

            {/* Certifications */}
            <CVList
              title="Certificates"
              columns={["Certificate", "Institution", "Date"]}
              data={certificationsData}
            />
          </div>
        </div>
      </div>

      <Footer />
      
      <CVDownloadButton headingId="cv-heading" />
    </main>
  )
}
