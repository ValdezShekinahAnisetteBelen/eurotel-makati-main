"use client"

import { useState, useEffect } from "react"
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpDown, Plus } from "lucide-react"
import { RoomImagesCell } from "@/components/RoomImagesCell"
import { RoomAmenitiesCell } from "@/components/RoomAmenitiesCell"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Columns } from "lucide-react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Room {
  id: number
  name: string
  description?: string
  amenities?: string[]
  price: number
  status: "Available" | "Occupied"
  images?: string[]
    discount?: number
   featured?: boolean;
   
}

export default function RoomsPage() {
  const router = useRouter()

  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    amenities: [] as string[],
    price: "",
    images: [] as File[],
  })
  const [amenityInput, setAmenityInput] = useState("")
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)


  // Allowed extensions
  const allowedTypes = ["image/jpeg", "image/png"]
  const maxSize = 2 * 1024 * 1024 // 2MB

const handleEditClick = (room: Room) => {
  setEditingRoom(room);
  setIsEditOpen(true);
};

  
  const amenityOptions = [
    "Free WiFi",
    "Air Conditioning",
    "Mini Bar",
    "Room Service",
    "Flat Screen TV",
    "City View",
    "Balcony",
    "Work Desk",
    "Sofa",
  ]

  // ✅ Add room through Next.js API
  const handleAddRoom = async () => {
    const formData = new FormData()
    formData.append("name", newRoom.name)
    formData.append("description", newRoom.description || "")
    formData.append("price", String(Number(newRoom.price)))
   newRoom.amenities.forEach(a => formData.append("amenities[]", a))
   formData.append("featured", newRoom.featured ? "1" : "0");
   formData.append("discount", String(newRoom.discount || 0))



   for (let i = 0; i < newRoom.images.length; i++) {
    formData.append("images[]", newRoom.images[i]) // ✅ array-style
    }


   const response = await fetch("/api/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ token here
    },
    body: formData,
  })

    if (response.ok) {
      const savedRoom = await response.json()
      setRooms([...rooms, savedRoom])
      setNewRoom({ name: "", description: "", price: "", amenities: [], images: [] })
      setAmenityInput("")
    } else {
      console.error("Failed to save room")
    }
  }

 const handleUpdateRoom = async () => {
  if (!editingRoom) return;

  const formData = new FormData();
  formData.append("name", editingRoom.name);
  formData.append("description", editingRoom.description || "");
  formData.append("price", String(Number(editingRoom.price) || 0));
  formData.append("status", editingRoom.status);
  formData.append("featured", editingRoom.featured ? "1" : "0");
  formData.append("discount", String(editingRoom.discount || 0))

  editingRoom.amenities?.forEach((a) => formData.append("amenities[]", a));

  // ✅ New images
  editingRoom.images?.forEach((img: any) => {
    if (img instanceof File) {
      formData.append("images[]", img);
    }
  });

  // ✅ Send kept existing images
  editingRoom.images?.forEach((img: any) => {
    if (typeof img === "string") {
      formData.append("existing_images[]", img);
    }
  });

  try {
    const response = await fetch(`/api/rooms/${editingRoom.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      const updatedRoom = await response.json();
      setRooms((prev) =>
        prev.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
      );
      setIsEditOpen(false);
      setEditingRoom(null);
    } else {
      const error = await response.text();
      console.error("Failed to update room:", error);
    }
  } catch (err) {
    console.error("Error updating room:", err);
  }
};


 // ✅ Table Columns
const columns = [
  {
    accessorKey: "name",
    header: ({ column }: any) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto font-normal"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
{
  accessorKey: "price",
  header: "Price (with discount)",
  cell: ({ row }: any) => {
    const price = Number(row.original.price) || 0
    const discount = Number(row.original.discount) || 0
    const finalPrice = price - (price * discount) / 100
    return (
      <div>
        <span className="font-medium text-green-700">
          ₱{finalPrice.toLocaleString()}
        </span>
        {discount > 0 && (
          <span className="text-xs text-gray-500 ml-2 line-through">
            ₱{price.toLocaleString()}
          </span>
        )}
      </div>
    )
  },
},

  { accessorKey: "status", header: "Status", cell: ({ row }: any) => (
      <span className={`font-medium ${row.original.status === "Available" ? "text-green-600" : "text-red-600"}`}>
        {row.original.status}
      </span>
    )
  },
  {
  accessorKey: "featured",
  header: "Featured",
  cell: ({ row }: any) => (
    <span
      className={`font-medium ${
        row.original.featured ? "text-blue-600" : "text-gray-400"
      }`}
    >
      {row.original.featured ? "Yes" : "No"}
    </span>
  ),
},

  { accessorKey: "description", header: "Description", cell: ({ row }: any) => <span className="line-clamp-2">{row.original.description}</span> },
  { accessorKey: "amenities", header: "Amenities", cell: ({ row }: any) => <RoomAmenitiesCell amenities={row.original.amenities || []} /> },
  { accessorKey: "images", header: "Images", cell: ({ row }: any) => <RoomImagesCell images={row.original.images || []} /> },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => <Button size="sm" variant="outline" onClick={() => handleEditClick(row.original)}>Edit</Button>
  },
]

// ✅ React Table Hook (must be unconditionally called)
const table = useReactTable({
  data: rooms,
  columns,
  state: { globalFilter, columnVisibility },
  onGlobalFilterChange: setGlobalFilter,
  onColumnVisibilityChange: setColumnVisibility,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})



 // Check auth
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.replace("/login") 
    }
  }, [router])

  useEffect(() => {
  const token = localStorage.getItem("token") // ✅ Get token

  fetch("/api/rooms", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => setRooms(data))
    .catch(err => console.error("Failed to load rooms:", err))
}, [])


  // 🚨 Render
  if (!user) return <p>Loading...</p> // Safe now because all hooks are declared above

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
            {/* Left: Title */}
            <CardTitle>Rooms</CardTitle>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2">
                {/* Add Room Button + Dialog */}
                <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Room
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                    <Input
                        placeholder="Room Name"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    />
                    <Textarea
                        placeholder="Description"
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    />
                    <Input
                        type="number"
                        placeholder="Price"
                        value={newRoom.price}
                        onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Discount (%)"
                      value={newRoom.discount || ""}
                      onChange={(e) => setNewRoom({ ...newRoom, discount: Number(e.target.value) })}
                    />

                    {/* Amenities Checkboxes */}
                    <div>
                        <p className="mb-2 font-medium">Select Amenities:</p>
                        <div className="grid grid-cols-2 gap-2">
                        {amenityOptions.map((amenity) => (
                            <label
                            key={amenity}
                            className="flex items-center gap-2 border rounded px-2 py-1 cursor-pointer"
                            >
                            <input
                                type="checkbox"
                                checked={newRoom.amenities.includes(amenity)}
                                onChange={(e) => {
                                if (e.target.checked) {
                                    setNewRoom({
                                    ...newRoom,
                                    amenities: [...newRoom.amenities, amenity],
                                    })
                                } else {
                                    setNewRoom({
                                    ...newRoom,
                                    amenities: newRoom.amenities.filter((a) => a !== amenity),
                                    })
                                }
                                }}
                            />
                            {amenity}
                            </label>
                        ))}
                        </div>
                    </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRoom.featured || false}
                    onChange={(e) => setNewRoom({ ...newRoom, featured: e.target.checked })}
                  />
                  Featured
                </label>

                    {/* Image Upload */}
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      const validFiles: File[] = []

                      files.forEach((file) => {
                        if (!allowedTypes.includes(file.type)) {
                          toast.error("Only JPG or PNG images are allowed.")
                        } else if (file.size > maxSize) {
                          toast.error(`${file.name} is too large (max 2MB).`)
                        } else {
                          validFiles.push(file)
                        }
                      })

                      if (validFiles.length > 0) {
                        setNewRoom((prev) => ({
                          ...prev,
                          images: [...prev.images, ...validFiles],
                        }))
                      }
                    }}
                  />

                    {/* Preview Selected Images */}
                    {newRoom.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                        {newRoom.images.map((file, idx) => (
                            <div
                            key={idx}
                            className="relative w-full h-24 border rounded overflow-hidden"
                            >
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${idx}`}
                                className="object-cover w-full h-full"
                            />
                            </div>
                        ))}
                        </div>
                    )}

                    <Button onClick={handleAddRoom} className="w-full">
                        Save
                    </Button>
                    </div>
                </DialogContent>
                </Dialog>

                 <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                            <DialogTitle>Edit Room</DialogTitle>
                            </DialogHeader>

                            {editingRoom && (
                            <div className="space-y-4">
                              {/* Room Name */}
                              <div className="space-y-1">
                                <Label htmlFor="edit-name">Room Name</Label>
                                <Input
                                  id="edit-name"
                                  placeholder="Room Name"
                                  value={editingRoom.name}
                                  onChange={(e) =>
                                    setEditingRoom({ ...editingRoom, name: e.target.value })
                                  }
                                />
                              </div>

                              {/* Description */}
                              <div className="space-y-1">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  placeholder="Description"
                                  value={editingRoom.description || ""}
                                  onChange={(e) =>
                                    setEditingRoom({ ...editingRoom, description: e.target.value })
                                  }
                                />
                              </div>

                              {/* Price */}
                              <div className="space-y-1">
                                <Label htmlFor="edit-price">Price</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  placeholder="Price"
                                  value={editingRoom.price}
                                  onChange={(e) =>
                                    setEditingRoom({ ...editingRoom, price: Number(e.target.value) })
                                  }
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="edit-discount">Discount (%)</Label>
                                <Input
                                  id="edit-discount"
                                  type="number"
                                  placeholder="Discount"
                                  value={editingRoom.discount || 0}
                                  onChange={(e) =>
                                    setEditingRoom({ ...editingRoom, discount: Number(e.target.value) })
                                  }
                                />
                              </div>


                              {/* Status */}
                              <div className="space-y-1">
                                <Label htmlFor="edit-status">Status</Label>
                                <select
                                  id="edit-status"
                                  value={editingRoom.status}
                                  onChange={(e) =>
                                    setEditingRoom({
                                      ...editingRoom,
                                      status: e.target.value as "Available" | "Occupied",
                                    })
                                  }
                                  className="border rounded px-2 py-1 w-full"
                                >
                                  <option value="Available">Available</option>
                                  <option value="Occupied">Occupied</option>
                                </select>
                              </div>

                              {/* Amenities */}
                              <div>
                                <p className="mb-2 font-medium">Edit Amenities:</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {amenityOptions.map((amenity) => (
                                    <label
                                      key={amenity}
                                      className="flex items-center gap-2 border rounded px-2 py-1 cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={editingRoom.amenities?.includes(amenity) || false}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setEditingRoom({
                                              ...editingRoom,
                                              amenities: [...(editingRoom.amenities || []), amenity],
                                            })
                                          } else {
                                            setEditingRoom({
                                              ...editingRoom,
                                              amenities:
                                                editingRoom.amenities?.filter((a) => a !== amenity) || [],
                                            })
                                          }
                                        }}
                                      />
                                      {amenity}
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-1">
                              <Label htmlFor="edit-featured">Featured</Label>
                              <input
                                id="edit-featured"
                                type="checkbox"
                                checked={editingRoom.featured || false}
                                onChange={(e) =>
                                  setEditingRoom({ ...editingRoom, featured: e.target.checked })
                                }
                              />
                            </div>


                              {/* Images */}
                              <div className="space-y-1">
                                <Label htmlFor="edit-images">Upload Images</Label>
                               <Input
                                id="edit-images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || [])
                                  const validFiles: File[] = []

                                  files.forEach((file) => {
                                    if (!allowedTypes.includes(file.type)) {
                                      toast.error("❌ Only JPG or PNG images are allowed.")
                                    } else if (file.size > maxSize) {
                                      toast.error(`❌ ${file.name} is too large (max 2MB).`)
                                    } else {
                                      validFiles.push(file)
                                    }
                                  })

                                  if (validFiles.length > 0) {
                                    setEditingRoom((prev) =>
                                      prev
                                        ? { ...prev, images: [...(prev.images || []), ...validFiles] }
                                        : null
                                    )
                                  }
                                }}
                              />

                              </div>

                              {/* Preview Selected Images */}
                              <div className="grid grid-cols-3 gap-2 mt-2">
                              {editingRoom.images.map((img, idx) => (
                                <div
                                  key={idx}
                                  className="relative w-full h-24 border rounded overflow-hidden"
                                >
                                  <img
                                    src={img instanceof File ? URL.createObjectURL(img) : `http://localhost:8000/${img}`}
                                    alt={`preview-${idx}`}
                                    className="object-cover w-full h-full"
                                  />

                                  {/* Delete button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingRoom((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              images: prev.images?.filter((_, i) => i !== idx) || [],
                                            }
                                          : null
                                      );
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>


                              <Button onClick={handleUpdateRoom} className="w-full">
                                Update
                              </Button>
                            </div>
                          )}

                        </DialogContent>
                        </Dialog>


                {/* Columns Dropdown */}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                    <Columns className="h-4 w-4 mr-2" />
                    Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    {table.getAllLeafColumns().map((column) => {
                        const headerLabel =
                        typeof column.columnDef.header === "string"
                            ? column.columnDef.header
                            : column.id   // fallback to column id if header is a function

                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                            {headerLabel.charAt(0).toUpperCase() + headerLabel.slice(1)} {/* Capitalize */}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                    </DropdownMenuContent>


                </DropdownMenu>
            </div>
            </CardHeader>

        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search rooms..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-2 text-left">
                        {header.isPlaceholder
                          ? null
                          : typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2">
                        {typeof cell.column.columnDef.cell === "function"
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.getValue()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
