import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import type { Product } from "@/lib/models"
import { successResponse, errorResponse } from "@/lib/api-response"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(errorResponse("Invalid ID"), { status: 400 })
    }

    const { db } = await connectToDatabase()

    const product = await db.collection<Product>("products").findOne({
      _id: new ObjectId(id),
    })

    if (!product) {
      return NextResponse.json(errorResponse("Product not found"), {
        status: 404,
      })
    }

    return NextResponse.json(successResponse(product))
  } catch (error) {
    console.error("[Product GET Error]", error)
    return NextResponse.json(errorResponse("Failed to fetch product"), {
      status: 500,
    })
  }
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Params is now a Promise
) {
  try {
   
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" }, 
        { status: 401 }
      );
    }

   
    const { id } = await params;
    console.log("Processing update for ID:", id);

   
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" }, 
        { status: 400 }
      );
    }

    const body = await request.json();
    const { db } = await connectToDatabase();

    // 5. Prepare Update Data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.name) updateData.name = body.name;
    if (body.description) updateData.description = body.description;
    if (body.price) updateData.price = Number(body.price);
    if (body.stock) updateData.stock = Number(body.stock);
    if (body.category) updateData.category = body.category;
    
    if (body.image) {
      updateData.images = Array.isArray(body.image) ? body.image : [body.image];
    }

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" } 
    );

   
    const updatedProduct = result?.value || result;

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Product updated successfully", 
      data: updatedProduct 
    });

  } catch (error) {
    console.error("[Product PUT Error]", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json(errorResponse("Unauthorized"), {
        status: 401,
      })
    }

   const {id}= await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(errorResponse("Invalid ID"), {
        status: 400,
      })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection<Product>("products").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(errorResponse("Product not found"), {
        status: 404,
      })
    }

    return NextResponse.json(
      successResponse({ message: "Product deleted successfully" })
    )
  } catch (error) {
    console.error("[Product DELETE Error]", error)
    return NextResponse.json(errorResponse("Failed to delete product"), {
      status: 500,
    })
  }
}
