export const counter_options = [
  'This Week',
  'This Month',
  'This Year',
  'Custom',
];

export const inprogress_options = ['All', 'On Track', 'Critical', 'Overdue'];

export const open_options = ['All', 'New', 'Re-opened'];

export const my_tasks_options = [];

export const queues_options = [
  {
    name: 'All Tasks',
    slug: 'all_task',
  },
  {
    name: 'Unassigned',
    slug: 'unassigned',
  },
  {
    name: 'Unresponded',
    slug: 'unresponded',
  },
  {
    name: 'Due Today',
    slug: 'due_today',
  },
  {
    name: 'My Tasks',
    slug: 'my_tasks',
  },
];

export const sort_options = [
  {
    name: 'Name',
    slug: 'name',
    sortKey: 'name',
    sortType: '',
  },
  {
    name: 'Created',
    slug: 'created',
    sortKey: 'created_at',
    sortType: '',
  },
  {
    name: 'Submitted',
    slug: 'submitted',
    sortKey: 'date_submitted',
    sortType: '',
  },
  {
    name: 'Due',
    slug: 'due',
    sortKey: 'due_date',
    sortType: '',
  },
  {
    name: 'Delivery',
    slug: 'delivery',
    sortKey: 'delivery_date',
    sortType: 'delivery_date',
  },
];

export const more_options = [
  {
    name: 'EOD Report',
    slug: 'eod_report',
  },
  {
    name: 'Resources',
    slug: 'resources',
  },
  {
    name: 'Dev Dash',
    slug: 'dev_dash',
  },
];

export const summary_devdash = [
  {
    name: 'On Track',
    slug: 'onTrack',
  },
  {
    name: 'Critical',
    slug: 'critical',
  },
  {
    name: 'Overdue',
    slug: 'overdue',
  },
  {
    name: 'Completed',
    slug: 'completed',
  },
];

export const filter_list = [
  {
    name: 'Staff Member',
    slug: 'staff',
  },
  {
    name: 'Partners',
    slug: 'partners',
  },
  {
    name: 'Concept',
    slug: 'concept',
  },
  {
    name: 'Campaign',
    slug: 'campaign',
  },
  {
    name: 'Date',
    slug: 'date',
  },
];

export const chart_filter_list = [
  {
    name: 'This Week',
    slug: 'this_week',
  },
  {
    name: 'Last Week',
    slug: 'last_week',
  },
  {
    name: 'This Month',
    slug: 'this_month',
  },
  {
    name: 'Last Month',
    slug: 'last_month',
  },
  {
    name: 'This Year',
    slug: 'this_year',
  },
  {
    name: 'Custom',
    slug: 'custom_date',
  },
];

export const statistic_filter_list = [
  {
    name: 'Concept',
    slug: 'concept',
  },
  {
    name: 'Campaign',
    slug: 'campaign',
  },
  {
    name: 'This Week',
    slug: 'thisweek',
  },
  {
    name: 'Last Week',
    slug: 'lastweek',
  },
  {
    name: 'This Month',
    slug: 'thismonth',
  },
  {
    name: 'Last Month',
    slug: 'lastmonth',
  },
  {
    name: 'This Year',
    slug: 'thisyear',
  },
];

export const concept_columns = [
  {
    id: 'concept_name',
    label: 'Concept',
    minWidth: 300,
    isSticky: true,
    align: 'left',
    isClickable: true,
  },
  {
    id: 'partner',
    label: 'Partner',
    minWidth: 200,
    isSticky: false,
    align: 'left',
    isClickable: false,
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    isSticky: false,
    align: 'center',
    isClickable: false,
  },
  {
    id: 'created_at',
    label: 'Created At',
    minWidth: 180,
    isSticky: false,
    align: 'center',
    isClickable: false,
  },
  // {
  //   id: 'updated_at',
  //   label: 'Updated At',
  //   minWidth: 180,
  //   isSticky: false,
  //   align: 'center',
  //   isClickable: false,
  // },
  // {
  //   id: 'updated_by',
  //   label: 'Updated by',
  //   minWidth: 180,
  //   isSticky: false,
  //   align: 'center',
  //   isClickable: false,
  // },
];

export const campaign_columns = [
  {
    id: 'campaign_name',
    label: 'Campaign',
    minWidth: 300,
    isSticky: true,
    align: 'left',
    isClickable: true,
  },
  {
    id: 'concept_name',
    label: 'Concept',
    minWidth: 200,
    isSticky: false,
    align: 'left',
    isClickable: false,
  },
  {
    id: 'partner',
    label: 'Partner',
    minWidth: 200,
    isSticky: false,
    align: 'left',
    isClickable: false,
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    isSticky: false,
    align: 'center',
    isClickable: false,
  },
  {
    id: 'created_at',
    label: 'Created At',
    minWidth: 180,
    isSticky: false,
    align: 'center',
    isClickable: false,
  },
  // {
  //   id: 'updated_at',
  //   label: 'Updated At',
  //   minWidth: 180,
  //   isSticky: false,
  //   align: 'center',
  //   isClickable: false,
  // },
  // {
  //   id: 'updated_by',
  //   label: 'Updated by',
  //   minWidth: 180,
  //   isSticky: false,
  //   align: 'center',
  //   isClickable: false,
  // },
];

export const task_columns = [
  {
    id: 'task',
    label: 'Task',
    minWidth: 300,
    isSticky: true,
    align: 'left',
  },
  {
    id: 'timer_id',
    label: 'Time Log ID',
    minWidth: 170,
    isSticky: false,
    align: 'center',
  },
  {
    id: 'timer_type',
    label: 'Classification',
    minWidth: 170,
    isSticky: false,
    align: 'center',
  },
  {
    id: 'user',
    label: 'Staff',
    minWidth: 200,
    isSticky: false,
    align: 'left',
  },
  // {
  //   id: 'task_type',
  //   label: 'Task Type',
  //   minWidth: 170,
  //   isSticky: false,
  //   align: 'center',
  // },
  {
    id: 'partner',
    label: 'Partner',
    minWidth: 170,
    isSticky: false,
    align: 'center',
  },
  {
    id: 'start_12hrs',
    label: 'Start',
    minWidth: 180,
    isSticky: false,
    align: 'center',
  },
  {
    id: 'end_12hrs',
    label: 'End',
    minWidth: 180,
    isSticky: false,
    align: 'center',
  },

  // {
  //   id: 'concept',
  //   label: 'Concept',
  //   minWidth: 170,
  //   isSticky: false,
  //   align: 'center',
  // },
  // {
  //   id: 'campaign',
  //   label: 'Campaign',
  //   minWidth: 170,
  //   isSticky: false,
  //   align: 'center',
  // },
  {
    id: 'total',
    label: 'Time(h)',
    minWidth: 170,
    isSticky: false,
    align: 'center',
  },
  {
    id: 'total_decmial',
    label: 'Time(decimal)',
    minWidth: 170,
    isSticky: false,
    align: 'center',
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 100,
    isSticky: false,
    align: 'center',
  },
];

// export const smartly_columns = [
//   {
//     id: 'task',
//     label: 'Task',
//     minWidth: 300,
//     isSticky: true,
//     align: 'left',
//   },

//   {
//     id: 'user',
//     label: 'Staff',
//     minWidth: 200,
//     isSticky: false,
//     align: 'left',
//   },
//   {
//     id: 'timer_type',
//     label: 'Classification',
//     minWidth: 170,
//     isSticky: false,
//     align: 'center',
//   },
//   {
//     id: 'task_type',
//     label: 'Task Type',
//     minWidth: 170,
//     isSticky: false,
//     align: 'center',
//   },
//   {
//     id: 'start_12hrs',
//     label: 'Start',
//     minWidth: 180,
//     isSticky: false,
//     align: 'center',
//   },
//   {
//     id: 'end_12hrs',
//     label: 'End',
//     minWidth: 180,
//     isSticky: false,
//     align: 'center',
//   },
//   {
//     id: 'partner',
//     label: 'Partner',
//     minWidth: 170,
//     isSticky: false,
//     align: 'center',
//   },
//   {
//     id: 'total',
//     label: 'Time(h)',
//     minWidth: 170,
//     isSticky: false,
//     align: 'center',
//   },
//   {
//     id: 'total_decmial',
//     label: 'Time(decimal)',
//     minWidth: 170,
//     isSticky: false,
//     align: 'center',
//   },
//   {
//     id: 'action',
//     label: 'Action',
//     minWidth: 100,
//     isSticky: false,
//     align: 'center',
//   },
// ];
