// API layer ready for Supabase integration
class API {
  static async request(endpoint, options = {}) {
    // Placeholder for Supabase fetch calls
    console.log(`[API] ${endpoint}`, options);
    return { success: true, data: null };
  }
}
window.API = API;