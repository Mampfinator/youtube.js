export interface YtInitialData {
    responseContext:   ResponseContext;
    contents:          Contents;
    header?:           YtInitialDataHeader;
    trackingParams:    string;
    topbar:            Topbar;
    frameworkUpdates?: FrameworkUpdates;
    metadata?:         Metadata;
    microformat?:      Microformat;
    estimatedResults?: string;
    targetId?:         string;
}

export interface Contents {
    twoColumnBrowseResultsRenderer?: TwoColumnBrowseResultsRenderer;
    twoColumnSearchResultsRenderer?: TwoColumnSearchResultsRenderer;
}

export interface TwoColumnBrowseResultsRenderer {
    tabs: Tab[];
}

export interface Tab {
    tabRenderer?:           TabRenderer;
    expandableTabRenderer?: ExpandableTabRenderer;
}

export interface ExpandableTabRenderer {
    endpoint: CommandClass;
    title:    string;
    selected: boolean;
}

export interface CommandClass {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    browseEndpoint:      CommandBrowseEndpoint;
}

export interface CommandBrowseEndpoint {
    browseId:          string;
    params?:           string;
    canonicalBaseUrl?: string;
}

export interface EndpointCommandMetadata {
    webCommandMetadata: PurpleWebCommandMetadata;
}

export interface PurpleWebCommandMetadata {
    url:         string;
    webPageType: string;
    rootVe:      number;
    apiUrl?:     string;
}

export interface TabRenderer {
    selected?:      boolean;
    content?:       TabRendererContent;
    tabIdentifier?: string;
    trackingParams: string;
    endpoint?:      CommandClass;
    title?:         string;
}

export interface TabRendererContent {
    richGridRenderer?:    RichGridRenderer;
    sectionListRenderer?: ContentSectionListRenderer;
}

export interface RichGridRenderer {
    contents:       RichGridRendererContent[];
    trackingParams: string;
    header?:        RichGridRendererHeader;
    targetId:       string;
    reflowOptions?: ReflowOptions;
    style?:         string;
}

export interface RichGridRendererContent {
    richItemRenderer?:         PurpleRichItemRenderer;
    richSectionRenderer?:      RichSectionRenderer;
    continuationItemRenderer?: PurpleContinuationItemRenderer;
}

export interface PurpleContinuationItemRenderer {
    trigger:              string;
    continuationEndpoint: ContinuationEndpoint;
    ghostCards?:          GhostCards;
}

export interface ContinuationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     ContinuationEndpointCommandMetadata;
    continuationCommand: ContinuationEndpointContinuationCommand;
}

export interface ContinuationEndpointCommandMetadata {
    webCommandMetadata: FluffyWebCommandMetadata;
}

export interface FluffyWebCommandMetadata {
    sendPost: boolean;
    apiUrl?:  string;
}

export interface ContinuationEndpointContinuationCommand {
    token:   string;
    request: string;
}

export interface GhostCards {
    ghostGridRenderer: GhostGridRenderer;
}

export interface GhostGridRenderer {
    rows: number;
}

export interface PurpleRichItemRenderer {
    content:        PurpleContent;
    trackingParams: string;
}

export interface PurpleContent {
    videoRenderer?:    PurpleVideoRenderer;
    reelItemRenderer?: ItemReelItemRenderer;
}

export interface ItemReelItemRenderer {
    videoId:            string;
    headline:           ContentClass;
    thumbnail:          ReelWatchEndpointThumbnail;
    viewCountText:      SubscriberCountText;
    navigationEndpoint: ReelItemRendererNavigationEndpoint;
    menu:               ButtonClass;
    trackingParams:     string;
    accessibility:      ToggledAccessibilityDataClass;
    style:              string;
    videoType:          string;
    loggingDirectives:  LoggingDirectives;
}

export interface ToggledAccessibilityDataClass {
    accessibilityData: AccessibilityAccessibilityData;
}

export interface AccessibilityAccessibilityData {
    label: string;
}

export interface ContentClass {
    simpleText: string;
}

export interface LoggingDirectives {
    trackingParams:                string;
    visibility:                    Visibility;
    enableDisplayloggerExperiment: boolean;
}

export interface Visibility {
    types: string;
}

export interface ButtonClass {
    menuRenderer: ButtonMenuRenderer;
}

export interface ButtonMenuRenderer {
    items:          PurpleItem[];
    trackingParams: string;
    accessibility:  ToggledAccessibilityDataClass;
}

export interface PurpleItem {
    menuNavigationItemRenderer: MenuNavigationItemRenderer;
}

export interface MenuNavigationItemRenderer {
    text:               ChannelHandleText;
    icon:               IconImage;
    navigationEndpoint: MenuNavigationItemRendererNavigationEndpoint;
    trackingParams:     string;
    accessibility:      ToggledAccessibilityDataClass;
}

export interface IconImage {
    iconType: string;
}

export interface MenuNavigationItemRendererNavigationEndpoint {
    clickTrackingParams:  string;
    commandMetadata:      PurpleCommandMetadata;
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
    key:   string;
    value: string;
}

export interface ChannelHandleText {
    runs: ChannelHandleTextRun[];
}

export interface ChannelHandleTextRun {
    text: string;
}

export interface ReelItemRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    reelWatchEndpoint:   ReelWatchEndpoint;
}

export interface ReelWatchEndpoint {
    videoId:          string;
    playerParams:     string;
    thumbnail:        ReelWatchEndpointThumbnail;
    overlay:          Overlay;
    params:           string;
    sequenceProvider: string;
    sequenceParams:   string;
    loggingContext:   ReelWatchEndpointLoggingContext;
}

export interface ReelWatchEndpointLoggingContext {
    vssLoggingContext: LoggingContext;
    qoeLoggingContext: LoggingContext;
}

export interface LoggingContext {
    serializedContextData: string;
}

export interface Overlay {
    reelPlayerOverlayRenderer: ReelPlayerOverlayRenderer;
}

export interface ReelPlayerOverlayRenderer {
    style:                     string;
    trackingParams:            string;
    reelPlayerNavigationModel: string;
}

export interface ReelWatchEndpointThumbnail {
    thumbnails:            ThumbnailThumbnail[];
    isOriginalAspectRatio: boolean;
}

export interface ThumbnailThumbnail {
    url:    string;
    width:  number;
    height: number;
}

export interface SubscriberCountText {
    accessibility: ToggledAccessibilityDataClass;
    simpleText:    string;
}

export interface PurpleVideoRenderer {
    videoId:                             string;
    thumbnail:                           Avatar;
    title:                               CollapsedStateButtonTextClass;
    descriptionSnippet:                  ChannelHandleText;
    longBylineText?:                     LongBylineTextClass;
    publishedTimeText:                   ContentClass;
    lengthText:                          SubscriberCountText;
    viewCountText:                       ContentClass;
    navigationEndpoint:                  GridVideoRendererNavigationEndpoint;
    ownerBadges?:                        OwnerBadgeElement[];
    ownerText?:                          LongBylineTextClass;
    shortBylineText?:                    LongBylineTextClass;
    trackingParams:                      string;
    showActionMenu:                      boolean;
    shortViewCountText:                  SubscriberCountText;
    menu:                                VideoRendererMenu;
    channelThumbnailSupportedRenderers?: ChannelThumbnailSupportedRenderers;
    thumbnailOverlays:                   VideoRendererThumbnailOverlay[];
    inlinePlaybackEndpoint?:             InlinePlaybackEndpoint;
}

export interface ChannelThumbnailSupportedRenderers {
    channelThumbnailWithLinkRenderer: ChannelThumbnailWithLinkRenderer;
}

export interface ChannelThumbnailWithLinkRenderer {
    thumbnail:          Avatar;
    navigationEndpoint: Endpoint;
    accessibility:      ToggledAccessibilityDataClass;
}

export interface Endpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    browseEndpoint:      AuthorEndpointBrowseEndpoint;
}

export interface AuthorEndpointBrowseEndpoint {
    browseId:         string;
    canonicalBaseUrl: string;
}

export interface Avatar {
    thumbnails: ThumbnailThumbnail[];
}

export interface InlinePlaybackEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    watchEndpoint:       InlinePlaybackEndpointWatchEndpoint;
}

export interface InlinePlaybackEndpointWatchEndpoint {
    videoId:                            string;
    playerParams:                       string;
    playerExtraUrlParams:               Param[];
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
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

export interface LongBylineTextClass {
    runs: LongBylineTextRun[];
}

export interface LongBylineTextRun {
    text:               string;
    navigationEndpoint: Endpoint;
}

export interface VideoRendererMenu {
    menuRenderer: PurpleMenuRenderer;
}

export interface PurpleMenuRenderer {
    items:          FluffyItem[];
    trackingParams: string;
    accessibility:  ToggledAccessibilityDataClass;
    targetId?:      string;
}

export interface FluffyItem {
    menuServiceItemRenderer: PurpleMenuServiceItemRenderer;
}

export interface PurpleMenuServiceItemRenderer {
    text:            ChannelHandleText;
    icon:            IconImage;
    serviceEndpoint: ServiceEndpoint;
    trackingParams:  string;
    hasSeparator?:   boolean;
}

export interface ServiceEndpoint {
    clickTrackingParams:         string;
    commandMetadata:             ContinuationEndpointCommandMetadata;
    signalServiceEndpoint?:      UntoggledServiceEndpointSignalServiceEndpoint;
    shareEntityServiceEndpoint?: ShareEntityServiceEndpoint;
    playlistEditEndpoint?:       UntoggledServiceEndpointPlaylistEditEndpoint;
}

export interface UntoggledServiceEndpointPlaylistEditEndpoint {
    playlistId: string;
    actions:    PurpleAction[];
}

export interface PurpleAction {
    addedVideoId: string;
    action:       string;
}

export interface ShareEntityServiceEndpoint {
    serializedShareEntity: string;
    commands:              ShareEntityServiceEndpointCommand[];
}

export interface ShareEntityServiceEndpointCommand {
    clickTrackingParams: string;
    openPopupAction:     CommandOpenPopupAction;
}

export interface CommandOpenPopupAction {
    popup:     PurplePopup;
    popupType: string;
    beReused:  boolean;
}

export interface PurplePopup {
    unifiedSharePanelRenderer: UnifiedSharePanelRenderer;
}

export interface UnifiedSharePanelRenderer {
    trackingParams:     string;
    showLoadingSpinner: boolean;
}

export interface UntoggledServiceEndpointSignalServiceEndpoint {
    signal:  string;
    actions: FluffyAction[];
}

export interface FluffyAction {
    clickTrackingParams:  string;
    addToPlaylistCommand: AddToPlaylistCommand;
}

export interface AddToPlaylistCommand {
    openMiniplayer:      boolean;
    videoId:             string;
    listType:            string;
    onCreateListCommand: OnCreateListCommand;
    videoIds:            string[];
}

export interface OnCreateListCommand {
    clickTrackingParams:           string;
    commandMetadata:               ContinuationEndpointCommandMetadata;
    createPlaylistServiceEndpoint: CreatePlaylistServiceEndpoint;
}

export interface CreatePlaylistServiceEndpoint {
    videoIds: string[];
    params:   string;
}

export interface GridVideoRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    watchEndpoint:       PurpleWatchEndpoint;
}

export interface PurpleWatchEndpoint {
    videoId:                            string;
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export interface OwnerBadgeElement {
    metadataBadgeRenderer: OwnerBadgeMetadataBadgeRenderer;
}

export interface OwnerBadgeMetadataBadgeRenderer {
    icon:              IconImage;
    style:             string;
    tooltip:           string;
    trackingParams:    string;
    accessibilityData: AccessibilityAccessibilityData;
}

export interface VideoRendererThumbnailOverlay {
    thumbnailOverlayTimeStatusRenderer?:     ThumbnailOverlayTimeStatusRenderer;
    thumbnailOverlayToggleButtonRenderer?:   ThumbnailOverlayToggleButtonRenderer;
    thumbnailOverlayNowPlayingRenderer?:     ThumbnailOverlayRenderer;
    thumbnailOverlayLoadingPreviewRenderer?: ThumbnailOverlayRenderer;
}

export interface ThumbnailOverlayRenderer {
    text: ChannelHandleText;
}

export interface ThumbnailOverlayTimeStatusRenderer {
    text:  SubscriberCountText;
    style: string;
}

export interface ThumbnailOverlayToggleButtonRenderer {
    isToggled?:               boolean;
    untoggledIcon:            IconImage;
    toggledIcon:              IconImage;
    untoggledTooltip:         string;
    toggledTooltip:           string;
    untoggledServiceEndpoint: ServiceEndpoint;
    toggledServiceEndpoint?:  ToggledServiceEndpoint;
    untoggledAccessibility:   ToggledAccessibilityDataClass;
    toggledAccessibility:     ToggledAccessibilityDataClass;
    trackingParams:           string;
}

export interface ToggledServiceEndpoint {
    clickTrackingParams:  string;
    commandMetadata:      ContinuationEndpointCommandMetadata;
    playlistEditEndpoint: ToggledServiceEndpointPlaylistEditEndpoint;
}

export interface ToggledServiceEndpointPlaylistEditEndpoint {
    playlistId: string;
    actions:    TentacledAction[];
}

export interface TentacledAction {
    action:         string;
    removedVideoId: string;
}

export interface CollapsedStateButtonTextClass {
    runs:          ChannelHandleTextRun[];
    accessibility: ToggledAccessibilityDataClass;
}

export interface RichSectionRenderer {
    content:        RichSectionRendererContent;
    trackingParams: string;
    fullBleed:      boolean;
}

export interface RichSectionRendererContent {
    richShelfRenderer: RichShelfRenderer;
}

export interface RichShelfRenderer {
    title:          ChannelHandleText;
    contents:       RichShelfRendererContent[];
    trackingParams: string;
    showMoreButton: ShowMoreButtonClass;
    icon?:          IconImage;
    endpoint?:      RichShelfRendererEndpoint;
}

export interface RichShelfRendererContent {
    richItemRenderer: FluffyRichItemRenderer;
}

export interface FluffyRichItemRenderer {
    content:        FluffyContent;
    trackingParams: string;
}

export interface FluffyContent {
    reelItemRenderer?: PurpleReelItemRenderer;
    videoRenderer?:    PurpleVideoRenderer;
}

export interface PurpleReelItemRenderer {
    videoId:            string;
    headline:           ContentClass;
    thumbnail:          ReelWatchEndpointThumbnail;
    viewCountText:      SubscriberCountText;
    navigationEndpoint: ReelItemRendererNavigationEndpoint;
    menu:               PurpleMenu;
    trackingParams:     string;
    accessibility:      ToggledAccessibilityDataClass;
    style:              string;
    videoType:          string;
    loggingDirectives:  LoggingDirectives;
}

export interface PurpleMenu {
    menuRenderer: FluffyMenuRenderer;
}

export interface FluffyMenuRenderer {
    items:          TentacledItem[];
    trackingParams: string;
    accessibility:  ToggledAccessibilityDataClass;
}

export interface TentacledItem {
    menuServiceItemRenderer?:    FluffyMenuServiceItemRenderer;
    menuNavigationItemRenderer?: MenuNavigationItemRenderer;
}

export interface FluffyMenuServiceItemRenderer {
    text:            ChannelHandleText;
    icon:            IconImage;
    serviceEndpoint: PurpleServiceEndpoint;
    trackingParams:  string;
    accessibility:   ToggledAccessibilityDataClass;
    hasSeparator:    boolean;
}

export interface PurpleServiceEndpoint {
    clickTrackingParams:        string;
    commandMetadata:            ContinuationEndpointCommandMetadata;
    shareEntityServiceEndpoint: ShareEntityServiceEndpoint;
}

export interface RichShelfRendererEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    browseEndpoint:      PurpleBrowseEndpoint;
}

export interface PurpleBrowseEndpoint {
    browseId: string;
}

export interface ShowMoreButtonClass {
    buttonRenderer: ShowMoreButtonButtonRenderer;
}

export interface ShowMoreButtonButtonRenderer {
    style:          string;
    size:           string;
    icon:           IconImage;
    accessibility?: AccessibilityAccessibilityData;
    tooltip?:       string;
    trackingParams: string;
    isDisabled?:    boolean;
}

export interface RichGridRendererHeader {
    feedFilterChipBarRenderer: FeedFilterChipBarRenderer;
}

export interface FeedFilterChipBarRenderer {
    contents:        FeedFilterChipBarRendererContent[];
    trackingParams:  string;
    nextButton?:     ClearButtonClass;
    previousButton?: ClearButtonClass;
    styleType:       string;
}

export interface FeedFilterChipBarRendererContent {
    chipCloudChipRenderer: ChipCloudChipRenderer;
}

export interface ChipCloudChipRenderer {
    style?:              ToggledStyleClass;
    text:                Text;
    trackingParams:      string;
    isSelected?:         boolean;
    navigationEndpoint?: ChipCloudChipRendererNavigationEndpoint;
    targetId?:           string;
}

export interface ChipCloudChipRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     ContinuationEndpointCommandMetadata;
    continuationCommand: NavigationEndpointContinuationCommand;
}

export interface NavigationEndpointContinuationCommand {
    token:   string;
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
    runs?:       ChannelHandleTextRun[];
    simpleText?: string;
}

export interface ClearButtonClass {
    buttonRenderer: ClearButtonButtonRenderer;
}

export interface ClearButtonButtonRenderer {
    style:             string;
    size:              string;
    isDisabled:        boolean;
    icon:              IconImage;
    tooltip?:          string;
    trackingParams:    string;
    accessibilityData: ToggledAccessibilityDataClass;
}

export interface ReflowOptions {
    minimumRowsOfVideosAtStart:         number;
    minimumRowsOfVideosBetweenSections: number;
}

export interface ContentSectionListRenderer {
    contents:             TentacledContent[];
    trackingParams:       string;
    targetId?:            string;
    disablePullToRefresh: boolean;
    subMenu?:             PurpleSubMenu;
}

export interface TentacledContent {
    itemSectionRenderer: PurpleItemSectionRenderer;
}

export interface PurpleItemSectionRenderer {
    contents:           StickyContent[];
    trackingParams:     string;
    header?:            ItemSectionRendererHeader;
    sectionIdentifier?: string;
}

export interface StickyContent {
    channelVideoPlayerRenderer?:       ChannelVideoPlayerRenderer;
    shelfRenderer?:                    PurpleShelfRenderer;
    reelShelfRenderer?:                ReelShelfRenderer;
    recognitionShelfRenderer?:         RecognitionShelfRenderer;
    gridRenderer?:                     GridRenderer;
    backstagePostThreadRenderer?:      BackstagePostThreadRenderer;
    channelAboutFullMetadataRenderer?: ChannelAboutFullMetadataRenderer;
}

export interface BackstagePostThreadRenderer {
    post:              Post;
    trackingParams:    string;
    loggingDirectives: LoggingDirectives;
}

export interface Post {
    backstagePostRenderer: BackstagePostRenderer;
}

export interface BackstagePostRenderer {
    postId:               string;
    authorText:           AuthorText;
    authorThumbnail:      AuthorThumbnail;
    authorEndpoint:       Endpoint;
    contentText:          ContentText;
    backstageAttachment?: BackstageAttachment;
    expandButton:         BackstagePostRendererCollapseButton;
    collapseButton:       BackstagePostRendererCollapseButton;
    publishedTimeText:    BackstagePostRendererTitle;
    voteCount:            SubscriberCountText;
    voteStatus:           string;
    actionButtons:        ActionButtons;
    trackingParams:       string;
    surface:              string;
    loggingDirectives:    LoggingDirectives;
}

export interface ActionButtons {
    commentActionButtonsRenderer: CommentActionButtonsRenderer;
}

export interface CommentActionButtonsRenderer {
    likeButton:     DislikeButtonClass;
    replyButton:    ReplyButton;
    dislikeButton:  DislikeButtonClass;
    trackingParams: string;
    style:          string;
}

export interface DislikeButtonClass {
    toggleButtonRenderer: ToggleButtonRenderer;
}

export interface ToggleButtonRenderer {
    style:                      ToggledStyleClass;
    size?:                      Size;
    isToggled:                  boolean;
    isDisabled:                 boolean;
    defaultIcon:                IconImage;
    accessibility:              AccessibilityAccessibilityData;
    trackingParams:             string;
    defaultTooltip:             string;
    toggledTooltip:             string;
    toggledStyle:               ToggledStyleClass;
    defaultNavigationEndpoint?: DefaultNavigationEndpoint;
    accessibilityData:          ToggledAccessibilityDataClass;
    toggledAccessibilityData?:  ToggledAccessibilityDataClass;
    defaultText?:               ChannelHandleText;
}

export interface DefaultNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    signInEndpoint:      DefaultNavigationEndpointSignInEndpoint;
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
    style:              string;
    size:               string;
    text:               SubscriberCountText;
    icon:               IconImage;
    navigationEndpoint: CommandClass;
    accessibility:      AccessibilityAccessibilityData;
    tooltip:            string;
    trackingParams:     string;
    accessibilityData:  ToggledAccessibilityDataClass;
}

export interface AuthorText {
    runs:          LongBylineTextRun[];
    accessibility: ToggledAccessibilityDataClass;
}

export interface AuthorThumbnail {
    thumbnails:    ThumbnailThumbnail[];
    accessibility: ToggledAccessibilityDataClass;
}

export interface BackstageAttachment {
    backstageImageRenderer: BackstageImageRenderer;
}

export interface BackstageImageRenderer {
    image:          Avatar;
    trackingParams: string;
    command:        CommandClass;
    accessibility:  ToggledAccessibilityDataClass;
}

export interface BackstagePostRendererCollapseButton {
    buttonRenderer: PurpleButtonRenderer;
}

export interface PurpleButtonRenderer {
    style:          string;
    size:           string;
    text:           SubscriberCountText;
    accessibility:  AccessibilityAccessibilityData;
    trackingParams: string;
}

export interface ContentText {
    runs: ContentTextRun[];
}

export interface ContentTextRun {
    text:                string;
    navigationEndpoint?: PurpleNavigationEndpoint;
    loggingDirectives?:  LoggingDirectives;
}

export interface PurpleNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    urlEndpoint?:        PurpleURLEndpoint;
    browseEndpoint?:     AuthorEndpointBrowseEndpoint;
}

export interface PurpleURLEndpoint {
    url:      string;
    target?:  string;
    nofollow: boolean;
}

export interface BackstagePostRendererTitle {
    runs: PurpleRun[];
}

export interface PurpleRun {
    text:               string;
    navigationEndpoint: CommandClass;
}

export interface ChannelAboutFullMetadataRenderer {
    description:                       ContentClass;
    primaryLinks:                      ChannelAboutFullMetadataRendererPrimaryLink[];
    viewCountText:                     ContentClass;
    joinedDateText:                    ChannelHandleText;
    canonicalChannelUrl:               string;
    bypassBusinessEmailCaptcha:        boolean;
    title:                             ContentClass;
    avatar:                            Avatar;
    country:                           ContentClass;
    showDescription:                   boolean;
    businessEmailLabel:                ChannelHandleText;
    descriptionLabel:                  ChannelHandleText;
    detailsLabel:                      ChannelHandleText;
    primaryLinksLabel:                 ChannelHandleText;
    statsLabel:                        ChannelHandleText;
    countryLabel:                      CountryLabel;
    channelId:                         string;
    signInForBusinessEmail:            SignInForBusinessEmail;
    onBusinessEmailRevealClickCommand: OnBusinessEmailRevealClickCommand;
}

export interface CountryLabel {
    runs: CountryLabelRun[];
}

export interface CountryLabelRun {
    text:        string;
    deemphasize: boolean;
}

export interface OnBusinessEmailRevealClickCommand {
    clickTrackingParams:        string;
    commandMetadata:            ContinuationEndpointCommandMetadata;
    revealBusinessEmailCommand: RevealBusinessEmailCommand;
}

export interface RevealBusinessEmailCommand {
}

export interface ChannelAboutFullMetadataRendererPrimaryLink {
    navigationEndpoint: PrimaryLinkNavigationEndpoint;
    icon:               Icon;
    title:              ContentClass;
    trackingParams:     string;
}

export interface Icon {
    thumbnails: CommonConfigElement[];
}

export interface PrimaryLinkNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    urlEndpoint:         PurpleURLEndpoint;
}

export interface SignInForBusinessEmail {
    runs: SignInForBusinessEmailRun[];
}

export interface SignInForBusinessEmailRun {
    text:                string;
    navigationEndpoint?: FluffyNavigationEndpoint;
}

export interface FluffyNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    signInEndpoint:      PurpleSignInEndpoint;
}

export interface PurpleSignInEndpoint {
    nextEndpoint: CommandClass;
}

export interface ChannelVideoPlayerRenderer {
    videoId:           string;
    title:             PurpleTitle;
    description:       Description;
    viewCountText:     ContentClass;
    publishedTimeText: ChannelHandleText;
    readMoreText:      ReadMoreText;
}

export interface Description {
    runs: DescriptionRun[];
}

export interface DescriptionRun {
    text:                string;
    navigationEndpoint?: TentacledNavigationEndpoint;
}

export interface TentacledNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    browseEndpoint?:     CommandBrowseEndpoint;
    urlEndpoint?:        PurpleURLEndpoint;
}

export interface ReadMoreText {
    runs: ReadMoreTextRun[];
}

export interface ReadMoreTextRun {
    text:               string;
    navigationEndpoint: GridVideoRendererNavigationEndpoint;
}

export interface PurpleTitle {
    runs:          ReadMoreTextRun[];
    accessibility: ToggledAccessibilityDataClass;
}

export interface GridRenderer {
    items:          GridRendererItem[];
    trackingParams: string;
    targetId:       string;
}

export interface GridRendererItem {
    gridPlaylistRenderer?: GridPlaylistRenderer;
    gridChannelRenderer?:  GridChannelRenderer;
}

export interface GridChannelRenderer {
    channelId:           string;
    thumbnail:           Avatar;
    videoCountText:      ChannelHandleText;
    subscriberCountText: SubscriberCountText;
    navigationEndpoint:  Endpoint;
    title:               ContentClass;
    subscribeButton:     A11YSkipNavigationButtonClass;
    trackingParams:      string;
}

export interface A11YSkipNavigationButtonClass {
    buttonRenderer: A11YSkipNavigationButtonButtonRenderer;
}

export interface A11YSkipNavigationButtonButtonRenderer {
    style:               string;
    size:                string;
    isDisabled:          boolean;
    text:                ChannelHandleText;
    navigationEndpoint?: StickyNavigationEndpoint;
    trackingParams:      string;
    command?:            ButtonRendererCommand;
}

export interface ButtonRendererCommand {
    clickTrackingParams:   string;
    commandMetadata:       FluffyCommandMetadata;
    signalServiceEndpoint: CommandSignalServiceEndpoint;
}

export interface FluffyCommandMetadata {
    webCommandMetadata: StickyWebCommandMetadata;
}

export interface StickyWebCommandMetadata {
    sendPost: boolean;
}

export interface CommandSignalServiceEndpoint {
    signal:  string;
    actions: StickyAction[];
}

export interface StickyAction {
    clickTrackingParams: string;
    signalAction:        SignalAction;
}

export interface SignalAction {
    signal: string;
}

export interface StickyNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     PurpleCommandMetadata;
    modalEndpoint:       PurpleModalEndpoint;
}

export interface PurpleModalEndpoint {
    modal: PurpleModal;
}

export interface PurpleModal {
    modalWithTitleAndButtonRenderer: PurpleModalWithTitleAndButtonRenderer;
}

export interface PurpleModalWithTitleAndButtonRenderer {
    title:   ContentClass;
    content: ContentClass;
    button:  PurpleButton;
}

export interface PurpleButton {
    buttonRenderer: FluffyButtonRenderer;
}

export interface FluffyButtonRenderer {
    style:              string;
    size:               string;
    isDisabled:         boolean;
    text:               ContentClass;
    navigationEndpoint: IndigoNavigationEndpoint;
    trackingParams:     string;
}

export interface IndigoNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    signInEndpoint:      FluffySignInEndpoint;
}

export interface FluffySignInEndpoint {
    nextEndpoint:   Endpoint;
    continueAction: string;
    idamTag:        string;
}

export interface GridPlaylistRenderer {
    playlistId:          string;
    thumbnail:           Avatar;
    title:               FluffyTitle;
    videoCountText:      ChannelHandleText;
    navigationEndpoint:  GridPlaylistRendererNavigationEndpoint;
    videoCountShortText: ContentClass;
    trackingParams:      string;
    sidebarThumbnails?:  Avatar[];
    thumbnailText:       SnippetTextClass;
    ownerBadges:         OwnerBadgeElement[];
    thumbnailRenderer:   ThumbnailRenderer;
    thumbnailOverlays:   GridPlaylistRendererThumbnailOverlay[];
    viewPlaylistText:    ViewPlaylistText;
    publishedTimeText?:  ContentClass;
}

export interface GridPlaylistRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    watchEndpoint:       FluffyWatchEndpoint;
}

export interface FluffyWatchEndpoint {
    videoId:                            string;
    playlistId:                         string;
    params?:                            string;
    loggingContext:                     WatchEndpointLoggingContext;
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export interface WatchEndpointLoggingContext {
    vssLoggingContext: LoggingContext;
}

export interface GridPlaylistRendererThumbnailOverlay {
    thumbnailOverlaySidePanelRenderer?:  ThumbnailOverlaySidePanelRenderer;
    thumbnailOverlayHoverTextRenderer?:  ThumbnailOverlayHoverTextRenderer;
    thumbnailOverlayNowPlayingRenderer?: ThumbnailOverlayRenderer;
}

export interface ThumbnailOverlayHoverTextRenderer {
    text: ChannelHandleText;
    icon: IconImage;
}

export interface ThumbnailOverlaySidePanelRenderer {
    text: ContentClass;
    icon: IconImage;
}

export interface ThumbnailRenderer {
    playlistVideoThumbnailRenderer: PlaylistVideoThumbnailRenderer;
}

export interface PlaylistVideoThumbnailRenderer {
    thumbnail:      Avatar;
    trackingParams: string;
}

export interface SnippetTextClass {
    runs: SnippetTextRun[];
}

export interface SnippetTextRun {
    text:  string;
    bold?: boolean;
}

export interface FluffyTitle {
    runs: FluffyRun[];
}

export interface FluffyRun {
    text:               string;
    navigationEndpoint: GridPlaylistRendererNavigationEndpoint;
}

export interface ViewPlaylistText {
    runs: ViewPlaylistTextRun[];
}

export interface ViewPlaylistTextRun {
    text:               string;
    navigationEndpoint: RichShelfRendererEndpoint;
}

export interface RecognitionShelfRenderer {
    title:    ContentClass;
    subtitle: ContentClass;
    avatars:  Icon[];
    button:   SponsorButtonClass;
    surface:  string;
}

export interface SponsorButtonClass {
    buttonRenderer: SponsorButtonButtonRenderer;
}

export interface SponsorButtonButtonRenderer {
    style:              string;
    size:               string;
    isDisabled:         boolean;
    text:               ChannelHandleText;
    navigationEndpoint: IndecentNavigationEndpoint;
    trackingParams:     string;
    hint:               Hint;
    accessibilityData:  ToggledAccessibilityDataClass;
    targetId:           string;
}

export interface Hint {
    hintRenderer: HintRenderer;
}

export interface HintRenderer {
    hintId:         string;
    dwellTimeMs:    string;
    hintCap:        HintCap;
    trackingParams: string;
}

export interface HintCap {
    impressionCap: string;
}

export interface IndecentNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     PurpleCommandMetadata;
    modalEndpoint:       FluffyModalEndpoint;
}

export interface FluffyModalEndpoint {
    modal: FluffyModal;
}

export interface FluffyModal {
    modalWithTitleAndButtonRenderer: FluffyModalWithTitleAndButtonRenderer;
}

export interface FluffyModalWithTitleAndButtonRenderer {
    title:   ChannelHandleText;
    content: ChannelHandleText;
    button:  FluffyButton;
}

export interface FluffyButton {
    buttonRenderer: TentacledButtonRenderer;
}

export interface TentacledButtonRenderer {
    style:              string;
    size:               string;
    isDisabled:         boolean;
    text:               ContentClass;
    navigationEndpoint: HilariousNavigationEndpoint;
    trackingParams:     string;
}

export interface HilariousNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    signInEndpoint:      TentacledSignInEndpoint;
}

export interface TentacledSignInEndpoint {
    hack: boolean;
}

export interface ReelShelfRenderer {
    title:          ChannelHandleText;
    button:         ButtonClass;
    items:          ReelShelfRendererItem[];
    trackingParams: string;
    icon:           IconImage;
}

export interface ReelShelfRendererItem {
    reelItemRenderer: ItemReelItemRenderer;
}

export interface PurpleShelfRenderer {
    title:          BackstagePostRendererTitle;
    endpoint:       CommandClass;
    content:        IndigoContent;
    trackingParams: string;
    subtitle?:      ContentClass;
    playAllButton?: AboutTheseResultsButtonClass;
}

export interface IndigoContent {
    horizontalListRenderer?:        HorizontalListRenderer;
    expandedShelfContentsRenderer?: ExpandedShelfContentsRenderer;
}

export interface ExpandedShelfContentsRenderer {
    items:        ExpandedShelfContentsRendererItem[];
    showMoreText: ChannelHandleText;
}

export interface ExpandedShelfContentsRendererItem {
    channelRenderer: ChannelRenderer;
}

export interface ChannelRenderer {
    channelId:           string;
    title:               ContentClass;
    navigationEndpoint:  Endpoint;
    thumbnail:           Avatar;
    descriptionSnippet:  ChannelHandleText;
    shortBylineText:     LongBylineTextClass;
    videoCountText:      ChannelHandleText;
    subscriptionButton:  SubscriptionButton;
    subscriberCountText: SubscriberCountText;
    subscribeButton:     DismissButtonClass;
    trackingParams:      string;
    longBylineText:      LongBylineTextClass;
}

export interface DismissButtonClass {
    buttonRenderer: DismissButtonButtonRenderer;
}

export interface DismissButtonButtonRenderer {
    style:               string;
    size:                string;
    isDisabled:          boolean;
    text:                ChannelHandleText;
    navigationEndpoint?: AmbitiousNavigationEndpoint;
    trackingParams:      string;
}

export interface AmbitiousNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     PurpleCommandMetadata;
    modalEndpoint:       TentacledModalEndpoint;
}

export interface TentacledModalEndpoint {
    modal: TentacledModal;
}

export interface TentacledModal {
    modalWithTitleAndButtonRenderer: TentacledModalWithTitleAndButtonRenderer;
}

export interface TentacledModalWithTitleAndButtonRenderer {
    title:   ContentClass;
    content: ContentClass;
    button:  TentacledButton;
}

export interface TentacledButton {
    buttonRenderer: StickyButtonRenderer;
}

export interface StickyButtonRenderer {
    style:              string;
    size:               string;
    isDisabled:         boolean;
    text:               ContentClass;
    navigationEndpoint: CunningNavigationEndpoint;
    trackingParams:     string;
}

export interface CunningNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    signInEndpoint:      StickySignInEndpoint;
}

export interface StickySignInEndpoint {
    nextEndpoint:   NextEndpoint;
    continueAction: string;
    idamTag:        string;
}

export interface NextEndpoint {
    clickTrackingParams: string;
}

export interface SubscriptionButton {
    subscribed: boolean;
}

export interface HorizontalListRenderer {
    items:            HorizontalListRendererItem[];
    trackingParams:   string;
    visibleItemCount: number;
    nextButton:       ShowMoreButtonClass;
    previousButton:   ShowMoreButtonClass;
}

export interface HorizontalListRendererItem {
    gridVideoRenderer?:    GridVideoRenderer;
    gridPlaylistRenderer?: GridPlaylistRenderer;
}

export interface GridVideoRenderer {
    videoId:            string;
    thumbnail:          Avatar;
    title:              SubscriberCountText;
    publishedTimeText:  ContentClass;
    viewCountText:      ContentClass;
    navigationEndpoint: GridVideoRendererNavigationEndpoint;
    ownerBadges:        OwnerBadgeElement[];
    trackingParams:     string;
    shortViewCountText: SubscriberCountText;
    menu:               VideoRendererMenu;
    thumbnailOverlays:  VideoRendererThumbnailOverlay[];
    shortBylineText?:   LongBylineTextClass;
}

export interface AboutTheseResultsButtonClass {
    buttonRenderer: AboutTheseResultsButtonButtonRenderer;
}

export interface AboutTheseResultsButtonButtonRenderer {
    style:               string;
    size:                string;
    isDisabled:          boolean;
    text:                ChannelHandleText;
    icon:                IconImage;
    navigationEndpoint?: GridPlaylistRendererNavigationEndpoint;
    trackingParams:      string;
    iconPosition?:       string;
}

export interface ItemSectionRendererHeader {
    commentsHeaderRenderer: CommentsHeaderRenderer;
}

export interface CommentsHeaderRenderer {
    isBackstageContent: boolean;
    trackingParams:     string;
}

export interface PurpleSubMenu {
    channelSubMenuRenderer: ChannelSubMenuRenderer;
}

export interface ChannelSubMenuRenderer {
    contentTypeSubMenuItems: ExpandableTabRenderer[];
    sortSetting?:            SortSetting;
}

export interface SortSetting {
    sortFilterSubMenuRenderer: SortFilterSubMenuRenderer;
}

export interface SortFilterSubMenuRenderer {
    subMenuItems:   SubMenuItem[];
    title:          string;
    icon:           IconImage;
    accessibility:  ToggledAccessibilityDataClass;
    trackingParams: string;
}

export interface SubMenuItem {
    title:              string;
    selected:           boolean;
    navigationEndpoint: CommandClass;
    trackingParams:     string;
}

export interface TwoColumnSearchResultsRenderer {
    primaryContents: PrimaryContents;
}

export interface PrimaryContents {
    sectionListRenderer: PrimaryContentsSectionListRenderer;
}

export interface PrimaryContentsSectionListRenderer {
    contents:            IndecentContent[];
    trackingParams:      string;
    subMenu:             FluffySubMenu;
    hideBottomSeparator: boolean;
    targetId:            string;
}

export interface IndecentContent {
    itemSectionRenderer?:      FluffyItemSectionRenderer;
    continuationItemRenderer?: FluffyContinuationItemRenderer;
}

export interface FluffyContinuationItemRenderer {
    trigger:              string;
    continuationEndpoint: ContinuationEndpoint;
}

export interface FluffyItemSectionRenderer {
    contents:       HilariousContent[];
    trackingParams: string;
}

export interface HilariousContent {
    videoRenderer?: ItemVideoRenderer;
    shelfRenderer?: FluffyShelfRenderer;
}

export interface FluffyShelfRenderer {
    title:          ContentClass;
    content:        AmbitiousContent;
    trackingParams: string;
}

export interface AmbitiousContent {
    verticalListRenderer: VerticalListRenderer;
}

export interface VerticalListRenderer {
    items:                    VerticalListRendererItem[];
    collapsedItemCount:       number;
    collapsedStateButtonText: CollapsedStateButtonTextClass;
    trackingParams:           string;
}

export interface VerticalListRendererItem {
    videoRenderer: ItemVideoRenderer;
}

export interface ItemVideoRenderer {
    videoId:                            string;
    thumbnail:                          Avatar;
    title:                              CollapsedStateButtonTextClass;
    longBylineText:                     LongBylineTextClass;
    publishedTimeText:                  ContentClass;
    lengthText:                         SubscriberCountText;
    viewCountText:                      ContentClass;
    navigationEndpoint:                 MagentaNavigationEndpoint;
    badges?:                            PurpleBadge[];
    ownerBadges?:                       OwnerBadgeElement[];
    ownerText:                          LongBylineTextClass;
    shortBylineText:                    LongBylineTextClass;
    trackingParams:                     string;
    showActionMenu:                     boolean;
    shortViewCountText:                 SubscriberCountText;
    menu:                               VideoRendererMenu;
    channelThumbnailSupportedRenderers: ChannelThumbnailSupportedRenderers;
    thumbnailOverlays:                  VideoRendererThumbnailOverlay[];
    detailedMetadataSnippets:           DetailedMetadataSnippet[];
    inlinePlaybackEndpoint:             InlinePlaybackEndpoint;
    expandableMetadata?:                ExpandableMetadata;
    searchVideoResultEntityKey:         string;
}

export interface PurpleBadge {
    metadataBadgeRenderer: PurpleMetadataBadgeRenderer;
}

export interface PurpleMetadataBadgeRenderer {
    style:              string;
    label:              string;
    trackingParams:     string;
    accessibilityData?: AccessibilityAccessibilityData;
}

export interface DetailedMetadataSnippet {
    snippetText:      SnippetTextClass;
    snippetHoverText: ChannelHandleText;
    maxOneLine:       boolean;
}

export interface ExpandableMetadata {
    expandableMetadataRenderer: ExpandableMetadataRenderer;
}

export interface ExpandableMetadataRenderer {
    header:            ExpandableMetadataRendererHeader;
    expandedContent:   ExpandedContent;
    expandButton:      ClearButtonClass;
    collapseButton:    ClearButtonClass;
    trackingParams:    string;
    loggingDirectives: LoggingDirectives;
}

export interface ExpandedContent {
    horizontalCardListRenderer: HorizontalCardListRenderer;
}

export interface HorizontalCardListRenderer {
    cards:          Card[];
    trackingParams: string;
    style:          HorizontalCardListRendererStyle;
    previousButton: ShowMoreButtonClass;
    nextButton:     ShowMoreButtonClass;
}

export interface Card {
    macroMarkersListItemRenderer: MacroMarkersListItemRenderer;
}

export interface MacroMarkersListItemRenderer {
    title:           ContentClass;
    timeDescription: ContentClass;
    thumbnail:       Avatar;
    onTap:           OnTap;
    trackingParams:  string;
    layout:          string;
    isHighlighted:   boolean;
}

export interface OnTap {
    clickTrackingParams:     string;
    commandExecutorCommand?: CommandExecutorCommand;
    commandMetadata?:        EndpointCommandMetadata;
    watchEndpoint?:          CommandWatchEndpoint;
}

export interface CommandExecutorCommand {
    commands: CommandExecutorCommandCommand[];
}

export interface CommandExecutorCommandCommand {
    clickTrackingParams:  string;
    commandMetadata?:     EndpointCommandMetadata;
    watchEndpoint?:       CommandWatchEndpoint;
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
    type:      string;
    payload:   Payload;
}

export interface Payload {
    markersVisibilityOverrideEntity: MarkersVisibilityOverrideEntity;
}

export interface MarkersVisibilityOverrideEntity {
    key:                          string;
    videoId:                      string;
    visibilityOverrideMarkersKey: string[];
}

export interface CommandWatchEndpoint {
    videoId:                            string;
    startTimeSeconds?:                  number;
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export interface HorizontalCardListRendererStyle {
    type: string;
}

export interface ExpandableMetadataRendererHeader {
    collapsedTitle:     ContentClass;
    collapsedThumbnail: Avatar;
    collapsedLabel:     ChannelHandleText;
    expandedTitle:      ChannelHandleText;
}

export interface MagentaNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    watchEndpoint:       TentacledWatchEndpoint;
}

export interface TentacledWatchEndpoint {
    videoId:                            string;
    params:                             string;
    watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export interface FluffySubMenu {
    searchSubMenuRenderer: SearchSubMenuRenderer;
}

export interface SearchSubMenuRenderer {
    title:                   ChannelHandleText;
    groups:                  Group[];
    trackingParams:          string;
    button:                  DislikeButtonClass;
    aboutTheseResultsButton: AboutTheseResultsButtonClass;
}

export interface Group {
    searchFilterGroupRenderer: SearchFilterGroupRenderer;
}

export interface SearchFilterGroupRenderer {
    title:          ContentClass;
    filters:        Filter[];
    trackingParams: string;
}

export interface Filter {
    searchFilterRenderer: SearchFilterRenderer;
}

export interface SearchFilterRenderer {
    label:               ContentClass;
    navigationEndpoint?: SearchFilterRendererNavigationEndpoint;
    tooltip:             string;
    trackingParams:      string;
    status?:             string;
}

export interface SearchFilterRendererNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    searchEndpoint:      NavigationEndpointSearchEndpoint;
}

export interface NavigationEndpointSearchEndpoint {
    query:  string;
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
    type:      string;
    options:   Options;
}

export interface Options {
    persistenceOption: string;
}

export interface Timestamp {
    seconds: string;
    nanos:   number;
}

export interface YtInitialDataHeader {
    feedTabbedHeaderRenderer?: FeedTabbedHeaderRenderer;
    c4TabbedHeaderRenderer?:   C4TabbedHeaderRenderer;
}

export interface C4TabbedHeaderRenderer {
    channelId:           string;
    title:               string;
    navigationEndpoint:  Endpoint;
    avatar:              Avatar;
    banner:              Avatar;
    badges:              OwnerBadgeElement[];
    headerLinks:         HeaderLinks;
    subscribeButton:     SubscribeButton;
    subscriberCountText: SubscriberCountText;
    tvBanner:            Avatar;
    mobileBanner:        Avatar;
    trackingParams:      string;
    sponsorButton:       SponsorButtonClass;
    channelHandleText:   ChannelHandleText;
    videosCountText:     ChannelHandleText;
}

export interface HeaderLinks {
    channelHeaderLinksRenderer: ChannelHeaderLinksRenderer;
}

export interface ChannelHeaderLinksRenderer {
    primaryLinks:   ChannelHeaderLinksRendererPrimaryLink[];
    secondaryLinks: SecondaryLink[];
}

export interface ChannelHeaderLinksRendererPrimaryLink {
    navigationEndpoint: PrimaryLinkNavigationEndpoint;
    icon:               Icon;
    title:              ContentClass;
}

export interface SecondaryLink {
    navigationEndpoint: SecondaryLinkNavigationEndpoint;
    icon:               Icon;
    title:              ContentClass;
}

export interface SecondaryLinkNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    urlEndpoint:         FluffyURLEndpoint;
}

export interface FluffyURLEndpoint {
    url:      string;
    nofollow: boolean;
}

export interface SubscribeButton {
    buttonRenderer: IndigoButtonRenderer;
}

export interface IndigoButtonRenderer {
    style:              string;
    size:               string;
    isDisabled:         boolean;
    text:               ChannelHandleText;
    navigationEndpoint: FriskyNavigationEndpoint;
    trackingParams:     string;
}

export interface FriskyNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     PurpleCommandMetadata;
    modalEndpoint:       StickyModalEndpoint;
}

export interface StickyModalEndpoint {
    modal: StickyModal;
}

export interface StickyModal {
    modalWithTitleAndButtonRenderer: StickyModalWithTitleAndButtonRenderer;
}

export interface StickyModalWithTitleAndButtonRenderer {
    title:   ContentClass;
    content: ContentClass;
    button:  StickyButton;
}

export interface StickyButton {
    buttonRenderer: IndecentButtonRenderer;
}

export interface IndecentButtonRenderer {
    style:              string;
    size:               string;
    isDisabled:         boolean;
    text:               ContentClass;
    navigationEndpoint: MischievousNavigationEndpoint;
    trackingParams:     string;
}

export interface MischievousNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    signInEndpoint:      IndigoSignInEndpoint;
}

export interface IndigoSignInEndpoint {
    nextEndpoint:   CommandClass;
    continueAction: string;
    idamTag:        string;
}

export interface FeedTabbedHeaderRenderer {
    title: ChannelHandleText;
}

export interface Metadata {
    channelMetadataRenderer: ChannelMetadataRenderer;
}

export interface ChannelMetadataRenderer {
    title:                  string;
    description:            string;
    rssUrl:                 string;
    externalId:             string;
    keywords:               string;
    ownerUrls:              string[];
    avatar:                 Avatar;
    channelUrl:             string;
    isFamilySafe:           boolean;
    availableCountryCodes:  string[];
    androidDeepLink:        string;
    androidAppindexingLink: string;
    iosAppindexingLink:     string;
    vanityChannelUrl:       string;
}

export interface Microformat {
    microformatDataRenderer: MicroformatDataRenderer;
}

export interface MicroformatDataRenderer {
    urlCanonical:       string;
    title:              string;
    description:        string;
    thumbnail:          Avatar;
    siteName:           string;
    appName:            string;
    androidPackage:     string;
    iosAppStoreId:      string;
    iosAppArguments:    string;
    ogType:             string;
    urlApplinksWeb:     string;
    urlApplinksIos:     string;
    urlApplinksAndroid: string;
    urlTwitterIos:      string;
    urlTwitterAndroid:  string;
    twitterCardType:    string;
    twitterSiteHandle:  string;
    schemaDotOrgType:   string;
    noindex:            boolean;
    unlisted:           boolean;
    familySafe:         boolean;
    tags:               string[];
    availableCountries: string[];
    linkAlternates:     LinkAlternate[];
}

export interface LinkAlternate {
    hrefUrl: string;
}

export interface ResponseContext {
    serviceTrackingParams:           ServiceTrackingParam[];
    maxAgeSeconds?:                  number;
    mainAppWebResponseContext:       MainAppWebResponseContext;
    webResponseContextExtensionData: WebResponseContextExtensionData;
}

export interface MainAppWebResponseContext {
    loggedOut: boolean;
}

export interface ServiceTrackingParam {
    service: string;
    params:  Param[];
}

export interface WebResponseContextExtensionData {
    ytConfigData: YtConfigData;
    hasDecorated: boolean;
}

export interface YtConfigData {
    visitorData:           string;
    rootVisualElementType: number;
}

export interface Topbar {
    desktopTopbarRenderer: DesktopTopbarRenderer;
}

export interface DesktopTopbarRenderer {
    logo:                     Logo;
    searchbox:                Searchbox;
    trackingParams:           string;
    countryCode:              string;
    topbarButtons:            TopbarButton[];
    hotkeyDialog:             HotkeyDialog;
    backButton:               BackButtonClass;
    forwardButton:            BackButtonClass;
    a11ySkipNavigationButton: A11YSkipNavigationButtonClass;
}

export interface BackButtonClass {
    buttonRenderer: BackButtonButtonRenderer;
}

export interface BackButtonButtonRenderer {
    trackingParams: string;
    command:        ButtonRendererCommand;
}

export interface HotkeyDialog {
    hotkeyDialogRenderer: HotkeyDialogRenderer;
}

export interface HotkeyDialogRenderer {
    title:          ChannelHandleText;
    sections:       Section[];
    dismissButton:  DismissButtonClass;
    trackingParams: string;
}

export interface Section {
    hotkeyDialogSectionRenderer: HotkeyDialogSectionRenderer;
}

export interface HotkeyDialogSectionRenderer {
    title:   ChannelHandleText;
    options: Option[];
}

export interface Option {
    hotkeyDialogSectionOptionRenderer: HotkeyDialogSectionOptionRenderer;
}

export interface HotkeyDialogSectionOptionRenderer {
    label:                     ChannelHandleText;
    hotkey:                    string;
    hotkeyAccessibilityLabel?: ToggledAccessibilityDataClass;
}

export interface Logo {
    topbarLogoRenderer: TopbarLogoRenderer;
}

export interface TopbarLogoRenderer {
    iconImage:         IconImage;
    tooltipText:       ChannelHandleText;
    endpoint:          RichShelfRendererEndpoint;
    trackingParams:    string;
    overrideEntityKey: string;
}

export interface Searchbox {
    fusionSearchboxRenderer: FusionSearchboxRenderer;
}

export interface FusionSearchboxRenderer {
    icon:            IconImage;
    placeholderText: ChannelHandleText;
    config:          Config;
    trackingParams:  string;
    searchEndpoint:  FusionSearchboxRendererSearchEndpoint;
    clearButton:     ClearButtonClass;
}

export interface Config {
    webSearchboxConfig: WebSearchboxConfig;
}

export interface WebSearchboxConfig {
    requestLanguage:     string;
    requestDomain:       string;
    hasOnscreenKeyboard: boolean;
    focusSearchbox:      boolean;
}

export interface FusionSearchboxRendererSearchEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    searchEndpoint:      SearchEndpointSearchEndpoint;
}

export interface SearchEndpointSearchEndpoint {
    query: string;
}

export interface TopbarButton {
    topbarMenuButtonRenderer?: TopbarMenuButtonRenderer;
    buttonRenderer?:           TopbarButtonButtonRenderer;
}

export interface TopbarButtonButtonRenderer {
    style:              string;
    size:               string;
    text:               ChannelHandleText;
    icon:               IconImage;
    navigationEndpoint: BraggadociousNavigationEndpoint;
    trackingParams:     string;
    targetId:           string;
}

export interface BraggadociousNavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata:     EndpointCommandMetadata;
    signInEndpoint:      IndecentSignInEndpoint;
}

export interface IndecentSignInEndpoint {
    idamTag: string;
}

export interface TopbarMenuButtonRenderer {
    icon:           IconImage;
    menuRequest:    MenuRequest;
    trackingParams: string;
    accessibility:  ToggledAccessibilityDataClass;
    tooltip:        string;
    style:          string;
}

export interface MenuRequest {
    clickTrackingParams:   string;
    commandMetadata:       ContinuationEndpointCommandMetadata;
    signalServiceEndpoint: MenuRequestSignalServiceEndpoint;
}

export interface MenuRequestSignalServiceEndpoint {
    signal:  string;
    actions: IndigoAction[];
}

export interface IndigoAction {
    clickTrackingParams: string;
    openPopupAction:     ActionOpenPopupAction;
}

export interface ActionOpenPopupAction {
    popup:     FluffyPopup;
    popupType: string;
    beReused:  boolean;
}

export interface FluffyPopup {
    multiPageMenuRenderer: MultiPageMenuRenderer;
}

export interface MultiPageMenuRenderer {
    trackingParams:     string;
    style:              string;
    showLoadingSpinner: boolean;
}
