// components/LocationForm.tsx
"use client";
import React from "react";

interface LocationFormProps {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({
  location,
  setLocation,
  handleSubmit,
  isLoading,
}) => {
  return (
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
  );
};

export default LocationForm;
