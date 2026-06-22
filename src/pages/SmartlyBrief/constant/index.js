// export const generalInfo = [
//   {
//   left:[
//     {
//       label: "Client",
//       name: "client",
//       isRequired: true,
//     }]

//     {
//       label: "Concept Name",
//       name: "concept_name",
//       isRequired: true,
//     },
//     {
//       label: "Region/Market",
//       name: "region_market",
//       isRequired: true,
//     },
//     {
//       label: "Language",
//       name: "language",
//       isRequired: true,
//     },
//   ],
//   right:[
//     {
//       label: "PM",
//       name: "client",
//       isRequired: true,
//     },
//     {
//       label: "CSM/CP",
//       name: "concept_name",
//       isRequired: true,
//     },
//     {
//       label: "Design",
//       name: "region_market",
//       isRequired: true,
//     },
//     {
//       label: "Copy",
//       name: "language",
//       isRequired: true,
//     },
//   ]
//   },
//   {
//     label: "Due Date",
//     name: "due_date",
//     isRequired: true,
//   },
// ];

export const generalInfo = [
  {
    left: {
      label: 'Task Name',
      name: 'name',
      isRequired: true,
      maxLength: 75,
    },
    right: {
      label: 'Due Date',
      name: 'date',
      isRequired: true,
      maxLength: 100,
    },
  },
  {
    left: {
      label: 'Client/Partner',
      name: 'client',
      isRequired: true,
      maxLength: 75,
    },
    right: {
      label: 'CSM/CP',
      name: 'csm_cp',
      isRequired: true,
      maxLength: 75,
    },
  },
  {
    left: {
      label: 'Market',
      name: 'region_market',
      isRequired: true,
      maxLength: 100,
    },
    right: {
      label: 'Language',
      name: 'language',
      isRequired: true,
      maxLength: 100,
    },
  },
  {
    left: {
      label: 'PM ',
      name: 'pm',
      isRequired: true,
      maxLength: 75,
    },
    right: {
      label: 'Concept',
      name: 'concept',
      isRequired: false,
      maxLength: 100,
    },
  },
  {
    left: {
      label: 'Design/Copy/Motion',
      name: 'design',
      isRequired: false,
      maxLength: 100,
    },
    right: {
      label: 'Feed/Catalog Name',
      name: 'feed_catalog_name',
      isRequired: false,
      maxLength: 100,
    },
  },
  // {
  //   left: {
  //     label: 'Design',
  //     name: 'design',
  //     isRequired: false,
  //     maxLength: 100,
  //   },
  //   right: {
  //     label: 'Copy',
  //     name: 'copy',
  //     isRequired: false,
  //     maxLength: 100,
  //   },
  // },
  // {
  //   left: {
  //     label: 'Feed/Catalog Name',
  //     name: 'feed_catalog_name',
  //     isRequired: false,
  //     maxLength: 100,
  //   },
  //   right: {
  //     label: 'Motion',
  //     name: 'motion',
  //     isRequired: false,
  //     maxLength: 100,
  //   },
  // },
];

export const taskType_value = [
  {
    value: 473,
    label: 'Concept Design',
  },
  {
    value: 474,
    label: 'Concept Build',
  },
  {
    value: 438,
    label: 'Creative Build',
  },
];

export const defaultSizes = [
  '1920x1080',
  '1080x1920',
  '1080x1080',
  '1350x1080',
];

export const defaultDurations = ['6s', '10s', '15s'];

export const defaultPlatform = ['Facebook / Instagram', 'Youtube', 'Tiktok'];

export const staticassets = [
  {
    name: 'Meta Static Image Ad',
    items: ['9x16', '1x1', '4x5', '16x9', 'Others'],
  },
  {
    name: 'Meta Image Carousel Ad',
    items: ['9x16', '1x1'],
  },
  {
    name: 'Pinterest',
    items: ['Image (2x3)', 'Shopping feed Ads (9x16)'],
  },
  {
    name: 'Snapchat',
    items: ['Image (9x16)', 'Catalog Ads (9x16)'],
  },
  {
    name: 'Others',
    items: [],
  },
];

export const assets = [
  {
    label: 'Brand Guidelines',
    name: 'guidelines',
    description: '',
  },
  {
    label: 'Sample Creative Design/Mock',
    name: 'design',
    description: '',
  },
  {
    label: 'Fix & Flex Guide',
    name: 'guide',
    description: '',
  },
  {
    label: 'Video Assets',
    name: 'video',
    description: '',
  },
  {
    label: 'Audio Assets',
    name: 'audios',
    description: '',
  },
  {
    label: 'Image Assets',
    name: 'images',
    description: '',
  },
  {
    label: 'Logos',
    name: 'logos',
    description: '',
  },
  {
    label: 'Fonts',
    name: 'fonts',
    description: '',
  },
  {
    label: 'Completed Content Sheet/s',
    name: 'sheet',
    description: '',
  },
  {
    label: 'Link to Feed/s (Meta/Snapchat/Pinterest)',
    name: 'link',
    description: '',
  },
];

export const videoFormat = [
  {
    label: 'Youtube Ad',
    size: ['16x9', '9x16'],
  },
  {
    label: 'Meta Video Ad',
    size: ['9x16', '1x1', '4x5', '16x9'],
  },
  {
    label: 'Pinterest',
    size: ['Video (1x1)', 'Video (2x3)', 'Video (4x5)', 'Video (9x16)'],
  },
  {
    label: 'Snapchat',
    size: ['Video (9x16)'],
  },
  {
    label: 'Tiktok Ads',
    size: ['Standard Video', 'Creator Connect'],
  },
  {
    label: 'Others',
    size: [],
  },
];
