import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';

import {
    BackburnerItem, CreateProjectProps, Label, Project, Task, UpdateTaskProps
} from '../types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MockMarvinService {
  mockTasks: Task[] = [
    { 
      _id: 'task1', 
      title: 'Task 1', 
      note: 'Note 1', 
      db: 'Tasks', 
      done: false,
      labelIds: ['label1', 'label2'],
      rank: 1,
      parentId: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      backburner: false,
      bonusSection: '',
      calData: '',
      calId: '',
      calURL: '',
      colorBar: null,
      completedAt: null,
      customSection: '',
      dailySection: '',
      day: '',
      deletedAt: 0,
      dependsOn: {},
      doneAt: 0,
      dueDate: null,
      duration: 0,
      echo: false,
      echoedAt: 0,
      echoId: '',
      email: '',
      endDate: null,
      etag: '',
      firstScheduled: '',
      firstTracked: 0,
      generatedAt: 0,
      imported: false,
      isFrogged: false,
      isPinned: false,
      isReward: false,
      isStarred: false,
      itemSnoozeTime: 0,
      link: '',
      masterRank: 0,
      onboard: false,
      permaSnoozeTime: '',
      pinId: '',
      plannedMonth: '',
      plannedWeek: '',
      recurring: false,
      recurringTaskId: '',
      restoredAt: 0,
      reviewDate: '',
      sprintId: null,
      startDate: null,
      subtasks: {},
      timeBlockSection: '',
      timeEstimate: 0,
      times: [],
      workedOnAt: 0,
      marvinPoints: 0,
      mpNotes: [],
      rewardId: 0,
      rewardPoints: 0
    },
    { 
      _id: 'task2', 
      title: 'Task 2', 
      note: 'Note 2', 
      db: 'Tasks', 
      done: true,
      labelIds: ['label3', 'label4'],
      rank: 2,
      parentId: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      backburner: false,
      bonusSection: '',
      calData: '',
      calId: '',
      calURL: '',
      colorBar: null,
      completedAt: null,
      customSection: '',
      dailySection: '',
      day: '',
      deletedAt: 0,
      dependsOn: {},
      doneAt: 0,
      dueDate: null,
      duration: 0,
      echo: false,
      echoedAt: 0,
      echoId: '',
      email: '',
      endDate: null,
      etag: '',
      firstScheduled: '',
      firstTracked: 0,
      generatedAt: 0,
      imported: false,
      isFrogged: false,
      isPinned: false,
      isReward: false,
      isStarred: false,
      itemSnoozeTime: 0,
      link: '',
      masterRank: 0,
      onboard: false,
      permaSnoozeTime: '',
      pinId: '',
      plannedMonth: '',
      plannedWeek: '',
      recurring: false,
      recurringTaskId: '',
      restoredAt: 0,
      reviewDate: '',
      sprintId: null,
      startDate: null,
      subtasks: {},
      timeBlockSection: '',
      timeEstimate: 0,
      times: [],
      workedOnAt: 0,
      marvinPoints: 0,
      mpNotes: [],
      rewardId: 0,
      rewardPoints: 0
    }
  ];

  mockProjects: Project[] = [
    {
      _id: 'mock-project-1',
      title: 'Mock Project With Children',
      parentId: 'parent-1',
      rank: 1,
      children: [
        {
          _id: 'mock-subproject-1',
          title: 'Mock Sub Project',
          parentId: 'mock-project-1',
          rank: 1,
          children: [],
          color: '#000000',
          day: '',
          dayRank: 0,
          db: 'Categories',
          done: false,
          dueDate: '',
          labelIds: [],
          masterRank: 0,
          note: '',
          plannedWeek: '',
          plannedMonth: '',
          reviewDate: '',
          sprintId: '',
          timeEstimate: 0,
          updatedAt: Date.now(),
          doneDate: '',
          echo: false,
          endDate: '',
          firstScheduled: '',
          icon: '',
          isFrogged: false,
          marvinPoints: 0,
          mpNotes: [],
          recurring: false,
          priority: 'low',
          recurringTaskId: '',
          startDate: '',
          type: 'category',
          workedOnAt: 0
        },
        {
          _id: 'mock-subproject-2',
          title: 'Mock Sub Project 2',
          parentId: 'mock-project-1',
          rank: 2,
          children: [],
          color: '#000000',
          day: '',
          dayRank: 0,
          db: 'Categories',
          done: false,
          dueDate: '',
          labelIds: [],
          masterRank: 0,
          note: '',
          plannedWeek: '',
          plannedMonth: '',
          reviewDate: '',
          sprintId: '',
          timeEstimate: 0,
          updatedAt: Date.now(),
          doneDate: '',
          echo: false,
          endDate: '',
          firstScheduled: '',
          icon: '',
          isFrogged: false,
          marvinPoints: 0,
          mpNotes: [],
          recurring: false,
          priority: 'low',
          recurringTaskId: '',
          startDate: '',
          type: 'category',
          workedOnAt: 0
        }
      ],
      color: '#000000',
      day: '',
      dayRank: 0,
      db: 'Categories',
      done: false,
      dueDate: '',
      labelIds: [],
      masterRank: 0,
      note: '',
      plannedWeek: '',
      plannedMonth: '',
      reviewDate: '',
      sprintId: '',
      timeEstimate: 0,
      updatedAt: Date.now(),
      doneDate: '',
      echo: false,
      endDate: '',
      firstScheduled: '',
      icon: '',
      isFrogged: false,
      marvinPoints: 0,
      mpNotes: [],
      recurring: false,
      priority: 'low',
      recurringTaskId: '',
      startDate: '',
      type: 'project',
      workedOnAt: 0
    },
    {
      _id: 'mock-project-2',
      title: 'Mock Project Without Children',
      parentId: 'parent-1',
      rank: 2,
      children: [],
      color: '#000000',
      day: '',
      dayRank: 0,
      db: 'Categories',
      done: false,
      dueDate: '',
      labelIds: [],
      masterRank: 0,
      note: '',
      plannedWeek: '',
      plannedMonth: '',
      reviewDate: '',
      sprintId: '',
      timeEstimate: 0,
      updatedAt: Date.now(),
      doneDate: '',
      echo: false,
      endDate: '',
      firstScheduled: '',
      icon: '',
      isFrogged: false,
      marvinPoints: 0,
      mpNotes: [],
      recurring: false,
      priority: 'low',
      recurringTaskId: '',
      startDate: '',
      type: 'project',
      workedOnAt: 0
    }
  ];

  mockLabelGroups = {
    'group1': { title: 'Contexts' },
    'group2': { title: 'Times' },
    'group3': { title: 'Energy' },
    'group4': { title: 'Priorities' },
    'group5': { title: 'Categories' },
    'group6': { title: 'Responsibilities' },
    'group7': { title: 'Goals - Short Term' },
    'group8': { title: 'Goals - Medium Term' },
    'group9': { title: 'Goals - Long Term' },
    'group10': { title: 'Outcomes' },
    'group11': { title: 'Other' }
  };

  mockLabels: Label[] = [
    { _id: 'context1', title: 'Context1', groupId: 'group1', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'time1', title: 'Time1', groupId: 'group2', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'energy1', title: 'Energy1', groupId: 'group3', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'priority1', title: 'Priority1', groupId: 'group4', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'category1', title: 'Category1', groupId: 'group5', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'responsibility1', title: 'Responsibility Test', groupId: 'group6', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'shortgoal1', title: 'Goal Short', groupId: 'group7', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'mediumgoal1', title: 'Goal Medium', groupId: 'group8', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'longgoal1', title: 'Goal Long', groupId: 'group9', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'outcome1', title: 'Outcome Test', groupId: 'group10', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'status1', title: 'Status1', groupId: 'group11', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
    { _id: 'ungrouped1', title: 'Goal Ungrouped', groupId: 'group11', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' }
  ];

  createProject(project: CreateProjectProps): Observable<Project> {
    return of(this.mockProjects[0]);
  }

  getInbox(): Observable<Array<Project | Task>> {
    return of(this.mockTasks);
  }

  getLabelGroups(): Observable<any> {
    return of({ val: this.mockLabelGroups });
  }

  getLabels(): Observable<Label[]> {
    return of(this.mockLabels);
  }

  getProjects(): Observable<Project[]> {
    return of(this.mockProjects);
  }

  getProjectsByParent(projectId: string): Observable<Array<Project | Task>> {
    return of([this.mockProjects[0], this.mockTasks[0]]);
  }

  getReadAnyDoc(id: string): Observable<any> {
    return of({ id, data: 'Mock document data' });
  }

  setTaskDone(taskId: string): Observable<Task> {
    return of({ ...this.mockTasks[0], done: true });
  }

  setTaskOnBackburner(task: BackburnerItem): Observable<Task> {
    return of({ ...this.mockTasks[0], backburner: task.backburner });
  }

  updateTask(task: UpdateTaskProps): Observable<Task> {
    return of({
      ...this.mockTasks[0],
      ...task
    } as Task);
  }
} 