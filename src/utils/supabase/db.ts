import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const createSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createClient(cookieStore);
};

export default createSupabaseClient;
