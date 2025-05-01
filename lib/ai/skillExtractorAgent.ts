// lib/ai/skillExtractorAgent.ts
import { WatsonxChatModel } from "beeai-framework/adapters/watsonx/backend/chat";
import { Message } from "beeai-framework/backend/core";
import { jsonrepair } from "jsonrepair";
import { DuckDuckGoSearchTool } from "beeai-framework/tools/search/duckDuckGoSearch";

interface Skill {
  skillName: string;
  description: string;
  importance: string; // e.g., "High", "Medium", "Low"
}

interface AgentResponse {
  success: boolean;
  data: Skill[] | null;
  error?: string;
}

export class SkillExtractorAgent {
  private llm: any;
  private duckDuckGoSearchTool: DuckDuckGoSearchTool;

  constructor() {
    this.llm = new WatsonxChatModel("ibm/granite-3-8b-instruct");
    this.duckDuckGoSearchTool = new DuckDuckGoSearchTool();
  }

  async run(jobDescription: string): Promise<AgentResponse> {
    try {
      // 1. Search for skills related to the job description
      const searchQuery = `key skills for ${jobDescription}`;
      console.log(`Searching DuckDuckGo for: ${searchQuery}`);
      const searchResults = await this.duckDuckGoSearchTool.run({
        query: searchQuery,
      });

      const prompt = `You are an expert at extracting skills from job descriptions, and finding information about the skills.
      You must return a JSON array of EXACTLY 5 skill objects, where each object includes the skill name, a brief description, and an importance level (High, Medium, or Low).
      You are given a job description, and also a list of web search results that may be helpful in extracting the skills.
      Be sure the result contains array and not anything else, even there are no search results:
      Example:
      [
        {
          "skillName": "Python",
          "description": "Proficiency in Python programming language.",
          "importance": "High"
        },
        {
          "skillName": "Data Analysis",
          "description": "Experience with data analysis techniques and tools.",
          "importance": "Medium"
        },
        {
          "skillName": "Communication",
          "description": "Strong written and verbal communication skills.",
          "importance": "High"
        },
        {
          "skillName": "Machine Learning",
          "description": "Knowledge in machine learning algorithms",
          "importance": "Medium"
        },
        {
          "skillName": "SQL",
          "description": "Experience with SQL is needed to access all the data",
          "importance": "Medium"
        }
      ]
      
      Here's the job description: ${jobDescription}
      Here's the web search results: ${JSON.stringify(searchResults.results)}
      `;

      const response = await this.llm.create({
        messages: [
          Message.of({
            role: "system",
            text: `You are an expert at extracting skills from job descriptions, and finding information about the skills.
            You must return a JSON array of EXACTLY 5 skill objects, where each object includes the skill name, a brief description, and an importance level (High, Medium, or Low).
            You are given a job description, and also a list of web search results that may be helpful in extracting the skills.

            Be sure the result contains array and not anything else, even there are no search results:
            Example:
            [
              {
                "skillName": "Python",
                "description": "Proficiency in Python programming language.",
                "importance": "High"
              },
              {
                "skillName": "Data Analysis",
                "description": "Experience with data analysis techniques and tools.",
                "importance": "Medium"
              },
              {
                "skillName": "Communication",
                "description": "Strong written and verbal communication skills.",
                "importance": "High"
              },
              {
                "skillName": "Machine Learning",
                "description": "Knowledge in machine learning algorithms",
                "importance": "Medium"
              },
              {
                "skillName": "SQL",
                "description": "Experience with SQL is needed to access all the data",
                "importance": "Medium"
              }
            ]`,
          }),
          Message.of({ role: "user", text: prompt }),
        ],
      });

      const textContent = response.getTextContent();

      try {
        const skills: Skill[] = JSON.parse(jsonrepair(textContent.trim()));
        return { success: true, data: skills };
      } catch (error: any) {
        console.error("Error parsing JSON:", error);
        console.log("Failed JSON content:", textContent); // Log the content for debugging
        return {
          success: false,
          data: null,
          error: `Failed to parse skill data: ${error.message}. Check the console for the LLM output.`,
        };
      }
    } catch (error: any) {
      console.error(`SkillExtractorAgent error:`, error);
      return {
        success: false,
        data: null,
        error: `SkillExtractorAgent failed: ${error.message}`,
      };
    }
  }
}
