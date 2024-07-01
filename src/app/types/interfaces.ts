export interface BackburnerItem {
  itemId: string;
  backburner: boolean;
  parentProject: number;
}

export interface Challenge {
    _id: string;
    action: string;
    challenge: string;
}

export interface CreateProjectProps {
  "day": null | string;
  "title": string;
  "parentId": string;
/*
  {
    //"done": false,
    "day": null,
    "title": string
    "parentId": number
    // "labelIds": ["abc", "def"], // IDs of labels
    // "firstScheduled": "2020-07-17",
    // "rank": 999,
    // "dailySection": "Morning",
    // "bonusSection": "Essential", // or "Bonus"
    // "customSection": "a3gnaiN31mz", // ID of custom section (from profile.strategySettings.customStructure)
    // "timeBlockSection": "b00m3feaMbeaz", // ID of time block
    // "note": "Problems 1-4",
    // "dueDate": "2020-07-20",
    // "timeEstimate": 3600000, // ms
    // "isReward": false,
    // "priority": "high", // "high", "mid", or "low"
    // "isFrogged": 2,
    // "plannedWeek": "2020-07-12",
    // "plannedMonth": "2020-07",
    // "rewardPoints": 1.25,
    // "rewardId": "anbeN3mRneam", // Unique ID of attached Reward
    "backburner": true, // Manually put in backburner (can also be backburner from label, start date, etc.)
    // "reviewDate": "2020-09-09",
    // "timeEstimate": 300000, // duration estimate in ms
    // "itemSnoozeTime": 1599577206923, // Date.now() until when it's snoozed
    // "permaSnoozeTime": "09:00",
  
    // Time offset in minutes
    //
    // Added to time to fix time zone issues.  So if the user is in Pacific time,
    // this would be -8*60.  If the user added a task with +today at 22:00 local
    // time 2019-12-05, then we want to create the task on 2019-12-05 and not
    // 2019-12-06 (which is the server date).
    "timeZoneOffset": 60,
  }*/
}

export interface Goal {
    _id: string;
    challenges: Challenge[];
    checkIn: boolean;
    checkInQuestions: { _id: string; title: string }[];
    checkIns: number[];
    checkInStart: string;
    checkInWeeks: number;
    color: string;
    committed: boolean;
    difficulty: number;
    dueDate?: string;
    expectedDuration: number;
    expectedHabits: number;
    expectedTasks: number;
    hasEnd: boolean;
    hideInDayView: boolean;
    importance: number;
    isStarred: number;
    labelIds: string[];
    lastCheckIn: string;
    motivations: string[];
    note: string;
    parentId?: string;
    sections: GoalSection[];
    startedAt: number;
    status: "backburner" | "pending" | "active" | "done";
    taskProgress: boolean;
    title: string;
    trackerProgress_$ID: boolean;
}

export interface GoalSection {
    _id: string;
    note: string;
    title: string;
}

export interface Habit {
    _id: string;
    askOn?: number[];
    color: string;
    dismissed?: string;
    done?: boolean;
    endDate?: string;
    endTime?: string;
    history?: number[];
    isFrogged?: number;
    isPositive: boolean;
    isStarred?: number;
    labelIds?: string[];
    note?: string;
    parentId: string;
    period: "day" | "week" | "month" | "quarter" | "year";
    recordType: "boolean" | "number";
    showAfterRecord?: boolean;
    showAfterSuccess?: boolean;
    showInCalendar?: boolean;
    showInDayView?: boolean;
    startDate?: string;
    startTime?: string;
    target: number;
    time?: string;
    timeEstimate?: number;
    title: string;
    units?: string;
}

export interface Label {
    _id: string;
    color: string;
    createdAt: number;
    groupId: string;
    icon: string;
    isAction: boolean;
    isHidden: boolean;
    showAs: "text" | "icon" | "both";
    title: string;
}

export interface LabelGroup {
    _id: string;
    color?: string;
    createdAt: number;
    icon?: string;
    isExclusive: boolean;
    isMenu?: boolean; // optional, as it is no longer used
    rank: number;
    title: string;
}

export interface Project {
    _id: string;
    color: string;
    children?: Project[];
    day: string | null | undefined;
    dayRank: number;
    db: string;
    done: boolean;
    doneDate: string;
    dueDate: string;
    echo: boolean;
    endDate: string;
    firstScheduled: string | "unassigned";
    icon: string;
    isFrogged: boolean;
    labelIds: string[];
    marvinPoints: number;
    masterRank:number;
    mpNotes: string[];
    note: string;
    parentId: string;
    plannedMonth: string;
    plannedWeek: string;
    priority: "low" | "mid" | "high";
    rank: number;
    recurring: boolean;
    recurringTaskId: string;
    reviewDate: string;
    sprintId: string;
    startDate: string;
    timeEstimate: number;
    title: string;
    type: "project" | "category";
    updatedAt: number;
    workedOnAt: number;
}

export interface ProjectChildrenResponse {
  data: Task | Project[];
}

export interface RecurringTask {
    _id: string;
    autoPlan?: "plannedWeek" | "plannedMonth";
    customRecurrence?: string;
    date?: number;
    day?: number;
    dueIn?: number;
    echoDays?: number;
    endDate?: string;
    labelIds?: string[];
    limitToWeekdays?: boolean;
    offCount?: number;
    onCount?: number;
    parentId: string;
    recurringType: "task" | "sequence" | "project";
    repeat?: number;
    repeatStart?: string;
    section?: string;
    subtaskList?: Task[];
    timeEstimate?: number;
    title: string;
    type:
      | "daily"
      | "weekly"
      | "monthly"
      | "n per week"
      | "repeat"
      | "repeat week"
      | "repeat month"
      | "repeat year"
      | "echo"
      | "onOff"
      | "custom";
    weekDays?: number[];
}

export interface SavedItem {
    _id: string;
    defaultParentId?: string; // optional
    itemType: "task" | "taskGroup" | "project";
    rank: number;
    tasks?: SavedItem[]; // optional, as it is only present for task groups and projects
    title: string;
}

export interface Subtask {
  _id: string;
  done: boolean;
  rank: number;
  timeEstimate: number;
  title: string;

  // NEW REMINDER FORMAT
  autoSnooze?: boolean;
  reminderOffset?: number;
  reminderTime?: number;
  snooze?: number;
  taskTime?: string;

  // OLD REMINDER FORMAT
  remindAt?: string;
  reminder?: {
    time: string;
    diff: number;
  };
}

export interface Task {
  _id: string;
  backburner: boolean;
  bonusSection: string;
  calData: string;
  calId: string;
  calURL: string;
  colorBar: string | null;
  completedAt: number | null;
  createdAt: number;
  customSection: string;
  dailySection: string;
  day: string;
  db: string;
  deletedAt: number;
  dependsOn: { [id: string]: boolean };
  done: boolean;
  doneAt: number;
  dueDate: string | null;
  duration: number;
  echo: boolean;
  echoedAt: number;
  echoId: string;
  email: string;
  endDate: string | null;
  etag: string;
  firstScheduled: string;
  firstTracked: number;
  generatedAt: number;
  imported: boolean;
  isFrogged: boolean;
  isPinned: boolean;
  isReward: boolean;
  isStarred: boolean;
  itemSnoozeTime: number;
  labelIds: string[];
  link: string;
  masterRank: number;
  note: string;
  onboard: boolean;
  parentId: string;
  permaSnoozeTime: string;
  pinId: string;
  plannedMonth: string;
  plannedWeek: string;
  rank: number;
  recurring: boolean;
  recurringTaskId: string;
  restoredAt: number;
  reviewDate: string;
  sprintId: string | null;
  startDate: string | null;
  subtasks: { [id: string]: Subtask };
  timeBlockSection: string;
  timeEstimate: number;
  times: number[];
  title: string;
  updatedAt: number;
  workedOnAt: number;

  // Gamification
  marvinPoints?: number;
  mpNotes?: string[];
  rewardId?: number;
  rewardPoints?: number;

  // Goals
  g_in_GOALID?: boolean;
  g_sec_GOALID?: string;
  g_rank_GOALID?: number;

  // NEW REMINDER FORMAT
  autoSnooze?: boolean;
  reminderOffset?: number;
  reminderTime?: number;
  snooze?: number;
  taskTime?: string;

  // OLD REMINDER FORMAT
  remindAt?: string;
  reminder?: {
    time: string;
    diff: number;
  };
}

export interface UpdateTaskProps {
  itemId: string;
  labelIds: string[];
  note: string;
  parentProject: string;
  rank: 0 | 1 | 2 | false;
  title: string;
}
