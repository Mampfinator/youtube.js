export declare enum AttachmentType {
    Image = "Image",
    Poll = "Poll",
    Quiz = "Quiz",
    Video = "Video",
    Playlist = "Playlist",
    SharedPost = "SharedPost",
    None = "None"
}
export interface PollChoice {
    text: string;
    imageUrl?: string;
}
export interface QuizChoice extends PollChoice {
    isCorrect: boolean;
}
interface BaseCommunityPost {
    id: string;
    content?: {
        text: string;
        url?: string;
    }[];
    attachmentType: AttachmentType;
}
export interface TextOnlyCommunityPost extends BaseCommunityPost {
    attachmentType: AttachmentType.None;
    content: {
        text: string;
        url?: string;
    }[];
}
export interface ImageCommunityPost extends BaseCommunityPost {
    attachmentType: AttachmentType.Image;
    images: string[];
}
export interface PollCommunityPost extends BaseCommunityPost {
    attachmentType: AttachmentType.Poll;
    choices: PollChoice[];
}
export interface QuizCommunityPost extends BaseCommunityPost {
    attachmentType: AttachmentType.Quiz;
    choices: QuizChoice[];
}
export interface VideoCommunityPost extends BaseCommunityPost {
    attachmentType: AttachmentType.Video;
    video: {
        id?: string;
        title: string;
        descriptionSnippet?: string;
        thumbnail: string;
        membersOnly: boolean;
    };
}
export interface PlaylistCommunityPost extends BaseCommunityPost {
    attachmentType: AttachmentType.Playlist;
    playlist: {
        /**
         * If ID is undefined, the playlist is no longer available.
         */
        id?: string;
        title: string;
        thumbail: string;
    };
}
export interface SharedPostCommunityPost extends BaseCommunityPost {
    attachmentType: AttachmentType.SharedPost;
    sharedPost: CommunityPost;
}
/**
 * Represents a community post. Type can be narrowed by checking the post's {@linkcode AttachmentType}.
 */
export type CommunityPost = SharedPostCommunityPost | ImageCommunityPost | PollCommunityPost | QuizCommunityPost | VideoCommunityPost | PlaylistCommunityPost | TextOnlyCommunityPost;
export {};
