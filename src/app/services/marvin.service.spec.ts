import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MarvinService } from './marvin.service';
import { CreateProjectProps, Project, Task, Label, BackburnerItem, UpdateTaskProps } from '../types/interfaces';
import { mockLabel, mockLabel2, mockProject, mockTask } from 'src/assets/mock';
import marvinConfigs from 'marvin-configs.json';
import { Subscription } from 'rxjs';

describe('MarvinService', () => {
  let service: MarvinService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:4200/api/';
  const subscriptions: Subscription[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarvinService]
    });

    service = TestBed.inject(MarvinService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    subscriptions.forEach(subscription => subscription.unsubscribe());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a project', () => {
    const mockProjectProps: CreateProjectProps = {
      day: '2023-06-15',
      title: 'Test Project',
      parentId: 'parent123'
    };

    const mockResponse: Project = mockProject;

    const subscription = service.createProject(mockProjectProps).subscribe(project => {
      expect(project).toEqual(mockResponse);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(apiUrl + 'addProject');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProjectProps);
    req.flush(mockResponse);
  });

  it('should get inbox items', () => {
    const mockInboxItems: Array<Project | Task> = [
      mockTask,
      mockProject
    ];

    const subscription = service.getInbox().subscribe(items => {
      expect(items).toEqual(mockInboxItems);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(apiUrl + 'children?parentId=unassigned');
    expect(req.request.method).toBe('GET');
    req.flush(mockInboxItems);
  });

  it('should get labels', () => {
    const mockLabels: Label[] = [
      mockLabel,
      mockLabel2
    ];

    const subscription = service.getLabels().subscribe(labels => {
      expect(labels).toEqual(mockLabels);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(apiUrl + 'labels');
    expect(req.request.method).toBe('GET');
    req.flush(mockLabels);
  });

  it('should retrieve label groups', () => {
    const mockResponse = { groups: ['Group1', 'Group2', 'Group3'] };

    const subscription = service.getLabelGroups().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(req => 
      req.url === apiUrl + 'doc' && 
      req.method === 'GET'
    );

    expect(req.request.params.get('id')).toEqual('strategySettings.labelSettings.groups');
    expect(req.request.headers.get('X-Full-Access-Token')).toEqual(marvinConfigs.fullAccessToken);

    req.flush(mockResponse);
  });

  it('should retrieve projects', () => {
    const mockProjects: Project[] = [
      { _id: '1', title: 'Project 1' },
      { _id: '2', title: 'Project 2' }
    ] as Project[]; // Type assertion as Project[] since we're not providing all properties

    const subscription = service.getProjects().subscribe(projects => {
      expect(projects).toEqual(mockProjects);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(req => 
      req.url === apiUrl + 'categories' && 
      req.method === 'GET'
    );

    expect(req.request.headers.get('X-API-Token')).toEqual(marvinConfigs.apiToken);

    req.flush(mockProjects);
  });

  it('should retrieve projects and tasks by parent', () => {
    const parentId = 'parent123';
    const mockItems: Array<Project | Task> = [
      { _id: '1', title: 'Project 1' } as Project,
      { _id: '2', title: 'Task 1' } as Task
    ];

    const subscription = service.getProjectsByParent(parentId).subscribe(items => {
      expect(items).toEqual(mockItems);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(req => 
      req.url === apiUrl + 'children' && 
      req.method === 'GET'
    );

    expect(req.request.headers.get('X-API-Token')).toEqual(marvinConfigs.apiToken);
    expect(req.request.params.get('parentId')).toEqual(parentId);

    req.flush(mockItems);
  });

  it('should retrieve a document with the correct headers and params', () => {
    const mockId = 'testDocId123';
    const mockResponse = { id: mockId, content: 'Test document content' };

    const subscription = service.getReadAnyDoc(mockId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(req => 
      req.url === apiUrl + 'doc' && 
      req.method === 'GET'
    );

    expect(req.request.params.get('id')).toEqual(mockId);
    expect(req.request.headers.get('X-Full-Access-Token')).toEqual(marvinConfigs.fullAccessToken);

    req.flush(mockResponse);
  });

  it('should set task as done', () => {
    const taskId = 'task123';
    const mockResponse: Task = mockTask;

    const subscription = service.setTaskDone(taskId).subscribe(task => {
      expect(task).toEqual(mockResponse);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(apiUrl + 'markDone');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ itemId: taskId, timeZoneOffset: -300 });
    req.flush(mockResponse);
  });

  it('should set task on backburner', () => {
    const mockBackburnerItem: BackburnerItem = {
      itemId: 'task123',
      backburner: true,
      parentProject: 123
    };

    const mockResponse: Task = { _id: 'task123', backburner: true } as Task;

    const subscription = service.setTaskOnBackburner(mockBackburnerItem).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(req => 
      req.url === apiUrl + 'doc/update' && 
      req.method === 'POST'
    );

    expect(req.request.headers.get('X-Full-Access-Token')).toEqual(marvinConfigs.fullAccessToken);
    expect(req.request.body).toEqual({
      itemId: 'task123',
      setters: [
        { key: 'backburner', val: true },
        { key: 'parentId', val: 123 },
        { key: 'fieldUpdates.backburner', val: jasmine.any(Number) },
        { key: 'fieldUpdates.parentId', val: jasmine.any(Number) },
        { key: 'updatedAt', val: jasmine.any(Number) },
      ]
    });

    req.flush(mockResponse);
  });

  it('should update task', () => {
    const mockUpdateTaskProps: UpdateTaskProps = {
      itemId: 'task789',
      labelIds: ['label1', 'label2'],
      note: 'Updated note',
      parentProject: 'project101',
      rank: 0,
      title: 'Updated Task Title'
    };

    const mockResponse: Task = { _id: 'task789', title: 'Updated Task Title' } as Task;

    const subscription = service.updateTask(mockUpdateTaskProps).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    subscriptions.push(subscription);

    const req = httpMock.expectOne(req => 
      req.url === apiUrl + 'doc/update' && 
      req.method === 'POST'
    );

    expect(req.request.headers.get('X-Full-Access-Token')).toEqual(marvinConfigs.fullAccessToken);
    expect(req.request.body).toEqual({
      itemId: 'task789',
      setters: [
        { key: 'labelIds', val: ['label1', 'label2'] },
        { key: 'note', val: 'Updated note' },
        { key: 'parentId', val: 'project101' },
        { key: 'rank', val: 0 },
        { key: 'title', val: 'Updated Task Title' },
        { key: 'fieldUpdates.labelIds', val: jasmine.any(Number) },
        { key: 'fieldUpdates.note', val: jasmine.any(Number) },
        { key: 'fieldUpdates.parentId', val: jasmine.any(Number) },
        { key: 'fieldUpdates.rank', val: jasmine.any(Number) },
        { key: 'fieldUpdates.title', val: jasmine.any(Number) },
        { key: 'updatedAt', val: jasmine.any(Number) },
      ]
    });

    req.flush(mockResponse);
  });
});
