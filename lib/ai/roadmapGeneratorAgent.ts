// lib/ai/roadmapGeneratorAgent.ts
import { WatsonxChatModel } from "beeai-framework/adapters/watsonx/backend/chat";
import { Message } from "beeai-framework/backend/core";
import { jsonrepair } from "jsonrepair";

interface RoadmapStep {
  name: string;
  description: string;
  resourceLinks: string[];
}

interface AgentResponse {
  success: boolean;
  data: RoadmapStep[] | null;
  error?: string;
}

export class RoadmapGeneratorAgent {
  private llm: any;

  constructor() {
    this.llm = new WatsonxChatModel("ibm/granite-3-8b-instruct");
  }

  async run(skillName: string): Promise<AgentResponse> {
    try {
      const prompt = `Generate a learning roadmap for the skill "${skillName}".
      The roadmap should include a maximum of four steps, each with a name, a brief description. Create the link so if the user press on it, it will direct to a search to DuckDuckGo using this "free online resources for <step name> in <skillName>" as a string .
      Each step must be a high level topic, be sure that all text can fit in PDF.
      Return the roadmap as a JSON array of step objects.`;

      const response = await this.llm.create({
        messages: [
          Message.of({
            role: "system",
            text: `You are an expert at creating learning roadmaps.
            Given a skill, you will generate a learning roadmap with a maximum of four steps, each with a name, a brief description. 
            Each step must be a high level topic. The description is maximum 200 words to ensure that all text can fit in PDF. The links is for the DDG using  "free online resources for <step name> in <skillName>".

            Be sure the result contains array and not anything else. The list has 4 steps:
            Example Output:
            [
              {
                "name": "Introduction to Python",
                "description": "Learn the basic syntax and data structures of Python.",
                "resourceLinks": [
                  "https://duckduckgo.com/?q=free+online+resources+for+Introduction+to+Python+in+Python",
                ]
              },
              {
                "name": "Python Data Structures",
                "description": "Dive deeper into Lists, Dictionaries, and other data structures.",
                "resourceLinks": [
                 "https://duckduckgo.com/?q=free+online+resources+for+Python+Data+Structures+in+Python",
                ]
              },
              {
                "name": "Object-Oriented Programming in Python",
                "description": "Understand OOP concepts and implement classes and objects.",
                "resourceLinks": [
                  "https://duckduckgo.com/?q=free+online+resources+for+Object-Oriented+Programming+in+Python+in+Python",
                ]
              },
              {
                "name": "Algorithms in Python",
                "description": "Dive deeper into Algorithms",
                "resourceLinks": [
                  "https://duckduckgo.com/?q=free+online+resources+for+Algorithms+in+Python+in+Python",
                ]
              }
            ]`,
          }),
          Message.of({ role: "user", text: prompt }),
        ],
      });

      const textContent = response.getTextContent();

      try {
        const roadmap: RoadmapStep[] = JSON.parse(
          jsonrepair(textContent.trim())
        );
        return { success: true, data: roadmap };
      } catch (error: any) {
        console.error("Error parsing JSON:", error);
        console.log("Failed JSON content:", textContent); // Log the content for debugging
        return {
          success: false,
          data: null,
          error: `Failed to parse roadmap data: ${error.message}. Check the console for the LLM output.`,
        };
      }
    } catch (error: any) {
      console.error(`RoadmapGeneratorAgent error:`, error);
      return {
        success: false,
        data: null,
        error: `RoadmapGeneratorAgent failed: ${error.message}`,
      };
    }
  }
}
