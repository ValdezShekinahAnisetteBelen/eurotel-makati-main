"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera } from "lucide-react";
import { toast } from "sonner";

interface Admin {
  id: number;
  name: string;
  username: string;
  email: string;
  role?: string;
  profile_image?: string | File | null;
}

export default function AdminSettingsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Get logged-in admin ID safely
  const userData =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const parsedUser = userData ? JSON.parse(userData) : null;
  const adminId = parsedUser?.user?.id;

  // ✅ Fetch admin profile
  useEffect(() => {
    if (!adminId) return;

    const fetchAdminProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/profile/${adminId}`);
        if (!res.ok) throw new Error("Failed to fetch admin data");

        const data = await res.json();
        setAdmin(data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching admin profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [API_URL, adminId]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!admin) return;

  try {
    const formData = new FormData();
    formData.append("name", admin.name?.trim() || "");
    formData.append("username", admin.username?.trim() || "");
    
    if (admin.profile_image instanceof File) {
      formData.append("profile_image", admin.profile_image);
    }

    const res = await fetch(`${API_URL}/admin/profile/${adminId}`, {
      method: "POST", // ✅ Laravel route accepts POST or PUT, POST is safer for multipart
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");

    toast.success("Profile updated successfully");
    setAdmin(data.user);
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Failed to update profile");
  }
};


  // ✅ Handle image preview & file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdmin((prev) => (prev ? { ...prev, profile_image: file } : prev));
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading admin profile...
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No admin data found
      </div>
    );
  }

  const profileImageUrl =
    admin.profile_image instanceof File
      ? URL.createObjectURL(admin.profile_image)
      : admin.profile_image
      ? `${API_URL.replace("/api", "")}/uploads/profile_images/${admin.profile_image}`
      : "/images/admin-avatar.jpg";

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10">
      <Card className="w-full max-w-2xl shadow-md rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            Admin Profile Settings
          </CardTitle>
        </CardHeader>

        <Separator className="my-2" />

        <CardContent>
          {/* Profile Header */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-yellow-400">
                <AvatarImage src={profileImageUrl} alt="Admin Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 bg-yellow-400 text-white p-2 rounded-full shadow hover:bg-yellow-500 transition"
                aria-label="Change profile picture"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                id="profile_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <p className="text-lg font-medium text-gray-700">{admin.name}</p>
            <p className="text-sm text-gray-500">{admin.role || "Administrator"}</p>
          </div>

          {/* Profile Edit Form */}
          <form className="space-y-6" onSubmit={handleSave} encType="multipart/form-data">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={admin.name}
                onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={admin.email}
                disabled
                className="mt-1 bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                value={admin.username}
                onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
