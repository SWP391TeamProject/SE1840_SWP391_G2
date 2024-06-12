import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

export const Sell = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8">Selling Jewelry</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Step 1: Submit Your Jewelry */}
                <div className="rounded-lg shadow-md p-6  border dark:border-white ">
                    <h3 className="text-xl font-medium mb-2">Step 1: Submit a Jewelry Auction Request</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>Visit our website and go to create Consignment page </li>
                        <li>The form will ask for your contact information, a detailed description of your jewelry and your desired selling price.</li>
                        <li>You can upload multiple pictures from different angles to help valuers accurately assess your jewelry's worth.</li>
                    </ul>
                    <Button variant={'default'} className='m-4'>
                        <Link to="/create-consignment">
                            Submit Jewelry
                        </Link>
                    </Button>
                </div>

                {/* Step 2: Prepare Your Listing */}
                <div className="rounded-lg shadow-md p-6  border dark:border-white ">
                    <h3 className="text-xl font-medium mb-2">Step 2: Receive Initial Valuation and Send Your Jewelry</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>After receiving your request, a customer service representative will contact you to confirm details and gather additional information if needed.</li>
                        <li>They'll send you an initial valuation of your jewelry based on the information provided and their expertise.</li>
                        <li>If you agree with the initial valuation, you'll be instructed on how to securely package and ship your jewelry to the auction system's company.</li>
                        <li>The system will provide detailed instructions on safe packing and transportation.</li>
                    </ul>
                </div>

                {/* Step 3: Finalize Your Auction */}
                <div className="rounded-lg shadow-md p-6  border dark:border-white ">
                    <h3 className="text-xl font-medium mb-2">Step 3: Receive Confirmation of Jewelry Receipt</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>Once your jewelry has been received by the auction house, you will receive a confirmation notification.</li>
                        <li>They'll photograph the jewelry from various angles for record-keeping and marketing purposes.</li>
                        <li>The auction house will handle the safekeeping and insurance of your jewelry throughout the appraisal and auction process.</li>
                    </ul>
                </div>

                {/* Step 4: Participate in the Auction */}
                <div className="rounded-lg shadow-md p-6  border dark:border-white ">
                    <h3 className="text-xl font-medium mb-2">Step 4: Receive Final Appraisal and Confirmation of Acceptance</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>Upon the manager's approval, the final appraisal report will be sent to you for your review and acceptance.</li>
                        <li>If you are satisfied with the appraisal and agree to proceed with the auction, you will need to confirm your acceptance in writing.</li>
                    </ul>
                </div>

                {/* Step 5: Auction End */}
                <div className="rounded-lg shadow-md p-6  border dark:border-white ">
                    <h3 className="text-xl font-medium mb-2">Step 5: Manager Selects Auction for Your Jewelry</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>The auction house manager will consider factors such as the value, rarity, and appeal of your jewelry to determine the most suitable auction for its sale.</li>
                        <li>They will select an upcoming auction that aligns with the target audience for your jewelry and maximizes its potential selling price.</li>
                        <li>You will be informed of the selected auction date and time, allowing you to make any necessary arrangements to participate in the auction.</li>
                    </ul>
                </div>
            </div>
        </div>)
}
