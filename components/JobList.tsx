// components/JobList.tsx
import React from "react";

interface Job {
  title: string;
  description: string;
}

interface JobListProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onJobSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Jobs</h2>
      <ul>
        {jobs.map((job, index) => (
          <li
            key={index}
            className="border rounded p-2 mb-2 cursor-pointer"
            onClick={() => onJobSelect(job)}
          >
            <h3 className="font-semibold">{job.title}</h3>
            <p>{job.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
