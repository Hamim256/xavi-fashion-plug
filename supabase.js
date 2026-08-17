const SUPABASE_URL = "https://wovyhrpehywmxdhjibbq.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xoRcJtQ1_HN-F_XbwdXD0A_H5jzV9MD";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
