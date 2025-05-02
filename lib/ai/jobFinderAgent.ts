// lib/ai/jobFinderAgent.ts
import { DuckDuckGoSearchTool } from "beeai-framework/tools/search/duckDuckGoSearch";
import { Message } from "beeai-framework/backend/core";
import { WatsonxChatModel } from "beeai-framework/adapters/watsonx/backend/chat";
import { jsonrepair } from "jsonrepair";

interface Job {
  title: string;
  description: string;
}

interface AgentResponse {
  success: boolean;
  data: Job[] | null;
  error?: string;
}

export class DuckDuckGoJobFinderAgent {
  private duckDuckGoSearchTool: DuckDuckGoSearchTool;

  constructor() {
    this.duckDuckGoSearchTool = new DuckDuckGoSearchTool();
  }

  async run(location: string, sectors?: string[]): Promise<AgentResponse> {
    try {
      let searchResults: any[] = [];

      if (sectors && sectors.length > 0) {
        // Search for each sector
        for (const sector of sectors) {
          const searchQuery = `jobs in ${location} in the ${sector} sector`;
          console.log(`Searching DuckDuckGo for: ${searchQuery}`);

          const sectorResults = await this.duckDuckGoSearchTool.run({
            query: searchQuery,
          });

          if (sectorResults && sectorResults.results) {
            searchResults = searchResults.concat(sectorResults.results);
          }
        }
      } else {
        // Basic search without sectors
        const searchQuery = `jobs in ${location}`;
        console.log(`Searching DuckDuckGo for: ${searchQuery}`);

        const basicResults = await this.duckDuckGoSearchTool.run({
          query: searchQuery,
        });

        if (basicResults && basicResults.results) {
          searchResults = basicResults.results;
        }
      }

      return { success: true, data: searchResults };
    } catch (error: any) {
      console.error(`JobFinderAgent error:`, error);
      return {
        success: false,
        data: null,
        error: `JobFinderAgent failed: ${error.message}`,
      };
    }
  }
}

export class JobTitleExtractionAgent {
  private llm: any;

  constructor() {
    this.llm = new WatsonxChatModel("ibm/granite-3-8b-instruct");
  }

  async run(searchResults: any): Promise<AgentResponse> {
    try {
      const prompt = `You are an expert at extracting job information from a list of unstructured text and creating concise, accurate job descriptions. You will receive a list of job details, including job titles, and format it to a JSON format with the "title" and "description" keys. The "title" MUST be a job name. The "description" should be a brief (1-2 sentence) summary of the job, accurately reflecting the role's key responsibilities, required skills, and overall purpose.

      Skip any results that look like "100+ jobs in london" or are not a job name.

      Focus on providing factual and relevant descriptions directly related to the job title. Avoid generic phrases and focus on specifics.

      The returned result must be JSON only.

      Here's an example of the required JSON format:

      [
        {
          "title": "Software Engineer (Backend)",
          "description": "Designs, develops, and maintains server-side logic and APIs for web applications using Java and Spring Boot. Requires strong problem-solving skills and experience with database systems like PostgreSQL."
        },
        {
          "title": "Data Scientist (Machine Learning)",
          "description": "Develops and implements machine learning models to solve business problems, using Python and scikit-learn. Requires a strong understanding of statistical modeling and experience with data visualization tools like Tableau."
        },
        {
          "title": "Marketing Manager (Digital)",
          "description": "Develops and executes digital marketing campaigns across various channels, including social media, email, and search engines. Requires strong analytical skills and experience with marketing automation platforms."
        },
        {
          "title": "Project Manager (Agile)",
          "description": "Leads cross-functional teams to deliver software projects using Agile methodologies, ensuring projects are completed on time and within budget. Requires excellent communication and organizational skills and experience with Jira and Confluence."
        }
      ]
      `;

      const llmResponse = await this.llm.create({
        messages: [
          Message.of({
            role: "system",
            text: prompt,
          }),
          Message.of({
            role: "user",
            text: JSON.stringify(searchResults),
          }),
        ],
      });

      const llmParsedResult = JSON.parse(
        jsonrepair(llmResponse.getTextContent().trim())
      );

      const jobs: Job[] = llmParsedResult;

      return { success: true, data: jobs };
    } catch (error: any) {
      console.error(`JobFinderAgent error:`, error);
      return {
        success: false,
        data: null,
        error: `JobFinderAgent failed: ${error.message}`,
      };
    }
  }
}

export class OrchestratorAgent {
  async run(location: string, sectors?: string[]): Promise<AgentResponse> {
    try {
      const duckDuckGoJobFinderAgent = new DuckDuckGoJobFinderAgent();
      const jobTitleExtractionAgent = new JobTitleExtractionAgent();

      const duckDuckGoResponse = await duckDuckGoJobFinderAgent.run(
        location,
        sectors
      );

      if (!duckDuckGoResponse.success) {
        console.log(duckDuckGoResponse, "duckDuckGoResponse");

        return {
          success: false,
          data: null,
          error: "Failed to retrieve data from one or more agents",
        };
      }

      const refineResponse = await jobTitleExtractionAgent.run(
        duckDuckGoResponse.data
      );

      if (!refineResponse.success) {
        return {
          success: false,
          data: null,
          error: refineResponse.error,
        };
      }

      return { success: true, data: refineResponse.data };
    } catch (error: any) {
      console.error("API error:", error);
      return {
        success: false,
        data: null,
        error: `Failed to process request: ${error.message}`,
      };
    }
  }
}
