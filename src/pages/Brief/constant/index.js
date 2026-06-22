import EditRoundedIcon from '@mui/icons-material/EditRounded';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import CopyLinkIcon from '@mui/icons-material/ContentCopy';

export const overview = [
  { key: 'id', name: 'Brief ID', tooltip: null },
  { key: 'team', name: 'Team' },
  { key: 'task_type', name: 'Task Type', tooltip: null },
  { key: 'company_name', name: 'Partner', tooltip: null },
  { key: 'request_type', name: 'Which contract should this be billed?' },
  { key: 'region', name: 'CS Region', tooltip: null },
  { key: 'customer_tier', name: 'Customer Tier', tooltip: null },
  { key: 'user_email', name: 'User Email', tooltip: null },
  {
    key: 'created_at',
    name: 'Date Created',
    tooltip:
      'The date the task was added to Ad-weave or initiated by the requestor.',
  },
  { key: 'campaign_launch_date', name: 'Est. Delivery Date', tooltip: null },
  { key: 'campaign_end_date', name: 'Est. Campaign End Date', tooltip: null },
  { key: 'tags', name: 'Tags', tooltip: null },
  { key: 'is_approved', name: 'Status', tooltip: null },
];

export const brief_overview = [
  {
    key: 'creative_project_goals',
    name: 'Please tell us about your creative project and goals',
    tooltip: null,
  },
  { key: 'languages', name: 'Languages', tooltip: null },
  { key: 'markets', name: 'Markets', tooltip: null },
  { key: 'assets', name: 'Assets', tooltip: null },
  { key: 'assets_instructions', name: 'Assets Instruction', tooltip: null },
];

export const brief = [
  { key: 'dynamic_elements', name: 'Dynamic Elements', tooltip: null },
  { key: 'advance_features', name: 'Advance Features', tooltip: null },
  { key: 'animations', name: 'Animations', tooltip: null },
  {
    key: 'creative_project_goals',
    name: 'Please tell us about your creative project and goals',
    tooltip: null,
  },
  {
    key: 'needs_concepting',
    name: 'Do you need concepting/ideation?',
    tooltip: null,
  },
  {
    key: 'stage_funnel_targeting',
    name: 'What stage of the funnel is your creative project targeting?',
    tooltip: null,
  },
  {
    key: 'newsize_or_rebuild',
    name: 'Are you resizing or updating existing templates?',
    tooltip: null,
  },
  {
    key: 'existing_creative_templates',
    name: 'Will this project build on existing creative templates?',
    tooltip: null,
  },
  {
    key: 'resizing_or_new_iteration',
    name: 'Are you resizing or updating existing templates?',
    tooltip: null,
  },
  {
    key: 'iteration_campaign_variants_need',
    name: 'How many more iterations / campaign variants do you need?',
    tooltip: null,
  },
  {
    key: 'existing_platforms_advertising_on_page',
    name: 'What platforms are you advertising on?',
    tooltip: null,
  },
  {
    key: 'scratch_platforms_advertising_on',
    name: 'For which platform do you need the creatives for?',
    tooltip: null,
  },
  {
    key: 'need_iterations_campaign_variants',
    name: 'Will you need more iterations / run campaign variants?',
    tooltip: null,
  },
  {
    key: 'many_iterations_campaign_variants',
    name: 'How many more iterations / campaign variants do you need?',
    tooltip: null,
  },
  {
    key: 'campaign_languages_count',
    name: 'How many Language(s) are covered by your campaign?',
    tooltip: null,
  },
];

export const channel = [
  { key: 'meta_channels', name: 'Meta Channels', tooltip: null },
  { key: 'google_channels', name: 'Google Channels', tooltip: null },
  { key: 'google_ads_channels', name: 'Google Ads Channels', tooltip: null },
  { key: 'tiktok_channels', name: 'Tiktok Channels', tooltip: null },
  { key: 'youtube_channels', name: 'YouTube Channels', tooltip: null },
  { key: 'pinterest_channels', name: 'Pinterest Channels', tooltip: null },
  { key: 'snapchat_channels', name: 'Snapchat Channels', tooltip: null },
];

export const templates_formats = [
  { key: 'scratch_meta_template_formats', name: 'Meta', tooltip: null },
  { key: 'scratch_tiktok_template_formats', name: 'Tiktok', tooltip: null },
  { key: 'scratch_snapchat_template_formats', name: 'Snapchat', tooltip: null },
  {
    key: 'scratch_pinterest_template_formats',
    name: 'Pinterest',
    tooltip: null,
  },
  { key: 'scratch_youtube_template_formats', name: 'YouTube', tooltip: null },
  {
    key: 'scratch_display_template_formats',
    name: 'Display',
    tooltip: null,
  },
  { key: 'reuse_meta_template_formats', name: 'Meta', tooltip: null },
  { key: 'reuse_tiktok_template_formats', name: 'Tiktok', tooltip: null },
  { key: 'reuse_snapchat_template_formats', name: 'Snapchat', tooltip: null },
  {
    key: 'reuse_pinterest_template_formats',
    name: 'Pinterest',
    tooltip: null,
  },
  { key: 'reuse_youtube_template_formats', name: 'YouTube', tooltip: null },
  {
    key: 'reuse_display_template_formats',
    name: 'Google Display',
    tooltip: null,
  },
];

export const templates_sizes = [
  // Scratch
  {
    key: 'scratch_meta_static_template_sizes',
    name: 'Meta Static',
    tooltip: null,
  },
  {
    key: 'scratch_meta_video_template_sizes',
    name: 'Meta Video',
    tooltip: null,
  },
  {
    key: 'scratch_meta_carousel_template_sizes',
    name: 'Meta Carousel',
    tooltip: null,
  },
  {
    key: 'scratch_meta_dpa_template_sizes',
    name: 'Meta DPA',
    tooltip: null,
  },
  {
    key: 'scratch_meta_daba_template_sizes',
    name: 'Meta DABA',
    tooltip: null,
  },
  {
    key: 'scratch_meta_cpv_template_sizes',
    name: 'Meta CPV',
    tooltip: null,
  },
  {
    key: 'scratch_tiktok_static_template_sizes',
    name: 'TikTok Static',
    tooltip: null,
  },
  {
    key: 'scratch_tiktok_video_template_sizes',
    name: 'TikTok Video',
    tooltip: null,
  },
  {
    key: 'scratch_tiktok_carousel_template_sizes',
    name: 'TikTok Carousel',
    tooltip: null,
  },
  {
    key: 'scratch_tiktok_dpa_template_sizes',
    name: 'TikTok DPA',
    tooltip: null,
  },
  {
    key: 'scratch_tiktok_daba_template_sizes',
    name: 'TikTok DABA',
    tooltip: null,
  },
  {
    key: 'scratch_tiktok_cpv_template_sizes',
    name: 'TikTok CPV',
    tooltip: null,
  },
  {
    key: 'scratch_tiktok_vsa_template_sizes',
    name: 'TikTok VSA',
    tooltip: null,
  },
  {
    key: 'scratch_snapchat_static_template_sizes',
    name: 'Snapchat Static',
    tooltip: null,
  },
  {
    key: 'scratch_snapchat_video_template_sizes',
    name: 'Snapchat Video',
    tooltip: null,
  },
  {
    key: 'scratch_snapchat_carousel_template_sizes',
    name: 'Snapchat Carousel',
    tooltip: null,
  },
  {
    key: 'scratch_snapchat_dpa_template_sizes',
    name: 'Snapchat DPA',
    tooltip: null,
  },
  {
    key: 'scratch_snapchat_daba_template_sizes',
    name: 'Snapchat DABA',
    tooltip: null,
  },
  {
    key: 'scratch_snapchat_cpv_template_sizes',
    name: 'Snapchat CPV',
    tooltip: null,
  },
  {
    key: 'scratch_pinterest_static_template_sizes',
    name: 'Pinterest Static',
    tooltip: null,
  },
  {
    key: 'scratch_pinterest_video_template_sizes',
    name: 'Pinterest Video',
    tooltip: null,
  },
  {
    key: 'scratch_pinterest_carousel_template_sizes',
    name: 'Pinterest Carousel',
    tooltip: null,
  },
  {
    key: 'scratch_youtube_video_template_sizes',
    name: 'Youtube Video',
    tooltip: null,
  },
  {
    key: 'scratch_display_amazon_dsp_template_sizes',
    name: 'Amazon DSP Display',
    tooltip: null,
  },
  {
    key: 'scratch_displaytrade_desk_dsp_template_sizes',
    name: 'The Trade Desk DSP Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_yahoo_dsp_template_sizes',
    name: 'Yahoo DSP Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_google_customer_match_template_sizes',
    name: 'Google Customer Match Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_google_display_ad_rich_media_display_template_sizes',
    name: 'Google Display Ad - Rich Media Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_google_display_ad_standard_display_template_sizes',
    name: 'Google Display Ad - Standard Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_google_display_ad_image_video_template_sizes',
    name: 'Google Display Ad - Image/Video Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_google_ads_performance_max_image_video_template_sizes',
    name: 'Google Ads Performance Max - Image/Video Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_google_ads_display_ad_standard_display_template_sizes',
    name: 'Google Ads Display Ad - Standard Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_google_ads_demand_gen_template_sizes',
    name: 'Google Ads Demand Gen Display',
    tooltip: null,
  },
  {
    key: 'scratch_display_google_uac_template_sizes',
    name: 'Google UAC Display',
    tooltip: null,
  },

  // Reused
  {
    key: 'reuse_meta_static_template_sizes',
    name: 'Meta Static',
    tooltip: null,
  },
  {
    key: 'reuse_meta_video_template_sizes',
    name: 'Meta Video',
    tooltip: null,
  },
  {
    key: 'reuse_meta_carousel_template_sizes',
    name: 'Meta Carousel',
    tooltip: null,
  },
  {
    key: 'reuse_meta_dpa_template_sizes',
    name: 'Meta DPA',
    tooltip: null,
  },
  {
    key: 'reuse_meta_daba_template_sizes',
    name: 'Meta DABA',
    tooltip: null,
  },
  {
    key: 'reuse_meta_cpv_template_sizes',
    name: 'Meta CPV',
    tooltip: null,
  },
  {
    key: 'reuse_tiktok_static_template_sizes',
    name: 'TikTok Static',
    tooltip: null,
  },
  {
    key: 'reuse_tiktok_video_template_sizes',
    name: 'TikTok Video',
    tooltip: null,
  },
  { key: 'reuse_tiktok_vsa_template_sizes', name: 'TikTok VSA', tooltip: null },
  {
    key: 'reuse_tiktok_carousel_template_sizes',
    name: 'TikTok Carousel',
    tooltip: null,
  },
  {
    key: 'reuse_tiktok_dpa_template_sizes',
    name: 'TikTok DPA',
    tooltip: null,
  },
  {
    key: 'reuse_tiktok_daba_template_sizes',
    name: 'TikTok DABA',
    tooltip: null,
  },
  {
    key: 'reuse_tiktok_cpv_template_sizes',
    name: 'TikTok CPV',
    tooltip: null,
  },
  {
    key: 'reuse_snapchat_static_template_sizes',
    name: 'Snapchat Static',
    tooltip: null,
  },
  {
    key: 'reuse_snapchat_video_template_sizes',
    name: 'Snapchat Video',
    tooltip: null,
  },
  {
    key: 'reuse_snapchat_carousel_template_sizes',
    name: 'Snapchat Carousel',
    tooltip: null,
  },
  {
    key: 'reuse_snapchat_dpa_template_sizes',
    name: 'Snapchat DPA',
    tooltip: null,
  },
  {
    key: 'reuse_snapchat_daba_template_sizes',
    name: 'Snapchat DABA',
    tooltip: null,
  },
  {
    key: 'reuse_snapchat_cpv_template_sizes',
    name: 'Snapchat CPV',
    tooltip: null,
  },
  {
    key: 'reuse_pinterest_static_template_sizes',
    name: 'Pinterest Static',
    tooltip: null,
  },
  {
    key: 'reuse_pinterest_video_template_sizes',
    name: 'Pinterest Video',
    tooltip: null,
  },
  {
    key: 'reuse_pinterest_carousel_template_sizes',
    name: 'Pinterest Carousel',
    tooltip: null,
  },
  {
    key: 'reuse_youtube_video_template_sizes',
    name: 'Youtube Video',
    tooltip: null,
  },
  {
    key: 'reuse_display_amazon_dsp_template_sizes',
    name: 'Amazon DSP Display',
    tooltip: null,
  },
  {
    key: 'reuse_displaytrade_desk_dsp_template_sizes',
    name: 'The Trade Desk DSP Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_yahoo_dsp_template_sizes',
    name: 'Yahoo DSP Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_google_customer_match_template_sizes',
    name: 'Google Customer Match Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_google_display_ad_rich_media_display_template_sizes',
    name: 'Google Display Ad - Rich Media Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_google_display_ad_standard_display_template_sizes',
    name: 'Google Display Ad - Standard Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_google_display_ad_image_video_template_sizes',
    name: 'Google Display Ad - Image/Video Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_google_ads_performance_max_image_video_template_sizes',
    name: 'Google Ads Performance Max - Image/Video Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_google_ads_display_ad_standard_display_template_sizes',
    name: 'Google Ads Display Ad - Standard Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_google_ads_demand_gen_template_sizes',
    name: 'Google Ads Demand Gen Display',
    tooltip: null,
  },
  {
    key: 'reuse_display_google_uac_template_sizes',
    name: 'Google UAC Display',
    tooltip: null,
  },
];

export const thread_opts_with_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const thread_opts_with_ownership = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
];

export const thread_opts_with_ownership_and_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const thread_opts_for_assigned_teams = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'thread_resolve',
    name: 'Mark as Resolved',
    icon: <CheckCircleOutlineIcon color="success" />,
  },
  {
    key: 'thread_reject',
    name: 'Mark as Rejected',
    icon: <CancelIcon color="error" />,
  },
];

export const thread_opts_for_assigned_teams_with_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'thread_resolve',
    name: 'Mark as Resolved',
    icon: <CheckCircleOutlineIcon color="success" />,
  },
  {
    key: 'thread_reject',
    name: 'Mark as Rejected',
    icon: <CancelIcon color="error" />,
  },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const thread_opts_for_assigned_teams_with_ownership = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'thread_resolve',
    name: 'Mark as Resolved',
    icon: <CheckCircleOutlineIcon color="success" />,
  },
  {
    key: 'thread_reject',
    name: 'Mark as Rejected',
    icon: <CancelIcon color="error" />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
];

export const thread_opts_for_assigned_teams_with_ownership_and_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'thread_resolve',
    name: 'Mark as Resolved',
    icon: <CheckCircleOutlineIcon color="success" />,
  },
  {
    key: 'thread_reject',
    name: 'Mark as Rejected',
    icon: <CancelIcon color="error" />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const subtask_thread_opts = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'redirect_subtask', name: 'View Task', icon: <LaunchIcon /> },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const subtask_thread_opts_with_ownership = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'thread_edit', name: 'Edit thread', icon: <EditRoundedIcon /> },
  { key: 'thread_delete', name: 'Delete thread', icon: <DeleteIcon /> },
  { key: 'redirect_subtask', name: 'View Task', icon: <LaunchIcon /> },
  {
    key: 'thread_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const comment_opts_with_ownership = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'comment_edit', name: 'Edit comment', icon: <EditRoundedIcon /> },
  { key: 'comment_delete', name: 'Delete comment', icon: <DeleteIcon /> },
];

export const comment_opts_with_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  {
    key: 'comment_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const comment_opts_with_ownership_and_edit_history = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
  { key: 'comment_edit', name: 'Edit comment', icon: <EditRoundedIcon /> },
  { key: 'comment_delete', name: 'Delete comment', icon: <DeleteIcon /> },
  {
    key: 'comment_history',
    name: 'View History',
    icon: <HistoryOutlinedIcon />,
  },
];

export const default_thread_comment_opts = [
  {
    key: 'copy_link',
    name: 'Copy Link',
    icon: <CopyLinkIcon />,
  },
];

export const task_error_messages = [
  {
    key: `ID/UUID Not Found!`,
    status: 404,
    name: 'Task Not Found!',
  },
  {
    key: `Trying to get property 'campaign_id' of non-object`,
    status: 500,
    name: 'Subtask Not Found!',
  },
  {
    key: undefined,
    status: 0,
    name: `This might be an error on the server, please contact the administrator.`,
  },
  {
    key: undefined,
    status: 404,
    name: 'Task Not Found!',
  },
  {
    key: undefined,
    status: 408,
    name: `Request Timeout.`,
  },
  {
    key: undefined,
    status: 500,
    name: 'This might be an error on the server, please contact the administrator.',
  },
  {
    key: undefined,
    status: 504,
    name: `Gateway Timeout.`,
  },
];
