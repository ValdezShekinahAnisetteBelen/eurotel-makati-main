import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔹 GET Room
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ FIXED
  try {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Room not found with ID: ${id}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`❌ GET /api/rooms/${id} failed:`, err);
    return NextResponse.json(
      { error: "Failed to fetch room", details: String(err) },
      { status: 500 }
    );
  }
}

// 🔹 PUT Room
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ FIXED
  try {
    const formData = await req.formData();
    formData.append("_method", "PUT"); // Laravel-style override

    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
      method: "POST",
      body: formData,
    });

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: res.status });
    } catch {
      return NextResponse.json({ error: text }, { status: res.status });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 🔹 DELETE Room
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ FIXED
  try {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to delete room with ID: ${id}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`❌ DELETE /api/rooms/${id} failed:`, err);
    return NextResponse.json(
      { error: "Failed to delete room", details: String(err) },
      { status: 500 }
    );
  }
}
