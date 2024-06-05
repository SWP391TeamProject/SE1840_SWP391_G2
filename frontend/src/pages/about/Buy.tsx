import React from 'react'

export const Buy = () => {
  return (
    <div className="container mx-auto px-4 py-8 ">
    <h2 className="text-3xl font-bold mb-8">Buying Jewelry</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Step 1: Register to Bid */}
      <div className="rounded-lg shadow-md p-4">
        <h3 className="text-xl font-medium mb-2">Step 1: Register to Bid</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Fill out the registration form.</li>
          <li>Provide credit card and phone number information.</li>
          <li>Review and understand the fee structure.</li>
        </ul>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4">
          Register
        </button>
      </div>

      {/* Step 2: Perform Due Diligence */}
      <div className="rounded-lg shadow-md p-4">
        <h3 className="text-xl font-medium mb-2">Step 2: Perform Due Diligence</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Review high-resolution images of the item.</li>
          <li>Explore details about known flaws, reports, and maintenance.</li>
          <li>Communicate with the seller through comments, Q&A, or direct contact.</li>
        </ul>
        <div className="flex space-x-2 mt-4">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md">
            Request Viewing
          </button>
         
        </div>
      </div>

      {/* Step 3: Arrange Financing and Logistics */}
      <div className="rounded-lg shadow-md p-4">
        <h3 className="text-xl font-medium mb-2">Step 3: Arrange Financing and Logistics</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Explore financing options from partners like LightStream.</li>
          <li>Calculate shipping costs directly within the auction screen.</li>
        </ul>
      </div>

      {/* Step 4: Bid */}
      <div className="rounded-lg shadow-md p-4">
        <h3 className="text-xl font-medium mb-2">Step 4: Bid</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Use the simple and straightforward bidding interface.</li>
          <li>Get real-time updates on the bid status.</li>
          <li>Watch a tutorial video on how to place bids.</li>
          <li>Review information on binding bids and auction extension rules.</li>
        </ul>
      </div>

      {/* Step 5: Win the Auction */}
      <div className="rounded-lg shadow-md p-4">
        <h3 className="text-xl font-medium mb-2">Step 5: Win the Auction</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Follow the step-by-step checklist for post-auction process.</li>
          <li>Communicate directly with the seller through messages.</li>
        </ul>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mt-4">
          Finalize Sale
        </button>
      </div>
    </div>
  </div>
  )
}
