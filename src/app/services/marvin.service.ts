import marvinConfigs from 'marvin-configs.json';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackburnerItem, CreateProjectProps, Label, Project, Task, UpdateTaskProps } from '../types/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarvinService {
  private apiUrl = 'http://localhost:4200/api/';

  constructor(private http: HttpClient) {}

  createProject(project: CreateProjectProps): Observable<Project> {
    const headers = new HttpHeaders().set('X-Full-Access-Token', marvinConfigs.fullAccessToken);
    const body = {
      day: project.day,
      title: project.title,
      parentId: project.parentId
    };

    return this.http.post<Project>(this.apiUrl + 'addProject', body, { headers });
  }

  getInbox(): Observable<Array<Project | Task>> {
    return this.getProjectsByParent('unassigned');
  }

  getLabelGroups() {
    return this.getReadAnyDoc('strategySettings.labelSettings.groups');
  }

  getLabels(): Observable<Label[]> {
    const headers = new HttpHeaders().set('X-API-Token', marvinConfigs.apiToken);

    return this.http.get<Label[]>(this.apiUrl + 'labels', { headers });
  }

  getProjects(): Observable<Project[]> {
    const headers = new HttpHeaders().set('X-API-Token', marvinConfigs.apiToken);

    return this.http.get<Project[]>(this.apiUrl + 'categories', { headers });
  }

  getProjectsByParent(projectId: string): Observable<Array<Project | Task>> {
    const headers = new HttpHeaders().set('X-API-Token', marvinConfigs.apiToken);
    const params = { parentId: projectId };

    return this.http.get<Array<Project | Task>>(this.apiUrl + 'children', { headers, params });
  }

  getReadAnyDoc(id: string): Observable<any> {
    const headers = new HttpHeaders().set('X-Full-Access-Token', marvinConfigs.fullAccessToken);
    const params = { id: id };

    return this.http.get(this.apiUrl + 'doc', { headers, params });
  }

  setTaskDone(taskId: string): Observable<Task> {
    const body = {
      itemId: taskId,
      timeZoneOffset: -300
    };
    const headers = new HttpHeaders().set('X-API-Token', marvinConfigs.apiToken);

    return this.http.post<Task>(this.apiUrl + 'markDone', body, { headers });
  }

  setTaskOnBackburner(task: BackburnerItem): Observable<Task> {
    const headers = new HttpHeaders().set('X-Full-Access-Token', marvinConfigs.fullAccessToken);
    const body = {
      itemId: task.itemId,
      setters: [
        { key: 'backburner', val: task.backburner },
        { key: 'parentId', val: task.parentProject },
        { key: 'fieldUpdates.backburner', val: Date.now() },
        { key: 'fieldUpdates.parentId', val: Date.now() },
        { key: 'updatedAt', val: Date.now() },
      ]
    };

    return this.http.post<Task>(this.apiUrl + '/doc/update', body, { headers });
  }

  updateTask(task: UpdateTaskProps): Observable<Task> {
    const headers = new HttpHeaders().set('X-Full-Access-Token', marvinConfigs.fullAccessToken);
    const body = {
      itemId: task.itemId,
      setters: [
        { key: 'labelIds', val: task.labelIds },
        { key: 'note', val: task.note },
        { key: 'parentId', val: task.parentProject },
        { key: 'rank', val: task.rank },
        { key: 'title', val: task.title },
        { key: 'fieldUpdates.labelIds', val: Date.now() },
        { key: 'fieldUpdates.note', val: Date.now() },
        { key: 'fieldUpdates.parentId', val: Date.now() },
        { key: 'fieldUpdates.rank', val: Date.now() },
        { key: 'fieldUpdates.title', val: Date.now() },
        { key: 'updatedAt', val: Date.now() },
      ]
    };

    return this.http.post<Task>(this.apiUrl + '/doc/update', body, { headers });
  }
}
