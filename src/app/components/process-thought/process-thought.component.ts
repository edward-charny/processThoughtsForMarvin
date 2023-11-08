import { forkJoin, take } from 'rxjs';

import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MarvinService } from '../../services/marvin.service';
import { Label, Project, Task } from '../../types/interfaces';
import { CountdownEvent } from 'ngx-countdown';
import { TreeBuilder } from 'src/app/types/tree';
import { SelectionModel } from '@angular/cdk/collections';

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

    //projects
    projects: Project[];
    flattenedProjects: Project[];

    inboxForm: FormGroup;
    isTimerEnabled: boolean;

    showSpinner = true;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<Project>(false /* multiple */);

    treeControl = new NestedTreeControl<Project>(node => node.children);
    
    dataSource = new MatTreeNestedDataSource<Project>();

    constructor(
        private _snackBar: MatSnackBar,
        private marvinService: MarvinService
    ) {
    //   this.dataSource.data = this.projects;
    }

    hasChild = (_: number, node: Project) => !!node.children && node.children.length > 0;

    ngOnInit(): void {
        this.initForm();
        this.fetchData();
    }

    /** Whether all the descendants of the node are selected */
    descendantsAllSelected(node: Project): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every(child => this.checklistSelection.isSelected(child));
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: Project): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: Project): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
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

        //get projects
        if (!this.projects || this.projects.length === 0) {
            this.marvinService
                .getProjects()
                .pipe(take(1))
                .subscribe((projects) => {
                    //store the flattensed project tree for teh dropdown
                    this.flattenedProjects = projects;
                    const treeBuilder = new TreeBuilder();
                    this.projects = treeBuilder.buildTree(projects);
                    this.dataSource.data = this.projects;
                    this.showSpinner = false;

                    // console.log( this.projects); // Output: Array of root nodes representing the built tree structure
                });
        }
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
        // console.log('label groups', groups);
        // console.log('labels', labels);

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
