"use client";

import { useEffect, useState } from "react";
import sdk, { type Context } from "@farcaster/frame-sdk";
import { PROJECT_TITLE } from "~/lib/constants";


export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [timeLeft, setTimeLeft] = useState("");

  const calculateTimeLeft = () => {
    const now = new Date();
    const nextThursday = new Date(now);
    
    // Set to next Thursday
    nextThursday.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7));
    nextThursday.setHours(17, 0, 0, 0); // 5 PM

    // If it's already past Thursday 5pm this week, go to next week
    if (nextThursday < now) {
      nextThursday.setDate(nextThursday.getDate() + 7);
    }

    const difference = nextThursday.getTime() - now.getTime();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }
      setContext(context);
      sdk.actions.ready({});
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50"
      style={{ 
        paddingTop: context?.client.safeAreaInsets?.top ?? 0, 
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-full max-w-[400px] mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {timeLeft}
          </div>
          <div className="text-center text-xs sm:text-sm mt-2 sm:mt-3 text-purple-100">
            Until Thursday 5pm
          </div>
        </div>
      </div>
    </div>
  );
}

