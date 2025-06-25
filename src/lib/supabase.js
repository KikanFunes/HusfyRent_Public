export const supabase = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    insert: () => Promise.resolve({ data: null, error: null }),
    eq: () => Promise.resolve({ data: null, error: null }),
  }),
};