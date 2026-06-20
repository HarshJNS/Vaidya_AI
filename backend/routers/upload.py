from fastapi import APIRouter, File, UploadFile

router = APIRouter()


@router.post("/")
async def upload_docs(file: UploadFile = File(...)):
    content = await file.read()
    return {
        "success": True,
        "filename": file.filename,
        "bytes": len(content),
        "message": "Storage upload wiring is ready; connect Supabase Storage bucket before production use.",
    }

