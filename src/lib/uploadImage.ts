import { supabase } from "@/integrations/supabase/client";

export async function uploadImage(file: File, folder: string = "uploads"): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error("Image trop lourde (max 10 Mo)");
  if (!file.type.startsWith("image/")) throw new Error("Le fichier doit être une image");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(fileName);
  return data.publicUrl;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}
