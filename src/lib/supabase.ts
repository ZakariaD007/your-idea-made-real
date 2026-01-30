import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ropguztyrbenordqdaks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcGd1enR5cmJlbm9yZHFkYWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTUxOTAsImV4cCI6MjA4NTMzMTE5MH0.sqr8_tVNVRHUXenOEO46JpWSszYzIxqqUBrX_srSK7k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
