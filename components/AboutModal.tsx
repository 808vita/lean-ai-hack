// components/AboutModal.tsx
import React from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded p-6 shadow-lg w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          About C-Kur
        </h2>
        <p className="text-gray-700 mb-4">
          C-Kur helps job seekers bridge the skills gap and land their dream
          jobs. We understand that finding the right career path can be
          challenging, especially when it's not clear what skills are needed and
          how to acquire them.
        </p>
        <p className="text-gray-700 mb-4">
          Traditional job boards simply list job openings. They don't provide
          insight into the specific skills required for each role, nor do they
          offer guidance on how to develop those skills. This leaves job seekers
          feeling lost and unsure of where to start.
        </p>
        <p className="text-gray-700 mb-4">
          C-Kur uses advanced AI to analyze job descriptions and identify the
          critical skills needed. For each skill, C-Kur generates a personalized
          learning roadmap, outlining the steps required to master that skill.
          We also provide links to free online resources to help you learn
          efficiently and effectively.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">
          Key Features:
        </h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>AI-Powered Skill Extraction</li>
          <li>Personalized Learning Roadmaps</li>
          <li>Free Online Resources</li>
          <li>Job Search</li>
        </ul>
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AboutModal;
