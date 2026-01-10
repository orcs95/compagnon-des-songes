import { Layout } from '@/components/layout/Layout';
import { 
  HeroSection, 
  ActivitiesSection, 
  UpcomingEventsSection, 
  LocationSection, 
  CTASection 
} from '@/components/home/HomePageSections';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ActivitiesSection />
      <UpcomingEventsSection />
      <LocationSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
