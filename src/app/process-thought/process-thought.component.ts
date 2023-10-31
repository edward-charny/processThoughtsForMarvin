import { forkJoin, take } from 'rxjs';

import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MarvinService } from '../marvin.service';
import { Label, Project, Task } from '../interfaces';
import { CountdownEvent } from 'ngx-countdown';

@Component({
  selector: 'app-process-thought',
  templateUrl: './process-thought.component.html',
    styleUrls: ['./process-thought.component.scss'],
})
export class ProcessThoughtComponent implements OnInit, OnDestroy {
  tasks: Task[];
  taskCount = 0;
  
  thought: string;
  comment: string;

  statuses: Label[] = [];
  
  //labels
  ungroupedLabels: Label[] = [];
  topics: Label[] = [];
  contexts: Label[] = [];
  durations: Label[] = [];
  energies: Label[] = [];
  priorities: Label[] = [];
  
  //goals
  responsibilities: Label[] = [];
  shortTermGoals: Label[] = [];
  mediumTermGoals: Label[] = [];
  longTermGoals: Label[] = [];
  outcomesOfLife: Label[] = [];

  inboxForm: FormGroup;
  isTimerEnabled: boolean;

  constructor(private _snackBar: MatSnackBar, private marvinService: MarvinService) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchData();
  }

  private fetchData(): void {
    // get thoughts in inbox
    this.marvinService
    .getInbox()
    .pipe(take(1))
    .subscribe((results: Array<Project | Task>) => {
        this.tasks = results.filter(
            (task) => task.db === 'Tasks'
        ) as Task[];
        this.taskCount = this.tasks.length;
        this.thought = this.tasks[0].title;
        this.comment = this.tasks[0].note;
    });

    // get labels
    forkJoin({
      groups: this.marvinService.getLabelGroups().pipe(take(1)),
      labels: this.marvinService.getLabels().pipe(take(1)),
        }).subscribe((results) => {
    this.processLabelCategories(results.groups?.val, results.labels);
    });
  }

  private initForm(): void {
    this.inboxForm = new FormGroup({
      thought: new FormControl(this.thought),
      comment: new FormControl(this.comment),
      isActionable: new FormControl(),
      isProject: new FormControl(),
      isQuickAction: new FormControl(),
      isDone: new FormControl(),
      successfulOutcome: new FormControl(),
      description: new FormControl(),
      topic: new FormControl(),
      context: new FormControl(),
      duration: new FormControl(),
      energy: new FormControl(),
      priority: new FormControl(),
      status: new FormControl(),
      dueDate: new FormControl(),
      startDate: new FormControl(),
      notes: new FormControl(),
      goals: new FormGroup({
          responsibilities: new FormControl(),
          shortTermGoals: new FormControl(),
          mediumTermGoals: new FormControl(),
          longTermGoals: new FormControl(),
          outcomesOfLife: new FormControl(),
      }),
      isNewProject: new FormControl(),
      newProjectName: new FormControl(),
      projectParent: new FormControl(),
    });
  }

  onComplete() {
    console.log('Complete triggered');
  }

  onCountdown(event: CountdownEvent) {
        if (event.action === 'done') {
            this._snackBar.open('2 minutes have ended!!', 'X');
    }
  }

  onDiscard() {
    console.log('Discard triggered');
  }

  onReferenceSupport() {
    console.log('Reference Support triggered');
  }

  onSomedayMaybe() {
    console.log('Someday Maybe triggered');
  }

  onStartNow() {
    this.isTimerEnabled = true;
  }

  onSubmit() {
    console.log('Submit triggered');
  }

  onUpdateTask() {
    console.log('Update Task triggered');
  }

  private processLabelCategories(groups: any, labels: Label[]): void {
    console.log('label groups', groups);
    console.log('labels', labels);

        labels.forEach((label) => {
      // console.log('label: ', label);
      // console.log('title: ', groups[label.groupId]?.title);
      // console.log('group: ', groups[label.groupId]);
      switch (groups[label.groupId]?.title) {
        case 'Contexts':
          this.contexts.push(label);
          break;
        case 'Times':
          this.durations.push(label);
          break;
        case 'Energy':
          this.energies.push(label);
          break;
        case 'Priorities':
          this.priorities.push(label);
          break;
        case 'Categories':
          this.topics.push(label);
          break;
        case 'Responsibilities':
          label.title = label.title.replace('Responsibility ', '');
          this.responsibilities.push(label);
          break;
        case 'Goals - Short Term':
          label.title = label.title.replace('Goal ', '');
          this.shortTermGoals.push(label);
          break;
        case 'Goals - Medium Term':
          label.title = label.title.replace('Goal ', '');
          this.mediumTermGoals.push(label);
          break;
        case 'Goals - Long Term':
          label.title = label.title.replace('Goal ', '');
          this.longTermGoals.push(label);
          break;
        case 'Outcomes':
                    if (label.title !== 'Outcome of life') {
            label.title = label.title.replace('Outcome ', '');
          }
          this.outcomesOfLife.push(label);
          break;
        default:
                    if (label.title.includes('Goal')) {
            this.ungroupedLabels.push(label);
          } else {
            this.statuses.push(label);
          }
          break;
      }
    });
  }

    ngOnDestroy(): void {}
}
