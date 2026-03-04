from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .database import get_supabase_client
from .models import (
    APIMessage,
    ContactMessageCreate,
    ContactMessageResponse,
    FAQ,
    GalleryImage,
    Package,
    Review,
    ReviewCreate,
    Video,
)

app = FastAPI(
    title="Travel API",
    version="1.0.0",
    description="Backend for the travel website (FastAPI + Supabase).",
)

# CORS (adjust origin in .env / deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for local dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 1) Health check
@app.get("/api/health", response_model=APIMessage)
def health_check() -> APIMessage:
    return APIMessage(message="OK")


# 2) List all packages
@app.get("/api/packages", response_model=List[Package])
def list_packages() -> List[Package]:
    supabase = get_supabase_client()
    resp = supabase.table("packages").select("*").order("id").execute()

    return resp.data or []


@app.get("/api/packages/featured", response_model=List[Package])
def get_featured_packages() -> List[Package]:
    supabase = get_supabase_client()
    resp = (
        supabase.table("packages")
        .select("*")
        .eq("is_featured", True)
        .order("id")
        .execute()
    )

    return resp.data or []

# 3) Get package by ID
@app.get("/api/packages/{package_id}", response_model=Package)
def get_package(package_id: int) -> Package:
    supabase = get_supabase_client()
    resp = (
        supabase.table("packages")
        .select("*")
        .eq("id", package_id)
        .single()
        .execute()
    )

    if not resp.data:
        raise HTTPException(status_code=404, detail="Package not found")

    return resp.data


# 4) Featured packages


# 5) Gallery images
@app.get("/api/gallery", response_model=List[GalleryImage])
def get_gallery() -> List[GalleryImage]:
    supabase = get_supabase_client()
    resp = supabase.table("gallery_images").select("*").order("id").execute()

    return resp.data or []


# 6) Reviews (optional package_id filter)
@app.get("/api/reviews", response_model=List[Review])
def get_reviews(package_id: Optional[int] = None) -> List[Review]:
    supabase = get_supabase_client()
    query = supabase.table("reviews").select("*").order("created_at", desc=True)

    if package_id is not None:
        query = query.eq("package_id", package_id)

    resp = query.execute()

    return resp.data or []


# 7) Create review
@app.post("/api/reviews", response_model=Review)
def create_review(payload: ReviewCreate) -> Review:
    supabase = get_supabase_client()

    resp = supabase.table("reviews").insert(payload.model_dump()).execute()

    if not resp.data:
        raise HTTPException(status_code=500, detail="Failed to create review")

    return resp.data[0]



# 8) FAQs
@app.get("/api/faqs", response_model=List[FAQ])
def get_faqs() -> List[FAQ]:
    supabase = get_supabase_client()
    resp = supabase.table("faqs").select("*").order("id").execute()

    return resp.data or []


# 9) Videos
@app.get("/api/videos", response_model=List[Video])
def get_videos() -> List[Video]:
    supabase = get_supabase_client()
    resp = supabase.table("videos").select("*").order("id").execute()

    return resp.data or []


# 10) Contact form submission
@app.post("/api/contact", response_model=ContactMessageResponse)
def submit_contact(payload: ContactMessageCreate) -> ContactMessageResponse:
    supabase = get_supabase_client()
    resp = (
        supabase.table("contact_messages")
        .insert(payload.dict())
        .select("id")
        .single()
        .execute()
    )

    if not resp.data:
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

    reference_id = str(resp.data["id"]) if "id" in resp.data else None

    return ContactMessageResponse(
        message="Thank you for reaching out. We'll get back to you soon.",
        reference_id=reference_id,
    )
