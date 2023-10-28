import marvinConfigs from 'marvin-configs.json';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Label, Project, ProjectChildrenResponse, Task } from './interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarvinService {
  private apiUrl = 'https://serv.amazingmarvin.com/api/';

  constructor(private http: HttpClient) { }

  getInbox(): Observable<Array<Project | Task>> {
    return this.getProjectChildren('unassigned');
  }

  getLabelGroups() {
    return this.getReadAnyDoc('strategySettings.labelSettings.groups');
  }

  getLabels(): Observable<Label[]> {
    const headers = new HttpHeaders().set('X-API-Token', marvinConfigs.apiToken);

    return this.http.get<Label[]>(this.apiUrl + 'labels', { headers });
  }

  getProjectChildren(projectId: string): Observable<Array<Project | Task>> {
    const headers = new HttpHeaders().set('X-API-Token', marvinConfigs.apiToken);
    const params = { parentId: projectId };

    return this.http.get<Array<Project | Task>>(this.apiUrl + 'children', { headers, params });
  }

  getReadAnyDoc(id: string): Observable<any> {
    const headers = new HttpHeaders().set('X-Full-Access-Token', marvinConfigs.fullAccessToken);
    const params = { id: id };

    return this.http.get(this.apiUrl + 'doc', { headers, params });
  }
}
