import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${params.id}`, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Room not found with ID: ${params.id}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`❌ GET /api/rooms/${params.id} failed:`, err);
    return NextResponse.json(
      { error: "Failed to fetch room", details: String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await req.formData();
    formData.append("_method", "PUT"); // Laravel requires this

    const res = await fetch(`${BASE_URL}/rooms/${params.id}`, {
      method: "POST", // still POST with _method=PUT
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${BASE_URL}/rooms/${params.id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to delete room with ID: ${params.id}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`❌ DELETE /api/rooms/${params.id} failed:`, err);
    return NextResponse.json(
      { error: "Failed to delete room", details: String(err) },
      { status: 500 }
    );
  }
}