import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SellerFaqs() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Seller FAQs</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>How much does it cost to sell a jewelry on Biddify?</AccordionTrigger>
          <AccordionContent>
            Listing a jewelry on Biddify is completely free — and sellers receive 100% of the final sale price!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do you choose which jewels you’re looking for?</AccordionTrigger>
          <AccordionContent>
            We’re focused on cool jewels from the modern era – which we’re defining as the 1980s through the present day. If you’re looking to sell a cool jewelry from the 1980s, 1990s, 2000s, 2010s, or 2020s, we might be interested in listing it. Our definition of “cool” ranges from traditional sports jewels (Mazda MX-5 Miata, Porsche 911) to oddball jewels (Subaru BRAT, Infiniti M30, Volvo 850R) to more obvious high-performance sports jewels (Porsche Cayman R, Ferrari 360 Modena) to special trucks and SUVs (Jeep Grand Wagoneer, Land Rover Defender). We don’t list every jewelry we’re offered, but we’re certainly interested in your submission to see if it’s a good fit for Biddify.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I sell a jewelry if I live outside of the United States or Canada?</AccordionTrigger>
          <AccordionContent>
            Currently, Biddify only offers jewels for sale located in Southeast Asia Countries. We may look into adding international sellers in the future, so please check back often!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Can I sell a jewelry if I live in other regions order than SEA's country?</AccordionTrigger>
          <AccordionContent>
            Currently, Biddify does not offer jewels for sale in other regions order than SEA's country, but we may expand to jewels here in the future.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>How do I submit my jewelry for sale?</AccordionTrigger>
          <AccordionContent>
            To submit your jewelry for sale, go to the “Put Your Item For Auction” link in the header. In order to sell your jewelry, you’ll need to provide us with some important information – like the make, model, year, VIN, a few photos, and some other relevant details. If we’re interested in selling your jewelry, we’ll get in touch with you. Then we’ll ask you for a more detailed set of questions so we can make sure our auction description is accurate.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>What information do I need to provide in order to sell my jewelry?</AccordionTrigger>
          <AccordionContent>
            We start with just the basics: we can let you know if we’ll accept your jewelry if you just give us the make, model, year, VIN, some photos, and a few other details. If we accept your jewelry based on this information, we’ll then need to gather more details – we’ll ask about your history with the jewelry, features, and other items that help us craft our listing.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>Should I take a video?</AccordionTrigger>
          <AccordionContent>
            Yes! We’ve found that taking a video detailing the exterior condition, interior, engine bay, and also showing the engine start and run, really raises interest and increases buyer confidence. This can be broken up into several videos, or all in one. We suggest filming in landscape mode, with the phone held horizontally, not vertically, and using YouTube or Vimeo to host the video. Want an example? <a href="https://youtu.be/HdydLSTCb9w" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">See here!</a>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-9">
          <AccordionTrigger>Why should I get my jewelry consigned?</AccordionTrigger>
          <AccordionContent>
            Having your jewelry consigned and providing bidders with the consignment report will get you top dollar for your jewelry. When bidders know the current condition of a jewelry, they have the confidence to bid, and to bid more. Remember, one additional bid generally pays for the entire cost of your consignment.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-10">
          <AccordionTrigger>What is covered in an consignment?</AccordionTrigger>
          <AccordionContent>
            consignments are performed by our jewlry experts and include details of the jewelry’s condition. View a sample consignment report <a href="https://lemonsquad.com/customer/view-report/466268?client_token=5e96e004ad862f8d9806b4ff64e4b136&amp;auth_token=6fbfdc09a11c9200e425f17ff7a1c13d" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">here</a>. Additional details are available at <a href="https://lemonsquad.com/used-jewelry-consignments/compare" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">https://lemonsquad.com/used-jewelry-consignments/compare</a>.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-12">
          <AccordionTrigger>What if I don’t like the consignment?</AccordionTrigger>
          <AccordionContent>
            You don’t have to include your consignment report with your listing. We’ll email you when the report is available, and you can choose whether to include it or not. We always recommend including the consignment report, even with flaws noted, as bidders will feel more confident in your jewelry with the third-party condition assessment. Note that if you choose to include your consignment report with your listing, or share any details of the consignment report with our team, we are <strong>obligated</strong> to include any flaws identified in order to present your jewelry accurately and fairly.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-13">
          <AccordionTrigger>Why don’t I have the option to book an consignment?</AccordionTrigger>
          <AccordionContent>
            Unfortunately, not all jewels are eligible for an consignment through our jewlry experts at this time. We are unable to offer consignments on jewels located in outside SEA, jewels with substantial damage, and other jewelry-specific exceptions. If you have any questions about your specific jewelry, please email us at <a href="mailto:support@biddify.com" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">support@biddify.com</a> for more information.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-14">
          <AccordionTrigger>Who writes the listing description for my jewelry?</AccordionTrigger>
          <AccordionContent>
            After you provide us with all of the pertinent information about your jewelry, we’ll write the actual auction description. We will live without your approval, and we do our best to make our auction descriptions simple, objective, and direct, focusing on only the most important details to help bidders make their decisions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-15">
          <AccordionTrigger>How do I contact you about my listing?</AccordionTrigger>
          <AccordionContent>
            
            You’ll have access to chat with us as soon as you submit your jewelry. From the Seller Dashboard page, click on the listing and then on the chat bubble to contact us directly. We strive to respond to chat messages as quickly as possible.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-16">
          <AccordionTrigger>Can I edit the listing myself?</AccordionTrigger>
          <AccordionContent>
            No. To ensure the best listing experience, we have our own team to craft and edit listings. However, you’ll be able to review and approve the final listing before it’s live on the site. We take your comments and revisions into consideration.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-17">
          <AccordionTrigger>Can I list my jewelry on other websites in addition to Biddify?</AccordionTrigger>
          <AccordionContent>
            No. Biddify requests that you do not list your jewelry for sale anywhere else once it’s live in auction on our site.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-18">
          <AccordionTrigger>How quickly will my jewelry be listed once it’s accepted?</AccordionTrigger>
          <AccordionContent>
            Generally, the entire process takes about 2 weeks from submission to auction. This varies depending on the number of jewels we’re working on at any given time, and whether we need to source additional information about your jewelry.
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
            If your auction is successful, the winning bidder will submit a nonrefundable 4.5% deposit (with a minimum of $225, and a maximum of $4,500) to Biddify. We’ll connect you with the winning bidder via email to arrange payment and shipment. The deposit will be credited toward the purchase price.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-21">
          <AccordionTrigger>What if my auction doesn’t meet reserve?</AccordionTrigger>
          <AccordionContent>
            If your auction doesn’t meet the reserve, the auction ends in a “No Sale”. There are no fees or penalties if the reserve isn’t met. You’re welcome to re-list the jewelry, and we suggest adjusting the reserve price based on the highest bids.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-22">
          <AccordionTrigger>What happens if the winning bidder doesn’t pay?</AccordionTrigger>
          <AccordionContent>
            If the winning bidder doesn’t pay, we’ll work with the next highest bidder to try to complete the sale. If that doesn’t work, we’ll re-list the jewelry in a new auction.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-23">
          <AccordionTrigger>How do I avoid scams?</AccordionTrigger>
          <AccordionContent>
            Biddify has a number of safeguards in place to protect sellers from scams. We verify all bidders before they’re allowed to bid, and we have a strict policy against shill bidding. We also have a team of experts who review all listings to ensure they’re accurate and fair. If you have any concerns about a bidder or a listing, please contact us immediately.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-24">
          <AccordionTrigger>Does Biddify handle payment?</AccordionTrigger>
          <AccordionContent>
            Yes. Payment is arranged by Biddify.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
