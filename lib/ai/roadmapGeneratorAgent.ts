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
      The roadmap should include a series of steps, each with a name, a brief description, and a list of links to free online resources for learning that step.
      Return the roadmap as a JSON array of step objects.`;

      const response = await this.llm.create({
        messages: [
          Message.of({
            role: "system",
            text: `You are an expert at creating learning roadmaps.
            Given a skill, you will generate a series of steps, each with a name, a brief description, and a list of links to free online resources for learning that step.
            Example Output:
            [
              {
                "name": "Introduction to Python",
                "description": "Learn the basic syntax and data structures of Python.",
                "resourceLinks": [
                  "https://www.codecademy.com/learn/learn-python-3",
                  "https://www.learnpython.org/"
                ]
              },
              {
                "name": "Python Data Structures",
                "description": "Dive deeper into Lists, Dictionaries, and other data structures.",
                "resourceLinks": [
                  "https://www.tutorialspoint.com/python/python_data_types.htm",
                  "https://realpython.com/python-data-structures/"
                ]
              },
              {
                "name": "Object-Oriented Programming in Python",
                "description": "Understand OOP concepts and implement classes and objects.",
                "resourceLinks": [
                  "https://realpython.com/oop-in-python-vs-traditional-programming/",
                  "https://www.programiz.com/python-programming/object-oriented-programming"
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
