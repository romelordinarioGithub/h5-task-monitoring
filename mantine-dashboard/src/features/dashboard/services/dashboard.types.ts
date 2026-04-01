type RawDataAssignee = {
  id?: number;
  name?: string;
  email?: string;
  avatar?: string;
};

export type RawData = {
  name?: string;
  task_type?: string;
  rel_type?: string;
  status?: string;
  channel?: string;
  due_date?: string;
  delivery_date?: string;
  priority?: string;
  link?: string;
  tags?: string;
  assignees?: RawDataAssignee[];
};
