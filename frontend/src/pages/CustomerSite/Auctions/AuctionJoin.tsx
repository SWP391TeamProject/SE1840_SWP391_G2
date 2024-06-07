import { useEffect, useState } from "react";
import { Client } from '@stomp/stompjs';
import { useLocation, useParams } from "react-router-dom";
import { getCookie } from "@/utils/cookies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AuctionJoin() {
  let client: Client | null = null;
  const location = useLocation();
  let message = "";
  const [price, setPrice] = useState("");
  let auctionId = location.state.id.auctionSessionId;
  let itemId = location.state.id.itemId;
  let itemDTO = location.state.itemDTO;
  useEffect(() => {
    // Create a WebSocket connection

    client = new Client();

    // Configure the WebSocket endpoint URL
    const websocketUrl = `ws://localhost:8080/auction-join?token=${JSON.parse(getCookie("user")).accessToken}`; // Replace with your WebSocket endpoint URL

    // Connect to the WebSocket server
    client.configure({
      brokerURL: websocketUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      logRawCommunication: true,
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        client?.publish({
          destination: `/app/chat.addUser/${auctionId}/${itemId}`,
          body: JSON.stringify({
            auctionItemId: location.state.id,
            payment:{
              accountId: JSON.parse(getCookie("user")).id
            }
          }),
        });
        // Perform actions after successful connection
        const destination = `/topic/public/${auctionId}/${itemId}`; // Specify the destination for the server-side message handler
        client?.subscribe(destination, (message) => {
          if (JSON.parse(message.body).body.toString().endsWith("JOIN") || JSON.parse(message.body).body.toString().endsWith("BID")) {
            setPrice(JSON.parse(message.body).body.split(":")[1]);
          }
          console.log('Received message:', JSON.parse(message.body));

        });
      },
      // You can add more event handlers and configuration options as needed
    });

    // Connect to the WebSocket server
    client.activate();


    // Clean up the connection on component unmount
    return () => {
      client?.deactivate();
    };
  }, []);

  const sendMessage = () => {
    message = (document.getElementById("price") as HTMLInputElement).value;
    const destination = `/app/chat.sendMessage/${auctionId}/${itemId}`; // Specify the destination for the server-side message handler            

    if (client != null) {
      console.log("" + JSON.stringify({
        price: parseFloat(message),
        accountId: JSON.parse(getCookie("user")).id
      }));
      client.publish({
        destination,
        body: JSON.stringify({
          price: parseFloat(message),
          accountId: JSON.parse(getCookie("user")).id
        }),
      });
    }
  }

  return (
    <div className="grid grid-cols-[300px_1fr_300px] gap-8 h-screen">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg sticky top-6">
        <div className="grid gap-4">
          <div> 
            <Button size="large" className="text-white p-4" onClick={()=>{
              window.history.back();
            }}>Back</Button>
            <div className="grid grid-cols-1 gap-4">
              <img
                src={itemDTO.attachments[0].link}
                alt="Vintage Typewriter"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 my-4">
              <img
                src={itemDTO.attachments[1].link}
                alt="Vintage Typewriter"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
              <img
                src={itemDTO.attachments[2].link}
                alt="Vintage Typewriter"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
              <img
                src={itemDTO.attachments[3].link}
                alt="Vintage Typewriter"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />

            </div>
            <h2 className="text-2xl font-bold">{itemDTO.name}</h2>
            <ScrollArea className="w-full h-72 border rounded-xl ">
              <p className="text-gray-500 dark:text-gray-400 h-96 p-2">
                {itemDTO.description}
              </p>
            </ScrollArea>

          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Condition:</span>
              <span>Excellent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Dimensions:</span>
              <span>12 x 8 x 5 inches</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Weight:</span>
              <span>8 lbs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Authenticity:</span>
              <span>Certified</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Current Bid:</span>
              <span className="text-lg font-semibold">${price}</span>
            </div>
            <div className="flex items-start gap-3">

              <div className="rounded-full bg-blue-500 text-white flex items-center justify-center w-8 h-8">
                <span>B</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-[70%]">
                <p>Hey, I'd like to place a bid on the vintage typewriter. What's the current highest bid?</p>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">2:30 PM</div>
              </div>
            </div>
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[70%]">
                <p>The current highest bid is $425. Feel free to place your bid above that amount.</p>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">2:31 PM</div>
              </div>
              <div className="rounded-full bg-blue-500 text-white flex items-center justify-center w-8 h-8">
                <span>A</span>
              </div>
            </div>

          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="relative">
              <Input type="number" placeholder="Type your message..." className="pr-12 rounded-lg w-full" id='price' />
              <Button type="submit" size="icon" className="absolute top-1/2 right-3 -translate-y-1/2" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Time Remaining</h3>
            <div className="text-2xl font-bold">
              <div className="text-2xl font-bold" />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Auction Status:</span>
              <span>Live</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Number of Bids:</span>
              <span>12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Highest Bid:</span>
              <span>$425</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
