import { PlaylistContex } from "../PlaylistContext";
import { ChannelSearchContext } from "./ChannelSearchContext";
import { ChannelTab } from "./ChannelTabContext";
import { CommunityContext } from "./CommunityContext";
import { FeaturedContext } from "./FeaturedContext";
import { PodcastsContext } from "./PodcastsContext";
import { ReleasesContext } from "./ReleasesContext";
import { ShortsContext } from "./ShortsContext";
import { StoreContext } from "./StoreContext";
import { StreamsContext } from "./StreamsContext";
import { VideosContext } from "./VideosContext";

export type ChannelContext = {
    [ChannelTab.Featured]: FeaturedContext;
    [ChannelTab.Videos]: VideosContext;
    [ChannelTab.Shorts]: ShortsContext;
    [ChannelTab.Streams]: StreamsContext;
    [ChannelTab.Releases]: ReleasesContext;
    [ChannelTab.Playlists]: PlaylistContex;
    [ChannelTab.Podcasts]: PodcastsContext;
    [ChannelTab.Community]: CommunityContext;
    [ChannelTab.Store]: StoreContext;
    [ChannelTab.Search]: ChannelSearchContext;
};
