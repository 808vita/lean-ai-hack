// components/SkillModal.tsx
import React from "react";

interface Skill {
  skillName: string;
  description: string;
  importance: string;
}

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: Skill[];
  jobTitle: string | undefined;
}

const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  skills,
  jobTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white rounded p-6 shadow-lg w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Skills for {jobTitle}
        </h2>
        <ul className="max-h-[60vh] overflow-y-auto">
          {skills.map((skill, index) => (
            <li key={index} className="border rounded p-4 mb-3 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700">
                {skill.skillName}
              </h3>
              <p className="text-gray-600">{skill.description}</p>
              <p className="text-sm text-gray-500">
                Importance:{" "}
                <span className="font-medium">{skill.importance}</span>
              </p>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SkillModal;
