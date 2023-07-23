"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoLicense = exports.PrivacyStatus = exports.RejectionReason = exports.FailureReason = exports.UploadStatus = exports.LiveBroadcastContent = void 0;
var LiveBroadcastContent;
(function (LiveBroadcastContent) {
    LiveBroadcastContent["Live"] = "live";
    LiveBroadcastContent["None"] = "none";
    LiveBroadcastContent["Upcoming"] = "upcoming";
})(LiveBroadcastContent = exports.LiveBroadcastContent || (exports.LiveBroadcastContent = {}));
var UploadStatus;
(function (UploadStatus) {
    UploadStatus["Deleted"] = "deleted";
    UploadStatus["Failed"] = "failed";
    UploadStatus["Processed"] = "processed";
    UploadStatus["Rejected"] = "rejected";
    UploadStatus["Uploaded"] = "uploaded";
})(UploadStatus = exports.UploadStatus || (exports.UploadStatus = {}));
var FailureReason;
(function (FailureReason) {
    FailureReason["Codec"] = "codec";
    FailureReason["Conversion"] = "conversion";
    FailureReason["EmptyFile"] = "emptyFile";
    FailureReason["InvalidFile"] = "invalidFile";
    FailureReason["TooSmall"] = "tooSmall";
    FailureReason["UploadAborted"] = "uploadAborted";
})(FailureReason = exports.FailureReason || (exports.FailureReason = {}));
var RejectionReason;
(function (RejectionReason) {
    RejectionReason["Claim"] = "claim";
    RejectionReason["Copyright"] = "copyright";
    RejectionReason["Duplicate"] = "duplicate";
    RejectionReason["Inappropriate"] = "inappropriate";
    RejectionReason["Legal"] = "legal";
    RejectionReason["Length"] = "length";
    RejectionReason["TermsOfUse"] = "termsOfUse";
    RejectionReason["Trademark"] = "trademark";
    RejectionReason["UploaderAccountClosed"] = "uploaderAccountClosed";
    RejectionReason["UploaderAccountSuspended"] = "uploaderAccountSuspended";
})(RejectionReason = exports.RejectionReason || (exports.RejectionReason = {}));
var PrivacyStatus;
(function (PrivacyStatus) {
    PrivacyStatus["Private"] = "private";
    PrivacyStatus["Public"] = "public";
    PrivacyStatus["Unlisted"] = "unlisted";
})(PrivacyStatus = exports.PrivacyStatus || (exports.PrivacyStatus = {}));
var VideoLicense;
(function (VideoLicense) {
    VideoLicense["CreativeCommon"] = "creativeCommon";
    VideoLicense["YouTube"] = "youtube";
})(VideoLicense = exports.VideoLicense || (exports.VideoLicense = {}));
