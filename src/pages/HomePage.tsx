import Hero from '../features/home/Hero'
import CTAs from '../features/home/CTAs'
import StatsBar from '../features/home/StatsBar'
import FeaturesList from '../features/home/FeaturesList'
import ProjectsShowcase from '../features/home/ProjectsShowcase'
import Roadmap from '../features/home/Roadmap'
import PartnersGrid from '../features/home/PartnersGrid'
import CTA2 from '../features/home/CTA2'

const HomePage = () => {
  return (
    <div className="space-y-4">
      <Hero />
      <CTAs />
      <FeaturesList />
      <StatsBar />   
      <ProjectsShowcase />
      <Roadmap />    
      <CTA2 />
      <PartnersGrid />
    </div>
  )
}

export default HomePage
