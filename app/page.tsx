import AppAndNewsletter from "./components/homepage/AppAndNewsletter";
import FeaturedMenu from "./components/homepage/FeaturedMenu";
import Hero from "./components/homepage/Hero";
import HowItWorks from "./components/homepage/HowItWorks";
import PopularShops from "./components/homepage/PopularShops";
import Reviews from "./components/homepage/Reviews";
import SpecialOffer from "./components/homepage/SpecialOffer";
import VendorCta from "./components/homepage/VendorCta";

// Home page - sections appear in this order, top to bottom.
// The navbar and footer are rendered by app/layout.tsx.
export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <HowItWorks />
      <PopularShops />
      <FeaturedMenu />
      <SpecialOffer />
      <VendorCta />
      <Reviews />
      <AppAndNewsletter />
    </main>
  );
}
