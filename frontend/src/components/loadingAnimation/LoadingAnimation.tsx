import { HdmiPort, Loader2, LoaderPinwheel, LucideAlignHorizontalDistributeCenter, LucideGavel } from "lucide-react";
const messages = [
  "Loading...",
  "Please wait...",
  "Did you know? The average human attention span is 8 seconds.",
  "The quick brown fox jumps over the lazy dog.",
  "If you're waiting for a sign, this is it.",
  "The best things come to those who wait.",
  "Good things take time.",
  "Patience is a virtue.",
  "Rome wasn't built in a day.",
  "It's worth the wait.",
  "Don't worry, be happy.",
  "Just keep swimming.",
  "The early bird catches the worm.",
  "The best is yet to come.",
  "You're almost there.",
]
export default function LoadingAnimation({ message = "Loading..." }) {
  const loadingScreenMessage = messages[Math.floor(Math.random() * messages.length)];

  return <div className="w-full max-w-screen-5xl  h-[80%] bg-transparent flex flex-col justify-center items-center absolute mx-auto my-auto absolute">
    <div className="w-auto relative"> {/* Add relative here */}
      <div className="rotate-25 -translate-y-5 -translate-x-4">
        <LucideGavel className="w-10 h-10 animate-bounce text-primary m-0 p-0 absolute " /> {/* Adjust translate-y here */}
      </div>
      <HdmiPort className="w-10 h-10 text-primary m-0 p-0" />
    </div>

    <span className=" ml-2 text-lg text-primary">{loadingScreenMessage}</span>
  </div>;
}
