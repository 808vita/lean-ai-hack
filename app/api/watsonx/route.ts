// app/api/watsonx/route.ts
import { NextResponse, NextRequest } from "next/server";
import {
  DuckDuckGoJobFinderAgent,
  JobTitleExtractionAgent,
} from "@/lib/ai/jobFinderAgent";

interface RequestBody {
  location: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { location } = (await req.json()) as RequestBody;

    if (!location) {
      return NextResponse.json(
        { error: "Missing location in the request body" },
        { status: 400 }
      );
    }

    const duckDuckGoJobFinderAgent = new DuckDuckGoJobFinderAgent();
    const duckDuckGoResponse = await duckDuckGoJobFinderAgent.run(location);

    if (!duckDuckGoResponse.success) {
      return NextResponse.json(
        { error: duckDuckGoResponse.error },
        { status: 500 }
      );
    }
    const jobTitleExtractionAgent = new JobTitleExtractionAgent();
    const refineResponse = await jobTitleExtractionAgent.run(
      duckDuckGoResponse.data
    );

    if (!refineResponse.success) {
      return NextResponse.json(
        { error: refineResponse.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: refineResponse.data });
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to process request: ${error.message}` },
      { status: 500 }
    );
  }
}
