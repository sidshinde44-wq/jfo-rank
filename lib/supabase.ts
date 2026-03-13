// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = 'https://mifaumzmqxuzkzicnbly.supabase.co'       // replace with your project URL
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZmF1bXptcXh1emt6aWNuYmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODk0MDksImV4cCI6MjA4ODk2NTQwOX0.QsqQUhVwpemixWhX4voXxbWYgyJzLDsxSx3KwFZrMII'  // replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)