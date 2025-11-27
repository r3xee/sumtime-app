import { createClient } from "@supabase/supabase-js";
import { environment } from "../../config/environment";

export const supabase = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_KEY,
  {
    auth: {
      flowType: "implicit",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
