// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import LocationForm from "@/components/LocationForm";
import JobList from "@/components/JobList";
import SkillModal from "@/components/SkillModal";
import LoadingIndicator from "@/components/LoadingIndicator";

interface Job {
  title: string;
  description: string;
}

export default function Home() {
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false); //New State
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectors, setSectors] = useState<string[]>([]);

  const fetchJobDetails = async (jobDescription: string) => {
    setIsSkillsLoading(true);
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
      setIsSkillsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent, newSectors: string[]) => {
    e.preventDefault();
    setIsJobsLoading(true);
    setError(null);
    setSkills([]);
    setSelectedJob(null);

    try {
      const response = await fetch("/api/watsonx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, sectors: newSectors }),
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
      setIsJobsLoading(false);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      if (selectedJob) {
        const details = await fetchJobDetails(selectedJob.title);
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
      <LocationForm
        location={location}
        setLocation={setLocation}
        handleSubmit={handleSubmit}
        isLoading={isJobsLoading}
        setSectors={setSectors}
      />

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isJobsLoading && <LoadingIndicator message="Loading Jobs..." />}
      {!isJobsLoading && jobs.length > 0 && (
        <JobList jobs={jobs} onJobSelect={(job) => setSelectedJob(job)} />
      )}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJob(null);
          setSkills([]);
        }}
        skills={skills}
        jobTitle={selectedJob?.title}
        isLoading={isSkillsLoading} // use the new state variable
      />
    </div>
  );
}
