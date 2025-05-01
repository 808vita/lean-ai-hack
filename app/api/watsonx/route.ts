// app/api/watsonx/route.ts
import { NextResponse, NextRequest } from "next/server";
import { OrchestratorAgent } from "@/lib/ai/jobFinderAgent";

interface RequestBody {
  location: string;
  sectors?: string[];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { location, sectors } = (await req.json()) as RequestBody;

    if (!location) {
      return NextResponse.json(
        { error: "Missing location in the request body" },
        { status: 400 }
      );
    }

    const orchestratorAgent = new OrchestratorAgent();
    const response = await orchestratorAgent.run(location, sectors);

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
