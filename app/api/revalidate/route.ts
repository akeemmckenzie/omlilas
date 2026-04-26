import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { _type, slug } = body;

    if (_type === "artwork") {
      revalidatePath("/originals");
      revalidatePath("/originals/[collection]", "page");
      revalidatePath("/prints");
      revalidatePath("/");
      if (slug?.current) {
        revalidatePath(`/artwork/${slug.current}`);
      }
    }

    if (_type === "collection") {
      revalidatePath("/originals");
      revalidatePath("/originals/[collection]", "page");
      if (slug?.current) {
        revalidatePath(`/originals/${slug.current}`);
      }
    }

    if (_type === "blogPost") {
      revalidatePath("/blog");
      revalidatePath("/");
      if (slug?.current) {
        revalidatePath(`/blog/${slug.current}`);
      }
    }

    if (_type === "siteSettings") {
      revalidatePath("/", "layout");
    }

    if (_type === "pageContent") {
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
