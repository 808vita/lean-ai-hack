// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";

interface Job {
  title: string;
  description: string;
}

export default function Home() {
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchJobDetails = async (jobDescription: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/job-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch job details");
      }

      const data = await response.json();
      // Assuming the API returns the skills data directly
      console.log(data, "data");
      //TODO: Add type
      return data;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSkills([]);
    setSelectedJob(null);

    try {
      const response = await fetch("/api/watsonx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data.data || []);
    } catch (error: any) {
      setError(error.message);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      if (selectedJob) {
        const details = await fetchJobDetails(selectedJob.description);
        if (details?.data) {
          setSkills(details?.data);
        }
      }
    };
    getDetails();
  }, [selectedJob]);

  useEffect(() => {
    if (selectedJob) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [selectedJob]);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Job Finder</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded p-2 mr-2 w-64"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Find Jobs"}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {jobs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Jobs in {location}</h2>
          <ul>
            {jobs.map((job, index) => (
              <li
                key={index}
                className="border rounded p-2 mb-2 cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <h3 className="font-semibold">{job.title}</h3>
                <p>{job.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isModalOpen && skills.length > 0 && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center overflow-auto p-4">
          <div className="bg-white rounded p-6 shadow-lg w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Skills for {selectedJob?.title}
            </h2>
            <ul className="max-h-[60vh] overflow-y-auto">
              {skills.map((skill: any, index: number) => (
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
              onClick={() => {
                setIsModalOpen(false);
                setSelectedJob(null);
                setSkills([]);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
