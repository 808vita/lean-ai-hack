// app/api/job-details/route.ts
import { NextResponse, NextRequest } from "next/server";
import { SkillExtractorAgent } from "@/lib/ai/skillExtractorAgent";

interface RequestBody {
  jobDescription: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { jobDescription } = (await req.json()) as RequestBody;

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Missing jobDescription in the request body" },
        { status: 400 }
      );
    }

    const skillExtractorAgent = new SkillExtractorAgent();
    const response = await skillExtractorAgent.run(jobDescription);

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
