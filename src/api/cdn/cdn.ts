import { CDN_BASE_URL, ThumbnailQuality } from "./cnd.constants";

export class YouTubeCDN {
    public getVideoThumbnail(
        videoId: string,
        quality: ThumbnailQuality,
    ): string {
        return `${CDN_BASE_URL}/vi/${videoId}/${quality}.jpg`;
    }
}
