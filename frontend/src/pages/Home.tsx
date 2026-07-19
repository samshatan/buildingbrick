import FeaturedWorkers from "@/components/FeaturedWorkers";
import HeroSection from "@/components/HeroSection";
import WorkerCategories from "@/components/WorkerCategories";
import NewsLetterBox from "@/components/NewsLetterBox";
import OurPolicy from "@/components/OurPolicy";
import PlatformServices from "@/components/PlatformServices";
import WorkerPerks from "@/components/WorkerPerks";

function Home(){
  return(
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <HeroSection/>
      <PlatformServices/>
      <WorkerPerks/>
      <WorkerCategories/>
      <FeaturedWorkers/>
      <OurPolicy/>
      <NewsLetterBox/>
    </div>
  )
}
export default Home;