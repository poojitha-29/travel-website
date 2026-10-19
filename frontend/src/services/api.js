import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[api] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. ' +
      'Data fetching will be unavailable until you configure frontend/.env.'
  );
}

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

function ensureClient() {
  if (!supabase) throw new Error('Supabase client is not configured');
  return supabase;
}

// Wraps a Supabase result in { data } to preserve the existing res.data access pattern
// that all pages rely on (e.g. `.then(res => setItems(res.data || []))`).
function wrap(data) {
  return { data };
}

export async function getHealth() {
  return wrap({ message: 'OK' });
}

export async function getPackages() {
  const client = ensureClient();
  const { data, error } = await client
    .from('packages')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return wrap(data ?? []);
}

export async function getFeaturedPackages() {
  const client = ensureClient();
  const { data, error } = await client
    .from('packages')
    .select('*')
    .eq('is_featured', true)
    .order('id', { ascending: true });
  if (error) throw error;
  return wrap(data ?? []);
}

export async function getPackageById(id) {
  const client = ensureClient();
  const { data, error } = await client
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return wrap(data);
}

export async function getGallery() {
  const client = ensureClient();
  const { data, error } = await client
    .from('gallery_images')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return wrap(data ?? []);
}


export async function getReviews(packageId) {
  const client = ensureClient();

  // Only fetch fields that are safe to display publicly.
  let query = client
    .from('reviews')
    .select('id, name, rating, comment, created_at, package_id')
    .order('created_at', { ascending: false });

  if (packageId != null) {
    query = query.eq('package_id', packageId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return wrap(data ?? []);
}

export async function createReview(reviewData) {
  const client = ensureClient();

  const { error } = await client
    .from('reviews')
    .insert({
      name: reviewData.name.trim(),
      phone: reviewData.phone,
      email: reviewData.email?.trim() || null,
      rating: Number(reviewData.rating),
      comment: reviewData.comment.trim(),
    });

  if (error) throw error;

  return wrap({ message: 'Review submitted successfully' });
}


export async function getFaqs() {
  const client = ensureClient();
  const { data, error } = await client
    .from('faqs')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return wrap(data ?? []);
}

export async function getVideos() {
  const client = ensureClient();
  const { data, error } = await client
    .from('videos')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return wrap(data ?? []);
}

// sendContactMessage is kept for API completeness but is not called from the UI
// (both Contact.jsx and PackageDetail.jsx send enquiries directly to WhatsApp).
export async function sendContactMessage(contactData) {
  const client = ensureClient();
  const { data, error } = await client
    .from('contact_messages')
    .insert({
      name: contactData.name,
      email: contactData.email,
      message: contactData.message,
      ...(contactData.package_id != null && { package_id: contactData.package_id }),
    })
    .select('id')
    .single();
  if (error) throw error;
  return wrap({
    message: "Thank you for reaching out. We'll get back to you soon.",
    reference_id: data?.id != null ? String(data.id) : null,
  });
}
