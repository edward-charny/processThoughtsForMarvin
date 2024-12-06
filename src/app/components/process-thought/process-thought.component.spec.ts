import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarHarness } from '@angular/material/snack-bar/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { CountdownEvent, CountdownStatus } from 'ngx-countdown';
import { MarvinService } from '../../services/marvin.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MockMarvinService } from '../../services/mock-marvin.service';
import { Task, Label, Project } from '../../types/interfaces';

import { ProcessThoughtComponent } from './process-thought.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { of } from 'rxjs';
import { SINGLE_ACTION_PROJECT_ID } from 'src/app/types/constants';
import { SelectionModel } from '@angular/cdk/collections';

describe('ProcessThoughtComponent', () => {
  let component: ProcessThoughtComponent;
  let fixture: ComponentFixture<ProcessThoughtComponent>;
  let loader: HarnessLoader;
  let mockMarvinService: MockMarvinService;
  let marvinService: MarvinService;

  let getInboxSpy: jasmine.Spy;
  let getLabelGroupsSpy: jasmine.Spy;
  let getLabelsSpy: jasmine.Spy;
  let getProjectsSpy: jasmine.Spy;
  let updateTaskSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcessThoughtComponent],
      imports: [
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MarvinService, useClass: MockMarvinService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessThoughtComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    mockMarvinService = TestBed.inject(MockMarvinService);
    marvinService = TestBed.inject(MarvinService);

    // Setup default spy behavior
    getInboxSpy = spyOn(marvinService, 'getInbox').and.returnValue(of(mockMarvinService.mockTasks));
    getLabelGroupsSpy = spyOn(marvinService, 'getLabelGroups').and.returnValue(of({ val: mockMarvinService.mockLabelGroups }));
    getLabelsSpy = spyOn(marvinService, 'getLabels').and.returnValue(of(mockMarvinService.mockLabels));
    getProjectsSpy = spyOn(marvinService, 'getProjects').and.returnValue(of(mockMarvinService.mockProjects));
    component.checklistSelection = new SelectionModel<Project>(true /* multiple */);
    fixture.detectChanges();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with all required fields', () => {
    component['initForm']();
    const form = component.inboxForm;

    expect(form.get('thought')).toBeTruthy();
    expect(form.get('comment')).toBeTruthy();
    expect(form.get('isActionable')).toBeTruthy();
    expect(form.get('isProject')).toBeTruthy();
    expect(form.get('isQuickAction')).toBeTruthy();
    expect(form.get('isDone')).toBeTruthy();
    expect(form.get('successfulOutcome')).toBeTruthy();
    expect(form.get('description')).toBeTruthy();
    expect(form.get('topic')).toBeTruthy();
    expect(form.get('context')).toBeTruthy();
    expect(form.get('duration')).toBeTruthy();
    expect(form.get('energy')).toBeTruthy();
    expect(form.get('priority')).toBeTruthy();
    expect(form.get('status')).toBeTruthy();
    expect(form.get('dueDate')).toBeTruthy();
    expect(form.get('startDate')).toBeTruthy();
    expect(form.get('notes')).toBeTruthy();
    expect(form.get('goals')).toBeTruthy();
    expect(form.get('isNewProject')).toBeTruthy();
    expect(form.get('newProjectName')).toBeTruthy();
    expect(form.get('projectParent')).toBeTruthy();
  });

  it('should initialize goals form group with all required fields', () => {
    component['initForm']();
    const goalsGroup = component.inboxForm.get('goals');

    expect(goalsGroup?.get('responsibilities')).toBeTruthy();
    expect(goalsGroup?.get('shortTermGoals')).toBeTruthy();
    expect(goalsGroup?.get('mediumTermGoals')).toBeTruthy();
    expect(goalsGroup?.get('longTermGoals')).toBeTruthy();
    expect(goalsGroup?.get('outcomesOfLife')).toBeTruthy();
  });

  it('should set validators on required fields', () => {
    component['initForm']();
    const form = component.inboxForm;

    expect(form.get('successfulOutcome')?.hasValidator(Validators.required)).toBeTruthy();
    expect(form.get('description')?.hasValidator(Validators.required)).toBeTruthy();
    expect(form.get('topic')?.hasValidator(Validators.required)).toBeTruthy();
    expect(form.get('context')?.hasValidator(Validators.required)).toBeTruthy();
    expect(form.get('duration')?.hasValidator(Validators.required)).toBeTruthy();
    expect(form.get('energy')?.hasValidator(Validators.required)).toBeTruthy();
    expect(form.get('priority')?.hasValidator(Validators.required)).toBeTruthy();
    expect(form.get('status')?.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should filter array and map matching IDs', () => {
    const labels: Label[] = [
      { _id: '1', title: 'Label 1', groupId: 'g1', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
      { _id: '2', title: 'Label 2', groupId: 'g1', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
      { _id: '3', title: 'Label 3', groupId: 'g2', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' }
    ];
    
    const labelIds = ['1', '3'];

    const result = component['filterAndMap'](labels, labelIds);

    expect(result).toEqual(['1', '3']);
  });

  it('should return empty array when no matches found', () => {
    const labels: Label[] = [
      { _id: '1', title: 'Label 1', groupId: 'g1', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' },
      { _id: '2', title: 'Label 2', groupId: 'g1', color: '', createdAt: Date.now(), icon: '', isAction: false, isHidden: false, showAs: 'text' }
    ];
    
    const labelIds = ['3', '4'];

    const result = component['filterAndMap'](labels, labelIds);

    expect(result).toEqual([]);
  });

  it('should handle empty input arrays', () => {
    const emptyLabels: Label[] = [];
    const emptyIds: string[] = [];

    const result = component['filterAndMap'](emptyLabels, emptyIds);

    expect(result).toEqual([]);
  });

  it('should show snackbar message when countdown is done', fakeAsync(() => {
    // Create countdown event with 'done' action
    const countdownEvent: CountdownEvent = {
      action: 'done',
      status: CountdownStatus.done,
      left: 0,
      text: '00:00:00'
    };

    // Spy on snackbar
    const snackBarSpy = spyOn(component['_snackBar'], 'open');

    // Trigger countdown completion
    component.onCountdown(countdownEvent);
    
    // Wait for async operations
    tick();
    fixture.detectChanges();
    
    // Verify snackbar was called with correct message
    expect(snackBarSpy).toHaveBeenCalledWith('2 minutes have ended!!', 'X');
  }));

  it('should not show snackbar message for non-done countdown events', fakeAsync(() => {
    const countdownEvent: CountdownEvent = {
      action: 'notify',
      status: CountdownStatus.ing,
      left: 30000,
      text: '00:00:30'
    };

    // Spy on snackbar
    const snackBarSpy = spyOn(component['_snackBar'], 'open');

    // Trigger countdown event
    component.onCountdown(countdownEvent);

    // Wait for async operations
    tick();
    fixture.detectChanges();
    
    // Verify snackbar was not called
    expect(snackBarSpy).not.toHaveBeenCalled();
  }));

  it('should process label categories correctly', () => {
    // No need to call processLabelCategories since it's called during initialization
    
    // Verify the arrays are populated correctly
    expect(component.contexts.length).toBe(1);
    expect(component.durations.length).toBe(1);
    expect(component.energies.length).toBe(1);
    expect(component.priorities.length).toBe(1);
    expect(component.topics.length).toBe(1);
    expect(component.responsibilities.length).toBe(1);
    expect(component.shortTermGoals.length).toBe(1);
    expect(component.mediumTermGoals.length).toBe(1);
    expect(component.longTermGoals.length).toBe(1);
    expect(component.outcomesOfLife.length).toBe(1);
    expect(component.statuses.length).toBe(1);
    expect(component.ungroupedLabels.length).toBe(1);
  });

  it('should move to next task correctly', () => {
    component.tasks = mockMarvinService.mockTasks;
    component.thoughtIndex = 0;
    fixture.detectChanges();

    component.nextTask();
    
    expect(component.thoughtIndex).toBe(1);
    expect(component.thought).toBe('Task 2');
    expect(component.comment).toBe('Note 2');
    expect(component.thoughtId).toBe('task2');
  });

  it('should complete task and move to next', () => {
    component.thoughtId = 'task1';
    component.tasks = mockMarvinService.mockTasks;
    
    component.onComplete();
    fixture.detectChanges();

    expect(component.thoughtIndex).toBe(1);
    expect(component.thought).toBe('Task 2');
  });

  it('should move task to someday/maybe list', () => {
    component.thoughtId = 'task1';
    component.tasks = mockMarvinService.mockTasks;
    
    component.onSomedayMaybe();
    fixture.detectChanges();

    expect(component.thoughtIndex).toBe(1);
    expect(component.thought).toBe('Task 2');
  });

  it('should enable timer when starting now', () => {
    component.onStartNow();
    expect(component.isTimerEnabled).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    component.inboxForm.setErrors({ invalid: true });
    spyOn(console, 'log');
    
    component.onSubmit();
    
    expect(console.log).toHaveBeenCalledWith('Form is not valid');
  });

  it('should create new project and update task when isNewProject is true', async () => {
    component.thoughtId = 'testTask';
    component.inboxForm.patchValue({
      description: 'Test Description',
      successfulOutcome: 'Test Outcome',
      notes: 'Test Notes',
      topic: ['topic1'],
      context: ['context1'],
      duration: ['duration1'],
      energy: ['energy1'],
      status: ['status1'],
      priority: 1,
      goals: {
        responsibilities: ['resp1'],
        shortTermGoals: ['short1'],
        mediumTermGoals: ['medium1'],
        longTermGoals: ['long1'],
        outcomesOfLife: ['outcome1']
      },
      isNewProject: true,
      newProjectName: 'New Project',
      projectParent: 'parentId'
    });

    component.onSubmit();
    await fixture.whenStable();
    
    expect(component.flattenedProjects).toBeDefined();
    expect(component.projects).toBeDefined();
  });

  it('should update task with correct data', () => {
    component.thoughtId = 'testTask';
    component.tasks = mockMarvinService.mockTasks;
    
    component.inboxForm.patchValue({
      description: 'Test Description',
      successfulOutcome: 'Test Outcome',
      notes: 'Test Notes',
      topic: ['topic1'],
      context: ['context1'],
      duration: ['duration1'],
      energy: ['energy1'],
      status: ['status1'],
      priority: 1,
      goals: {
        responsibilities: ['resp1'],
        shortTermGoals: ['short1'],
        mediumTermGoals: ['medium1'],
        longTermGoals: ['long1'],
        outcomesOfLife: ['outcome1']
      }
    });

    fixture.detectChanges();
    component.onUpdateTask('parentProject');
    
    expect(updateTaskSpy).toHaveBeenCalled();
    expect(updateTaskSpy).toHaveBeenCalledWith({
      itemId: 'testTask',
      title: 'Test Description',
      note: 'Notes:\nTest Notes\nSuccessful Outcome:\nTest Outcome',
      labelIds: ['topic1', 'context1', 'duration1', 'energy1', 'status1', 
                'resp1', 'short1', 'medium1', 'long1', 'outcome1'],
      rank: 1,
      parentProject: 'parentProject'
    });
    
    expect(component.thoughtIndex).toBe(1);
    expect(component.thought).toBe('Task 2');
  });

  it('should update task directly when isNewProject is false', () => {
    // Setup initial component state
    component.thoughtId = 'mock-task-1';
    component.tasks = mockMarvinService.mockTasks;
    
    // Create spy on onUpdateTask
    spyOn(component, 'onUpdateTask');
    
    // Set form values with all required fields
    component.inboxForm.patchValue({
      description: 'Test Description',
      successfulOutcome: 'Test Outcome',
      topic: ['topic1'],
      context: ['context1'],
      duration: ['duration1'],
      energy: ['energy1'],
      priority: 1,
      status: ['status1'],
      isNewProject: false
    });
    
    fixture.detectChanges();

    component.onSubmit();

    expect(component.onUpdateTask).toHaveBeenCalledWith(SINGLE_ACTION_PROJECT_ID);
  });

  it('hasChild should return true when node has children', () => {
    expect(component.hasChild(0, mockMarvinService.mockProjects[0])).toBe(true);
  });

  it('hasChild should return false when node has no children', () => {
    expect(component.hasChild(0, mockMarvinService.mockProjects[1])).toBe(false);
  });

  it('hasChild should handle undefined children', () => {
    const projectWithNullChildren: Project = {
      ...mockMarvinService.mockProjects[0],
      children: undefined
    };
    expect(component.hasChild(0, projectWithNullChildren)).toBe(false);
  });

  it('hasChild should handle null children', () => {
    const projectWithNullChildren: Project = {
      ...mockMarvinService.mockProjects[0],
      children: null
    };
    expect(component.hasChild(0, projectWithNullChildren)).toBe(false);
  });

  it('hasChild should handle undefined children', () => {
    const projectWithNullChildren: Project = {
      ...mockMarvinService.mockProjects[0],
      children: undefined
    };
    expect(component.hasChild(0, projectWithNullChildren)).toBe(false);
  });

  it('hasChild should handle empty children array', () => {
    const projectWithEmptyChildren: Project = {
      ...mockMarvinService.mockProjects[0],
      children: []
    };
    expect(component.hasChild(0, projectWithEmptyChildren)).toBe(false);
  });

  it('descendantsAllSelected should return true when all descendants are selected', () => {
    const parentNode = mockMarvinService.mockProjects[0];
    if (parentNode.children) {
      parentNode.children.forEach(child => {
        component.checklistSelection.select(child);
      });
    }
    expect(component.descendantsAllSelected(parentNode)).toBe(true);
  });

  it('descendantsPartiallySelected should return true when some descendants are selected', () => {
    const node = mockMarvinService.mockProjects[0];
    const childNode = node.children![0];

    expect(node!.children!.length > 1).toBe(true);
    
    // Select the child node
    component.checklistSelection.select(childNode);
    
    // Ensure the parent node is not selected
    expect(component.checklistSelection.isSelected(node)).toBe(false);
    
    // Check if descendantsPartiallySelected returns true
    expect(component.descendantsPartiallySelected(node)).toBe(true);
  });

  it('todoItemSelectionToggle should toggle selection of node and its descendants', () => {
    const node = mockMarvinService.mockProjects[0];
    
    // Ensure the node and its descendants are initially not selected
    expect(component.checklistSelection.isSelected(node)).toBe(false);
    expect(component.checklistSelection.isSelected(node.children![0])).toBe(false);

    // Toggle selection on the node
    component.todoItemSelectionToggle(node);
    expect(component.checklistSelection.isSelected(node)).toBe(true);
    expect(component.checklistSelection.isSelected(node.children![0])).toBe(true);

    // Toggle selection off the node
    component.todoItemSelectionToggle(node);
    expect(component.checklistSelection.isSelected(node)).toBe(false);
    expect(component.checklistSelection.isSelected(node.children![0])).toBe(false);
  });
  
  it('should handle empty inbox', () => {
    getInboxSpy.and.returnValue(of([]));
    spyOn(component['_snackBar'], 'open');

    component.fetchData();
    
    expect(getInboxSpy).toHaveBeenCalled();
    expect(component.tasks.length).toBe(0);
    expect(component.showSpinner).toBeFalse();
    expect(component['_snackBar'].open).toHaveBeenCalledWith('No thoughts to process!', 'OK');
  });

  it('should process inbox tasks correctly', () => {
    getInboxSpy.and.returnValue(of([mockMarvinService.mockTasks[0]]));
    getLabelGroupsSpy.and.returnValue(of({ val: {} }));
    getLabelsSpy.and.returnValue(of([]));
    getProjectsSpy.and.returnValue(of([]));

    component.fetchData();

    expect(component.tasks.length).toBe(1);
    expect(component.taskCount).toBe(1);
    expect(component.thought).toBe('Task 1');
    expect(component.comment).toBe('Note 1');
    expect(component.thoughtId).toBe('task1');
  });

  it('should filter out completed tasks', () => {
    getLabelGroupsSpy.and.returnValue(of({ val: {} }));
    getLabelsSpy.and.returnValue(of([]));
    getProjectsSpy.and.returnValue(of([]));

    component.fetchData();

    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0]._id).toBe('task1');
  });

  it('should handle tasks with labels', () => {
    component.topics = [{ _id: 'label1', title: 'Topic 1' } as Label];
    component.contexts = [{ _id: 'label2', title: 'Context 1' } as Label];

    getLabelGroupsSpy.and.returnValue(of({ val: {} }));
    getLabelsSpy.and.returnValue(of([]));
    getProjectsSpy.and.returnValue(of([]));

    component.fetchData();

    expect(component.inboxForm.get('topic')?.value).toEqual(['label1']);
    expect(component.inboxForm.get('context')?.value).toEqual(['label2']);
  });

  it('should handle download data flag', () => {
    component.downloadData = true;
    const mockProjects = [{ _id: 'project1', title: 'Project 1' }];

    getInboxSpy.and.returnValue(of([]));
    getLabelGroupsSpy.and.returnValue(of({ val: {} }));
    getLabelsSpy.and.returnValue(of([]));
    getProjectsSpy.and.returnValue(of(mockProjects as Project[]));
    spyOn(component['fileDownloadService'], 'saveToCSV');

    component.fetchData();

    expect(component['fileDownloadService'].saveToCSV).toHaveBeenCalledWith('projects', mockProjects);
  });
});