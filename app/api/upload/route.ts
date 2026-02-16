import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(errorResponse("No image provided"), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json(
      successResponse({
        url: result.secure_url,
        public_id: result.public_id,
      })
    );
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return NextResponse.json(errorResponse("Upload failed"), { status: 500 });
  }
}
