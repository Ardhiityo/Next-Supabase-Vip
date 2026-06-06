import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const cookieStore = await cookies();
const supabase = createClient(cookieStore);

export default supabase;
