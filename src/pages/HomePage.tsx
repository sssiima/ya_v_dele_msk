import Hero from '../features/home/Hero'
import StatsBar from '../features/home/StatsBar'
import FeaturesList from '../features/home/FeaturesList'
import ProjectsShowcase from '../features/home/ProjectsShowcase'
import Roadmap from '../features/home/Roadmap'
import VusesGrid from '../features/home/VusesGrid'
import CTA2 from '../features/home/CTA2'
import { useEffect } from 'react'
import MentorsList from '@/features/home/MentorsList'
import PartnersGrid1 from '@/features/home/PartnersGrid1'
import PartnersGrid2 from '@/features/home/PartnersGrid2'
import GeneralPartnersGrid from '@/features/home/GeneralPartnersGrid'

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="space-y-4">
      <Hero />
      <FeaturesList />
      <StatsBar />   
      <ProjectsShowcase />
      <Roadmap />    
      <CTA2 />
      <MentorsList />
      <PartnersGrid1 />
      <PartnersGrid2 />
      <GeneralPartnersGrid />
      <VusesGrid />
    </div>
  )
}

export default HomePage
