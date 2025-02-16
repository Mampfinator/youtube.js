export interface Messages {
    continuationContents: ContinuationContents;
}
export interface ContinuationContents {
    liveChatContinuation: LiveChatContinuation;
}
export interface LiveChatContinuation {
    actions: Action[];
}
export interface Action {
    clickTrackingParams?: TrackingParams;
    addChatItemAction?: AddChatItemAction;
    liveChatReportModerationStateCommand?: LiveChatReportModerationStateCommand;
    removeChatItemAction?: RemoveChatItemAction;
    addLiveChatTickerItemAction?: AddLiveChatTickerItemAction;
    replayChatItemAction?: {
        clickTrackingParams: string;
        actions: [Action];
    };
}
export interface AddChatItemAction {
    item: AddChatItemActionItem;
    clientId?: string;
}
export interface AddChatItemActionItem {
    liveChatTextMessageRenderer?: LiveChatTextMessageRenderer;
    liveChatViewerEngagementMessageRenderer?: LiveChatViewerEngagementMessageRenderer;
    liveChatMembershipItemRenderer?: LiveChatMembershipItemRenderer;
    liveChatPlaceholderItemRenderer?: LiveChatPlaceholderItemRenderer;
    liveChatPaidMessageRenderer?: LiveChatPaidMessageRenderer;
    liveChatPaidStickerRenderer?: LiveChatPaidStickerRenderer;
}
export interface LiveChatPaidStickerRenderer {
    id: string;
    contextMenuEndpoint: ContextMenuEndpoint;
    contextMenuAccessibility: ContextMenuAccessibility;
    timestampUsec: string;
    authorPhoto: SponsorPhotoClass;
    authorName: AuthorName;
    authorExternalChannelId: string;
    timestampText: {
        simpleText: string;
    };
    sticker: {
        thumbnails: Thumbnail[];
        accessibility: {
            accessibilityData: {
                label: string;
            };
        };
    };
    authorBadges: AuthorBadge[];
    moneyChipBackgroundColor: number;
    moneyChipTextColor: number;
    purchaseAmountText: {
        simpleText: string;
    };
    stickerDisplayWidth: number;
    stickerDisplayHeight: number;
    backgroundColor: number;
    authorNameTextColor: number;
    trackingParams: string;
    isV2Style: boolean;
}
export interface LiveChatMembershipItemRenderer {
    id: string;
    timestampUsec: string;
    authorExternalChannelId: string;
    headerPrimaryText?: HeaderPrimaryText;
    headerSubtext: HeaderSubtext;
    message?: LiveChatMembershipItemRendererMessage;
    authorName: AuthorName;
    authorPhoto: SponsorPhotoClass;
    authorBadges: AuthorBadge[];
    contextMenuEndpoint: ContextMenuEndpoint;
    contextMenuAccessibility: ContextMenuAccessibility;
    trackingParams: string;
    empty?: boolean;
}
export interface AuthorBadge {
    liveChatAuthorBadgeRenderer: LiveChatAuthorBadgeRenderer;
}
export interface LiveChatAuthorBadgeRenderer {
    customThumbnail: SponsorPhotoClass;
    tooltip: Label;
    accessibility: ContextMenuAccessibility;
}
export interface ContextMenuAccessibility {
    accessibilityData: AccessibilityData;
}
export interface AccessibilityData {
    label: Label;
}
export type Label = string;
export interface SponsorPhotoClass {
    thumbnails: Thumbnail[];
}
export interface Thumbnail {
    url: string;
    width?: number;
    height?: number;
}
export interface AuthorName {
    simpleText: string;
}
export interface ContextMenuEndpoint {
    clickTrackingParams?: string;
    commandMetadata: ContextMenuEndpointCommandMetadata;
    liveChatItemContextMenuEndpoint: LiveChatItemContextMenuEndpoint;
}
export interface ContextMenuEndpointCommandMetadata {
    webCommandMetadata: PurpleWebCommandMetadata;
}
export interface PurpleWebCommandMetadata {
    ignoreNavigation: boolean;
}
export interface LiveChatItemContextMenuEndpoint {
    params: string;
}
export interface HeaderPrimaryText {
    runs: HeaderPrimaryTextRun[];
}
export interface HeaderPrimaryTextRun {
    text: string;
}
export interface HeaderSubtext {
    simpleText?: SimpleText;
    runs?: HeaderPrimaryTextRun[];
}
export type SimpleText = string;
export interface LiveChatMembershipItemRendererMessage {
    runs: PurpleRun[];
}
export interface PurpleRun {
    text?: string;
    emoji?: PurpleEmoji;
}
export interface PurpleEmoji {
    emojiId: string;
    shortcuts: string[];
    searchTerms: string[];
    image: ImageClass;
    isCustomEmoji: boolean;
}
export interface ImageClass {
    thumbnails: Thumbnail[];
    accessibility: ContextMenuAccessibility;
}
export interface LiveChatPaidMessageRenderer {
    id: string;
    timestampUsec: string;
    authorName: AuthorName;
    authorPhoto: SponsorPhotoClass;
    purchaseAmountText: AuthorName;
    message: HeaderPrimaryText;
    headerBackgroundColor: number;
    headerTextColor: number;
    bodyBackgroundColor: number;
    bodyTextColor: number;
    authorExternalChannelId: string;
    authorNameTextColor: number;
    contextMenuEndpoint: ContextMenuEndpoint;
    timestampColor: number;
    contextMenuAccessibility: ContextMenuAccessibility;
    trackingParams: string;
    authorBadges: AuthorBadge[];
    textInputBackgroundColor: number;
    creatorHeartButton: CreatorHeartButton;
    isV2Style: boolean;
    replyButton: LiveChatPaidMessageRendererReplyButton;
    pdgLikeButton?: PdgLikeButton;
}
export interface CreatorHeartButton {
    creatorHeartViewModel: CreatorHeartViewModel;
}
export interface CreatorHeartViewModel {
    creatorThumbnail: CreatorThumbnail;
    heartedIcon: HeartedIcon;
    unheartedIcon: UnheartedIcon;
    heartedHoverText: string;
    heartedAccessibilityLabel: string;
    unheartedAccessibilityLabel: string;
    engagementStateKey: string;
}
export interface CreatorThumbnail {
    sources: CreatorThumbnailSource[];
}
export interface CreatorThumbnailSource {
    url: string;
}
export interface HeartedIcon {
    sources: HeartedIconSource[];
}
export interface HeartedIconSource {
    clientResource: ClientResource;
}
export interface ClientResource {
    imageName: string;
}
export interface UnheartedIcon {
    sources: HeartedIconSource[];
    processor: Processor;
}
export interface Processor {
    borderImageProcessor: BorderImageProcessor;
}
export interface BorderImageProcessor {
    imageTint: ImageTint;
}
export interface ImageTint {
    color: number;
}
export interface PdgLikeButton {
    pdgLikeViewModel: PdgLikeViewModel;
}
export interface PdgLikeViewModel {
    toggleButton: ToggleButton;
}
export interface ToggleButton {
    toggleButtonViewModel: ToggleButtonViewModel;
}
export interface ToggleButtonViewModel {
    defaultButtonViewModel: ButtonViewModel;
    toggledButtonViewModel: ButtonViewModel;
    trackingParams: string;
}
export interface ButtonViewModel {
    buttonViewModel: DefaultButtonViewModelButtonViewModel;
}
export interface DefaultButtonViewModelButtonViewModel {
    trackingParams: string;
    loggingDirectives: LoggingDirectives;
}
export interface LoggingDirectives {
    trackingParams: string;
    visibility: Visibility;
}
export interface Visibility {
    types: string;
}
export interface LiveChatPaidMessageRendererReplyButton {
    pdgReplyButtonViewModel: PdgReplyButtonViewModel;
}
export interface PdgReplyButtonViewModel {
    replyButton: PdgReplyButtonViewModelReplyButton;
    replyCountEntityKey: string;
    replyCountPlaceholder: ReplyCountPlaceholder;
}
export interface PdgReplyButtonViewModelReplyButton {
    buttonViewModel: ReplyButtonButtonViewModel;
}
export interface ReplyButtonButtonViewModel {
    iconName: string;
    onTap: PurpleOnTap;
    accessibilityText: string;
    style: string;
    trackingParams: string;
    type: string;
    buttonSize: string;
    customBackgroundColor: number;
    customFontColor: number;
    onVisible: OnVisible;
    loggingDirectives: LoggingDirectives;
}
export interface PurpleOnTap {
    innertubeCommand: Command;
}
export interface Command {
    clickTrackingParams: string;
    showEngagementPanelEndpoint: ShowEngagementPanelEndpoint;
}
export interface ShowEngagementPanelEndpoint {
    identifier: Identifier;
    globalConfiguration: LiveChatItemContextMenuEndpoint;
    engagementPanelPresentationConfigs: EngagementPanelPresentationConfigs;
}
export interface EngagementPanelPresentationConfigs {
    engagementPanelPopupPresentationConfig: EngagementPanelPopupPresentationConfig;
}
export interface EngagementPanelPopupPresentationConfig {
    popupType: string;
}
export interface Identifier {
    surface: string;
    tag: string;
}
export interface OnVisible {
    innertubeCommand: OnVisibleInnertubeCommand;
}
export interface OnVisibleInnertubeCommand {
    clickTrackingParams: string;
    logFlowLoggingEventCommand: LogFlowLoggingEventCommand;
}
export interface LogFlowLoggingEventCommand {
    flowEventType: number;
    flowEventNamespace: string;
    flowType: string;
    flowEventMetadata: FlowEventMetadata;
}
export interface FlowEventMetadata {
    liveChatEngagementContext: LiveChatEngagementContext;
}
export interface LiveChatEngagementContext {
    entryPointType: string;
}
export interface ReplyCountPlaceholder {
    content: string;
    styleRuns: StyleRun[];
}
export interface StyleRun {
    startIndex: number;
    length: number;
}
export interface LiveChatPlaceholderItemRenderer {
    id: string;
    timestampUsec: string;
}
export interface LiveChatTextMessageRenderer {
    message: LiveChatTextMessageRendererMessage;
    authorName?: AuthorName;
    authorPhoto: SponsorPhotoClass;
    contextMenuEndpoint: ContextMenuEndpoint;
    id: string;
    timestampUsec: string;
    authorExternalChannelId: string;
    contextMenuAccessibility: ContextMenuAccessibility;
    trackingParams?: TrackingParams;
    authorBadges?: AuthorBadge[];
    beforeContentButtons?: BeforeContentButton[];
}
export interface BeforeContentButton {
    buttonViewModel: BeforeContentButtonButtonViewModel;
}
export interface BeforeContentButtonButtonViewModel {
    iconName: string;
    title: Label;
    onTap: FluffyOnTap;
    type: string;
    buttonSize: string;
    iconTrailing: boolean;
    customBackgroundColor: number;
    customFontColor: number;
}
export interface FluffyOnTap {
    innertubeCommand: OnTapInnertubeCommand;
}
export interface OnTapInnertubeCommand {
    showEngagementPanelEndpoint: ShowEngagementPanelEndpoint;
}
export interface LiveChatTextMessageRendererMessage {
    runs: FluffyRun[];
}
export interface FluffyRun {
    text?: string;
    emoji?: FluffyEmoji;
}
export interface FluffyEmoji {
    emojiId: string;
    shortcuts: string[];
    searchTerms: string[];
    image: ImageClass;
    isCustomEmoji?: boolean;
    supportsSkinTone?: boolean;
    variantIds?: string[];
}
type TrackingParams = string;
export interface LiveChatViewerEngagementMessageRenderer {
    id: string;
    timestampUsec: string;
    icon: Icon;
    message: HeaderPrimaryText;
    actionButton: ActionButton;
    trackingParams: TrackingParams;
}
export interface ActionButton {
    buttonRenderer: ButtonRenderer;
}
export interface ButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: AuthorName;
    navigationEndpoint: NavigationEndpoint;
    trackingParams: string;
    accessibilityData: ContextMenuAccessibility;
}
export interface NavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: NavigationEndpointCommandMetadata;
    urlEndpoint: URLEndpoint;
}
export interface NavigationEndpointCommandMetadata {
    webCommandMetadata: FluffyWebCommandMetadata;
}
export interface FluffyWebCommandMetadata {
    url: string;
    webPageType: string;
    rootVe: number;
}
export interface URLEndpoint {
    url: string;
    target: string;
}
export interface Icon {
    iconType: string;
}
export interface AddLiveChatTickerItemAction {
    item: AddLiveChatTickerItemActionItem;
    durationSec: string;
}
export interface AddLiveChatTickerItemActionItem {
    liveChatTickerSponsorItemRenderer?: LiveChatTickerSponsorItemRenderer;
    liveChatTickerPaidMessageItemRenderer?: LiveChatTickerPaidMessageItemRenderer;
}
export interface LiveChatTickerPaidMessageItemRenderer {
    id: string;
    amountTextColor: number;
    startBackgroundColor: number;
    endBackgroundColor: number;
    authorPhoto: ImageClass;
    durationSec: number;
    showItemEndpoint: LiveChatTickerPaidMessageItemRendererShowItemEndpoint;
    authorExternalChannelId: string;
    fullDurationSec: number;
    trackingParams: string;
    authorUsername: AuthorName;
    dynamicStateData: DynamicStateData;
    animationOrigin: string;
    openEngagementPanelCommand: Command;
}
export interface DynamicStateData {
    likeCountEntityKey: string;
    likeIcon: Icon;
    stateSlideDirection: string;
    stateSlideDurationMs: number;
    stateUpdateDelayBeforeMs: number;
    stateUpdateDelayAfterMs: number;
    likesEmptyStateText: EmptyStateText;
    likedIcon: Icon;
    engagementStateEntityKey: string;
    replyCountEntityKey: string;
    replyIcon: Icon;
    emptyStateText: EmptyStateText;
}
export interface EmptyStateText {
    content: string;
}
export interface LiveChatTickerPaidMessageItemRendererShowItemEndpoint {
    clickTrackingParams: string;
    commandMetadata: ContextMenuEndpointCommandMetadata;
    showLiveChatItemEndpoint: PurpleShowLiveChatItemEndpoint;
}
export interface PurpleShowLiveChatItemEndpoint {
    renderer: PurpleRenderer;
    trackingParams: string;
}
export interface PurpleRenderer {
    liveChatPaidMessageRenderer: LiveChatPaidMessageRenderer;
}
export interface LiveChatTickerSponsorItemRenderer {
    id: string;
    detailText: DetailText;
    detailTextColor: number;
    startBackgroundColor: number;
    endBackgroundColor: number;
    sponsorPhoto: SponsorPhotoClass;
    durationSec: number;
    showItemEndpoint: LiveChatTickerSponsorItemRendererShowItemEndpoint;
    authorExternalChannelId: string;
    fullDurationSec: number;
    trackingParams: string;
}
export interface DetailText {
    accessibility?: ContextMenuAccessibility;
    simpleText?: string;
    runs?: HeaderPrimaryTextRun[];
}
export interface LiveChatTickerSponsorItemRendererShowItemEndpoint {
    clickTrackingParams: string;
    commandMetadata: ContextMenuEndpointCommandMetadata;
    showLiveChatItemEndpoint: FluffyShowLiveChatItemEndpoint;
}
export interface FluffyShowLiveChatItemEndpoint {
    renderer: FluffyRenderer;
    trackingParams: string;
}
export interface FluffyRenderer {
    liveChatMembershipItemRenderer: LiveChatMembershipItemRenderer;
}
export interface LiveChatReportModerationStateCommand {
}
export interface RemoveChatItemAction {
    targetItemId: string;
}
export {};
