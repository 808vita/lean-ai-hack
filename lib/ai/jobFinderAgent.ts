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

export class JobFinderAgent {
  private duckDuckGoSearchTool: DuckDuckGoSearchTool;
  private llm: any;

  constructor() {
    this.duckDuckGoSearchTool = new DuckDuckGoSearchTool();
    this.llm = new WatsonxChatModel("ibm/granite-3-8b-instruct");
  }

  async run(location: string): Promise<AgentResponse> {
    try {
      const searchQuery = `in demand jobs in ${location}`;

      console.log(`Searching DuckDuckGo for: ${searchQuery}`);

      const searchResults = await this.duckDuckGoSearchTool.run({
        query: searchQuery,
      });

      console.log(`DuckDuckGo results:`, searchResults);

      // Extract job titles and descriptions from search results.
      // This is a simplified approach. A more robust solution might
      // involve parsing the HTML content of the search results.
      //Refactor with LLM
      const llmResponse = await this.llm.create({
        messages: [
          Message.of({
            role: "system",
            text: `You are an expert at extracting job information from a list of unstructured text. You will receive a list of job details and format it to a JSON format with the "title" and "description" keys. The returned result must be JSON only.
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
            ]
            `,
          }),
          Message.of({
            role: "user",
            text: JSON.stringify(searchResults.results),
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