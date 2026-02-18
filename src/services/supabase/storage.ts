import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const extra = Constants.expoConfig?.extra as any;

const supabaseUrl = extra?.supabase?.url as string | undefined;
const supabaseAnonKey = extra?.supabase?.anonKey as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase config. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SUPABASE_BUCKET = (extra?.supabase?.bucket as string | undefined) ?? "public";
