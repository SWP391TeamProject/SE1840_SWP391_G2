import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SellerFaqs() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Seller FAQs</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>How much does it cost to sell a car on Cars & Bids?</AccordionTrigger>
          <AccordionContent>
            Listing a car on Cars & Bids is completely free — and sellers receive 100% of the final sale price!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do you choose which cars you’re looking for?</AccordionTrigger>
          <AccordionContent>
            We’re focused on cool cars, trucks, and SUVs from the modern era – which we’re defining as the 1980s through the present day. If you’re looking to sell a cool car from the 1980s, 1990s, 2000s, 2010s, or 2020s, we might be interested in listing it. Our definition of “cool” ranges from traditional sports cars (Mazda MX-5 Miata, Porsche 911) to oddball vehicles (Subaru BRAT, Infiniti M30, Volvo 850R) to more obvious high-performance sports cars (Porsche Cayman R, Ferrari 360 Modena) to special trucks and SUVs (Jeep Grand Wagoneer, Land Rover Defender). We don’t list every car we’re offered, but we’re certainly interested in your submission to see if it’s a good fit for Cars & Bids.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I sell a vehicle if I live outside of the United States or Canada?</AccordionTrigger>
          <AccordionContent>
            Currently, Cars & Bids only offers vehicles for sale located in the US and Canada. We may look into adding international sellers in the future, so please check back often!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Can I sell a vehicle if I live in Puerto Rico?</AccordionTrigger>
          <AccordionContent>
            Currently, Cars & Bids does not offer vehicles for sale in Puerto Rico, but we may expand to vehicles here in the future.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>How do I submit my car for sale?</AccordionTrigger>
          <AccordionContent>
            To submit your car for sale, go to the “Sell a Car” link in the header. In order to sell your car, you’ll need to provide us with some important information – like the make, model, year, VIN, a few photos, and some other relevant details. If we’re interested in selling your car, we’ll get in touch with you. Then we’ll ask you for a more detailed set of questions so we can make sure our auction description is accurate.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>What information do I need to provide in order to sell my car?</AccordionTrigger>
          <AccordionContent>
            We start with just the basics: we can let you know if we’ll accept your car if you just give us the make, model, year, VIN, some photos, and a few other details. If we accept your car based on this information, we’ll then need to gather more details – we’ll ask about your history with the car, features, and other items that help us craft our listing.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>How do I take the best pictures of my car?</AccordionTrigger>
          <AccordionContent>
            We can’t emphasize enough how important photos are for a successful auction! With this in mind, go check out our <a href="/photos/">photography</a> page to get tips and tricks, download our detailed photo guide, or even hire a professional photographer to come shoot your car.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>Should I take a video?</AccordionTrigger>
          <AccordionContent>
            Yes! We’ve found that taking a video detailing the exterior condition, interior, engine bay, and also showing the engine start and run, really raises interest and increases buyer confidence. This can be broken up into several videos, or all in one. We suggest filming in landscape mode, with the phone held horizontally, not vertically, and using YouTube or Vimeo to host the video. Want an example? <a href="https://youtu.be/HdydLSTCb9w" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">See here!</a>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger>Why should I get my car inspected?</AccordionTrigger>
          <AccordionContent>
            Having your car inspected and providing bidders with the inspection report will get you top dollar for your car. When bidders know the current condition of a car, they have the confidence to bid, and to bid more. Remember, one additional bid generally pays for the entire cost of your inspection.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
          <AccordionTrigger>What is covered in an inspection?</AccordionTrigger>
          <AccordionContent>
            Inspections are performed by Lemon Squad and include details of the car’s exterior, interior, and running condition. View a sample inspection report <a href="https://lemonsquad.com/customer/view-report/466268?client_token=5e96e004ad862f8d9806b4ff64e4b136&amp;auth_token=6fbfdc09a11c9200e425f17ff7a1c13d" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">here</a>. Additional details are available at <a href="https://lemonsquad.com/used-car-inspections/compare" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">https://lemonsquad.com/used-car-inspections/compare</a>.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-11">
          <AccordionTrigger>Will the inspector test drive my car?</AccordionTrigger>
          <AccordionContent>
            We strongly recommend that you allow the inspector to test drive your car as part of the inspection. Inspectors will test drive the vehicle as long as it is street-legal, safe to drive, and you allow them to drive it. In some instances, an inspector may not be able to test drive a vehicle, due to size constraints or liability issues. The vehicle may be test driven by the seller or seller's representative in these instances.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-12">
          <AccordionTrigger>What if I don’t like the inspection?</AccordionTrigger>
          <AccordionContent>
            You don’t have to include your inspection report with your listing. We’ll email you when the report is available, and you can choose whether to include it or not. We always recommend including the inspection report, even with flaws noted, as bidders will feel more confident in your car with the third-party condition assessment. Note that if you choose to include your inspection report with your listing, or share any details of the inspection report with our team, we are <strong>obligated</strong> to include any flaws identified in order to present your car accurately and fairly.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-13">
          <AccordionTrigger>Why don’t I have the option to book an inspection?</AccordionTrigger>
          <AccordionContent>
            Unfortunately, not all cars are eligible for an inspection through Lemon Squad at this time. We are unable to offer inspections on vehicles located in Canada, vehicles with substantial modifications, and other vehicle-specific exceptions. If you have any questions about your specific car, please email us at <a href="mailto:support@carsandbids.com" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">support@carsandbids.com</a> for more information.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-14">
          <AccordionTrigger>Who writes the listing description for my car?</AccordionTrigger>
          <AccordionContent>
            After you provide us with all of the pertinent information about your car, we’ll write the actual auction description. We won’t go live without your approval, and we do our best to make our auction descriptions simple, objective, and direct, focusing on only the most important details to help bidders make their decisions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-15">
          <AccordionTrigger>How do I contact you about my listing?</AccordionTrigger>
          <AccordionContent>
            You’ll have access to chat with us as soon as you submit your car. From the Seller Dashboard page, click on the listing and then on the chat bubble to contact us directly. We strive to respond to chat messages as quickly as possible.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-16">
          <AccordionTrigger>Can I edit the listing myself?</AccordionTrigger>
          <AccordionContent>
            No. To ensure the best listing experience, we have our own team to craft and edit listings. However, you’ll be able to review and approve the final listing before it’s live on the site. We take your comments and revisions into consideration.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-17">
          <AccordionTrigger>Can I list my car on other websites in addition to Cars & Bids?</AccordionTrigger>
          <AccordionContent>
            No. Cars & Bids requests that you do not list your vehicle for sale anywhere else once it’s live in auction on our site.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-18">
          <AccordionTrigger>How quickly will my car be listed once it’s accepted?</AccordionTrigger>
          <AccordionContent>
            Generally, the entire process takes about 2 weeks from submission to auction. This varies depending on the number of cars we’re working on at any given time, and whether we need to source additional information about your car.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-19">
          <AccordionTrigger>How long do auctions last?</AccordionTrigger>
          <AccordionContent>
            Auctions run for 7 days once they go live.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-20">
          <AccordionTrigger>What happens if my auction is successful?</AccordionTrigger>
          <AccordionContent>
            If your auction is successful, the winning bidder will submit a nonrefundable 4.5% deposit (with a minimum of $225, and a maximum of $4,500) to Cars & Bids. We’ll connect you with the winning bidder via email to arrange payment and shipment. The deposit will be credited toward the purchase price.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-21">
          <AccordionTrigger>What if my auction doesn’t meet reserve?</AccordionTrigger>
          <AccordionContent>
            If your auction doesn’t meet the reserve, the auction ends in a “No Sale”. There are no fees or penalties if the reserve isn’t met. You’re welcome to re-list the car, and we suggest adjusting the reserve price based on the highest bids.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-22">
          <AccordionTrigger>What happens if the winning bidder doesn’t pay?</AccordionTrigger>
          <AccordionContent>
            Fortunately, this happens very infrequently. If the winning bidder doesn’t pay, we’ll connect with you to discuss the next steps, which may include offering the car to the next highest bidder.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-23">
          <AccordionTrigger>How do I avoid scams?</AccordionTrigger>
          <AccordionContent>
            To avoid scams, be sure to verify that you have received funds before releasing your car. We recommend payment by wire transfer or cashier’s check.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-24">
          <AccordionTrigger>Does Cars & Bids handle payment?</AccordionTrigger>
          <AccordionContent>
            No. Payment is arranged directly between the buyer and seller.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
