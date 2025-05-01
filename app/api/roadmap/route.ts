// app/api/roadmap/route.ts
import { NextResponse, NextRequest } from "next/server";
import { RoadmapGeneratorAgent } from "@/lib/ai/roadmapGeneratorAgent";

interface RequestBody {
  skillName: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { skillName } = (await req.json()) as RequestBody;

    if (!skillName) {
      return NextResponse.json(
        { error: "Missing skillName in the request body" },
        { status: 400 }
      );
    }

    const roadmapGeneratorAgent = new RoadmapGeneratorAgent();
    const response = await roadmapGeneratorAgent.run(skillName);

    if (!response.success) {
      return NextResponse.json({ error: response.error }, { status: 500 });
    }

    return NextResponse.json({ data: response.data });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to process request: ${error.message}` },
      { status: 500 }
    );
  }
}
