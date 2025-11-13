import ProjectProcess from '@/components/ProjectProcess';

const testSteps = [
  { 
    id: "1", 
    title: "Product Market Fit", 
    description: "This text is always a problem to elaborate on when building digital products that need to find their place in the market.", 
    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/aa_cover_kwdihs.png" 
  },
  { 
    id: "2", 
    title: "Design Iteration", 
    description: "We refine based on user feedback and continuous testing cycles to improve the user experience.", 
    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710686/pillsure_cover_tfjjac.png" 
  },
  { 
    id: "3", 
    title: "Launch & Learn", 
    description: "We release, test, and improve based on real user data and behavioral analytics.", 
    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710641/calendario_cover_ubvlur.png" 
  },
  { 
    id: "4", 
    title: "Scale & Optimize", 
    description: "Once validated, we focus on scaling the solution and optimizing for performance and growth.", 
    imageUrl: "https://res.cloudinary.com/da4fs4oyj/image/upload/v1741710564/hey-oko25/fevp6vacedvcujrvzbcu.png" 
  }
];

export default function TestProcessPage() {
  return <ProjectProcess steps={testSteps} />;
}