import { createClient } from "@supabase/supabase-js";
import { environment } from "../../config/environment";

export const adminAuthClient = createClient(
  environment.SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
