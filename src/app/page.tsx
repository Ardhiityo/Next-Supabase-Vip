import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import createSupabaseClient from "@/utils/supabase/db";
import Image from "next/image";

export default async function Page() {
  const supabase = await createSupabaseClient();
  const { data: menus } = await supabase.from("menus").select();

  return (
    <>
      <h1 className="text-3xl font-bold mb-16">Menu</h1>
      <section className="grid md:grid-cols-5">
        {menus?.map((item) => (
          <Card className="relative mx-auto w-full max-w-sm pt-0" key={item.id}>
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <Image
              src={item.image}
              alt={item.name}
              width={400}
              height={400}
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary" className="font-bold">
                  ${item.price}
                </Badge>
              </CardAction>
              <CardTitle className="font-bold">{item.name}</CardTitle>
              <CardDescription>
                {item.description.length > 50
                  ? item.description.substring(0, 50) + "..."
                  : item.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full">Detail Menu</Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </>
  );
}
