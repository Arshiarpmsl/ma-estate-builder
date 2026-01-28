import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const db = {
  async getCompany() {
    const { data, error } = await supabase.from('company').select('*').single()
    if (error) throw error
    return data
  },

  async updateCompany(updates) {
    const { data, error } = await supabase.from('company').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', '00000000-0000-0000-0000-000000000001').select().single()
    if (error) throw error
    return data
  },



async getBeforeAfter() {
  const { data, error } = await supabase.from('before_after_projects').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
},

async addBeforeAfter(project) {
  const { data, error } = await supabase.from('before_after_projects').insert(project).select().single()
  if (error) throw error
  return data
},

async updateBeforeAfter(id, updates) {
  const { data, error } = await supabase.from('before_after_projects').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
},


async deleteContactSubmission(id) {
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
  if (error) throw error
},

async deleteBeforeAfter(id) {
  const { error } = await supabase.from('before_after_projects').delete().eq('id', id)
  if (error) throw error
},


// Image Collections
async getAllSiteImages() {
  const { data, error } = await supabase.from('site_images').select('*').order('created_at')
  if (error) throw error
  return data || []
},

async addImageCollection(id, name) {
  const { data, error } = await supabase.from('site_images').insert({ id, name, images: [] }).select().single()
  if (error) throw error
  return data
},

async deleteImageCollection(id) {
  const { error } = await supabase.from('site_images').delete().eq('id', id)
  if (error) throw error
},

// Categories
async addCategory(category) {
  const { data, error } = await supabase.from('categories').insert(category).select().single()
  if (error) throw error
  return data
},

async deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
},

// Gallery update
async updateGalleryItem(id, updates) {
  const { data, error } = await supabase.from('gallery').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
},



// Homepage Settings
async getHomepageSetting(id) {
  const { data, error } = await supabase.from('homepage_settings').select('value').eq('id', id)
  if (error && error.code !== 'PGRST116') throw error  // Ignore "no rows" error

  if (!data || data.length === 0) {
    const defaults = { hero: {}, stats: [], features: [], cta: {} }
    return defaults[id] || null
  }
  return data[0].value
},

async updateHomepageSetting(id, value) {
  const { error } = await supabase.from('homepage_settings').upsert({ id, value, updated_at: new Date().toISOString() })
  if (error) throw error
},

async getAllHomepageSettings() {
  const { data, error } = await supabase.from('homepage_settings').select('*')
  if (error) throw error
  return data || []
},



  async getServices() {
    const { data, error } = await supabase.from('services').select('*').order('sort_order')
    if (error) throw error
    return data || []
  },

  async getActiveServices() {
    const { data, error } = await supabase.from('services').select('*').eq('active', true).order('sort_order')
    if (error) throw error
    return data || []
  },

  async addService(service) {
    const { data, error } = await supabase.from('services').insert({ title: service.title, description: service.description, category: service.category, images: service.images || [], active: true, sort_order: 0 }).select().single()
    if (error) throw error
    return data
  },

  async updateService(id, updates) {
    const { data, error } = await supabase.from('services').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteService(id) {
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) throw error
  },

  async getGallery() {
    const { data, error } = await supabase.from('gallery').select('*').order('sort_order')
    if (error) throw error
    return data || []
  },

  async addGalleryItem(item) {
    const { data, error } = await supabase.from('gallery').insert({ title: item.title, category: item.category, images: item.images || [], sort_order: 0 }).select().single()
    if (error) throw error
    return data
  },

  async deleteGalleryItem(id) {
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw error
  },

  async getApprovedReviews() {
    const { data, error } = await supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getAllReviews() {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async submitReview(review) {
    const { data, error } = await supabase.from('reviews').insert({ name: review.name, location: review.location, rating: review.rating, text: review.text, approved: false }).select().single()
    if (error) throw error
    return data
  },

  async updateReview(id, updates) {
    const { data, error } = await supabase.from('reviews').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async deleteReview(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) throw error
  },

  async submitContact(contact) {
    const { data, error } = await supabase.from('contact_submissions').insert({ name: contact.name, email: contact.email, phone: contact.phone || null, message: contact.message }).select().single()
    if (error) throw error
    return data
  },

  async getContactSubmissions() {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async markContactRead(id) {
    const { error } = await supabase.from('contact_submissions').update({ read: true }).eq('id', id)
    if (error) throw error
  },

  async getCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order')
    if (error) throw error
    return data || []
  },

  async getSiteImages(section) {
    const { data, error } = await supabase.from('site_images').select('images').eq('id', section).single()
    if (error && error.code !== 'PGRST116') throw error
    return data?.images || []
  },

  async updateSiteImages(section, images) {
    const { error } = await supabase.from('site_images').upsert({ id: section, images: images, updated_at: new Date().toISOString() })
    if (error) throw error
  },

  async uploadImage(file, folder = 'general') {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const { data, error } = await supabase.storage.from('images').upload(fileName, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)
    return publicUrl
  }
}
