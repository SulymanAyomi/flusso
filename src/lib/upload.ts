import { CLOUD_NAME, CLOUD_UPLOAD_PRESET } from "@/config";

type UploadType = "avatar" | "attachment";

const FOLDERS: Record<UploadType, string> = {
    avatar: "flusso/avatars",
    attachment: "flusso/attachments",
};

export async function uploadFile(file: File, type: UploadType = "avatar") {
    // Basic validation (still needed)
    if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
    }

    if (file.size > 2 * 1024 * 1024) {
        throw new Error("Max file size is 2MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUD_UPLOAD_PRESET);
    formData.append("folder", FOLDERS[type]);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await res.json();

    if (!res.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "Upload failed");
    }

    return {
        url: data.secure_url,
        publicId: data.public_id,
    };
}