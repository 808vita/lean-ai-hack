// lib/ai/skillExtractorAgent.ts
import { WatsonxChatModel } from "beeai-framework/adapters/watsonx/backend/chat";
import { Message } from "beeai-framework/backend/core";
import { jsonrepair } from "jsonrepair";

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

  constructor() {
    this.llm = new WatsonxChatModel("ibm/granite-3-8b-instruct");
  }

  async run(jobDescription: string): Promise<AgentResponse> {
    try {
      const prompt = `Analyze the following job description and extract the key skills and qualifications.
      For each skill, provide a brief description and an importance level (High, Medium, or Low).
      Return the results as a JSON array of skill objects.

      Job Description:
      ${jobDescription}
      `;

      const response = await this.llm.create({
        messages: [
          Message.of({
            role: "system",
            text: `You are an expert at extracting skills from job descriptions.
            You must return a JSON array of skill objects, where each object includes the skill name, a brief description, and an importance level (High, Medium, or Low).
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
