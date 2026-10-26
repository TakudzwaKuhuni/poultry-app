import { createClient } from '@supabase/supabase-js';

// Explicitly pointing to your specific project database instance engine
const supabaseUrl = 'https://kxjrieeyhfpvfcemqhbu.supabase.co';
const supabaseAnonKey = 'sb_publishable_nxHywNvg8MpW_S6iv6taxA_Ra3TGSTn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
