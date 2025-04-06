import React, { useState, useEffect, useRef } from 'react';

export default function InitialLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const codeSnippet = [
    'function initPortfolio() {',
    '  const experience = "Software Engineer";',
    '  let skills = ["React", "Next.js", "React Native", "TypeScript"];',
    '  const passion = "Building innovative solutions";',
    '  return { name: "Asif Alam", experience, skills, passion };',
    '}'
  ];

  const terminalLines = useRef([]);

  // Handle typing animation
  useEffect(() => {
    if (currentStep < codeSnippet.length) {
      const timeout = setTimeout(() => {
        setTypedText(prev => prev + codeSnippet[currentStep] + '\n');
        setCurrentStep(prev => prev + 1);
      }, 400);

      return () => clearTimeout(timeout);
    } else if (!typingComplete) {
      setTypingComplete(true);
    }
  }, [currentStep, typingComplete]);

  // Handle loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + (typingComplete ? 4 : 1);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [typingComplete]);

  // Handle terminal messages
  useEffect(() => {
    if (typingComplete) {
      const messages = [
        { text: '> Initializing modules...', delay: 200 },
        { text: '> Verifying dependencies...', delay: 800 },
        { text: '> Configuring environment...', delay: 1400 },
        { text: '> Optimizing assets...', delay: 2000 },
        { text: '> Portfolio loaded successfully!', delay: 2600 }
      ];

      messages.forEach((message, index) => {
        setTimeout(() => {
          terminalLines.current = [...terminalLines.current, message.text];
          // Force re-render
          setLoadingProgress(prev => prev + 0.001);
        }, message.delay);
      });
    }
  }, [typingComplete]);

  // Handle visibility
  useEffect(() => {
    if (loadingProgress === 100) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 800); // Match fade-out animation duration
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 text-white overflow-hidden ${isExiting ? 'animate-fadeOut' : ''}`}
    >
      {/* Background particles/grid effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-500 rounded-full"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.5)',
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="border border-blue-800/30"
            />
          ))}
        </div>
      </div>

      <div className="text-center z-10 max-w-screen-md px-4">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6 font-mono text-sm leading-relaxed shadow-2xl w-full mx-auto relative overflow-hidden">
          {/* Terminal top bar */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 border-b border-gray-700 flex items-center px-4">
            <div className="flex space-x-2 absolute left-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="w-full text-center text-xs text-gray-400">portfolio-init.js</div>
          </div>

          {/* Code editor section */}
          <div className="text-left mt-4 pt-2 min-h-[180px]">
            {typedText.split('\n').map((line, index) => {
              if (!line) return null;

              // Format the line with syntax highlighting
              return (
                <div key={index} className="mb-2 opacity-0 animate-fadeIn" style={{ animationDelay: `${index * 400}ms`, animationFillMode: 'forwards' }}>
                  {index === 0 && (
                    <span>
                      <span className="text-blue-400">function</span>
                      <span className="text-yellow-300"> initPortfolio</span>
                      <span className="text-white">()</span>
                      <span className="text-white"> {`{`}</span>
                    </span>
                  )}

                  {index === 1 && (
                    <span className="pl-4">
                      <span className="text-purple-400">const</span>
                      <span className="text-blue-300"> experience</span>
                      <span className="text-white"> = </span>
                      <span className="text-orange-300">"Software Engineer"</span>
                      <span className="text-white">;</span>
                    </span>
                  )}

                  {index === 2 && (
                    <span className="pl-4">
                      <span className="text-purple-400">let</span>
                      <span className="text-blue-300"> skills</span>
                      <span className="text-white"> = [</span>
                      <span className="text-orange-300">"React"</span>
                      <span className="text-white">, </span>
                      <span className="text-orange-300">"Next.js"</span>
                      <span className="text-white">, </span>
                      <span className="text-orange-300">"React Native"</span>
                      <span className="text-white">, </span>
                      <span className="text-orange-300">"TypeScript"</span>
                      <span className="text-white">];</span>
                    </span>
                  )}

                  {index === 3 && (
                    <span className="pl-4">
                      <span className="text-purple-400">const</span>
                      <span className="text-blue-300"> passion</span>
                      <span className="text-white"> = </span>
                      <span className="text-orange-300">"Building innovative solutions"</span>
                      <span className="text-white">;</span>
                    </span>
                  )}

                  {index === 4 && (
                    <span className="pl-4">
                      <span className="text-purple-400">return</span>
                      <span className="text-white"> {`{ `}</span>
                      <span className="text-blue-300">name</span>
                      <span className="text-white">: </span>
                      <span className="text-orange-300">"Asif Alam"</span>
                      <span className="text-white">, experience, skills, passion {`}`};</span>
                    </span>
                  )}

                  {index === 5 && (
                    <span className="text-white">{`}`}</span>
                  )}
                </div>
              );
            })}

            {/* Blinking cursor */}
            {!typingComplete && (
              <div className="w-2 h-5 bg-white inline-block animate-blink ml-1"></div>
            )}
          </div>

          {/* Terminal output section */}
          {typingComplete && (
            <div className="mt-4 pt-4 border-t border-gray-700 text-left">
              <div className="text-green-400 mb-2"> Executing code...</div>
              {terminalLines.current.map((line, index) => (
                <div
                  key={index}
                  className="text-gray-300 mb-1 opacity-0 animate-fadeIn"
                  style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'forwards' }}
                >
                  {line}
                </div>
              ))}
              {terminalLines.current.length > 0 && terminalLines.current.length < 5 && (
                <div className="w-2 h-5 bg-white inline-block animate-blink ml-1"></div>
              )}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-800 rounded-full w-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        <h2
          className="text-2xl font-bold text-blue-400 mb-2 animate-pulse"
        >
          {loadingProgress < 100 ? 'Initializing Portfolio...' : 'Ready!'}
        </h2>

        <p className="text-sm text-blue-300">
          For the best experience, please view on a laptop or desktop device.
        </p>
      </div>
    </div>
  );
}