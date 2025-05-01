// components/SkillModal.tsx
import React, { useState, useEffect } from "react";
import Roadmap from "@/components/Roadmap";
import PDFDocument from "@/components/PDFDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface Skill {
  skillName: string;
  description: string;
  importance: string;
}

interface RoadmapStep {
  name: string;
  description: string;
  resourceLinks: string[];
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
  const [roadmaps, setRoadmaps] = useState<RoadmapStep[][]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [allRoadmapsLoaded, setAllRoadmapsLoaded] = useState(false);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      setIsLoading(true);
      setError(null);
      setAllRoadmapsLoaded(false);

      try {
        const roadmapPromises = skills.map(async (skill) => {
          const response = await fetch("/api/roadmap", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ skillName: skill.skillName }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error ||
                `Failed to fetch roadmap for ${skill.skillName}`
            );
          }

          const data = await response.json();
          return data.data || [];
        });

        const roadmapsData = await Promise.all(roadmapPromises);
        setRoadmaps(roadmapsData);
        setAllRoadmapsLoaded(true);
      } catch (error: any) {
        setError(error.message);
        setRoadmaps([]);
        setAllRoadmapsLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && skills.length > 0) {
      fetchRoadmaps();
    } else {
      setRoadmaps([]); // Clear roadmaps when the modal is closed or skills are empty
      setIsLoading(true); // Reset loading state when modal is closed
      setAllRoadmapsLoaded(false);
    }
  }, [isOpen, skills]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white rounded p-6 shadow-lg w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Skills for {jobTitle}
        </h2>
        {isLoading && skills.length > 0 && <p>Loading roadmaps...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div>
          {skills.map((skill, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {skill.skillName}
              </h3>
              <p className="text-gray-600 mb-2">{skill.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                Importance:{" "}
                <span className="font-medium">{skill.importance}</span>
              </p>
              {/* Only show the Roadmap component when it's not loading or there's an error */}
              {(!isLoading || error) && (
                <Roadmap roadmap={roadmaps[index] || []} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
          <PDFDownloadLink
            document={
              <PDFDocument
                jobTitle={jobTitle || "N/A"}
                skills={skills}
                roadmaps={roadmaps}
              />
            }
            fileName={`Skills and Roadmap for ${jobTitle || "N/A"}.pdf`}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Export to PDF"
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;
