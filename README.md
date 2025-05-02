# C-Kur: AI-Enhanced Skills Mapping for Workforce Development

C-Kur is an application that helps workforce development programs in underserved communities identify the specific skills that are most in-demand by local employers, aligning with the "Decent Work and Economic Growth Challenge".

## Problem

Workforce development programs in underserved communities often struggle to identify the specific skills that are most in-demand by local employers.

## Solution

C-Kur uses DuckDuckGo to search for job postings in a given location and sector. It then uses AI to extract the key skills and qualifications that employers are seeking from individual job descriptions. **For each extracted skill, C-Kur also generates a learning roadmap with links to relevant resources.** Finally, it presents this data in a clear and actionable format.

## Key Features

- **Job Search and Display:** Allows users to search for jobs in a specific location and sector and displays the results in a list.
- **AI-Powered Skill Extraction:** Uses AI to extract the key skills and qualifications from a job description.
- **Learning Roadmap Generation:** Generates a learning roadmap for each skill, providing a structured path to acquire the skill.
- **PDF Export:** Allows users to export job details (skills and roadmap) to a PDF document.
- **Location and Sector Selection:** Allows users to select a location and sector to focus the job search.

## Technology Stack

- Next.js
- TypeScript
- Tailwind CSS
- Watsonx.ai
- beeai-framework

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/808vita/lean-ai-hack
    ```

2.  **Install dependencies:**

    ```bash
    cd <project-directory>
    npm install
    ```

3.  **Configure environment variables:**

    - Create a `.env` file in the project root directory.
    - Add the following environment variables:

      ```
      WATSONX_API_KEY=YOUR_WATSONX_API_KEY
      WATSONX_PROJECT_ID=YOUR_WATSONX_PROJECT_ID
      WATSONX_REGION=YOUR_WATSONX_REGION
      ```

    - Replace `YOUR_WATSONX_API_KEY`, `YOUR_WATSONX_PROJECT_ID`, and `YOUR_WATSONX_REGION` with your actual Watsonx.ai credentials.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## Usage Instructions

1.  **Select a location:** Enter a location in the text input field.
2.  **Select a sector:** Select one sector from the list of available sectors.
3.  **Find Jobs:** Click the "Find Jobs" button to search for jobs in the specified location and sector.
4.  **View Job Details:** Click on a job card to view the details of the job, including the required skills and a learning roadmap.
5.  **Export to PDF:** Click the "Export to PDF" button to generate a PDF document containing the job details.

## API Endpoints

- `/api/watsonx`:

  - Purpose: Returns a list of jobs for the specified location and sectors.
  - Method: POST
  - Request Parameters:

    ```json
    {
      "location": "string",
      "sectors": ["string"]
    }
    ```

  - Response Format:

    ```json
    {
      "data": [
        {
          "title": "string",
          "description": "string"
        }
      ]
    }
    ```

- `/api/job-details`:

  - Purpose: Returns the skills for a job description.
  - Method: POST
  - Request Parameters:

    ```json
    {
      "jobDescription": "string"
    }
    ```

  - Response Format:

    ```json
    {
      "data": [
        {
          "skillName": "string",
          "description": "string",
          "importance": "string"
        }
      ]
    }
    ```

- `/api/roadmap`:

  - Purpose: Returns a learning roadmap for the specified skill.
  - Method: POST
  - Request Parameters:

    ```json
    {
      "skillName": "string"
    }
    ```

  - Response Format:

    ```json
    {
      "data": [
        {
          "name": "string",
          "description": "string",
          "resourceLinks": ["string"]
        }
      ]
    }
    ```

## AI Agents

- **DuckDuckGoJobFinderAgent:**

  - Role: Searches for job postings on DuckDuckGo for a specified location and sectors.
  - Input: Location (string), Sectors (array of strings, optional)
  - Output: A list of job titles and descriptions.

- **JobTitleExtractionAgent:**

  - Role: Extracts structured job title and description from unstructured text.
  - Input: Unstructured text containing job listings.
  - Output: A JSON object with job title and description.

- **SkillExtractorAgent:**

  - Role: Extracts the key skills and qualifications from a job description.
  - Input: Job description text (string).
  - Output: A list of skills with descriptions and importance levels.

- **RoadmapGeneratorAgent:**

  - Role: Generates a learning roadmap for a specific skill.
  - Input: Skill name (string).
  - Output: A list of roadmap steps with descriptions and DuckDuckGo search links.

## Data Structure

- **Job:**

  ```json
  {
    "title": "Software Engineer",
    "description": "Seeking a skilled software engineer to develop web applications."
  }
  ```

- **Skill:**

  ```json
  {
    "skillName": "Python",
    "description": "Proficiency in Python programming language.",
    "importance": "High"
  }
  ```

- **RoadmapStep:**

  ```json
  {
    "name": "Introduction to Python",
    "description": "Learn the basic syntax and data structures of Python.",
    "resourceLinks": [
      "https://duckduckgo.com/?q=free+online+resources+for+Introduction+to+Python+in+Python"
    ]
  }
  ```
