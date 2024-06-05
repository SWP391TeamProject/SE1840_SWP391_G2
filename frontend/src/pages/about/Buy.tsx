import React from 'react'

export const Buy = () => {
  return (<div className="container mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold mb-8">Buying Jewelry</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Step 1: Register to Participate */}
      <div className="rounded-lg shadow-md p-6 ">
        <h3 className="text-xl font-medium mb-2">Step 1: Register to Participate</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Make sure that you have enough balance to register</li>
          <li>Make a deposit at an auction<br />
            (The deposit may not be the same in different auctions)
            <br /> (the deposit will be refunded if you lose and will be deducted directly from the amount of the item to be paid for if you win)</li>
        </ul>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4">
          Register
        </button>
      </div>

      {/* Step 3: Participate in the Live Auction */}
      <div className="rounded-lg shadow-md p-6 ">
        <h3 className="text-xl font-medium mb-2">Step 2: Participate in the Live Auction</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Join the live auction session for real-time bidding.</li>
          <li>Take an item in the auction session to start bidding
            <br />
            (you can bid on multiple items at the same time)
          </li>
          <li>Keep up with the bids and adjust yours as needed.</li>
        </ul>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
          <strong className="font-bold">Be careful with your bidding!!!</strong>
          <br /> Once you've set a price, you won't be able to undo it.</div>
      </div>

      {/* Step 4: Auction Outcome Notification */}
      <div className="rounded-lg shadow-md p-6 ">
        <h3 className="text-xl font-medium mb-2">Step 3: Auction Outcome Notification</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Wait for notification about the auction's result.</li>
          <li>Find out if you’ve won your chosen piece.</li>
        </ul>
      </div>

      {/* Step 5: Payment Process */}
      <div className="rounded-lg shadow-md p-6 ">
        <h3 className="text-xl font-medium mb-2">Step 5: Payment Process</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Complete your payment through the specified method.</li>
          <li>Ensure the transaction for the purchase is secure.</li>
        </ul>
      </div>

      {/* Step 6: Receiving the Jewelry */}
      <div className="rounded-lg shadow-md p-6 ">
        <h3 className="text-xl font-medium mb-2">Step 6: Receiving the Jewelry</h3>
        <ul className="list-disc space-y-2 ml-7">
          <li>Coordinate the receipt of your jewelry piece.</li>
          <li>Confirm delivery or pickup arrangements with the auction house.</li>
        </ul>
      </div>


    </div>
  </div>
  )
}
