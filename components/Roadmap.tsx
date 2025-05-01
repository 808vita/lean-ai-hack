// components/Roadmap.tsx
import React, { useState } from "react";

interface RoadmapStep {
  name: string;
  description: string;
  resourceLinks: string[];
}

interface RoadmapProps {
  roadmap: RoadmapStep[];
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmap }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    setExpandedStep((prev) => (prev === index ? null : index));
  };

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-700 mt-2 mb-2">
        Learning Roadmap:
      </h4>
      {roadmap && roadmap.length > 0 ? (
        <div className="space-y-2">
          {roadmap.map((step, stepIndex) => (
            <div
              key={stepIndex}
              className="border rounded p-2 bg-gray-50 cursor-pointer"
            >
              <div
                className="flex items-center justify-between"
                onClick={() => toggleStep(stepIndex)}
              >
                <h5 className="font-semibold text-gray-700">{step.name}</h5>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    expandedStep === stepIndex ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              {expandedStep === stepIndex && (
                <div className="mt-2">
                  <p className="text-gray-600">{step.description}</p>
                  {step.resourceLinks && step.resourceLinks.length > 0 && (
                    <ul className="list-disc pl-5 mt-1">
                      {step.resourceLinks.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No roadmap available for this skill.</p>
      )}
    </div>
  );
};

export default Roadmap;
