import React from 'react'

export const Sell = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-8">Selling Jewelry</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Step 1: Submit Your Jewelry */}
                <div className="rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-medium mb-2">Step 1: Submit Your Jewelry</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>Fill out the form with jewelry details, photos, and descriptions.</li>
                        <li>Set a reserve price (optional) or choose no reserve.</li>
                        <li>Submit your listing for review by the auction team.</li>
                    </ul>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4">
                        Submit Jewelry
                    </button>
                </div>

                {/* Step 2: Prepare Your Listing */}
                <div className="rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-medium mb-2">Step 2: Prepare Your Listing</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>Get a guide for capturing high-quality photos and videos.</li>
                        <li>Upload detailed service history and ownership documents.</li>
                        <li>Consider getting an inspection and generating a report.</li>
                    </ul>
                </div>

                {/* Step 3: Finalize Your Auction */}
                <div className="rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-medium mb-2">Step 3: Finalize Your Auction</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>Review your draft listing for accuracy.</li>
                        <li>Schedule your auction using the provided scheduler.</li>
                    </ul>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mt-4">
                        Publish Listing
                    </button>
                </div>

                {/* Step 4: Participate in the Auction */}
                <div className="rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-medium mb-2">Step 4: Participate in the Auction (Live)</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>Engage with bidders through the live comment section.</li>
                        <li>Upload additional media to showcase the jewelry further (optional).</li>
                        <li>Track bids in real-time using the provided feature.</li>
                    </ul>
                </div>

                {/* Step 5: Auction End */}
                <div className="rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-medium mb-2">Step 5: Auction End</h3>
                    <ul className="list-disc space-y-2 ml-7">
                        <li>Follow the checklist for completing the sale post-auction.</li>
                        <li>Exchange contact information with the winning bidder.</li>
                        <li>Learn how to handle situations where the reserve price is not met (if applicable).</li>
                    </ul>
                </div>
            </div>
        </div>)
}
