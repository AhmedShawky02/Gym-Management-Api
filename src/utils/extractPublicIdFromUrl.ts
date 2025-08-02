import { HttpError } from "./HttpError.js";


export function extractPublicIdFromUrl(url: string): string {
    const withoutParams = url.split("?")[0]; // لو فيه query params
    const match = withoutParams.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);

    if (!match || !match[1]) {
        throw new HttpError("Failed to extract public ID from URL", 400);
    }

    return match[1]; // ← ده هو الـ public_id اللي Cloudinary محتاجه
}