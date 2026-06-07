"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Ellipsis } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, type SubmitEvent } from "react";
import { IMenu } from "@/types/IMenu";
import { toast } from "sonner";
import Image from "next/image";

export default function Page() {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getMenus() {
      const { data, error } = await supabase.from("menus").select();
      if (!error) {
        setMenus(data);
      }
    }
    getMenus();
  }, [supabase]);

  async function handleAddMenu(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMenu = Object.fromEntries(formData.entries());

    const { data, error } = await supabase
      .from("menus")
      .insert(newMenu)
      .select();
    if (!error) {
      setMenus([...menus, ...data]);
      setCreateDialogOpen(false);
      toast("Menu added successfully");
    }
  }

  async function handleDelete() {
    if (!selectedMenu) return;

    const { error } = await supabase
      .from("menus")
      .delete()
      .eq("id", selectedMenu.id);

    if (!error) {
      setMenus(menus.filter((menu) => menu.id !== selectedMenu.id));
      setDeleteDialogOpen(false);
      setSelectedMenu(null);
      toast("Menu deleted successfully");
    }
  }

  async function handleUpdate(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedMenu) return;

    const formData = new FormData(e.currentTarget);
    const newMenu = Object.fromEntries(formData.entries());

    const { error } = await supabase
      .from("menus")
      .update(newMenu)
      .eq("id", selectedMenu.id);

    if (!error) {
      const newMenus = menus.map((menu) =>
        menu.id === selectedMenu.id ? { ...menu, ...newMenu } : menu,
      );
      setMenus(newMenus);
      setEditDialogOpen(false);
      setSelectedMenu(null);
      toast("Menu updated successfully");
    }
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-16">Menu</h1>
        {/* Create Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button">Add Menu</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Menu</DialogTitle>
              <DialogDescription>Make new menu to here.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddMenu}>
              <FieldGroup>
                <Field>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required name="name" defaultValue="" />
                </Field>
                <Field>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="resize-none"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" defaultValue="0" required />
                </Field>
                <Field>
                  <Label htmlFor="image">Image</Label>
                  <Input id="image" name="image" required />
                </Field>
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select name="category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="non-coffee">Non Coffee</SelectItem>
                        <SelectItem value="pastry">Pastry</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <DialogFooter showCloseButton>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Create Dialog */}
      </div>

      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Menu</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Price</TableHead>
              <TableHead className="font-bold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus?.map((menu) => (
              <TableRow key={menu.id}>
                <TableCell className="font-medium">
                  <div className="flex gap-2 items-center flex-wrap">
                    <Image
                      src={menu.image}
                      alt={menu.name}
                      width={400}
                      height={400}
                      className="object-cover w-25 h-25 rounded-md"
                    />
                    {menu.name}
                  </div>
                </TableCell>
                <TableCell title={menu.description} className="text-nowrap">
                  {menu.description.length > 100
                    ? menu.description.substring(0, 100) + "..."
                    : menu.description}
                </TableCell>
                <TableCell>{menu.category}</TableCell>
                <TableCell>${menu.price}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Ellipsis className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMenu(menu);
                            setEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedMenu(menu);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              menu <strong>{selectedMenu?.name}</strong> from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Menu</DialogTitle>
              <DialogDescription>Edit the menu details.</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  required
                  name="name"
                  defaultValue={selectedMenu?.name}
                />
              </Field>
              <Field>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  className="resize-none"
                  required
                  defaultValue={selectedMenu?.description}
                />
              </Field>
              <Field>
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  name="price"
                  required
                  defaultValue={selectedMenu?.price}
                />
              </Field>
              <Field>
                <Label htmlFor="edit-image">Image</Label>
                <Input
                  id="edit-image"
                  name="image"
                  required
                  defaultValue={selectedMenu?.image}
                />
              </Field>
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select name="category" defaultValue={selectedMenu?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="coffee">Coffee</SelectItem>
                      <SelectItem value="non-coffee">Non Coffee</SelectItem>
                      <SelectItem value="pastry">Pastry</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <DialogFooter showCloseButton>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
