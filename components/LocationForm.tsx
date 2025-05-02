// components/LocationForm.tsx
"use client";
import React, { useState } from "react";
import AboutModal from "@/components/AboutModal"; // Import AboutModal
interface LocationFormProps {
  location: string;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent, sectors: string[]) => Promise<void>;
  isLoading: boolean;
  setSectors: React.Dispatch<React.SetStateAction<string[]>>;
}

const sectors = ["Technology", "Transport", "Finance", "Education"];

const LocationForm: React.FC<LocationFormProps> = ({
  location,
  setLocation,
  handleSubmit,
  isLoading,
  setSectors,
}) => {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [customSector, setCustomSector] = useState("");
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false); // Add local state

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) => {
      if (prev.includes(sector)) {
        return []; // Deselect if already selected
      } else {
        return [sector]; // Deselect all and select the new sector
      }
    });
  };

  const handleCustomSectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSector(e.target.value);
  };

  const handleAddCustomSector = () => {
    if (customSector.trim() !== "") {
      setSelectedSectors([customSector.trim()]); // Replace current selection with custom sector
      setCustomSector("");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, selectedSectors);
    setSectors(selectedSectors);
  };

  return (
    <form onSubmit={onSubmit} className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Enter Location:
      </label>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border rounded p-2 mr-2 w-64 text-lg mb-4"
      />

      {/* Sector Selection */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select One Sector:
        </label>
        <div className="flex flex-wrap">
          {sectors.map((sector) => (
            <button
              key={sector}
              type="button"
              className={`text-gray-700 font-bold py-2 px-4 rounded mr-2 mb-2
              ${
                selectedSectors.includes(sector)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => toggleSector(sector)}
            >
              {sector}
            </button>
          ))}
          {/* Display Custom Sectors */}
          {selectedSectors
            .filter((sector) => !sectors.includes(sector))
            .map((sector) => (
              <button
                key={sector}
                type="button"
                className={`text-gray-700 font-bold py-2 px-4 rounded mr-2 mb-2 bg-blue-400 hover:bg-red-300`}
                onClick={() => toggleSector(sector)}
              >
                {sector}
              </button>
            ))}
        </div>
      </div>

      {/* Custom Sector Input */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter Custom Sector:
        </label>
        <input
          type="text"
          placeholder="Enter custom sector"
          value={customSector}
          onChange={handleCustomSectorChange}
          className="border rounded p-2 mr-2 w-48 text-lg mb-2"
        />
        <button
          type="button"
          onClick={handleAddCustomSector}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add
        </button>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-3 text-lg font-bold hover:bg-blue-700"
          disabled={isLoading || location.trim() === ""}
        >
          {isLoading ? "Loading..." : "Find Jobs"}
        </button>

        <button
          type="button"
          className="border border-gray-500 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-200 focus:outline-none focus:shadow-outline ml-2"
          onClick={() => setIsAboutModalOpen(true)}
        >
          About C-Kur
        </button>
      </div>
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </form>
  );
};

export default LocationForm;
