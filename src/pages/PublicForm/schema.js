const schema = {
  id: 'adweave',
  title: 'Smartly Creative Request Form',
  pages: [
    // Main Page
    {
      id: 'main_page',
      stepperTitle: 'General Information',
      title: 'Submit creative requests to Smartly',
      fields: [
        {
          id: 'user_email',
          type: 'text',
          label: 'Email',
          placeholder: 'Enter your email address',
          isRequired: true,
        },
        {
          id: 'watchers',
          type: 'multi_select_popup',
          label: 'Notify Team Members',
          placeholder: 'No items selected',
        },
        {
          id: 'title',
          type: 'text',
          label: 'Project Name',
          placeholder: 'Enter here',
          validators: ['maxChars:70'],
          isRequired: true,
        },
        {
          id: 'company_name',
          type: 'single_select_popup',
          label: 'Company/Brand',
          // placeholder: 'No items selected',
          popupInputPlaceholder: 'Enter here',
          allowCustom: true,
          showAddHelper: true,
          isRequired: true,
          options: [],
        },
        {
          id: 'customer_tier',
          type: 'single_select_popup',
          label: 'Customer Tier',
          isRequired: true,
          options: [
            {
              id: 'tier_1',
              value:
                'Tier 1',
            },
            {
              id: 'tier_2',
              value:
                'Tier 2',
            },
            {
              id: 'tier_3',
              value:
                'Tier 3',
            },
            {
              id: 'tier_4',
              value:
                'Tier 4',
            },
            {
              id: 'tier_5',
              value:
                'Tier 5',
            },
            {
              id: 'not_applicable',
              value:
                'Not Applicable',
            },
          ],
        },
        {
          id: 'region',
          type: 'single_select_popup',
          label: 'CS Region',
          isRequired: true,
          options: [
            {
              id: 'apac',
              value:
                'APAC',
            },
            {
              id: 'europe',
              value:
                'Europe',
            },
            {
              id: 'latam',
              value:
                'LatAm',
            },
            {
              id: 'mena',
              value:
                'MENA',
            },
            {
              id: 'noram',
              value:
                'NorAm',
            },
          ],
        },
        {
          id: 'request_type',
          type: 'single_select_popup',
          label: 'Which contract should this be billed?',
          isRequired: true,
          isCompact: true,
          showDividerAfter: true,
          options: [
            {
              id: 'creative_suite',
              value: 'Creative Suite',
            },
            { id: 'sparkworks', value: 'SparkWorks' },
            { id: 'cs_sw', value: 'Both CS & SW' },
            { id: 'no_existing_creative_contract', value: "No Existing Creative Contract" }
          ],
        },
        {
          id: 'creative_project_goals',
          type: 'long_text',
          label: 'Please tell us about your creative project and goals',
          placeholder:
            'Describe the campaign you need creatives for and what you hope to achieve',
          isRequired: true,
        },
        {
          id: 'markets',
          type: 'multi_select_popup',
          label: 'Target Markets',
          description: 'Select markets',
          placeholder: 'No items selected',
          isRequired: true,
          options: [
            { id: 'US', value: 'United States' },
            { id: 'CA', value: 'Canada' },
            { id: 'GB', value: 'United Kingdom' },
            { id: 'IE', value: 'Ireland' },
            { id: 'DE', value: 'Germany' },
            { id: 'FR', value: 'France' },
            { id: 'NL', value: 'Netherlands' },
            { id: 'BE', value: 'Belgium' },
            { id: 'LU', value: 'Luxembourg' },
            { id: 'CH', value: 'Switzerland' },
            { id: 'AT', value: 'Austria' },
            { id: 'SE', value: 'Sweden' },
            { id: 'NO', value: 'Norway' },
            { id: 'FI', value: 'Finland' },
            { id: 'DK', value: 'Denmark' },
            { id: 'IS', value: 'Iceland' },
            { id: 'ES', value: 'Spain' },
            { id: 'PT', value: 'Portugal' },
            { id: 'IT', value: 'Italy' },
            { id: 'GR', value: 'Greece' },
            { id: 'PL', value: 'Poland' },
            { id: 'CZ', value: 'Czech Republic' },
            { id: 'SK', value: 'Slovakia' },
            { id: 'HU', value: 'Hungary' },
            { id: 'EE', value: 'Estonia' },
            { id: 'CN', value: 'China' },
            { id: 'LV', value: 'Latvia' },
            { id: 'LT', value: 'Lithuania' },
            { id: 'AU', value: 'Australia' },
            { id: 'NZ', value: 'New Zealand' },
            { id: 'JP', value: 'Japan' },
            { id: 'KR', value: 'South Korea' },
            { id: 'SG', value: 'Singapore' },
            { id: 'HK', value: 'Hong Kong' },
            { id: 'TW', value: 'Taiwan' },
            { id: 'AE', value: 'United Arab Emirates' },
            { id: 'QA', value: 'Qatar' },
            { id: 'BH', value: 'Bahrain' },
            { id: 'KW', value: 'Kuwait' },
            { id: 'SA', value: 'Saudi Arabia' },
            { id: 'CL', value: 'Chile' },
            { id: 'UY', value: 'Uruguay' },
            { id: 'CR', value: 'Costa Rica' },
            { id: 'MX', value: 'Mexico' },
            { id: 'MY', value: 'Malaysia' },
            { id: 'TH', value: 'Thailand' },
            { id: 'VN', value: 'Vietnam' },
            { id: 'ID', value: 'Indonesia' },
            { id: 'PH', value: 'Philippines' },
            { id: 'IN', value: 'India' },
            { id: 'JO', value: 'Jordan' },
            { id: 'OM', value: 'Oman' },
            { id: 'MA', value: 'Morocco' },
            { id: 'EG', value: 'Egypt' },
            { id: 'BR', value: 'Brazil' },
            { id: 'CO', value: 'Colombia' },
            { id: 'PE', value: 'Peru' },
            { id: 'RO', value: 'Romania' },
            { id: 'BG', value: 'Bulgaria' },
            { id: 'HR', value: 'Croatia' },
            { id: 'SI', value: 'Slovenia' },
            { id: 'RS', value: 'Serbia' },
            { id: 'KZ', value: 'Kazakhstan' },
            { id: 'RU', value: 'Russia' },
            { id: 'BY', value: 'Belarus' },
            { id: 'IR', value: 'Iran' },
            { id: 'KP', value: 'North Korea' },
            { id: 'SY', value: 'Syria' },
            { id: 'SD', value: 'Sudan' },
            { id: 'MM', value: 'Myanmar' },
            { id: 'AF', value: 'Afghanistan' },
            { id: 'TR', value: 'Turkey' },
            { id: 'PK', value: 'Pakistan' },
            { id: 'NG', value: 'Nigeria' },
            { id: 'KE', value: 'Kenya' }
          ]
          ,
        },
        {
          id: 'languages',
          type: 'multi_select_popup',
          label: 'Languages',
          description: 'Select languages',
          placeholder: 'No items selected',
          isRequired: true,
          options: [
            { id: 'en', value: 'English' },
            { id: 'es', value: 'Spanish' },
            { id: 'fr', value: 'French' },
            { id: 'de', value: 'German' },
            { id: 'el-GR ', value: 'Greek' },
            { id: 'pt', value: 'Portuguese' },
            { id: 'it', value: 'Italian' },
            { id: 'nl', value: 'Dutch' },
            { id: 'ru', value: 'Russian' },
            { id: 'sv', value: 'Swedish' },
            { id: 'no', value: 'Norwegian' },
            { id: 'da', value: 'Danish' },
            { id: 'fi', value: 'Finnish' },
            { id: 'is', value: 'Icelandic' },
            { id: 'ga', value: 'Irish Gaelic' },
            { id: 'cy', value: 'Welsh' },
            { id: 'pl', value: 'Polish' },
            { id: 'cs', value: 'Czech' },
            { id: 'sk', value: 'Slovak' },
            { id: 'hu', value: 'Hungarian' },
            { id: 'ro', value: 'Romanian' },
            { id: 'bg', value: 'Bulgarian' },
            { id: 'hr', value: 'Croatian' },
            { id: 'sr', value: 'Serbian' },
            { id: 'bs', value: 'Bosnian' },
            { id: 'sl', value: 'Slovenian' },
            { id: 'et', value: 'Estonian' },
            { id: 'lv', value: 'Latvian' },
            { id: 'lt', value: 'Lithuanian' },
            { id: 'uk', value: 'Ukrainian' },
            { id: 'kk', value: 'Kazakh' },
            { id: 'ar', value: 'Arabic' },
            { id: 'he', value: 'Hebrew' },
            { id: 'tr', value: 'Turkish' },
            { id: 'fa', value: 'Persian (Farsi)' },
            { id: 'ku', value: 'Kurdish' },
            { id: 'sw', value: 'Swahili' },
            { id: 'af', value: 'Afrikaans' },
            { id: 'am', value: 'Amharic' },
            { id: 'so', value: 'Somali' },
            { id: 'ha', value: 'Hausa' },
            { id: 'yo', value: 'Yoruba' },
            { id: 'zu', value: 'Zulu' },
            { id: 'hi', value: 'Hindi' },
            { id: 'bn', value: 'Bengali' },
            { id: 'ta', value: 'Tamil' },
            { id: 'te', value: 'Telugu' },
            { id: 'kn', value: 'Kannada' },
            { id: 'ml', value: 'Malayalam' },
            { id: 'mr', value: 'Marathi' },
            { id: 'gu', value: 'Gujarati' },
            { id: 'pa', value: 'Punjabi' },
            { id: 'ur', value: 'Urdu' },
            { id: 'si', value: 'Sinhala' },
            { id: 'ne', value: 'Nepali' },
            { id: 'zh', value: 'Chinese (Simplified)' },
            { id: 'zh-Hant', value: 'Chinese (Traditional)' },
            { id: 'yue', value: 'Cantonese' },
            { id: 'ja', value: 'Japanese' },
            { id: 'ko', value: 'Korean' },
            { id: 'vi', value: 'Vietnamese' },
            { id: 'th', value: 'Thai' },
            { id: 'id', value: 'Indonesian' },
            { id: 'ms', value: 'Malay' },
            { id: 'tl', value: 'Filipino / Tagalog' },
            { id: 'qu', value: 'Quechua' },
            { id: 'gn', value: 'Guarani' },
            { id: 'ay', value: 'Aymara' },
            { id: 'ca', value: 'Catalan' },
            { id: 'my', value: 'Burmese' },
            { id: 'km', value: 'Khmer' },
            { id: 'lo', value: 'Lao' },
            { id: 'mn', value: 'Mongolian' },
            { id: 'as', value: 'Assamese' },
            { id: 'or', value: 'Odia' },
            { id: 'sd', value: 'Sindhi' },
            { id: 'ig', value: 'Igbo' },
            { id: 'om', value: 'Oromo' },
            { id: 'sn', value: 'Shona' },
            { id: 'zgh', value: 'Berber (Tamazight)' },
            { id: 'az', value: 'Azerbaijani' },
            { id: 'uz', value: 'Uzbek' },
            { id: 'ps', value: 'Pashto' },
            { id: 'eu', value: 'Basque' },
            { id: 'gl', value: 'Galician' },
            { id: 'mi', value: 'Maori' },
            { id: 'haw', value: 'Hawaiian' },
            { id: 'fr-CA', value: 'Quebec French' },
            { id: 'gsw', value: 'Swiss German' },
            { id: 'be', value: 'Belarusian' }
          ],
        },
        { id: "delivery_notice", type: "alert", description: 'For delivery in under 10 days, leave the estimated delivery date or estimated campaign end date blank — we’ll follow up with timeline.' },
        {
          id: 'campaign_launch_date',
          type: 'date',
          label: 'Estimated Delivery Date',
        },
        {
          id: 'campaign_end_date',
          type: 'date',
          label: 'Estimated Campaign End Date',
          toggleFieldId: 'campaign_end_date_flag',
          toggleLabel: 'Always On',
        },
        {
          id: 'assets',
          type: 'multi_text',
          label: 'Assets',
          description: 'Provide asset labels and URLs',
          isRequired: true,
          validators: ['url'],
          rowFields: [
            {
              key: 'label',
              label: 'Label',
              placeholder: 'Enter asset label',
            },
            {
              key: 'link',
              label: 'Asset Link',
              placeholder: 'Enter asset URL',
            },
          ],
        },
        {
          id: 'assets_instructions',
          type: 'long_text',
          label: 'Assets Instructions',
          isRequired: true,
        },
      ],
    },

    // Creative Suite
    {
      id: 'creative_suite_page',
      stepperTitle: 'Core Production',
      parentId: 'brief',
      title: 'Creative Suite',
      showIf: {
        any:
          [
            { q: 'request_type', op: 'eq', value: 'creative_suite' },
            { q: 'request_type', op: 'eq', value: 'cs_sw' },
          ],
      },
      fields: [
        {
          id: "needs_concepting",
          type: "single_select",
          label: "Do you need concepting/ideation?",
          isRequired: true,
          options: [
            { id: "yes", value: "Yes" },
            { id: "no", value: "No" }
          ]
        }
      ]
    },

    // Creative Suite - No need concepting
    {
      id: 'creative_suite_no_concepting_page',
      stepperTitle: 'Core Production',
      parentId: 'brief',
      title: 'Creative Suite',
      showIf: {
        all: [
          { q: 'request_type', op: 'in', value: ['creative_suite', 'cs_sw'] },
          { q: 'needs_concepting', op: 'eq', value: 'no' }
        ]
      },
      fields: [
        {
          id: 'dynamic_elements',
          type: 'long_text',
          label: 'Dynamic Elements',
          placeholder:
            'Enter here...',
        },
        {
          id: 'advance_features',
          type: 'long_text',
          label: 'Advance Features',
          placeholder:
            'Enter here...',
        },
        {
          id: 'animations',
          type: 'long_text',
          label: 'Animations',
          placeholder:
            'Enter here...',
        },
      ]
    },

    // Stage Funnel
    {
      id: 'stage_funnel_page',
      stepperTitle: 'Core Production',
      parentId: 'brief',
      showIf: {
        any:
          [
            { q: 'request_type', op: 'eq', value: 'sparkworks' },
            { q: 'request_type', op: 'eq', value: 'no_existing_creative_contract' },
            { q: 'needs_concepting', op: 'eq', value: 'yes' }
          ],
      },
      fields: [
        {
          id: 'stage_funnel_targeting',
          type: 'multi_select',
          label: 'What stage of the funnel is your creative project targeting?',
          description: 'Select all that apply',
          isRequired: true,
          options: [
            { id: 'UF', value: 'Upper Funnel (Awareness / Reach)' },
            { id: 'MF', value: 'Middle Funnel (Consideration / Engagement)' },
            {
              id: 'LF',
              value: 'Lower Funnel (Retargeting / Personalization)',
            },
            { id: 'FF', value: 'Full Funnel Targeting' },
          ],
        },
      ]
    },

    // Creative Templates
    {
      id: "existing_creative_templates_page",
      stepperTitle: 'Core Production',
      parentId: 'brief',
      fields: [
        {
          id: 'existing_creative_templates',
          type: 'single_select',
          label: 'Will this project be built on existing creative templates?',
          description: 'Select at least one from the options',
          isRequired: true,
          options: [
            {
              id: 'scratch_raw_assets',
              value:
                'We’re starting from scratch and I only have raw assets to share (images, video, brand guidelines, etc.)',
              price: '12000',
            },
            {
              id: 'scratch_working_files',
              value:
                'We’re starting from scratch but I have layered working files (PSD or Figma)',
            },
            {
              id: 'reusing_existing_templates',
              value: 'Yes, we’re reusing / updating existing templates',
            },
          ]
        }],
    },

    // Scratch - Platforms advertising on
    {
      id: 'scratch_platforms_advertising_on_page',
      stepperTitle: 'Channels',
      parentId: 'brief',
      title: 'Platforms',
      showIf: {
        all: [
          {
            q: 'existing_creative_templates',
            op: 'in',
            value: ["scratch_raw_assets", "scratch_working_files"],
          },
        ],
      },
      fields: [
        {
          id: 'scratch_platforms_advertising_on',
          type: 'multi_select',
          label: 'For which platform do you need the creatives for?',
          description: 'Select all that apply',
          isRequired: true,
          options: [
            { id: 'meta', value: 'Meta' },
            { id: 'tiktok', value: 'TikTok' },
            { id: 'snapchat', value: 'Snapchat' },
            { id: 'pinterest', value: 'Pinterest' },
            { id: 'youtube', value: 'YouTube' },
            { id: 'display', value: 'Display' },
            { id: 'dsp', value: 'DSP' },
            { id: 'google_ads', value: 'Google Ads' },
          ],
        },
      ],
    },

    // Scratch - Template formats
    {
      id: 'scratch_template_formats_page',
      stepperTitle: 'Formats',
      parentId: 'brief',
      title: "Template Formats",
      showIf: {
        all: [
          {
            q: 'existing_creative_templates',
            op: 'in',
            value: ["scratch_raw_assets", "scratch_working_files"],
          },
        ],
      },
      fields: [
        {
          id: 'scratch_meta_template_formats',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'meta',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            { id: 'carousel', value: 'Carousel', price: '4500' },
            { id: 'dpa', value: 'DPA', price: '3500' },
            { id: 'daba', value: 'DABA', price: '3500' },
            { id: 'cpv', value: 'CPV', price: '3500' },
          ],
        },
        {
          id: 'scratch_tiktok_template_formats',
          type: 'multi_select',
          startIcon: 'tiktok',
          label: 'TikTok',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'tiktok',
          },
          isCompact: true,
          isRequired: true,
          options: [
            // { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            { id: 'vsa', value: 'VSA', price: '3500' },
            // { id: 'carousel', value: 'Carousel', price: '4500' },
            // { id: 'dpa', value: 'DPA', price: '3500' },
            // { id: 'daba', value: 'DABA', price: '3500' },
            // { id: 'cpv', value: 'CPV', price: '3500' },
          ],
        },
        {
          id: 'scratch_snapchat_template_formats',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'snapchat',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            { id: 'carousel', value: 'Carousel', price: '4500' },
            { id: 'dpa', value: 'DPA', price: '3500' },
            { id: 'daba', value: 'DABA', price: '3500' },
            { id: 'cpv', value: 'CPV', price: '3500' },
          ],
        },
        {
          id: 'scratch_pinterest_template_formats',
          type: 'multi_select',
          startIcon: 'pinterest',
          label: 'Pinterest',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'pinterest',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            { id: 'carousel', value: 'Carousel', price: '3500' },
          ],
        },
        {
          id: 'scratch_youtube_template_formats',
          type: 'multi_select',
          startIcon: 'youtube',
          label: 'YouTube',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'youtube',
          },
          isCompact: true,
          isRequired: true,
          options: [
            // { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            // { id: 'carousel', value: 'Carousel', price: '4500' },
          ],
        },
        {
          id: 'scratch_display_template_formats',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Display',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'display',
          },
          isCompact: { columns: 2 },
          isRequired: true,
          options: [
            // { id: 'amazon_dsp', value: 'Amazon DSP', price: '10000' },
            // { id: 'trade_desk_dsp', value: 'The Trade Desk DSP', price: '10000' },
            // { id: 'yahoo_dsp', value: 'Yahoo DSP', price: '10000' },
            { id: 'google_customer_match', value: 'Google Customer Match', price: '10000' },
            { id: 'google_display_ad_rich_media_display', value: 'Google Display Ad - Rich Media Display', price: '10000' },
            { id: 'google_display_ad_standard_display', value: 'Google Display Ad - Standard Display', price: '10000' },
            { id: 'google_display_ad_image_video', value: 'Google Display Ad - Image/Video', price: '10000' },
            // { id: 'google_ads_performance_max_image_video', value: 'Google Ads Performance Max - Image/Video', price: '10000' },
            // { id: 'google_ads_display_ad_standard_display', value: 'Google Ads Display Ad - Standard Display', price: '10000' },
            // { id: 'google_ads_demand_gen', value: 'Google Ads Demand Gen', price: '10000' },
            // { id: 'google_uac', value: 'Google UAC', price: '10000' },
          ],
        },
        {
          id: 'scratch_amazon_dsp_template_formats',
          type: 'multi_select',
          startIcon: 'amazon',
          label: 'Amazon DSP',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'dsp',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'display', value: 'Display', price: '10000' },
            { id: 'online_video', value: 'Online Video', price: '10000' },
            { id: 'ctv', value: 'CTV', price: '10000' },
          ],
        },
        {
          id: 'scratch_trade_desk_dsp_template_formats',
          type: 'multi_select',
          startIcon: 'trade_desk',
          label: 'The Trade Desk DSP',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'dsp',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'display', value: 'Display (Image Only)', price: '10000' },
            { id: 'online_video', value: 'Online Video', price: '10000' },
            { id: 'ctv', value: 'CTV', price: '10000' },
          ],
        },
        {
          id: 'scratch_yahoo_dsp_template_formats',
          type: 'multi_select',
          startIcon: 'yahoo',
          label: 'Yahoo DSP',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'dsp',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'display', value: 'Display', price: '10000' },
            { id: 'online_video', value: 'Online Video', price: '10000' },
            { id: 'ctv', value: 'CTV', price: '10000' },
          ],
        },
        {
          id: 'scratch_google_ads_template_formats',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Ads',
          description: 'Select template formats you need',
          showIf: {
            q: 'scratch_platforms_advertising_on',
            op: 'contains',
            value: 'google_ads',
          },
          isCompact: { columns: 2 },
          isRequired: true,
          options: [
            { id: 'google_ads_performance_max_image_video', value: 'Google Ads Performance Max - Image/Video', price: '10000' },
            { id: 'google_ads_display_ad_standard_display', value: 'Google Ads Display Ad - Standard Display', price: '10000' },
            { id: 'google_ads_demand_gen', value: 'Google Ads Demand Gen', price: '10000' },
            { id: 'google_uac', value: 'Google UAC', price: '10000' },
          ],
        },
      ],
    },

    // Scratch - Template sizes
    {
      id: 'scratch_template_sizes_need_page',
      stepperTitle: 'Sizes',
      parentId: 'brief',
      title: 'Template Sizes',
      showIf: {
        all: [
          {
            q: 'existing_creative_templates',
            op: 'in',
            value: ["scratch_raw_assets", "scratch_working_files"],
          },
        ],
      },
      fields: [
        // Meta
        {
          id: 'scratch_meta_static_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta Static',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'scratch_meta_template_formats',
                op: 'contains',
                value: 'static',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'scratch_meta_video_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'scratch_meta_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'scratch_meta_carousel_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta Carousel ',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'scratch_meta_template_formats',
                op: 'contains',
                value: 'carousel',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'scratch_meta_dpa_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta DPA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'scratch_meta_template_formats',
                op: 'contains',
                value: 'dpa',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'scratch_meta_daba_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta DABA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'scratch_meta_template_formats',
                op: 'contains',
                value: 'daba',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'scratch_meta_cpv_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta CPV',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'scratch_meta_template_formats',
                op: 'contains',
                value: 'cpv',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },

        // TikTok
        // {
        //   id: 'scratch_tiktok_static_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok Static',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'scratch_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'scratch_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'static',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },
        {
          id: 'scratch_tiktok_video_template_sizes',
          type: 'multi_select',
          startIcon: 'tiktok',
          label: 'TikTok Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'tiktok',
              },
              {
                q: 'scratch_tiktok_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'scratch_tiktok_vsa_template_sizes',
          type: 'multi_select',
          startIcon: 'tiktok',
          label: 'TikTok VSA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'tiktok',
              },
              {
                q: 'scratch_tiktok_template_formats',
                op: 'contains',
                value: 'vsa',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        // {
        //   id: 'scratch_tiktok_carousel_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok Carousel ',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'scratch_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'scratch_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'carousel',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },
        // {
        //   id: 'scratch_tiktok_dpa_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok DPA',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'scratch_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'scratch_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'dpa',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },
        // {
        //   id: 'scratch_tiktok_daba_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok DABA',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'scratch_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'scratch_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'daba',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },
        // {
        //   id: 'scratch_tiktok_cpv_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok CPV',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'scratch_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'scratch_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'cpv',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },

        // Snapchat
        {
          id: 'scratch_snapchat_static_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat Static',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'scratch_snapchat_template_formats',
                op: 'contains',
                value: 'static',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'scratch_snapchat_video_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'scratch_snapchat_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'scratch_snapchat_carousel_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat Carousel ',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'scratch_snapchat_template_formats',
                op: 'contains',
                value: 'carousel',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'scratch_snapchat_dpa_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat DPA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'scratch_snapchat_template_formats',
                op: 'contains',
                value: 'ddpa',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'scratch_snapchat_daba_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat DABA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'scratch_snapchat_template_formats',
                op: 'contains',
                value: 'daba',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'scratch_snapchat_cpv_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat CPV',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'scratch_snapchat_template_formats',
                op: 'contains',
                value: 'cpv',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },

        // Pinterest
        {
          id: 'scratch_pinterest_static_template_sizes',
          type: 'multi_select',
          startIcon: 'pinterest',
          label: 'Pinterest Static',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'pinterest',
              },
              {
                q: 'scratch_pinterest_template_formats',
                op: 'contains',
                value: 'static',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '4:3', value: '4:3' },
          ],
        },
        {
          id: 'scratch_pinterest_video_template_sizes',
          type: 'multi_select',
          startIcon: 'pinterest',
          label: 'Pinterest Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'pinterest',
              },
              {
                q: 'scratch_pinterest_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'scratch_pinterest_carousel_template_sizes',
          type: 'multi_select',
          startIcon: 'pinterest',
          label: 'Pinterest Carousel ',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'pinterest',
              },
              {
                q: 'scratch_pinterest_template_formats',
                op: 'contains',
                value: 'carousel',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          options: [
            { id: '4:3', value: '4:3' },
          ],
        },

        // Youtube
        // {
        //   id: 'scratch_youtube_static_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'youtube',
        //   label: 'Youtube Static',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'scratch_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'youtube',
        //       },
        //       {
        //         q: 'scratch_youtube_template_formats',
        //         op: 'contains',
        //         value: 'static',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //     { id: '16:9', value: '16:9' },
        //   ],
        // },
        {
          id: 'scratch_youtube_video_template_sizes',
          type: 'multi_select',
          startIcon: 'youtube',
          label: 'Youtube Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'youtube',
              },
              {
                q: 'scratch_youtube_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        // {
        //   id: 'scratch_youtube_carousel_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'youtube',
        //   label: 'Youtube Carousel ',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'scratch_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'youtube',
        //       },
        //       {
        //         q: 'scratch_youtube_template_formats',
        //         op: 'contains',
        //         value: 'carousel',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //     { id: '16:9', value: '16:9' },
        //   ],
        // },

        // Display
        {
          id: 'scratch_display_amazon_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Amazon DSP Display ',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'scratch_display_template_formats',
                op: 'contains',
                value: 'amazon_dsp',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ],
        },
        {
          id: 'scratch_displaytrade_desk_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'The Trade Desk DSP Display ',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'scratch_display_template_formats',
                op: 'contains',
                value: 'trade_desk_dsp',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_display_yahoo_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Yahoo DSP Display ',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'scratch_display_template_formats',
                op: 'contains',
                value: 'yahoo_dsp',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_display_google_customer_match_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Customer Match Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'scratch_display_template_formats',
                op: 'contains',
                value: 'google_customer_match',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_display_google_display_ad_rich_media_display_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Display Ad - Rich Media Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'scratch_display_template_formats',
                op: 'contains',
                value: 'google_display_ad_rich_media_display',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_display_google_display_ad_standard_display_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Display Ad - Standard Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'scratch_display_template_formats',
                op: 'contains',
                value: 'google_display_ad_standard_display',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_display_google_display_ad_image_video_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Display Ad - Image/Video Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'scratch_display_template_formats',
                op: 'contains',
                value: 'google_display_ad_image_video',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },

        // Google Ads
        {
          id: 'scratch_display_google_ads_performance_max_image_video_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Ads Performance Max - Image/Video Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'google_ads',
              },
              {
                q: 'scratch_google_ads_template_formats',
                op: 'contains',
                value: 'google_ads_performance_max_image_video',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_display_google_ads_display_ad_standard_display_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Ads Display Ad - Standard Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'google_ads',
              },
              {
                q: 'scratch_google_ads_template_formats',
                op: 'contains',
                value: 'google_ads_display_ad_standard_display',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_display_google_ads_demand_gen_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Ads Demand Gen Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'google_ads',
              },
              {
                q: 'scratch_google_ads_template_formats',
                op: 'contains',
                value: 'google_ads_demand_gen',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_display_google_uac_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google UAC Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'google_ads',
              },
              {
                q: 'scratch_google_ads_template_formats',
                op: 'contains',
                value: 'google_uac',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },

        // Amazon DSP
        {
          id: 'scratch_display_amazon_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'amazon',
          label: 'Amazon DSP Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_amazon_dsp_template_formats',
                op: 'contains',
                value: 'display',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_online_video_amazon_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'amazon',
          label: 'Amazon DSP Online Video',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_amazon_dsp_template_formats',
                op: 'contains',
                value: 'online_video',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'scratch_ctv_amazon_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'amazon',
          label: 'Amazon DSP CTV',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_amazon_dsp_template_formats',
                op: 'contains',
                value: 'ctv',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },

        // The Trade Desk DSP
        {
          id: 'scratch_display_trade_desk_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'trade_desk',
          label: 'Trade Desk DSP Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_trade_desk_dsp_template_formats',
                op: 'contains',
                value: 'display',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_online_video_trade_desk_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'trade_desk',
          label: 'Trade Desk DSP Online Video',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_trade_desk_dsp_template_formats',
                op: 'contains',
                value: 'online_video',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'scratch_ctv_trade_desk_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'trade_desk',
          label: 'Trade Desk DSP CTV',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_trade_desk_dsp_template_formats',
                op: 'contains',
                value: 'ctv',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },

        // Yahoo DSP
        {
          id: 'scratch_display_yahoo_template_sizes',
          type: 'multi_select',
          startIcon: 'yahoo',
          label: 'Yahoo DSP Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_yahoo_dsp_template_formats',
                op: 'contains',
                value: 'display',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'scratch_online_video_yahoo_template_sizes',
          type: 'multi_select',
          startIcon: 'yahoo',
          label: 'Yahoo DSP Online Video',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_yahoo_dsp_template_formats',
                op: 'contains',
                value: 'online_video',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'scratch_ctv_yahoo_template_sizes',
          type: 'multi_select',
          startIcon: 'yahoo',
          label: 'Yahoo DSP CTV',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'scratch_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'scratch_yahoo_dsp_template_formats',
                op: 'contains',
                value: 'ctv',
              }
            ]
          },
          checkboxes: [{ id: "needs_iterations", label: "I'll need adjustment or variation of an existing Master Template" }],
          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
      ],
    },

    // Reusing/Updating Existing Templates
    {
      id: 'newsize_or_rebuild_page',
      stepperTitle: 'Core Production',
      parentId: 'brief',
      showIf: {
        q: 'existing_creative_templates',
        op: 'eq',
        value: 'reusing_existing_templates',
      },
      fields: [
        {
          id: 'newsize_or_rebuild',
          type: 'single_select',
          label: 'Are you resizing or updating existing templates?',
          isRequired: true,
          options: [
            { id: 'newsize_existing', value: 'Add new size from existing' },
            { id: 'rebuild_existing', value: 'Rebuild' },
          ],
        },
      ],
    },

    // Reusing/Updating Existing Templates - Newsize/Rebuild - Platforms advertising on
    {
      id: 'reuse_platforms_advertising_on_page',
      stepperTitle: 'Channels',
      parentId: 'brief',
      title: 'Platforms',
      showIf: {
        q: 'existing_creative_templates',
        op: 'eq',
        value: "reusing_existing_templates",
      },
      fields: [
        {
          id: 'reuse_platforms_advertising_on',
          type: 'multi_select',
          label: 'For which platform do you need the creatives for?',
          description: 'Select all that apply',
          isRequired: true,
          options: [
            { id: 'meta', value: 'Meta' },
            { id: 'tiktok', value: 'TikTok' },
            { id: 'snapchat', value: 'Snapchat' },
            { id: 'pinterest', value: 'Pinterest' },
            { id: 'youtube', value: 'YouTube' },
            { id: 'display', value: 'Display' },
            { id: 'dsp', value: 'DSP' },
            { id: 'google_ads', value: 'Google Ads' },
          ],
        },
      ],
    },

    // Reusing/Updating Existing Templates - Newsize/Rebuild - Template formats
    {
      id: 'reuse_template_formats_page',
      stepperTitle: 'Formats',
      parentId: 'brief',
      title: "Template Formats",
      showIf: {
        q: 'existing_creative_templates',
        op: 'eq',
        value: "reusing_existing_templates",
      },
      fields: [
        {
          id: 'reuse_meta_template_formats',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'meta',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            { id: 'carousel', value: 'Carousel', price: '4500' },
            { id: 'dpa', value: 'DPA', price: '3500' },
            { id: 'daba', value: 'DABA', price: '3500' },
            { id: 'cpv', value: 'CPV', price: '3500' },
          ],
        },
        {
          id: 'reuse_tiktok_template_formats',
          type: 'multi_select',
          startIcon: 'tiktok',
          label: 'TikTok',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'tiktok',
          },
          isCompact: true,
          isRequired: true,
          options: [
            // { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            { id: 'vsa', value: 'VSA', price: '3500' },
            // { id: 'carousel', value: 'Carousel', price: '4500' },
            // { id: 'dpa', value: 'DPA', price: '3500' },
            // { id: 'daba', value: 'DABA', price: '3500' },
            // { id: 'cpv', value: 'CPV', price: '3500' },
          ],
        },
        {
          id: 'reuse_snapchat_template_formats',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'snapchat',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            { id: 'carousel', value: 'Carousel', price: '4500' },
            { id: 'dpa', value: 'DPA', price: '3500' },
            { id: 'daba', value: 'DABA', price: '3500' },
            { id: 'cpv', value: 'CPV', price: '3500' },
          ],
        },
        {
          id: 'reuse_pinterest_template_formats',
          type: 'multi_select',
          startIcon: 'pinterest',
          label: 'Pinterest',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'pinterest',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            { id: 'carousel', value: 'Carousel', price: '3500' },
          ],
        },
        {
          id: 'reuse_youtube_template_formats',
          type: 'multi_select',
          startIcon: 'youtube',
          label: 'YouTube',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'youtube',
          },
          isCompact: true,
          isRequired: true,
          options: [
            // { id: 'static', value: 'Static', price: '3500' },
            { id: 'video', value: 'Video', price: '3500' },
            // { id: 'carousel', value: 'Carousel', price: '4500' },
          ],
        },
        {
          id: 'reuse_display_template_formats',
          type: 'multi_select',
          label: 'Display',
          startIcon: 'google',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'display',
          },
          isCompact: { columns: 2 },
          isRequired: true,
          options: [
            { id: 'amazon_dsp', value: 'Amazon DSP', price: '10000' },
            { id: 'trade_desk_dsp', value: 'The Trade Desk DSP', price: '10000' },
            { id: 'yahoo_dsp', value: 'Yahoo DSP', price: '10000' },
            // { id: 'google_customer_match', value: 'Google Customer Match', price: '10000' },
            // { id: 'google_display_ad_rich_media_display', value: 'Google Display Ad - Rich Media Display', price: '10000' },
            // { id: 'google_display_ad_standard_display', value: 'Google Display Ad - Standard Display', price: '10000' },
            // { id: 'google_display_ad_image_video', value: 'Google Display Ad - Image/Video', price: '10000' },
            // { id: 'google_ads_performance_max_image_video', value: 'Google Ads Performance Max - Image/Video', price: '10000' },
            // { id: 'google_ads_display_ad_standard_display', value: 'Google Ads Display Ad - Standard Display', price: '10000' },
            // { id: 'google_ads_demand_gen', value: 'Google Ads Demand Gen', price: '10000' },
            // { id: 'google_uac', value: 'Google UAC', price: '10000' },
          ],
        },
        {
          id: 'reuse_amazon_dsp_template_formats',
          type: 'multi_select',
          startIcon: 'amazon',
          label: 'Amazon DSP',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'dsp',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'display', value: 'Display', price: '10000' },
            { id: 'online_video', value: 'Online Video', price: '10000' },
            { id: 'ctv', value: 'CTV', price: '10000' },
          ],
        },
        {
          id: 'reuse_trade_desk_dsp_template_formats',
          type: 'multi_select',
          startIcon: 'trade_desk',
          label: 'The Trade Desk DSP',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'dsp',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'display', value: 'Display (Image Only)', price: '10000' },
            { id: 'online_video', value: 'Online Video', price: '10000' },
            { id: 'ctv', value: 'CTV', price: '10000' },
          ],
        },
        {
          id: 'reuse_yahoo_dsp_template_formats',
          type: 'multi_select',
          startIcon: 'yahoo',
          label: 'Yahoo DSP',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'dsp',
          },
          isCompact: true,
          isRequired: true,
          options: [
            { id: 'display', value: 'Display', price: '10000' },
            { id: 'online_video', value: 'Online Video', price: '10000' },
            { id: 'ctv', value: 'CTV', price: '10000' },
          ],
        },
        {
          id: 'reuse_google_ads_template_formats',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Ads',
          description: 'Select template formats you need',
          showIf: {
            q: 'reuse_platforms_advertising_on',
            op: 'contains',
            value: 'google_ads',
          },
          isCompact: { columns: 2 },
          isRequired: true,
          options: [
            { id: 'google_ads_performance_max_image_video', value: 'Google Ads Performance Max - Image/Video', price: '10000' },
            { id: 'google_ads_display_ad_standard_display', value: 'Google Ads Display Ad - Standard Display', price: '10000' },
            { id: 'google_ads_demand_gen', value: 'Google Ads Demand Gen', price: '10000' },
            { id: 'google_uac', value: 'Google UAC', price: '10000' },
          ],
        },
      ],
    },

    // Reusing/Updating Existing Templates - Newsize/Rebuild - Template sizes
    {
      id: 'reuse_template_sizes_need_page',
      stepperTitle: 'Sizes',
      parentId: 'brief',
      title: 'Template Sizes',
      showIf: {
        q: 'existing_creative_templates',
        op: 'eq',
        value: "reusing_existing_templates",
      },
      fields: [
        // Meta
        {
          id: 'reuse_meta_static_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta Static',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'reuse_meta_template_formats',
                op: 'contains',
                value: 'static',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'reuse_meta_video_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'reuse_meta_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'reuse_meta_carousel_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta Carousel ',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'reuse_meta_template_formats',
                op: 'contains',
                value: 'carousel',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'reuse_meta_dpa_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta DPA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'reuse_meta_template_formats',
                op: 'contains',
                value: 'dpa',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'reuse_meta_daba_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta DABA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'reuse_meta_template_formats',
                op: 'contains',
                value: 'daba',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'reuse_meta_cpv_template_sizes',
          type: 'multi_select',
          startIcon: 'meta',
          label: 'Meta CPV',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'meta',
              },
              {
                q: 'reuse_meta_template_formats',
                op: 'contains',
                value: 'cpv',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },

        // TikTok
        // {
        //   id: 'reuse_tiktok_static_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok Static',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'reuse_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'reuse_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'static',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },
        {
          id: 'reuse_tiktok_video_template_sizes',
          type: 'multi_select',
          startIcon: 'tiktok',
          label: 'TikTok Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'tiktok',
              },
              {
                q: 'reuse_tiktok_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'reuse_tiktok_vsa_template_sizes',
          type: 'multi_select',
          startIcon: 'tiktok',
          label: 'TikTok VSA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'tiktok',
              },
              {
                q: 'reuse_tiktok_template_formats',
                op: 'contains',
                value: 'vsa',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        // {
        //   id: 'reuse_tiktok_carousel_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok Carousel ',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'reuse_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'reuse_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'carousel',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },
        // {
        //   id: 'reuse_tiktok_dpa_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok DPA',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'reuse_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'reuse_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'dpa',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },
        // {
        //   id: 'reuse_tiktok_daba_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok DABA',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'reuse_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'reuse_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'daba',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },
        // {
        //   id: 'reuse_tiktok_cpv_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'tiktok',
        //   label: 'TikTok CPV',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'reuse_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'tiktok',
        //       },
        //       {
        //         q: 'reuse_tiktok_template_formats',
        //         op: 'contains',
        //         value: 'cpv',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //   ],
        // },

        // Snapchat
        {
          id: 'reuse_snapchat_static_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat Static',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'reuse_snapchat_template_formats',
                op: 'contains',
                value: 'static',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'reuse_snapchat_video_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'reuse_snapchat_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'reuse_snapchat_carousel_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat Carousel ',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'reuse_snapchat_template_formats',
                op: 'contains',
                value: 'carousel',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'reuse_snapchat_dpa_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat DPA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'reuse_snapchat_template_formats',
                op: 'contains',
                value: 'dpa',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'reuse_snapchat_daba_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat DABA',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'reuse_snapchat_template_formats',
                op: 'contains',
                value: 'daba',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },
        {
          id: 'reuse_snapchat_cpv_template_sizes',
          type: 'multi_select',
          startIcon: 'snapchat',
          label: 'Snapchat CPV',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'snapchat',
              },
              {
                q: 'reuse_snapchat_template_formats',
                op: 'contains',
                value: 'cpv',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '1:1', value: '1:1' },
            { id: '4:5', value: '4:5' },
            { id: '9:16', value: '9:16' },
          ],
        },

        // Pinterest
        {
          id: 'reuse_pinterest_static_template_sizes',
          type: 'multi_select',
          startIcon: 'pinterest',
          label: 'Pinterest Static',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'pinterest',
              },
              {
                q: 'reuse_pinterest_template_formats',
                op: 'contains',
                value: 'static',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '4:3', value: '4:3' },
          ],
        },
        {
          id: 'reuse_pinterest_video_template_sizes',
          type: 'multi_select',
          startIcon: 'pinterest',
          label: 'Pinterest Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'pinterest',
              },
              {
                q: 'reuse_pinterest_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'reuse_pinterest_carousel_template_sizes',
          type: 'multi_select',
          startIcon: 'pinterest',
          label: 'Pinterest Carousel ',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'pinterest',
              },
              {
                q: 'reuse_pinterest_template_formats',
                op: 'contains',
                value: 'carousel',
              }
            ]
          },
          isCompact: true,
          isRequired: true,
          allowCustom: true,
          options: [
            { id: '4:3', value: '4:3' },
          ],
        },

        // Youtube
        // {
        //   id: 'reuse_youtube_static_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'youtube',
        //   label: 'Youtube Static',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     all: [
        //       {
        //         q: 'reuse_platforms_advertising_on',
        //         op: 'contains',
        //         value: 'youtube',
        //       },
        //       {
        //         q: 'reuse_youtube_template_formats',
        //         op: 'contains',
        //         value: 'static',
        //       }
        //     ]
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //     { id: '16:9', value: '16:9' },
        //   ],
        // },
        {
          id: 'reuse_youtube_video_template_sizes',
          type: 'multi_select',
          startIcon: 'youtube',
          label: 'Youtube Video',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'youtube',
              },
              {
                q: 'reuse_youtube_template_formats',
                op: 'contains',
                value: 'video',
              }
            ]
          },
          isCompact: { columns: 2 },
          isRequired: true,
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        // {
        //   id: 'reuse_youtube_carousel_template_sizes',
        //   type: 'multi_select',
        //   startIcon: 'youtube',
        //   label: 'Youtube Carousel ',
        //   description: 'Select template sizes you need',
        //   showIf: {
        //     q: 'reuse_youtube_template_formats',
        //     op: 'contains',
        //     value: 'carousel',
        //   },
        //   isCompact: true,
        //   isRequired: true,
        //   allowCustom: true,
        //   options: [
        //     { id: '1:1', value: '1:1' },
        //     { id: '4:5', value: '4:5' },
        //     { id: '9:16', value: '9:16' },
        //     { id: '16:9', value: '16:9' },
        //   ],
        // },

        // Display
        {
          id: 'reuse_display_amazon_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Amazon DSP Display ',
          description: 'Select template sizes you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'reuse_display_template_formats',
                op: 'contains',
                value: 'amazon_dsp',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ],
        },
        {
          id: 'reuse_displaytrade_desk_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'The Trade Desk DSP Display ',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'reuse_display_template_formats',
                op: 'contains',
                value: 'trade_desk_dsp',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_display_yahoo_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Yahoo DSP Display ',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'reuse_display_template_formats',
                op: 'contains',
                value: 'yahoo_dsp',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_display_google_customer_match_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Customer Match Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'reuse_display_template_formats',
                op: 'contains',
                value: 'google_customer_match',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_display_google_display_ad_rich_media_display_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Display Ad - Rich Media Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'reuse_display_template_formats',
                op: 'contains',
                value: 'google_display_ad_rich_media_display',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_display_google_display_ad_standard_display_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Display Ad - Standard Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'reuse_display_template_formats',
                op: 'contains',
                value: 'google_display_ad_standard_display',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_display_google_display_ad_image_video_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Display Ad - Image/Video Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'display',
              },
              {
                q: 'reuse_display_template_formats',
                op: 'contains',
                value: 'google_display_ad_image_video',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },

        // Google Ads
        {
          id: 'reuse_display_google_ads_performance_max_image_video_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Ads Performance Max - Image/Video Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'google_ads',
              },
              {
                q: 'reuse_google_ads_template_formats',
                op: 'contains',
                value: 'google_ads_performance_max_image_video',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_display_google_ads_display_ad_standard_display_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Ads Display Ad - Standard Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'google_ads',
              },
              {
                q: 'reuse_google_ads_template_formats',
                op: 'contains',
                value: 'google_ads_display_ad_standard_display',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_display_google_ads_demand_gen_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google Ads Demand Gen Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'google_ads',
              },
              {
                q: 'reuse_google_ads_template_formats',
                op: 'contains',
                value: 'google_ads_demand_gen',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_display_google_uac_template_sizes',
          type: 'multi_select',
          startIcon: 'google',
          label: 'Google UAC Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'google_ads',
              },
              {
                q: 'reuse_google_ads_template_formats',
                op: 'contains',
                value: 'google_uac',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },

        // Amazon DSP
        {
          id: 'reuse_display_amazon_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'amazon',
          label: 'Amazon DSP Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_amazon_dsp_template_formats',
                op: 'contains',
                value: 'display',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_online_video_amazon_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'amazon',
          label: 'Amazon DSP Online Video',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_amazon_dsp_template_formats',
                op: 'contains',
                value: 'online_video',
              }
            ]
          },

          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'reuse_ctv_amazon_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'amazon',
          label: 'Amazon DSP CTV',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_amazon_dsp_template_formats',
                op: 'contains',
                value: 'ctv',
              }
            ]
          },

          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },

        // The Trade Desk DSP
        {
          id: 'reuse_display_trade_desk_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'trade_desk',
          label: 'Trade Desk DSP Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_trade_desk_dsp_template_formats',
                op: 'contains',
                value: 'display',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_online_video_trade_desk_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'trade_desk',
          label: 'Trade Desk DSP Online Video',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_trade_desk_dsp_template_formats',
                op: 'contains',
                value: 'online_video',
              }
            ]
          },

          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'reuse_ctv_trade_desk_dsp_template_sizes',
          type: 'multi_select',
          startIcon: 'trade_desk',
          label: 'Trade Desk DSP CTV',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_trade_desk_dsp_template_formats',
                op: 'contains',
                value: 'ctv',
              }
            ]
          },

          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },

        // Yahoo DSP
        {
          id: 'reuse_display_yahoo_template_sizes',
          type: 'multi_select',
          startIcon: 'yahoo',
          label: 'Yahoo DSP Display',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_yahoo_dsp_template_formats',
                op: 'contains',
                value: 'display',
              }
            ]
          },

          isRequired: true,
          isCompact: true,
          allowCustom: true,
          options: [
            { id: '120x600', value: '120x600' },
            { id: '160x600', value: '160x600' },
            { id: '300x250', value: '300x250' },
            { id: '300x600', value: '300x600' },
            { id: '320x50', value: '320x50' },
            { id: '728x90', value: '728x90' },
            { id: '970x250', value: '970x250' },
          ]
        },
        {
          id: 'reuse_online_video_yahoo_template_sizes',
          type: 'multi_select',
          startIcon: 'yahoo',
          label: 'Yahoo DSP Online Video',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_yahoo_dsp_template_formats',
                op: 'contains',
                value: 'online_video',
              }
            ]
          },

          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
        {
          id: 'reuse_ctv_yahoo_template_sizes',
          type: 'multi_select',
          startIcon: 'yahoo',
          label: 'Yahoo DSP CTV',
          description: 'Please list the sizes that you need',
          showIf: {
            all: [
              {
                q: 'reuse_platforms_advertising_on',
                op: 'contains',
                value: 'dsp',
              },
              {
                q: 'reuse_yahoo_dsp_template_formats',
                op: 'contains',
                value: 'ctv',
              }
            ]
          },

          isRequired: true,
          isCompact: { columns: 2 },
          allowCustom: true,
          durationOptions: ['6s', '10s', '15s', '30s'],
          options: [
            { id: '1920x1080', value: '1920x1080 / 16x9' },
            { id: '1080x1920', value: '1080x1920 / 9x16' },
            { id: '1200x1200', value: '1200x1200 / 1x1' },
            { id: '1080x1350', value: '1080x1350 / 4x5' },
          ],
        },
      ],
    },
  ]
};

export default schema;
