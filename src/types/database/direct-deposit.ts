import { Database } from "@/integrations/supabase/types";

export type DirectDepositInfo = Database["public"]["Tables"]["direct_deposit_info"]["Row"];
export type DirectDepositInfoInsert = Database["public"]["Tables"]["direct_deposit_info"]["Insert"];
export type DirectDepositInfoUpdate = Database["public"]["Tables"]["direct_deposit_info"]["Update"];