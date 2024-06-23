/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/qSFrDXqYyvx
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Poppins } from 'next/font/google'

poppins({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/

/** Add border radius CSS variable to your global CSS:

:root {
  --radius: 0.875rem;
}
**/
import LandingPageCarousel from "@/pages/CustomerSite/LandingPage/LandingPageCarousel";
import FeaturedAuctions from "@/pages/CustomerSite/LandingPage/FeaturedAuctions";
import CategoriesSection from "@/pages/CustomerSite/LandingPage/CategoriesSection";
import AuctionProcessSection from "@/pages/CustomerSite/LandingPage/AuctionProcessSection";
import Footer from "../../../components/footer/Footer";
import { useEffect } from "react";

export function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div key="1" className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex flex-col gap-y-20 md:gap-y-30">
        {/* Start Carouesel Sections */}
        <LandingPageCarousel />
        {/* End Carousel Section */}
        {/* Start featured auctions section */}
        <FeaturedAuctions />
        {/* End featured auction sections */}
        {/* start section Categories Section */}
        <CategoriesSection />
        {/* End section Categories Section */}

        {/* Start Auction Process Section */}
        <AuctionProcessSection />
        {/* End section Auction Process Section */}

        {/* start footer section */}
        <Footer />
      </main>
    </div>
  );
}
