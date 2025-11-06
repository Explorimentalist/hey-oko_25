import { CVList } from '@/components/cv-list'
import type { Metadata } from 'next'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'CV | Hey-Oko',
  description: 'Professional experience and career journey of Ngatye Brian Oko.',
}

const cvData = [
  {
    role: "Strategic Product Designer (Part-time)",
    companyName: "Pillsure",
    sector: "Healthcare",
    period: "Jan 2024 – Present"
  },
  {
    role: "Senior UX Design Contractor", 
    companyName: "Class35",
    sector: "Fintech Agency",
    period: "May 2021 – Feb 2023"
  },
  {
    role: "Senior UX Designer / Product Designer",
    companyName: "TotallyMoney",
    sector: "Fintech",
    period: "Jul 2018 – Dec 2020"
  },
  {
    role: "Senior UX Design Contractor",
    companyName: "VCCP",
    sector: "Advertising",
    period: "Jan 2018 – Apr 2018"
  },
  {
    role: "UX Designer",
    companyName: "Monitise Create | Big Radical",
    sector: "Design Agency",
    period: "Apr 2016 – Nov 2017"
  },
  {
    role: "Interaction Designer",
    companyName: "Method",
    sector: "Design Consultancy",
    period: "Mar 2013 – Apr 2016"
  },
  {
    role: "Co-Head",
    companyName: "Fablab Umeå",
    sector: "Education/Tech",
    period: "Mar 2012 – Apr 2014"
  },
  {
    role: "Interaction Design Intern",
    companyName: "Electrolux/Smart Design/Designit",
    sector: "Industrial Design",
    period: "Sep 2010 – Sep 2011"
  }
]

const educationData = [
  {
    role: "Master in Interaction Design",
    companyName: "Umeå Institute of Design",
    period: "Sep 2009 – Jun 2012"
  },
  {
    role: "Industrial Design Introduction Postgraduate",
    companyName: "Umeå Institute of Design", 
    period: "Sep 2008 – Jun 2009"
  },
  {
    role: "Bachelor of Arts Industrial Design Engineering",
    companyName: "Elisava / Pompeu Fabra",
    period: "Jan 2002 – Dec 2005"
  }
]

const certificatesData = [
  {
    role: "Strategic Foresight for Brands: Plan for Future Success",
    companyName: "DOMĚSTIKA",
    period: "Jun 2024"
  },
  {
    role: "Copywriting for Copywriters",
    companyName: "DOMĚSTIKA", 
    period: "Apr 2024"
  },
  {
    role: "Foundation Training in Nonviolent Communication",
    companyName: "NVC Foundation",
    period: "Apr 2022"
  },
  {
    role: "Forecasting Skills: See the Future Before it Happens",
    companyName: "Institute for the Future via Coursera",
    period: "Oct 2020"
  },
  {
    role: "Simulation Skills: This is Your Brain on the Future",
    companyName: "Institute for the Future via Coursera",
    period: "Sep 2020"
  }
]

export default function CVPage() {
  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Back to home link */}
      <div className="pt-8 px-4">
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={14} className="mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>
      
      <CVList items={cvData} heading="Work experience" />
      <CVList 
        items={educationData} 
        heading="Education"
        columnCount={3}
        headers={{
          role: "Degree",
          companyName: "Institution", 
          period: "Period"
        }}
      />
      <CVList 
        items={certificatesData} 
        heading="Certificates"
        columnCount={3}
        headers={{
          role: "Certificate",
          companyName: "Provider", 
          period: "Date"
        }}
      />
      
      {/* Fixed bottom bar with CV download button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc/80 backdrop-blur-md z-40">
        <div className="max-w-5xl mx-auto flex justify-center">
          <a 
            href="/Ngatye Brian Oko CV.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center px-4 group-hover:pr-3 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-all duration-300"
          >
            <span>Download my CV</span>
            <Download 
              size={14} 
              className="opacity-0 group-hover:opacity-100 ml-0 group-hover:ml-2 transition-all duration-300" 
            />
          </a>
        </div>
      </div>
    </div>
  )
}