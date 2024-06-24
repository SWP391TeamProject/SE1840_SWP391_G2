import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";

export default function BuyerFaqs() {
    return <div>
      <h2 className="text-2xl font-bold mb-5">Buyer FAQs</h2>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                  <AccordionTrigger>What are the fees for the buyer on Cars & Bids?</AccordionTrigger>
                  <AccordionContent>
                      In addition to the final purchase price paid to the seller, buyers pay a 4.5% buyer’s fee to Cars & Bids. The buyer’s fee has a minimum of $225, and a maximum of $4,500.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
                  <AccordionTrigger>How do I register to bid?</AccordionTrigger>
                  <AccordionContent>
                      In order to register, first sign up by clicking the “Sign In” icon in the upper right corner of the screen – then click “Sign up here” in the box that subsequently pops up. Once you create a username and password, you’ll be prompted to verify your email address. After you’ve done that, you can return to Cars & Bids and you’ll be prompted to register to bid.
                      <br/>
                      If you don’t want to register just yet, no problem – you can do it later. Once you find a car you want to bid on, click “Place Bid” on the car’s listing page, and you’ll be prompted to register before you can bid. You will have to enter your credit information, as we place a hold on each bidder’s credit card until the conclusion of the auction.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-3">
                  <AccordionTrigger>How do I place a bid?</AccordionTrigger>
                  <AccordionContent>
                      In order to place a bid, you first have to register, which we’ve explained above. Once you’ve registered and you’ve found a car you’re interested in buying, bidding is easy – just click the “Place Bid” icon on a vehicle’s listing page. Then, you’re prompted to enter your bid amount.
                      <br/>
                      Your bid must be higher than the previous bid, of course – and depending on the current bidding level, there may be a minimum increase over the previous bid. Once you’ve submitted your bid, we place a hold on your credit card for 4.5% of your bid amount until the duration of the auction, in case you end up as the winning bidder.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-4">
                  <AccordionTrigger>How do bid increments work?</AccordionTrigger>
                  <AccordionContent>
                      Bid increments increase as follows:
                      <ul>
                          <li><strong>Minimum</strong> bid of $100 to start the auction</li>
                          <li><strong>$100</strong> increments up to $14,999</li>
                          <li><strong>$250</strong> increments from $15,000 to $49,999</li>
                          <li><strong>$500</strong> increments from $50,000 to $199,999</li>
                          <li><strong>$1,000</strong> increments at or above $200,000</li>
                      </ul>
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-5">
                  <AccordionTrigger>What currency does Cars & Bids use?</AccordionTrigger>
                  <AccordionContent>
                      All bids on Cars & Bids are in United States Dollars (USD), including on vehicles located in Canada.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-6">
                  <AccordionTrigger>Can I bid if I live outside of the United States or Canada?</AccordionTrigger>
                  <AccordionContent>
                      Yes, however you will need to pay in full for the vehicle promptly following the close of the auction, just like all other buyers. Additionally, any logistics, import fees, transportation, legal dues, and/or other items needed to export/import the vehicle are entirely the buyer’s responsibility. Please ensure you’re aware of all these rules and you have everything fully in place prior to bidding. The close of the auction is not the time to begin researching transportation logistics and import regulations.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-7">
                  <AccordionTrigger>How do I contact a seller privately?</AccordionTrigger>
                  <AccordionContent>
                      You can contact the seller privately through the auction description page for the seller’s vehicle. Just click the “Contact the seller” link next to the seller’s name, and you’ll be able to send the seller a private message that won’t appear on the auction itself.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-8">
                  <AccordionTrigger>How can I tell if a car was inspected?</AccordionTrigger>
                  <AccordionContent>
                      If a car was inspected, you’ll see an “Inspected” tag near the listing title. The listing page will have a link to view the inspection report under the main listing image, next to the Carfax logo.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-9">
                  <AccordionTrigger>What is covered in an inspection?</AccordionTrigger>
                  <AccordionContent>
                      Inspections are performed by Lemon Squad and include details of the car’s exterior, interior, and running condition. View a sample inspection report <a href="https://lemonsquad.com/customer/view-report/466268?client_token=5e96e004ad862f8d9806b4ff64e4b136&amp;auth_token=6fbfdc09a11c9200e425f17ff7a1c13d" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">here</a>. Additional details are available at <a href="https://lemonsquad.com/used-car-inspections/compare" class="ext-link" target="_blank" rel="noopener noreferrer nofollow">https://lemonsquad.com/used-car-inspections/compare</a>.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-10">
                  <AccordionTrigger>Are inspected cars test driven?</AccordionTrigger>
                  <AccordionContent>
                      Inspectors will test drive the vehicle as long as it is street-legal, safe to drive, and the seller allows them to drive it. In some instances, an inspector may not be able to test drive a vehicle, due to size constraints or liability issues. The vehicle may be test driven by the seller or seller's representative in these instances.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-11">
                  <AccordionTrigger>Is there proxy bidding?</AccordionTrigger>
                  <AccordionContent>
                      No. If you are outbid, you will need to manually input your next bid. Note that the price of the vehicle will immediately progress to your bid amount. For example, if the current high-bid is $30,000 and you input a $35,000 bid, the current high bid will immediately go to $35,000.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-12">
                  <AccordionTrigger>Why do you place a hold on my credit card when I bid?</AccordionTrigger>
                  <AccordionContent>
                      We place a hold on your credit card when you bid in order to account for the possibility that you may have to pay the buyer’s fee, should you end up as the winning bidder. The hold is for 4.5% of your initial bid amount, with a minimum of $225 and a maximum of $4,500. If you aren’t the winning bidder, the hold is released from your credit card at the conclusion of the auction.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-13">
                  <AccordionTrigger>I didn’t win the auction, why do I still have a hold from Cars & Bids?</AccordionTrigger>
                  <AccordionContent>
                      We cancel holds for non-winning bidders immediately upon the conclusion of the auction. Depending on your bank, it may take a few days - or up to 7 business days, in rare cases - for the hold to appear removed; please contact your card issuer directly with any questions about the timeline and process.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-14">
                  <AccordionTrigger>What’s the reserve price of the car I want to buy?</AccordionTrigger>
                  <AccordionContent>
                      If a listing doesn’t have a reserve, you’ll see a “No Reserve” tag along with a “No Reserve” indicator near the listing title. For auctions with a reserve price, we do not disclose the reserve prices.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-15">
                  <AccordionTrigger>How do I pay for the car if I win the auction?</AccordionTrigger>
                  <AccordionContent>
                      If you win the auction, congratulations! The seller will contact you to arrange payment. Generally, buyers pay the seller directly via bank wire. All funds will need to be sent to the seller, rather than to Cars & Bids.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-16">
                  <AccordionTrigger>When do I pay the buyer’s fee?</AccordionTrigger>
                  <AccordionContent>
                      If you win the auction, Cars & Bids will email you an invoice for the buyer’s fee within 24 hours of auction closing. The email will contain a link that will allow you to pay the buyer’s fee. Please pay it promptly, as you will need to complete the transaction in order to receive contact information for the seller and arrange to take delivery of your vehicle.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-17">
                  <AccordionTrigger>Do I need to pay sales tax on the car I bought?</AccordionTrigger>
                  <AccordionContent>
                      Sales tax on your vehicle depends on several factors – but you will generally pay sales tax in the state where the vehicle is being registered, rather than the state where it’s being purchased. This means that if you live in one state and the car you’re buying is in a different state, you’ll generally pay sales tax in your home state when you register the car. 
                      <br/>
                      As a rule of thumb, you pay sales tax when you register the vehicle – rather than at the point of purchase – but you should always check local regulations to be sure.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-18">
                  <AccordionTrigger>What happens if the reserve isn’t met?</AccordionTrigger>
                  <AccordionContent>
                      If the reserve isn’t met at the end of an auction, the seller has two choices. First, the seller can relist the vehicle on Cars & Bids – where it will go live again in just a few days. Second, the seller can also choose to contact the high bidder and attempt to work out a deal off the auction platform. 
                      <br/>
                      In the case of the second option, the seller will contact you via the email address you have on file with Cars & Bids.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-19">
                  <AccordionTrigger>How do I change the email address associated with my account?</AccordionTrigger>
                  <AccordionContent>
                      Email help@carsandbids.com with your current email address and the email address you’d like to change it to. Our staff will handle it for you.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
              <AccordionItem value="item-20">
                  <AccordionTrigger>What do I do if my question wasn’t answered here?</AccordionTrigger>
                  <AccordionContent>
                      Feel free to contact us at help@carsandbids.com. We’ll get back to you as soon as we can.
                  </AccordionContent>
              </AccordionItem>
      </Accordion>
    </div>
  }
  