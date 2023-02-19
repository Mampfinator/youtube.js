import { ItemIdentifier, Thumbnail } from "../../base-types";
import { PrivacyStatus } from "../../videos/types/api-types";

export type ChannelIdentifier = ItemIdentifier<"youtube#channel">;

export type ChannelResource = ChannelIdentifier & ChannelResourceParts;

/**
 * https://developers.google.com/youtube/v3/docs/channels#resource
 */
export interface ChannelResourceParts {
    snippet: Snippet;
    contentDetails: ContentDetails;
    statistics: Statistics;
    topicDetails: TopicDetails;
    status: Status;
    brandingSettings: BrandingSettings;
    auditDetails: AuditDetails;
    contentOwnerDetails: ContentOwnerDetails;
    localizations: Localizations;
}


export interface Snippet {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: {
        default: Thumbnail<88, 88>;
        medium: Thumbnail<240, 240>;
        high: Thumbnail<800, 800>;
    }
    defaultLanguage: string;
    localized: {
        title: string;
        description: string;
    }
    country: string;
}

export interface ContentDetails {
    relatedPlaylists: {
        likes: string;
        favorites: string;
        uploads: string;
    }    
}

export interface Statistics {
    viewCount: number;
    /**
     * Rounded to 3 significant figures.
     */
    subscriberCount: number;
    hiddenSubscriberCount: boolean;
    videoCount: number;
}

export interface TopicDetails {
    topicIds: string[];
    topicCategories: string[];
}

export interface Status {
    privacyStatus: PrivacyStatus;
    isLinked: boolean;
    longUploadStatus: boolean;
    madeForKids: boolean;
    selfDeclaredMadeForKids: boolean;
}

export interface BrandingSettings {
    channel: {
        title: string;
        description: string;
        keywords: string;
        trackingAnalyticsAccountId: string;
        moderateComments: boolean;
        unsubscribedTrailer: string;
        defaultLanguage: string;
        country: string;
    }

    watch: {
        textColor: string;
        backgroundColor: string;
        featuredPlaylistId: string;
    }
}

export interface AuditDetails {
    overallGoodStanding: boolean;
    communityGuidelinesGoodStanding: boolean;
    copyrightStrikeGoodStanding: boolean;
    contentIdClaimsGoodStanding: boolean;
}

export interface ContentOwnerDetails {
    contentOwner: string;
    timeLinked: string;
}


export type Localizations = Record<string, Localization>;

interface Localization {
    title: string;
    description: string;
}