import React from 'react';
import Hero from './components/Hero';
import ChatInterface from './components/ChatInterface';
import DemoInstructions from './components/DemoInstructions';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 flex-col md:flex-row max-w-6xl mx-auto w-full py-6 px-2 md:py-12 md:px-4 gap-4 md:gap-8">
        {/* Left Side: Info */}
        <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-8 justify-center mb-6 md:mb-0">
          <Hero />
          <DemoInstructions />
        </div>
        {/* Right Side: Chatbot */}
        <div className="w-full md:w-1/2 flex items-start md:items-center justify-center pt-2 md:pt-0">
          <div className="w-full max-w-full md:max-w-2xl">
            <ChatInterface />
          </div>
        </div>
      </div>
      <footer className="bg-white border-t py-6 px-2 md:py-8 md:px-4 mt-8 md:mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">
            © 2025 E-commerce Customer Service. Built with AI-powered conversation tools.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App; 