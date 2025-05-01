// components/LocationForm.tsx
"use client";
import React, { useState } from "react";

interface LocationFormProps {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent, sectors: string[]) => Promise<void>;
  isLoading: boolean;
  setSectors: React.Dispatch<React.SetStateAction<string[]>>;
}

const sectors = [
  "Technology",
  "Healthcare",
  "Renewable Energy",
  "Finance",
  "Education",
];

const LocationForm: React.FC<LocationFormProps> = ({
  location,
  setLocation,
  handleSubmit,
  isLoading,
  setSectors,
}) => {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [customSector, setCustomSector] = useState("");

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const handleCustomSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSector(e.target.value);
  };

  const handleAddCustomSector = () => {
    if (customSector.trim() !== "") {
      setSelectedSectors((prev) => [...prev, customSector.trim()]);
      setCustomSector("");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, selectedSectors);
    setSectors(selectedSectors);
  };

  return (
    <form onSubmit={onSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border rounded p-2 mr-2 w-64"
      />

      {/* Sector Selection */}
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Sectors:
        </label>
        <div className="flex flex-wrap">
          {sectors.map((sector) => (
            <button
              key={sector}
              type="button"
              className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mr-2 mb-2 ${
                selectedSectors.includes(sector) ? "bg-blue-300" : ""
              }`}
              onClick={() => toggleSector(sector)}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Sector Input */}
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Enter custom sector"
          value={customSector}
          onChange={handleCustomSectorChange}
          className="border rounded p-2 mr-2 w-48"
        />
        <button
          type="button"
          onClick={handleAddCustomSector}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
      </div>

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
