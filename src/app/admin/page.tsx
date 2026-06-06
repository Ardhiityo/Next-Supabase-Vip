import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import supabase from "@/utils/supabase/db";

export default async function Page() {
  const { data: menus } = await supabase.from("menus").select();
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-16">Menu</h1>
        <Button>Add Menu</Button>
      </div>
      <section>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-center">Menu</TableHead>
              <TableHead className="font-bold text-center">
                Description
              </TableHead>
              <TableHead className="font-bold text-center">Category</TableHead>
              <TableHead className="font-bold text-center">Price</TableHead>
              <TableHead className="font-bold text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus?.map((menu) => (
              <TableRow key={menu.id}>
                <TableCell className="font-medium">
                  <div className="flex gap-2 items-center justify-center text-center">
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
                <TableCell title={menu.description} className="text-center">
                  {menu.description.length > 100
                    ? menu.description.substring(0, 100) + "..."
                    : menu.description}
                </TableCell>
                <TableCell className="text-center">{menu.category}</TableCell>
                <TableCell className="text-center">${menu.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
}
