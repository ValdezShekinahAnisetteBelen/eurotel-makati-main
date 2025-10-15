import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // <-- use env variable

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/rooms`, {
      headers: { Accept: "application/json" },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ GET /api/rooms failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch rooms", details: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const res = await fetch(`${BASE_URL}/rooms`, {
      method: "POST",
      body: formData,
    });

    const text = await res.text(); // get raw Laravel response
    let data;

    try {
      data = JSON.parse(text); // parse JSON if valid
    } catch {
      data = { raw: text }; // fallback for HTML / unexpected
    }

    console.log("🔎 Laravel Response:", res.status, data);

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ POST /api/rooms failed:", err);
    return NextResponse.json(
      { error: "Failed to save room", details: String(err) },
      { status: 500 }
    );
  }
}
