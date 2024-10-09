"use client";
import React, { useState, useEffect } from "react";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "./ui/typewriter-effect";
import { Check } from "lucide-react";
import { BackgroundLines } from "./ui/background-lines";

const Confetti = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      {[...Array(50)].map((_, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-blue-500 rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

const EnhancedPaymentSuccess = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const words = [
    { text: "Payment" },
    {
      text: "Success!",
      className: "text-green-500 dark:text-green-500 font-bold",
    },
  ];

  const thankYouWords = [
    { text: "Thank" },
    { text: "you" },
    { text: "for" },
    { text: "processing" },
    { text: "your" },
    { text: "order" },
    { text: "with" },
    { text: "Ayax!" },
  ];

  return (
    <BackgroundLines>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
        <div className="bg-[#80f4ff] dark:bg-gray-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
          <div className="flex items-center justify-center">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
              <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="text-center space-y-4 sm:space-y-6">
            <TypewriterEffect
              words={words}
              className="text-3xl sm:text-4xl font-bold"
            />

            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>

            <div className="flex justify-center">
              <TypewriterEffectSmooth
                words={thankYouWords}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>
        </div>

        {showConfetti && <Confetti />}
      </div>
    </BackgroundLines>
  );
};

export default EnhancedPaymentSuccess;
