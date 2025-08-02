export interface IGalleryImageEntity {
    id: number;
    image_url: string;
    title: string | null;
    description: string | null;
    uploaded_at: Date | null;
}