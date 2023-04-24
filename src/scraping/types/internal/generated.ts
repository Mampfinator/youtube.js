export interface YtInitialData {
    responseContext: ResponseContext;
    contents: Contents;
    header?: YtInitialDataHeader;
    trackingParams: string;
    topbar: Topbar;
    frameworkUpdates?: FrameworkUpdates;
    metadata?: Metadata;
    microformat?: Microformat;
    estimatedResults?: string;
    targetId?: string;
}

export interface Contents {
    twoColumnBrowseResultsRenderer?: TwoColumnBrowseResultsRenderer;
    twoColumnSearchResultsRenderer?: TwoColumnSearchResultsRenderer;
}

export interface TwoColumnBrowseResultsRenderer {
    tabs: Tab[];
}

export interface Tab {
    tabRenderer?: TabRenderer;
    expandableTabRenderer?: ExpandableTabRenderer;
}

export interface ExpandableTabRenderer {
    endpoint: MoreEndpoint;
    title: string;
    selected: boolean;
}

export interface MoreEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    browseEndpoint: MoreEndpointBrowseEndpoint;
}

export interface MoreEndpointBrowseEndpoint {
    browseId: string;
    params?: string;
    canonicalBaseUrl?: string;
}

export interface MoreEndpointCommandMetadata {
    webCommandMetadata: PurpleWebCommandMetadata;
}

export interface PurpleWebCommandMetadata {
    url: string;
    webPageType: string;
    rootVe: number;
    apiUrl?: string;
}

export interface TabRenderer {
    selected?: boolean;
    content?: TabRendererContent;
    tabIdentifier?: string;
    trackingParams: string;
    endpoint?: MoreEndpoint;
    title?: string;
}

export interface TabRendererContent {
    richGridRenderer?: RichGridRenderer;
    sectionListRenderer?: ContentSectionListRenderer;
}

export interface RichGridRenderer {
    contents: RichGridRendererContent[];
    trackingParams: string;
    header?: RichGridRendererHeader;
    targetId: string;
    reflowOptions?: ReflowOptions;
    style?: string;
}

export interface RichGridRendererContent {
    richItemRenderer?: PurpleRichItemRenderer;
    richSectionRenderer?: RichSectionRenderer;
    continuationItemRenderer?: PurpleContinuationItemRenderer;
}

export interface PurpleContinuationItemRenderer {
    trigger: string;
    continuationEndpoint: ContinuationEndpoint;
    ghostCards?: GhostCards;
}

export interface ContinuationEndpoint {
    clickTrackingParams: string;
    commandMetadata: ContinuationEndpointCommandMetadata;
    continuationCommand: ContinuationEndpointContinuationCommand;
}

export interface ContinuationEndpointCommandMetadata {
    webCommandMetadata: FluffyWebCommandMetadata;
}

export interface FluffyWebCommandMetadata {
    sendPost: boolean;
    apiUrl?: string;
}

export interface ContinuationEndpointContinuationCommand {
    token: string;
    request: string;
}

export interface GhostCards {
    ghostGridRenderer: GhostGridRenderer;
}

export interface GhostGridRenderer {
    rows: number;
}

export interface PurpleRichItemRenderer {
    content: PurpleContent;
    trackingParams: string;
}

export interface PurpleContent {
    videoRenderer?: PurpleVideoRenderer;
    playlistRenderer?: PlaylistRenderer;
    reelItemRenderer?: ItemReelItemRenderer;
}

export interface PlaylistRenderer {
    playlistId: string;
    title: ContentClass;
    thumbnails: Avatar[];
    videoCount: string;
    navigationEndpoint: PlaylistRendererNavigationEndpoint;
    viewPlaylistText: ViewPlaylistText;
    publishedTimeText?: ContentClass;
    videos: Video[];
    videoCountText: ChannelHandleText;
    trackingParams: string;
    thumbnailText: ThumbnailTextClass;
    thumbnailRenderer: ThumbnailRenderer;
    thumbnailOverlays: PlaylistRendererThumbnailOverlay[];
}

export interface PlaylistRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    watchEndpoint: PurpleWatchEndpoint;
}

export interface PurpleWatchEndpoint {
    videoId: string;
    playlistId: string;
    params?: string;
    loggingContext: WatchEndpointLoggingContext;
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export interface WatchEndpointLoggingContext {
    vssLoggingContext: LoggingContext;
}

export interface LoggingContext {
    serializedContextData: string;
}

export interface WatchEndpointSupportedOnesieConfig {
    html5PlaybackOnesieConfig: Html5PlaybackOnesieConfig;
}

export interface Html5PlaybackOnesieConfig {
    commonConfig: CommonConfigElement;
}

export interface CommonConfigElement {
    url: string;
}

export interface ContentClass {
    simpleText: string;
}

export interface PlaylistRendererThumbnailOverlay {
    thumbnailOverlaySidePanelRenderer?: ThumbnailOverlaySidePanelRenderer;
    thumbnailOverlayHoverTextRenderer?: ThumbnailOverlayInlineUnplayableRendererClass;
    thumbnailOverlayNowPlayingRenderer?: ThumbnailOverlayLoadingPreviewRendererClass;
}

export interface ThumbnailOverlayInlineUnplayableRendererClass {
    text: ChannelHandleText;
    icon: MoreIcon;
}

export interface MoreIcon {
    iconType: string;
}

export interface ChannelHandleText {
    runs: ChannelHandleTextRun[];
}

export interface ChannelHandleTextRun {
    text: string;
}

export interface ThumbnailOverlayLoadingPreviewRendererClass {
    text: ChannelHandleText;
}

export interface ThumbnailOverlaySidePanelRenderer {
    text: ContentClass;
    icon: MoreIcon;
}

export interface ThumbnailRenderer {
    playlistVideoThumbnailRenderer: PlaylistVideoThumbnailRenderer;
}

export interface PlaylistVideoThumbnailRenderer {
    thumbnail: Avatar;
    trackingParams: string;
}

export interface Avatar {
    thumbnails: BannerThumbnail[];
}

export interface BannerThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface ThumbnailTextClass {
    runs: ThumbnailTextRun[];
}

export interface ThumbnailTextRun {
    text: string;
    bold?: boolean;
}

export interface Video {
    childVideoRenderer: ChildVideoRenderer;
}

export interface ChildVideoRenderer {
    title: ContentClass;
    navigationEndpoint: PlaylistRendererNavigationEndpoint;
    lengthText: SubscriberCountText;
    videoId: string;
}

export interface SubscriberCountText {
    accessibility: ToggledAccessibilityDataClass;
    simpleText: string;
}

export interface ToggledAccessibilityDataClass {
    accessibilityData: AccessibilityAccessibilityData;
}

export interface AccessibilityAccessibilityData {
    label: string;
}

export interface ViewPlaylistText {
    runs: ViewPlaylistTextRun[];
}

export interface ViewPlaylistTextRun {
    text: string;
    navigationEndpoint: RichShelfRendererEndpoint;
}

export interface RichShelfRendererEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    browseEndpoint: PurpleBrowseEndpoint;
}

export interface PurpleBrowseEndpoint {
    browseId: string;
}

export interface ItemReelItemRenderer {
    videoId: string;
    headline: ContentClass;
    thumbnail: ReelWatchEndpointThumbnail;
    viewCountText: SubscriberCountText;
    navigationEndpoint: ReelItemRendererNavigationEndpoint;
    menu: ButtonClass;
    trackingParams: string;
    accessibility: ToggledAccessibilityDataClass;
    style: string;
    videoType: string;
    loggingDirectives: LoggingDirectives;
}

export interface LoggingDirectives {
    trackingParams: string;
    visibility: Visibility;
    enableDisplayloggerExperiment: boolean;
}

export interface Visibility {
    types: string;
}

export interface ButtonClass {
    menuRenderer: ButtonMenuRenderer;
}

export interface ButtonMenuRenderer {
    items: PurpleItem[];
    trackingParams: string;
    accessibility: ToggledAccessibilityDataClass;
}

export interface PurpleItem {
    menuNavigationItemRenderer: MenuNavigationItemRenderer;
}

export interface MenuNavigationItemRenderer {
    text: ChannelHandleText;
    icon: MoreIcon;
    navigationEndpoint: MenuNavigationItemRendererNavigationEndpoint;
    trackingParams: string;
    accessibility: ToggledAccessibilityDataClass;
}

export interface MenuNavigationItemRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: PurpleCommandMetadata;
    userFeedbackEndpoint: UserFeedbackEndpoint;
}

export interface PurpleCommandMetadata {
    webCommandMetadata: TentacledWebCommandMetadata;
}

export interface TentacledWebCommandMetadata {
    ignoreNavigation: boolean;
}

export interface UserFeedbackEndpoint {
    additionalDatas: AdditionalData[];
}

export interface AdditionalData {
    userFeedbackEndpointProductSpecificValueData: Param;
}

export interface Param {
    key: string;
    value: string;
}

export interface ReelItemRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    reelWatchEndpoint: ReelWatchEndpoint;
}

export interface ReelWatchEndpoint {
    videoId: string;
    playerParams: string;
    thumbnail: ReelWatchEndpointThumbnail;
    overlay: Overlay;
    params: string;
    sequenceProvider: string;
    sequenceParams: string;
    loggingContext: ReelWatchEndpointLoggingContext;
}

export interface ReelWatchEndpointLoggingContext {
    vssLoggingContext: LoggingContext;
    qoeLoggingContext: LoggingContext;
}

export interface Overlay {
    reelPlayerOverlayRenderer: ReelPlayerOverlayRenderer;
}

export interface ReelPlayerOverlayRenderer {
    style: string;
    trackingParams: string;
    reelPlayerNavigationModel: string;
}

export interface ReelWatchEndpointThumbnail {
    thumbnails: BannerThumbnail[];
    isOriginalAspectRatio: boolean;
}

export interface PurpleVideoRenderer {
    videoId: string;
    thumbnail: Avatar;
    title: CollapsedStateButtonTextClass;
    descriptionSnippet: ChannelHandleText;
    longBylineText?: LongBylineTextClass;
    publishedTimeText: ContentClass;
    lengthText: SubscriberCountText;
    viewCountText: ContentClass;
    navigationEndpoint: VideoRendererNavigationEndpoint;
    ownerBadges?: OwnerBadgeElement[];
    ownerText?: LongBylineTextClass;
    shortBylineText?: LongBylineTextClass;
    trackingParams: string;
    showActionMenu: boolean;
    shortViewCountText: SubscriberCountText;
    menu: VideoRendererMenu;
    channelThumbnailSupportedRenderers?: ChannelThumbnailSupportedRenderers;
    thumbnailOverlays: VideoRendererThumbnailOverlay[];
    inlinePlaybackEndpoint?: Endpoint;
}

export interface ChannelThumbnailSupportedRenderers {
    channelThumbnailWithLinkRenderer: ChannelThumbnailWithLinkRenderer;
}

export interface ChannelThumbnailWithLinkRenderer {
    thumbnail: Avatar;
    navigationEndpoint: AuthorEndpointClass;
    accessibility: ToggledAccessibilityDataClass;
}

export interface AuthorEndpointClass {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    browseEndpoint: AuthorEndpointBrowseEndpoint;
}

export interface AuthorEndpointBrowseEndpoint {
    browseId: string;
    canonicalBaseUrl?: string;
}

export interface Endpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    watchEndpoint: InlinePlaybackEndpointWatchEndpoint;
}

export interface InlinePlaybackEndpointWatchEndpoint {
    videoId: string;
    playerParams: string;
    playerExtraUrlParams?: Param[];
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
    params?: string;
}

export interface LongBylineTextClass {
    runs: LongBylineTextRun[];
}

export interface LongBylineTextRun {
    text: string;
    navigationEndpoint: AuthorEndpointClass;
}

export interface VideoRendererMenu {
    menuRenderer: PurpleMenuRenderer;
}

export interface PurpleMenuRenderer {
    items: FluffyItem[];
    trackingParams: string;
    accessibility: ToggledAccessibilityDataClass;
    targetId?: string;
}

export interface FluffyItem {
    menuServiceItemRenderer: PurpleMenuServiceItemRenderer;
}

export interface PurpleMenuServiceItemRenderer {
    text: ChannelHandleText;
    icon: MoreIcon;
    serviceEndpoint: UntoggledServiceEndpointClass;
    trackingParams: string;
    hasSeparator?: boolean;
}

export interface UntoggledServiceEndpointClass {
    clickTrackingParams: string;
    commandMetadata: ContinuationEndpointCommandMetadata;
    signalServiceEndpoint?: UntoggledServiceEndpointSignalServiceEndpoint;
    shareEntityServiceEndpoint?: ShareEntityServiceEndpoint;
    playlistEditEndpoint?: UntoggledServiceEndpointPlaylistEditEndpoint;
}

export interface UntoggledServiceEndpointPlaylistEditEndpoint {
    playlistId: string;
    actions: PurpleAction[];
}

export interface PurpleAction {
    addedVideoId: string;
    action: string;
}

export interface ShareEntityServiceEndpoint {
    serializedShareEntity: string;
    commands: ShareEntityServiceEndpointCommand[];
}

export interface ShareEntityServiceEndpointCommand {
    clickTrackingParams: string;
    openPopupAction: CommandOpenPopupAction;
}

export interface CommandOpenPopupAction {
    popup: PurplePopup;
    popupType: string;
    beReused: boolean;
}

export interface PurplePopup {
    unifiedSharePanelRenderer: UnifiedSharePanelRenderer;
}

export interface UnifiedSharePanelRenderer {
    trackingParams: string;
    showLoadingSpinner: boolean;
}

export interface UntoggledServiceEndpointSignalServiceEndpoint {
    signal: string;
    actions: FluffyAction[];
}

export interface FluffyAction {
    clickTrackingParams: string;
    addToPlaylistCommand: AddToPlaylistCommand;
}

export interface AddToPlaylistCommand {
    openMiniplayer: boolean;
    videoId: string;
    listType: string;
    onCreateListCommand: OnCreateListCommand;
    videoIds: string[];
}

export interface OnCreateListCommand {
    clickTrackingParams: string;
    commandMetadata: ContinuationEndpointCommandMetadata;
    createPlaylistServiceEndpoint: CreatePlaylistServiceEndpoint;
}

export interface CreatePlaylistServiceEndpoint {
    videoIds: string[];
    params: string;
}

export interface VideoRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    watchEndpoint: FluffyWatchEndpoint;
}

export interface FluffyWatchEndpoint {
    videoId: string;
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export interface OwnerBadgeElement {
    metadataBadgeRenderer: OwnerBadgeMetadataBadgeRenderer;
}

export interface OwnerBadgeMetadataBadgeRenderer {
    icon: MoreIcon;
    style: string;
    tooltip: string;
    trackingParams: string;
    accessibilityData: AccessibilityAccessibilityData;
}

export interface VideoRendererThumbnailOverlay {
    thumbnailOverlayTimeStatusRenderer?: ThumbnailOverlayTimeStatusRenderer;
    thumbnailOverlayToggleButtonRenderer?: ThumbnailOverlayToggleButtonRenderer;
    thumbnailOverlayNowPlayingRenderer?: ThumbnailOverlayLoadingPreviewRendererClass;
    thumbnailOverlayLoadingPreviewRenderer?: ThumbnailOverlayLoadingPreviewRendererClass;
    thumbnailOverlayInlineUnplayableRenderer?: ThumbnailOverlayInlineUnplayableRendererClass;
}

export interface ThumbnailOverlayTimeStatusRenderer {
    text: SubscriberCountText;
    style: string;
}

export interface ThumbnailOverlayToggleButtonRenderer {
    isToggled?: boolean;
    untoggledIcon: MoreIcon;
    toggledIcon: MoreIcon;
    untoggledTooltip: string;
    toggledTooltip: string;
    untoggledServiceEndpoint: UntoggledServiceEndpointClass;
    toggledServiceEndpoint?: ToggledServiceEndpoint;
    untoggledAccessibility: ToggledAccessibilityDataClass;
    toggledAccessibility: ToggledAccessibilityDataClass;
    trackingParams: string;
}

export interface ToggledServiceEndpoint {
    clickTrackingParams: string;
    commandMetadata: ContinuationEndpointCommandMetadata;
    playlistEditEndpoint: ToggledServiceEndpointPlaylistEditEndpoint;
}

export interface ToggledServiceEndpointPlaylistEditEndpoint {
    playlistId: string;
    actions: TentacledAction[];
}

export interface TentacledAction {
    action: string;
    removedVideoId: string;
}

export interface CollapsedStateButtonTextClass {
    runs: ChannelHandleTextRun[];
    accessibility: ToggledAccessibilityDataClass;
}

export interface RichSectionRenderer {
    content: RichSectionRendererContent;
    trackingParams: string;
    fullBleed: boolean;
}

export interface RichSectionRendererContent {
    richShelfRenderer: RichShelfRenderer;
}

export interface RichShelfRenderer {
    title: ChannelHandleText;
    contents: RichShelfRendererContent[];
    trackingParams: string;
    showMoreButton: ShowMoreButtonClass;
    icon?: MoreIcon;
    endpoint?: RichShelfRendererEndpoint;
}

export interface RichShelfRendererContent {
    richItemRenderer: FluffyRichItemRenderer;
}

export interface FluffyRichItemRenderer {
    content: FluffyContent;
    trackingParams: string;
}

export interface FluffyContent {
    reelItemRenderer?: PurpleReelItemRenderer;
    videoRenderer?: PurpleVideoRenderer;
}

export interface PurpleReelItemRenderer {
    videoId: string;
    headline: ContentClass;
    thumbnail: ReelWatchEndpointThumbnail;
    viewCountText: SubscriberCountText;
    navigationEndpoint: ReelItemRendererNavigationEndpoint;
    menu: PurpleMenu;
    trackingParams: string;
    accessibility: ToggledAccessibilityDataClass;
    style: string;
    videoType: string;
    loggingDirectives: LoggingDirectives;
}

export interface PurpleMenu {
    menuRenderer: FluffyMenuRenderer;
}

export interface FluffyMenuRenderer {
    items: TentacledItem[];
    trackingParams: string;
    accessibility: ToggledAccessibilityDataClass;
}

export interface TentacledItem {
    menuServiceItemRenderer?: FluffyMenuServiceItemRenderer;
    menuNavigationItemRenderer?: MenuNavigationItemRenderer;
}

export interface FluffyMenuServiceItemRenderer {
    text: ChannelHandleText;
    icon: MoreIcon;
    serviceEndpoint: CommandClass;
    trackingParams: string;
    accessibility: ToggledAccessibilityDataClass;
    hasSeparator: boolean;
}

export interface CommandClass {
    clickTrackingParams: string;
    commandMetadata?: ContinuationEndpointCommandMetadata;
    shareEntityServiceEndpoint?: ShareEntityServiceEndpoint;
    copyTextEndpoint?: CopyTextEndpoint;
}

export interface CopyTextEndpoint {
    text: string;
    successActions: SuccessAction[];
}

export interface SuccessAction {
    clickTrackingParams: string;
    commandMetadata: SuccessActionCommandMetadata;
    signalServiceEndpoint: SuccessActionSignalServiceEndpoint;
}

export interface SuccessActionCommandMetadata {
    webCommandMetadata: StickyWebCommandMetadata;
}

export interface StickyWebCommandMetadata {
    sendPost: boolean;
}

export interface SuccessActionSignalServiceEndpoint {
    signal: string;
    actions: StickyAction[];
}

export interface StickyAction {
    clickTrackingParams: string;
    openPopupAction: PurpleOpenPopupAction;
}

export interface PurpleOpenPopupAction {
    popup: FluffyPopup;
    popupType: string;
}

export interface FluffyPopup {
    notificationActionRenderer: NotificationActionRenderer;
}

export interface NotificationActionRenderer {
    responseText: ChannelHandleText;
    trackingParams: string;
}

export interface ShowMoreButtonClass {
    buttonRenderer: ShowMoreButtonButtonRenderer;
}

export interface ShowMoreButtonButtonRenderer {
    style: string;
    size: string;
    icon: MoreIcon;
    accessibility?: AccessibilityAccessibilityData;
    tooltip?: string;
    trackingParams: string;
    isDisabled?: boolean;
}

export interface RichGridRendererHeader {
    feedFilterChipBarRenderer: FeedFilterChipBarRenderer;
}

export interface FeedFilterChipBarRenderer {
    contents: FeedFilterChipBarRendererContent[];
    trackingParams: string;
    nextButton?: ClearButtonClass;
    previousButton?: ClearButtonClass;
    styleType: string;
}

export interface FeedFilterChipBarRendererContent {
    chipCloudChipRenderer: ChipCloudChipRenderer;
}

export interface ChipCloudChipRenderer {
    style?: ToggledStyleClass;
    text: Text;
    trackingParams: string;
    isSelected?: boolean;
    navigationEndpoint?: ChipCloudChipRendererNavigationEndpoint;
    targetId?: string;
}

export interface ChipCloudChipRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: ContinuationEndpointCommandMetadata;
    continuationCommand: NavigationEndpointContinuationCommand;
}

export interface NavigationEndpointContinuationCommand {
    token: string;
    request: string;
    command: ContinuationCommandCommand;
}

export interface ContinuationCommandCommand {
    clickTrackingParams: string;
    showReloadUiCommand: ShowReloadUICommand;
}

export interface ShowReloadUICommand {
    targetId: string;
}

export interface ToggledStyleClass {
    styleType: string;
}

export interface Text {
    runs?: ChannelHandleTextRun[];
    simpleText?: string;
}

export interface ClearButtonClass {
    buttonRenderer: ClearButtonButtonRenderer;
}

export interface ClearButtonButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    icon: MoreIcon;
    tooltip?: string;
    trackingParams: string;
    accessibilityData: ToggledAccessibilityDataClass;
}

export interface ReflowOptions {
    minimumRowsOfVideosAtStart: number;
    minimumRowsOfVideosBetweenSections: number;
}

export interface ContentSectionListRenderer {
    contents: TentacledContent[];
    trackingParams: string;
    targetId?: string;
    disablePullToRefresh: boolean;
    subMenu?: PurpleSubMenu;
}

export interface TentacledContent {
    itemSectionRenderer: PurpleItemSectionRenderer;
}

export interface PurpleItemSectionRenderer {
    contents: StickyContent[];
    trackingParams: string;
    header?: ItemSectionRendererHeader;
    sectionIdentifier?: string;
    targetId?: string;
}

export interface StickyContent {
    channelVideoPlayerRenderer?: ChannelVideoPlayerRenderer;
    shelfRenderer?: PurpleShelfRenderer;
    reelShelfRenderer?: ReelShelfRenderer;
    recognitionShelfRenderer?: RecognitionShelfRenderer;
    backstagePostThreadRenderer?: BackstagePostThreadRenderer;
    continuationItemRenderer?: ItemContinuationItemRenderer;
    gridRenderer?: GridRenderer;
    channelAboutFullMetadataRenderer?: ChannelAboutFullMetadataRenderer;
}

export interface BackstagePostThreadRenderer {
    post: Post;
    trackingParams: string;
    loggingDirectives: LoggingDirectives;
}

export interface Post {
    backstagePostRenderer?: PostBackstagePostRenderer;
    sharedPostRenderer?: SharedPostRenderer;
}

export interface PostBackstagePostRenderer {
    postId: string;
    authorText: AuthorText;
    authorThumbnail: AuthorThumbnailClass;
    authorEndpoint: AuthorEndpointClass;
    contentText: PurpleContentText;
    expandButton: BackstagePostRendererCollapseButton;
    collapseButton: BackstagePostRendererCollapseButton;
    publishedTimeText: BackstagePostRendererTitle;
    voteCount: SubscriberCountText;
    voteStatus: string;
    actionButtons: ActionButtons;
    trackingParams: string;
    surface: string;
    loggingDirectives: LoggingDirectives;
    backstageAttachment?: PurpleBackstageAttachment;
}

export interface ActionButtons {
    commentActionButtonsRenderer: CommentActionButtonsRenderer;
}

export interface CommentActionButtonsRenderer {
    likeButton: DislikeButtonClass;
    replyButton?: ReplyButton;
    dislikeButton: DislikeButtonClass;
    trackingParams: string;
    style: string;
}

export interface DislikeButtonClass {
    toggleButtonRenderer: ToggleButtonRenderer;
}

export interface ToggleButtonRenderer {
    style: ToggledStyleClass;
    size?: Size;
    isToggled: boolean;
    isDisabled: boolean;
    defaultIcon: MoreIcon;
    accessibility: AccessibilityAccessibilityData;
    trackingParams: string;
    defaultTooltip: string;
    toggledTooltip: string;
    toggledStyle: ToggledStyleClass;
    defaultNavigationEndpoint?: DefaultNavigationEndpoint;
    accessibilityData: ToggledAccessibilityDataClass;
    toggledAccessibilityData?: ToggledAccessibilityDataClass;
    defaultText?: ChannelHandleText;
}

export interface DefaultNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    signInEndpoint: DefaultNavigationEndpointSignInEndpoint;
}

export interface DefaultNavigationEndpointSignInEndpoint {
    nextEndpoint: RichShelfRendererEndpoint;
}

export interface Size {
    sizeType: string;
}

export interface ReplyButton {
    buttonRenderer: ReplyButtonButtonRenderer;
}

export interface ReplyButtonButtonRenderer {
    style: string;
    size: string;
    text: SubscriberCountText;
    icon: MoreIcon;
    navigationEndpoint: MoreEndpoint;
    accessibility: AccessibilityAccessibilityData;
    tooltip: string;
    trackingParams: string;
    hint: Hint;
    accessibilityData: ToggledAccessibilityDataClass;
}

export interface Hint {
    hintRenderer: HintRenderer;
}

export interface HintRenderer {
    hintId: string;
    content: HintRendererContent;
    hintCap: HintCap;
    suggestedPosition: SuggestedPositionClass;
    trackingParams: string;
}

export interface HintRendererContent {
    bubbleHintRenderer: BubbleHintRenderer;
}

export interface BubbleHintRenderer {
    trackingParams: string;
    accessibility: AccessibilityAccessibilityData;
    detailsText: SubscriberCountText;
    isVisible: boolean;
    style: string;
}

export interface HintCap {
    impressionCap: string;
}

export interface SuggestedPositionClass {
    type: string;
}

export interface AuthorText {
    runs: LongBylineTextRun[];
    accessibility: ToggledAccessibilityDataClass;
}

export interface AuthorThumbnailClass {
    thumbnails: BannerThumbnail[];
    accessibility: ToggledAccessibilityDataClass;
}

export interface PurpleBackstageAttachment {
    backstageImageRenderer: BackstageAttachmentBackstageImageRenderer;
}

export interface BackstageAttachmentBackstageImageRenderer {
    image: Avatar;
    trackingParams: string;
    command: MoreEndpoint;
    accessibility: ToggledAccessibilityDataClass;
}

export interface BackstagePostRendererCollapseButton {
    buttonRenderer: PurpleButtonRenderer;
}

export interface PurpleButtonRenderer {
    style: string;
    size: string;
    text: SubscriberCountText;
    accessibility: AccessibilityAccessibilityData;
    trackingParams: string;
}

export interface PurpleContentText {
    runs: PurpleRun[];
}

export interface PurpleRun {
    text: string;
    navigationEndpoint?: PurpleNavigationEndpoint;
    loggingDirectives?: LoggingDirectives;
}

export interface PurpleNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    urlEndpoint?: URLEndpoint;
    browseEndpoint?: AuthorEndpointBrowseEndpoint;
}

export interface URLEndpoint {
    url: string;
    target?: string;
    nofollow: boolean;
}

export interface BackstagePostRendererTitle {
    runs: FluffyRun[];
}

export interface FluffyRun {
    text: string;
    navigationEndpoint: MoreEndpoint;
}

export interface SharedPostRenderer {
    displayName: AuthorText;
    thumbnail: AuthorThumbnailClass;
    endpoint: AuthorEndpointClass;
    content: ChannelHandleText;
    publishedTimeText: BackstagePostRendererTitle;
    actionMenu: ActionMenu;
    originalPost: OriginalPost;
    trackingParams: string;
    postId: string;
    navigationEndpoint: MoreEndpoint;
    showFullContentText: boolean;
}

export interface ActionMenu {
    menuRenderer: ActionMenuMenuRenderer;
}

export interface ActionMenuMenuRenderer {
    trackingParams: string;
}

export interface OriginalPost {
    backstagePostRenderer: OriginalPostBackstagePostRenderer;
}

export interface OriginalPostBackstagePostRenderer {
    postId: string;
    authorText: AuthorText;
    authorThumbnail: AuthorThumbnailClass;
    authorEndpoint: AuthorEndpointClass;
    contentText: FluffyContentText;
    backstageAttachment: FluffyBackstageAttachment;
    expandButton: BackstagePostRendererCollapseButton;
    collapseButton: BackstagePostRendererCollapseButton;
    publishedTimeText: BackstagePostRendererTitle;
    voteCount: SubscriberCountText;
    voteStatus: string;
    actionButtons: ActionButtons;
    trackingParams: string;
    surface: string;
    loggingDirectives: LoggingDirectives;
}

export interface FluffyBackstageAttachment {
    postMultiImageRenderer: PostMultiImageRenderer;
}

export interface PostMultiImageRenderer {
    images: Image[];
}

export interface Image {
    backstageImageRenderer: ImageBackstageImageRenderer;
}

export interface ImageBackstageImageRenderer {
    image: Avatar;
    trackingParams: string;
    icon: MoreIcon;
}

export interface FluffyContentText {
    runs: TentacledRun[];
}

export interface TentacledRun {
    text: string;
    navigationEndpoint?: FluffyNavigationEndpoint;
    loggingDirectives?: LoggingDirectives;
}

export interface FluffyNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    browseEndpoint?: FluffyBrowseEndpoint;
    urlEndpoint?: URLEndpoint;
}

export interface FluffyBrowseEndpoint {
    browseId: string;
    params: string;
}

export interface ChannelAboutFullMetadataRenderer {
    description: ContentClass;
    primaryLinks: AryLink[];
    viewCountText: ContentClass;
    joinedDateText: ChannelHandleText;
    canonicalChannelUrl: string;
    bypassBusinessEmailCaptcha: boolean;
    title: ContentClass;
    avatar: Avatar;
    country: ContentClass;
    showDescription: boolean;
    businessEmailLabel: ChannelHandleText;
    descriptionLabel: ChannelHandleText;
    detailsLabel: ChannelHandleText;
    primaryLinksLabel: ChannelHandleText;
    statsLabel: ChannelHandleText;
    countryLabel: CountryLabel;
    actionButtons: ActionButton[];
    channelId: string;
    signInForBusinessEmail: SignInForBusinessEmail;
    onBusinessEmailRevealClickCommand: OnBusinessEmailRevealClickCommand;
}

export interface ActionButton {
    buttonRenderer: ActionButtonButtonRenderer;
}

export interface ActionButtonButtonRenderer {
    icon: MoreIcon;
    tooltip: string;
    trackingParams: string;
    accessibilityData: ToggledAccessibilityDataClass;
    command: PurpleCommand;
}

export interface PurpleCommand {
    clickTrackingParams: string;
    commandMetadata: SuccessActionCommandMetadata;
    signalServiceEndpoint: PurpleSignalServiceEndpoint;
}

export interface PurpleSignalServiceEndpoint {
    signal: string;
    actions: IndigoAction[];
}

export interface IndigoAction {
    clickTrackingParams: string;
    openPopupAction: FluffyOpenPopupAction;
}

export interface FluffyOpenPopupAction {
    popup: TentacledPopup;
    popupType: string;
}

export interface TentacledPopup {
    menuPopupRenderer: MenuPopupRenderer;
}

export interface MenuPopupRenderer {
    items: MenuPopupRendererItem[];
}

export interface MenuPopupRendererItem {
    menuServiceItemRenderer: TentacledMenuServiceItemRenderer;
}

export interface TentacledMenuServiceItemRenderer {
    text: ChannelHandleText;
    trackingParams: string;
    command: CommandClass;
}

export interface CountryLabel {
    runs: CountryLabelRun[];
}

export interface CountryLabelRun {
    text: string;
    deemphasize: boolean;
}

export interface OnBusinessEmailRevealClickCommand {
    clickTrackingParams: string;
    commandMetadata: ContinuationEndpointCommandMetadata;
    revealBusinessEmailCommand: RevealBusinessEmailCommand;
}

export interface RevealBusinessEmailCommand {}

export interface AryLink {
    navigationEndpoint: SecondaryLinkNavigationEndpoint;
    icon: Icon;
    title: ContentClass;
    trackingParams?: string;
}

export interface Icon {
    thumbnails: CommonConfigElement[];
}

export interface SecondaryLinkNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    urlEndpoint: URLEndpoint;
}

export interface SignInForBusinessEmail {
    runs: SignInForBusinessEmailRun[];
}

export interface SignInForBusinessEmailRun {
    text: string;
    navigationEndpoint?: TentacledNavigationEndpoint;
}

export interface TentacledNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    signInEndpoint: PurpleSignInEndpoint;
}

export interface PurpleSignInEndpoint {
    nextEndpoint: MoreEndpoint;
}

export interface ChannelVideoPlayerRenderer {
    videoId: string;
    title: PurpleTitle;
    description: Description;
    viewCountText: ContentClass;
    publishedTimeText: ChannelHandleText;
    readMoreText: ReadMoreText;
}

export interface Description {
    runs: DescriptionRun[];
}

export interface DescriptionRun {
    text: string;
    navigationEndpoint?: StickyNavigationEndpoint;
}

export interface StickyNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    browseEndpoint?: MoreEndpointBrowseEndpoint;
    urlEndpoint?: URLEndpoint;
}

export interface ReadMoreText {
    runs: ReadMoreTextRun[];
}

export interface ReadMoreTextRun {
    text: string;
    navigationEndpoint: VideoRendererNavigationEndpoint;
}

export interface PurpleTitle {
    runs: ReadMoreTextRun[];
    accessibility: ToggledAccessibilityDataClass;
}

export interface ItemContinuationItemRenderer {
    trigger: string;
    continuationEndpoint: ContinuationEndpoint;
}

export interface GridRenderer {
    items: GridRendererItem[];
    trackingParams: string;
    targetId: string;
}

export interface GridRendererItem {
    gridChannelRenderer?: GridChannelRenderer;
    continuationItemRenderer?: ItemContinuationItemRenderer;
    gridPlaylistRenderer?: GridPlaylistRenderer;
}

export interface GridChannelRenderer {
    channelId: string;
    thumbnail: Avatar;
    videoCountText: ChannelHandleText;
    subscriberCountText: SubscriberCountText;
    navigationEndpoint: AuthorEndpointClass;
    title: ContentClass;
    subscribeButton: A11YSkipNavigationButtonClass;
    ownerBadges?: OwnerBadgeElement[];
    trackingParams: string;
}

export interface A11YSkipNavigationButtonClass {
    buttonRenderer: A11YSkipNavigationButtonButtonRenderer;
}

export interface A11YSkipNavigationButtonButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ChannelHandleText;
    navigationEndpoint?: IndigoNavigationEndpoint;
    trackingParams: string;
    command?: FluffyCommand;
}

export interface FluffyCommand {
    clickTrackingParams: string;
    commandMetadata: SuccessActionCommandMetadata;
    signalServiceEndpoint: FluffySignalServiceEndpoint;
}

export interface FluffySignalServiceEndpoint {
    signal: string;
    actions: IndecentAction[];
}

export interface IndecentAction {
    clickTrackingParams: string;
    signalAction: SignalAction;
}

export interface SignalAction {
    signal: string;
}

export interface IndigoNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: PurpleCommandMetadata;
    modalEndpoint: PurpleModalEndpoint;
}

export interface PurpleModalEndpoint {
    modal: PurpleModal;
}

export interface PurpleModal {
    modalWithTitleAndButtonRenderer: PurpleModalWithTitleAndButtonRenderer;
}

export interface PurpleModalWithTitleAndButtonRenderer {
    title: ContentClass;
    content: ContentClass;
    button: PurpleButton;
}

export interface PurpleButton {
    buttonRenderer: FluffyButtonRenderer;
}

export interface FluffyButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ContentClass;
    navigationEndpoint: IndecentNavigationEndpoint;
    trackingParams: string;
}

export interface IndecentNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    signInEndpoint: FluffySignInEndpoint;
}

export interface FluffySignInEndpoint {
    nextEndpoint: AuthorEndpointClass;
    continueAction: string;
    idamTag: string;
}

export interface GridPlaylistRenderer {
    playlistId: string;
    thumbnail: Avatar;
    title: FluffyTitle;
    videoCountText: ChannelHandleText;
    navigationEndpoint: PlaylistRendererNavigationEndpoint;
    publishedTimeText?: ContentClass;
    videoCountShortText: ContentClass;
    trackingParams: string;
    sidebarThumbnails?: Avatar[];
    thumbnailText: ThumbnailTextClass;
    ownerBadges: OwnerBadgeElement[];
    thumbnailRenderer: ThumbnailRenderer;
    thumbnailOverlays: PlaylistRendererThumbnailOverlay[];
    viewPlaylistText: ViewPlaylistText;
}

export interface FluffyTitle {
    runs: StickyRun[];
}

export interface StickyRun {
    text: string;
    navigationEndpoint: PlaylistRendererNavigationEndpoint;
}

export interface RecognitionShelfRenderer {
    title: ContentClass;
    subtitle: ContentClass;
    avatars: Icon[];
    button: SponsorButtonClass;
    surface: string;
}

export interface SponsorButtonClass {
    buttonRenderer: SponsorButtonButtonRenderer;
}

export interface SponsorButtonButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ChannelHandleText;
    navigationEndpoint: HilariousNavigationEndpoint;
    trackingParams: string;
    accessibilityData: ToggledAccessibilityDataClass;
    targetId: string;
}

export interface HilariousNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: PurpleCommandMetadata;
    modalEndpoint: FluffyModalEndpoint;
}

export interface FluffyModalEndpoint {
    modal: FluffyModal;
}

export interface FluffyModal {
    modalWithTitleAndButtonRenderer: FluffyModalWithTitleAndButtonRenderer;
}

export interface FluffyModalWithTitleAndButtonRenderer {
    title: ChannelHandleText;
    content: ChannelHandleText;
    button: FluffyButton;
}

export interface FluffyButton {
    buttonRenderer: TentacledButtonRenderer;
}

export interface TentacledButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ContentClass;
    navigationEndpoint: AmbitiousNavigationEndpoint;
    trackingParams: string;
}

export interface AmbitiousNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    signInEndpoint: TentacledSignInEndpoint;
}

export interface TentacledSignInEndpoint {
    hack: boolean;
}

export interface ReelShelfRenderer {
    title: ChannelHandleText;
    button: ButtonClass;
    items: ReelShelfRendererItem[];
    trackingParams: string;
    icon: MoreIcon;
}

export interface ReelShelfRendererItem {
    reelItemRenderer: ItemReelItemRenderer;
}

export interface PurpleShelfRenderer {
    title: BackstagePostRendererTitle;
    endpoint: MoreEndpoint;
    content: IndigoContent;
    trackingParams: string;
    playAllButton?: AboutTheseResultsButtonClass;
}

export interface IndigoContent {
    horizontalListRenderer?: HorizontalListRenderer;
    expandedShelfContentsRenderer?: ExpandedShelfContentsRenderer;
}

export interface ExpandedShelfContentsRenderer {
    items: ExpandedShelfContentsRendererItem[];
    showMoreText: ChannelHandleText;
}

export interface ExpandedShelfContentsRendererItem {
    channelRenderer: ChannelRenderer;
}

export interface ChannelRenderer {
    channelId: string;
    title: ContentClass;
    navigationEndpoint: AuthorEndpointClass;
    thumbnail: Avatar;
    descriptionSnippet: ChannelHandleText;
    shortBylineText: LongBylineTextClass;
    videoCountText: ChannelHandleText;
    subscriptionButton: SubscriptionButton;
    subscriberCountText: SubscriberCountText;
    subscribeButton: DismissButtonClass;
    trackingParams: string;
    longBylineText: LongBylineTextClass;
}

export interface DismissButtonClass {
    buttonRenderer: DismissButtonButtonRenderer;
}

export interface DismissButtonButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ChannelHandleText;
    navigationEndpoint?: CunningNavigationEndpoint;
    trackingParams: string;
}

export interface CunningNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: PurpleCommandMetadata;
    modalEndpoint: TentacledModalEndpoint;
}

export interface TentacledModalEndpoint {
    modal: TentacledModal;
}

export interface TentacledModal {
    modalWithTitleAndButtonRenderer: TentacledModalWithTitleAndButtonRenderer;
}

export interface TentacledModalWithTitleAndButtonRenderer {
    title: ContentClass;
    content: ContentClass;
    button: TentacledButton;
}

export interface TentacledButton {
    buttonRenderer: StickyButtonRenderer;
}

export interface StickyButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ContentClass;
    navigationEndpoint: MagentaNavigationEndpoint;
    trackingParams: string;
}

export interface MagentaNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    signInEndpoint: StickySignInEndpoint;
}

export interface StickySignInEndpoint {
    nextEndpoint: NextEndpoint;
    continueAction: string;
    idamTag: string;
}

export interface NextEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    browseEndpoint: FluffyBrowseEndpoint;
}

export interface SubscriptionButton {
    subscribed: boolean;
}

export interface HorizontalListRenderer {
    items: HorizontalListRendererItem[];
    trackingParams: string;
    visibleItemCount: number;
    nextButton: ShowMoreButtonClass;
    previousButton: ShowMoreButtonClass;
    collapsedItemCount?: number;
}

export interface HorizontalListRendererItem {
    gridVideoRenderer?: GridVideoRenderer;
    gridPlaylistRenderer?: GridPlaylistRenderer;
    gridChannelRenderer?: GridChannelRenderer;
}

export interface GridVideoRenderer {
    videoId: string;
    thumbnail: Avatar;
    title: SubscriberCountText;
    publishedTimeText: ContentClass;
    viewCountText: ContentClass;
    navigationEndpoint: VideoRendererNavigationEndpoint;
    shortBylineText?: LongBylineTextClass;
    ownerBadges: OwnerBadgeElement[];
    trackingParams: string;
    shortViewCountText: SubscriberCountText;
    menu: VideoRendererMenu;
    thumbnailOverlays: VideoRendererThumbnailOverlay[];
}

export interface AboutTheseResultsButtonClass {
    buttonRenderer: AboutTheseResultsButtonButtonRenderer;
}

export interface AboutTheseResultsButtonButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ChannelHandleText;
    icon: MoreIcon;
    navigationEndpoint?: PlaylistRendererNavigationEndpoint;
    trackingParams: string;
    iconPosition?: string;
}

export interface ItemSectionRendererHeader {
    commentsHeaderRenderer: CommentsHeaderRenderer;
}

export interface CommentsHeaderRenderer {
    isBackstageContent: boolean;
    trackingParams: string;
}

export interface PurpleSubMenu {
    channelSubMenuRenderer: ChannelSubMenuRenderer;
}

export interface ChannelSubMenuRenderer {
    contentTypeSubMenuItems: ExpandableTabRenderer[];
    sortSetting?: SortSetting;
}

export interface SortSetting {
    sortFilterSubMenuRenderer: SortFilterSubMenuRenderer;
}

export interface SortFilterSubMenuRenderer {
    subMenuItems: SubMenuItem[];
    title: string;
    icon: MoreIcon;
    accessibility: ToggledAccessibilityDataClass;
    trackingParams: string;
}

export interface SubMenuItem {
    title: string;
    selected: boolean;
    navigationEndpoint: MoreEndpoint;
    trackingParams: string;
}

export interface TwoColumnSearchResultsRenderer {
    primaryContents: PrimaryContents;
}

export interface PrimaryContents {
    sectionListRenderer: PrimaryContentsSectionListRenderer;
}

export interface PrimaryContentsSectionListRenderer {
    contents: IndecentContent[];
    trackingParams: string;
    subMenu: FluffySubMenu;
    hideBottomSeparator: boolean;
    targetId: string;
}

export interface IndecentContent {
    itemSectionRenderer?: FluffyItemSectionRenderer;
    continuationItemRenderer?: ItemContinuationItemRenderer;
}

export interface FluffyItemSectionRenderer {
    contents: HilariousContent[];
    trackingParams: string;
}

export interface HilariousContent {
    videoRenderer?: ItemVideoRenderer;
    shelfRenderer?: FluffyShelfRenderer;
}

export interface FluffyShelfRenderer {
    title: ContentClass;
    content: AmbitiousContent;
    trackingParams: string;
}

export interface AmbitiousContent {
    verticalListRenderer: VerticalListRenderer;
}

export interface VerticalListRenderer {
    items: VerticalListRendererItem[];
    collapsedItemCount: number;
    collapsedStateButtonText: CollapsedStateButtonTextClass;
    trackingParams: string;
}

export interface VerticalListRendererItem {
    videoRenderer: ItemVideoRenderer;
}

export interface ItemVideoRenderer {
    videoId: string;
    thumbnail: Avatar;
    title: CollapsedStateButtonTextClass;
    longBylineText: LongBylineTextClass;
    publishedTimeText: ContentClass;
    lengthText: SubscriberCountText;
    viewCountText: ContentClass;
    navigationEndpoint: Endpoint;
    badges?: PurpleBadge[];
    ownerBadges?: OwnerBadgeElement[];
    ownerText: LongBylineTextClass;
    shortBylineText: LongBylineTextClass;
    trackingParams: string;
    showActionMenu: boolean;
    shortViewCountText: SubscriberCountText;
    menu: VideoRendererMenu;
    channelThumbnailSupportedRenderers: ChannelThumbnailSupportedRenderers;
    thumbnailOverlays: VideoRendererThumbnailOverlay[];
    detailedMetadataSnippets: DetailedMetadataSnippet[];
    inlinePlaybackEndpoint?: Endpoint;
    searchVideoResultEntityKey: string;
    expandableMetadata?: ExpandableMetadata;
}

export interface PurpleBadge {
    metadataBadgeRenderer: PurpleMetadataBadgeRenderer;
}

export interface PurpleMetadataBadgeRenderer {
    style: string;
    label: string;
    trackingParams: string;
    accessibilityData?: AccessibilityAccessibilityData;
}

export interface DetailedMetadataSnippet {
    snippetText: ThumbnailTextClass;
    snippetHoverText: ChannelHandleText;
    maxOneLine: boolean;
}

export interface ExpandableMetadata {
    expandableMetadataRenderer: ExpandableMetadataRenderer;
}

export interface ExpandableMetadataRenderer {
    header: ExpandableMetadataRendererHeader;
    expandedContent: ExpandedContent;
    expandButton: ClearButtonClass;
    collapseButton: ClearButtonClass;
    trackingParams: string;
    colorData: ColorData;
    useCustomColors: boolean;
    loggingDirectives: LoggingDirectives;
}

export interface ColorData {
    lightColorPalette: ColorPalette;
    darkColorPalette: ColorPalette;
    vibrantColorPalette: ColorPalette;
}

export interface ColorPalette {
    section1Color: number;
    section2Color: number;
    section3Color: number;
    primaryTitleColor: number;
    secondaryTitleColor: number;
    iconActivatedColor: number;
    iconInactiveColor: number;
    section4Color: number;
    iconDisabledColor: number;
}

export interface ExpandedContent {
    horizontalCardListRenderer: HorizontalCardListRenderer;
}

export interface HorizontalCardListRenderer {
    cards: Card[];
    trackingParams: string;
    style: SuggestedPositionClass;
    previousButton: ShowMoreButtonClass;
    nextButton: ShowMoreButtonClass;
}

export interface Card {
    macroMarkersListItemRenderer: MacroMarkersListItemRenderer;
}

export interface MacroMarkersListItemRenderer {
    title: ContentClass;
    timeDescription: ContentClass;
    thumbnail: Avatar;
    onTap: OnTap;
    trackingParams: string;
    layout: string;
    isHighlighted: boolean;
}

export interface OnTap {
    clickTrackingParams: string;
    commandExecutorCommand?: CommandExecutorCommand;
    commandMetadata?: MoreEndpointCommandMetadata;
    watchEndpoint?: CommandWatchEndpoint;
}

export interface CommandExecutorCommand {
    commands: CommandExecutorCommandCommand[];
}

export interface CommandExecutorCommandCommand {
    clickTrackingParams: string;
    commandMetadata?: MoreEndpointCommandMetadata;
    watchEndpoint?: CommandWatchEndpoint;
    entityUpdateCommand?: EntityUpdateCommand;
}

export interface EntityUpdateCommand {
    entityBatchUpdate: EntityUpdateCommandEntityBatchUpdate;
}

export interface EntityUpdateCommandEntityBatchUpdate {
    mutations: PurpleMutation[];
}

export interface PurpleMutation {
    entityKey: string;
    type: string;
    payload: Payload;
}

export interface Payload {
    markersVisibilityOverrideEntity: MarkersVisibilityOverrideEntity;
}

export interface MarkersVisibilityOverrideEntity {
    key: string;
    videoId: string;
    visibilityOverrideMarkersKey: string[];
}

export interface CommandWatchEndpoint {
    videoId: string;
    startTimeSeconds?: number;
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export interface ExpandableMetadataRendererHeader {
    collapsedTitle: ContentClass;
    collapsedThumbnail: Avatar;
    collapsedLabel: ChannelHandleText;
    expandedTitle: ChannelHandleText;
}

export interface FluffySubMenu {
    searchSubMenuRenderer: SearchSubMenuRenderer;
}

export interface SearchSubMenuRenderer {
    title: ChannelHandleText;
    groups: Group[];
    trackingParams: string;
    button: DislikeButtonClass;
    aboutTheseResultsButton: AboutTheseResultsButtonClass;
}

export interface Group {
    searchFilterGroupRenderer: SearchFilterGroupRenderer;
}

export interface SearchFilterGroupRenderer {
    title: ContentClass;
    filters: Filter[];
    trackingParams: string;
}

export interface Filter {
    searchFilterRenderer: SearchFilterRenderer;
}

export interface SearchFilterRenderer {
    label: ContentClass;
    navigationEndpoint?: SearchFilterRendererNavigationEndpoint;
    tooltip: string;
    trackingParams: string;
    status?: string;
}

export interface SearchFilterRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    searchEndpoint: NavigationEndpointSearchEndpoint;
}

export interface NavigationEndpointSearchEndpoint {
    query: string;
    params: string;
}

export interface FrameworkUpdates {
    entityBatchUpdate: FrameworkUpdatesEntityBatchUpdate;
}

export interface FrameworkUpdatesEntityBatchUpdate {
    mutations: FluffyMutation[];
    timestamp: Timestamp;
}

export interface FluffyMutation {
    entityKey: string;
    type: string;
    options: Options;
}

export interface Options {
    persistenceOption: string;
}

export interface Timestamp {
    seconds: string;
    nanos: number;
}

export interface YtInitialDataHeader {
    feedTabbedHeaderRenderer?: FeedTabbedHeaderRenderer;
    c4TabbedHeaderRenderer?: C4TabbedHeaderRenderer;
}

export interface C4TabbedHeaderRenderer {
    channelId: string;
    title: string;
    navigationEndpoint: AuthorEndpointClass;
    avatar: Avatar;
    banner: Avatar;
    badges?: OwnerBadgeElement[];
    headerLinks: HeaderLinks;
    subscribeButton: SubscribeButton;
    subscriberCountText: SubscriberCountText;
    tvBanner: Avatar;
    mobileBanner: Avatar;
    trackingParams: string;
    sponsorButton?: SponsorButtonClass;
    channelHandleText: ChannelHandleText;
    style: string;
    videosCountText: ChannelHandleText;
    tagline: Tagline;
}

export interface HeaderLinks {
    channelHeaderLinksRenderer: ChannelHeaderLinksRenderer;
}

export interface ChannelHeaderLinksRenderer {
    primaryLinks: PrimaryLink[];
    secondaryLinks: AryLink[];
}

export interface PrimaryLink {
    navigationEndpoint: SecondaryLinkNavigationEndpoint;
    icon: Icon;
    title: ContentClass;
}

export interface SubscribeButton {
    buttonRenderer: IndigoButtonRenderer;
}

export interface IndigoButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ChannelHandleText;
    navigationEndpoint: FriskyNavigationEndpoint;
    trackingParams: string;
}

export interface FriskyNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: PurpleCommandMetadata;
    modalEndpoint: StickyModalEndpoint;
}

export interface StickyModalEndpoint {
    modal: StickyModal;
}

export interface StickyModal {
    modalWithTitleAndButtonRenderer: StickyModalWithTitleAndButtonRenderer;
}

export interface StickyModalWithTitleAndButtonRenderer {
    title: ContentClass;
    content: ContentClass;
    button: StickyButton;
}

export interface StickyButton {
    buttonRenderer: IndecentButtonRenderer;
}

export interface IndecentButtonRenderer {
    style: string;
    size: string;
    isDisabled: boolean;
    text: ContentClass;
    navigationEndpoint: MischievousNavigationEndpoint;
    trackingParams: string;
}

export interface MischievousNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    signInEndpoint: IndigoSignInEndpoint;
}

export interface IndigoSignInEndpoint {
    nextEndpoint: MoreEndpoint;
    continueAction: string;
    idamTag: string;
}

export interface Tagline {
    channelTaglineRenderer: ChannelTaglineRenderer;
}

export interface ChannelTaglineRenderer {
    content: string;
    maxLines: number;
    moreLabel: string;
    moreEndpoint: MoreEndpoint;
    moreIcon: MoreIcon;
}

export interface FeedTabbedHeaderRenderer {
    title: ChannelHandleText;
}

export interface Metadata {
    channelMetadataRenderer: ChannelMetadataRenderer;
}

export interface ChannelMetadataRenderer {
    title: string;
    description: string;
    rssUrl: string;
    externalId: string;
    keywords: string;
    ownerUrls: string[];
    avatar: Avatar;
    channelUrl: string;
    isFamilySafe: boolean;
    availableCountryCodes: string[];
    androidDeepLink: string;
    androidAppindexingLink: string;
    iosAppindexingLink: string;
    vanityChannelUrl: string;
}

export interface Microformat {
    microformatDataRenderer: MicroformatDataRenderer;
}

export interface MicroformatDataRenderer {
    urlCanonical: string;
    title: string;
    description: string;
    thumbnail: Avatar;
    siteName: string;
    appName: string;
    androidPackage: string;
    iosAppStoreId: string;
    iosAppArguments: string;
    ogType: string;
    urlApplinksWeb: string;
    urlApplinksIos: string;
    urlApplinksAndroid: string;
    urlTwitterIos: string;
    urlTwitterAndroid: string;
    twitterCardType: string;
    twitterSiteHandle: string;
    schemaDotOrgType: string;
    noindex: boolean;
    unlisted: boolean;
    familySafe: boolean;
    tags?: string[];
    availableCountries: string[];
    linkAlternates: LinkAlternate[];
}

export interface LinkAlternate {
    hrefUrl: string;
}

export interface ResponseContext {
    serviceTrackingParams: ServiceTrackingParam[];
    maxAgeSeconds?: number;
    mainAppWebResponseContext: MainAppWebResponseContext;
    webResponseContextExtensionData: WebResponseContextExtensionData;
}

export interface MainAppWebResponseContext {
    loggedOut: boolean;
}

export interface ServiceTrackingParam {
    service: string;
    params: Param[];
}

export interface WebResponseContextExtensionData {
    ytConfigData: YtConfigData;
    hasDecorated: boolean;
}

export interface YtConfigData {
    visitorData: string;
    rootVisualElementType: number;
}

export interface Topbar {
    desktopTopbarRenderer: DesktopTopbarRenderer;
}

export interface DesktopTopbarRenderer {
    logo: Logo;
    searchbox: Searchbox;
    trackingParams: string;
    countryCode: string;
    topbarButtons: TopbarButton[];
    hotkeyDialog: HotkeyDialog;
    backButton: BackButtonClass;
    forwardButton: BackButtonClass;
    a11ySkipNavigationButton: A11YSkipNavigationButtonClass;
}

export interface BackButtonClass {
    buttonRenderer: BackButtonButtonRenderer;
}

export interface BackButtonButtonRenderer {
    trackingParams: string;
    command: FluffyCommand;
}

export interface HotkeyDialog {
    hotkeyDialogRenderer: HotkeyDialogRenderer;
}

export interface HotkeyDialogRenderer {
    title: ChannelHandleText;
    sections: Section[];
    dismissButton: DismissButtonClass;
    trackingParams: string;
}

export interface Section {
    hotkeyDialogSectionRenderer: HotkeyDialogSectionRenderer;
}

export interface HotkeyDialogSectionRenderer {
    title: ChannelHandleText;
    options: Option[];
}

export interface Option {
    hotkeyDialogSectionOptionRenderer: HotkeyDialogSectionOptionRenderer;
}

export interface HotkeyDialogSectionOptionRenderer {
    label: ChannelHandleText;
    hotkey: string;
    hotkeyAccessibilityLabel?: ToggledAccessibilityDataClass;
}

export interface Logo {
    topbarLogoRenderer: TopbarLogoRenderer;
}

export interface TopbarLogoRenderer {
    iconImage: MoreIcon;
    tooltipText: ChannelHandleText;
    endpoint: RichShelfRendererEndpoint;
    trackingParams: string;
    overrideEntityKey: string;
}

export interface Searchbox {
    fusionSearchboxRenderer: FusionSearchboxRenderer;
}

export interface FusionSearchboxRenderer {
    icon: MoreIcon;
    placeholderText: ChannelHandleText;
    config: Config;
    trackingParams: string;
    searchEndpoint: FusionSearchboxRendererSearchEndpoint;
    clearButton: ClearButtonClass;
}

export interface Config {
    webSearchboxConfig: WebSearchboxConfig;
}

export interface WebSearchboxConfig {
    requestLanguage: string;
    requestDomain: string;
    hasOnscreenKeyboard: boolean;
    focusSearchbox: boolean;
}

export interface FusionSearchboxRendererSearchEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    searchEndpoint: SearchEndpointSearchEndpoint;
}

export interface SearchEndpointSearchEndpoint {
    query: string;
}

export interface TopbarButton {
    topbarMenuButtonRenderer?: TopbarMenuButtonRenderer;
    buttonRenderer?: TopbarButtonButtonRenderer;
}

export interface TopbarButtonButtonRenderer {
    style: string;
    size: string;
    text: ChannelHandleText;
    icon: MoreIcon;
    navigationEndpoint: BraggadociousNavigationEndpoint;
    trackingParams: string;
    targetId: string;
}

export interface BraggadociousNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: MoreEndpointCommandMetadata;
    signInEndpoint: IndecentSignInEndpoint;
}

export interface IndecentSignInEndpoint {
    idamTag: string;
}

export interface TopbarMenuButtonRenderer {
    icon: MoreIcon;
    menuRequest: MenuRequest;
    trackingParams: string;
    accessibility: ToggledAccessibilityDataClass;
    tooltip: string;
    style: string;
}

export interface MenuRequest {
    clickTrackingParams: string;
    commandMetadata: ContinuationEndpointCommandMetadata;
    signalServiceEndpoint: MenuRequestSignalServiceEndpoint;
}

export interface MenuRequestSignalServiceEndpoint {
    signal: string;
    actions: HilariousAction[];
}

export interface HilariousAction {
    clickTrackingParams: string;
    openPopupAction: TentacledOpenPopupAction;
}

export interface TentacledOpenPopupAction {
    popup: StickyPopup;
    popupType: string;
    beReused: boolean;
}

export interface StickyPopup {
    multiPageMenuRenderer: MultiPageMenuRenderer;
}

export interface MultiPageMenuRenderer {
    trackingParams: string;
    style: string;
    showLoadingSpinner: boolean;
}
