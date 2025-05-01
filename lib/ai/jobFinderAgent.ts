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
      const prompt = `You are an expert at extracting job information from a list of unstructured text. You will receive a list of job details and format it to a JSON format with the "title" and "description" keys. The title MUST be a job name.
      Skip any results that look like "100+ jobs in london" and is not a job name.
      The returned result must be JSON only.
            Example:
            [
              {
                "title": "Software Engineer",
                "description": "Seeking a skilled software engineer to develop web applications."
              },
              {
                "title": "Data Scientist",
                "description": "Looking for a data scientist to analyze data and build models."
              },
              {
                "title": "Project Manager",
                "description": "Experienced project manager needed to lead software development projects."
              }
            ]`;

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
