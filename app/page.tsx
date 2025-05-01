// app/page.tsx
"use client";
import React, { useState } from "react";

interface Job {
  title: string;
  description: string;
}

export default function Home() {
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

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
              <li key={index} className="border rounded p-2 mb-2">
                <h3 className="font-semibold">{job.title}</h3>
                <p>{job.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
