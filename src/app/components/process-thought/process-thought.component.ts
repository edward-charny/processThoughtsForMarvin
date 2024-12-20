import { CountdownEvent, CountdownStatus } from 'ngx-countdown';
import { forkJoin, take } from 'rxjs';
import { SINGLE_ACTION_PROJECT_ID } from 'src/app/types/constants';
import { TreeBuilder } from 'src/app/types/tree';

import { SelectionModel } from '@angular/cdk/collections';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { FileDownloadService } from '../../services/file-download.service';
import { MarvinService } from '../../services/marvin.service';
import {
    BackburnerItem, CreateProjectProps, Label, Project, Task, UpdateTaskProps
} from '../../types/interfaces';

@Component({
    selector: 'app-process-thought',
    templateUrl: './process-thought.component.html',
    styleUrls: ['./process-thought.component.scss'],
})
export class ProcessThoughtComponent implements OnInit, OnDestroy {
    downloadData = false;
    singleActionsProjectId = SINGLE_ACTION_PROJECT_ID;
    tasks: Task[] = [];
    taskCount = 0;

    comment: string;
    thought: string;
    thoughtId: string;
    thoughtIndex: number = 0;

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
    checklistSelection = new SelectionModel<Project>(true /* multiple */);

    treeControl = new NestedTreeControl<Project>(node => node.children);
    
    dataSource = new MatTreeNestedDataSource<Project>();

    constructor(
        private _snackBar: MatSnackBar,
        private cdRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private marvinService: MarvinService,
        private fileDownloadService: FileDownloadService
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

    fetchData(): void {
        // get thoughts in inbox
        this.marvinService
            .getInbox()
            .pipe(take(1))
            .subscribe({
                next: (results: Array<Project | Task>) => {
                    this.tasks = results.filter(
                        (task) => task.db === 'Tasks' && !task.done
                    ) as Task[];
                    this.taskCount = this.tasks.length;
                    
                    if (this.tasks.length === 0) {
                        this._snackBar.open('No thoughts to process!', 'OK');
                        this.showSpinner = false;
                        return;
                    }

                    const task = this.tasks[this.thoughtIndex];
                    if (task) {
                        this.comment = task.note || '';
                        this.thought = task.title || '';
                        this.thoughtId = task._id;
                        const priorities = task.rank?.toString();

                        if (task.labelIds?.length > 0) {
                            console.log('labels: ', task.labelIds);
                            const ungroupedLabels = this.filterAndMap(this.ungroupedLabels, task.labelIds);
                            const topics = this.filterAndMap(this.topics, task.labelIds);
                            const contexts = this.filterAndMap(this.contexts, task.labelIds);
                            const durations = this.filterAndMap(this.durations, task.labelIds);
                            const energies = this.filterAndMap(this.energies, task.labelIds);
                            
                            const statuses = this.filterAndMap(this.statuses, task.labelIds);
                            const responsibilities = this.filterAndMap(this.responsibilities, task.labelIds);
                            const shortTermGoals = this.filterAndMap(this.shortTermGoals, task.labelIds);
                            const mediumTermGoals = this.filterAndMap(this.mediumTermGoals, task.labelIds);
                            const longTermGoals = this.filterAndMap(this.longTermGoals, task.labelIds);
                            const outcomesOfLife = this.filterAndMap(this.outcomesOfLife, task.labelIds);
                            
                            if (this.downloadData) {
                              this.fileDownloadService.saveToCSV("topics", this.topics);
                              this.fileDownloadService.saveToCSV("contexts", this.contexts);
                              this.fileDownloadService.saveToCSV("durations", this.durations);
                              this.fileDownloadService.saveToCSV("energies", this.energies);
                              this.fileDownloadService.saveToCSV("statuses", this.statuses);
                              this.fileDownloadService.saveToCSV("responsibilities", this.responsibilities);
                              this.fileDownloadService.saveToCSV("shortTermGoals", this.shortTermGoals);
                              this.fileDownloadService.saveToCSV("mediumTermGoals", this.mediumTermGoals);
                              this.fileDownloadService.saveToCSV("longTermGoals", this.longTermGoals);
                              this.fileDownloadService.saveToCSV("outcomesOfLife", this.outcomesOfLife);
                            }

                            this.inboxForm.patchValue({
                                isActionable: 'yes',
                                isProject: 'no',
                                isQuickAction: 'no',
                                topic: topics,
                                // ungroupedLabels: ungroupedLabels,
                                context: contexts,
                                duration: durations.length === 1 ? durations[0] : '',
                                energy: energies.length === 1 ? energies[0] : '',
                                priority: priorities,
                                status: statuses,
                                // dueDate: [''],
                                // startDate: [''],
                                goals: {
                                    responsibilities: responsibilities,
                                    shortTermGoals: shortTermGoals,
                                    mediumTermGoals: mediumTermGoals,
                                    longTermGoals: longTermGoals,
                                    outcomesOfLife: outcomesOfLife
                                }
                            });
                        }
                    }
                    this.showSpinner = false;
                },
                error: (error) => {
                    console.error('Error fetching inbox:', error);
                    this._snackBar.open('Error loading thoughts!', 'OK');
                    this.showSpinner = false;
                }
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
                if (this.downloadData) {
                    this.fileDownloadService.saveToCSV("projects", this.projects);
                }
                this.showSpinner = false;

                // console.log( this.projects); // Output: Array of root nodes representing the built tree structure
            });
        }
    }

    private filterAndMap(arr: Label[], labelIds: string[]): string[] {
        return arr.reduce((result: string[], value) => {
          if (labelIds.some(labelId => value._id === labelId)) {
            result.push(value._id);
          }
          return result;
        }, []);
    }

    private initForm(): void {
        this.inboxForm = this.formBuilder.group({
            thought: [''],
            comment: [''],
            isActionable: [''],
            isProject: [''],
            isQuickAction: [''],
            isDone: [''],
            successfulOutcome: ['', Validators.required],
            description: ['', Validators.required],
            topic: ['', Validators.required],
            context: ['', Validators.required],
            duration: ['', Validators.required],
            energy: ['', Validators.required],
            priority: ['', Validators.required],
            status: ['', Validators.required],
            dueDate: [''],
            startDate: [''],
            notes: [''],
            goals: this.formBuilder.group({
                responsibilities: [''],
                shortTermGoals: [''],
                mediumTermGoals: [''],
                longTermGoals: [''],
                outcomesOfLife: [''],
            }),
            isNewProject: [''],
            newProjectName: [''],
            projectParent: [''],
        });
    }

    nextTask() {
        this.thoughtIndex++;
        if (this.thoughtIndex < this.tasks.length) {
            this.comment = this.tasks[this.thoughtIndex].note;
            this.thought = this.tasks[this.thoughtIndex].title;
            this.thoughtId = this.tasks[this.thoughtIndex]._id;
            this.inboxForm.reset();
        }
    }

    onComplete() {
        console.log('Complete triggered');
        this.marvinService
            .setTaskDone(this.thoughtId)
            .pipe(take(1))
            .subscribe((response) => {
                console.log(response);
                this.nextTask();
            });
    }

    onCountdown(event: CountdownEvent) {
        if (event.action === 'done' && event.status === CountdownStatus.done) {
            this._snackBar.open('2 minutes have ended!!', 'X');
        }
    }

    onDiscard() {
        //TODO: implement discard
        console.log('Discard triggered');
        this._snackBar.open('Discard functionality not yet implemented', 'OK', {
            duration: 3000,
        });
    }

    
    onReferenceSupport() {
        console.log('Reference Support triggered');
        // close aftere 5 minutes
        const dialogRef = this._snackBar.open('Please file the item and press OK when completed.', 'OK', {
            duration: 300000,
        });

        dialogRef.onAction().subscribe(() => {
            this.onComplete();
        });
    }

    onSomedayMaybe() {
        const task: BackburnerItem = {
            itemId: this.thoughtId,
            parentProject: 1766483747,
            backburner: true
        };
        this.marvinService
            .setTaskOnBackburner(task)
            .pipe(take(1))
            .subscribe((response) => {
                console.log(response);
                this.nextTask();
            });
        console.log('task: ', task);
    }

    onStartNow() {
        this.isTimerEnabled = true;
    }

    onSubmit() {
        console.log('Submit triggered');
        
        if(!this.inboxForm.valid) {
            console.log('Form is not valid');
            return;
        }

        if(this.inboxForm.value.isNewProject === true) {
            const project: CreateProjectProps = {
                day: null,
                title: this.inboxForm.value.newProjectName,
                parentId: this.inboxForm.value.projectParent
            };

            this.marvinService
                .createProject(project)
                .pipe(take(1))
                .subscribe((response: Project) => {
                    this.marvinService
                    .getProjects()
                    .pipe(take(1))
                    .subscribe((projects) => {
                        //store the flattensed project tree for the dropdown
                        this.flattenedProjects = projects;
                        const treeBuilder = new TreeBuilder();
                        this.projects = treeBuilder.buildTree(projects);
                        this.dataSource.data = this.projects;
                        this.showSpinner = false;
                        
                        this.flattenedProjects.find((project) => {
                            if(project._id === response._id) {
                                this.onUpdateTask(project._id)
                            }
                        })
                    });
                    console.log(response);
                });
        } else {
            this.onUpdateTask(this.inboxForm.value.projectParent ? this.inboxForm.value.projectParent : this.singleActionsProjectId);
        }

    }

    onUpdateTask(parentProject: string) {
        console.log('Update Task triggered');

        if(this.inboxForm.value.newProjectName) {
            this.inboxForm.value.isNewProject = true;
        }

        const labelIds: string[] = [
            this.inboxForm.value.topic,
            this.inboxForm.value.context,
            this.inboxForm.value.duration,
            this.inboxForm.value.energy,
            this.inboxForm.value.status,
        ];

        if(this.inboxForm.value.goals.responsibilities) {
            labelIds.push(this.inboxForm.value.goals.responsibilities);
        }
        if(this.inboxForm.value.goals.shortTermGoals) {
            labelIds.push(this.inboxForm.value.goals.shortTermGoals);
        }
        if(this.inboxForm.value.goals.mediumTermGoals) {
            labelIds.push(this.inboxForm.value.goals.mediumTermGoals);
        }
        if(this.inboxForm.value.goals.longTermGoals) {
            labelIds.push(this.inboxForm.value.goals.longTermGoals);
        }
        if(this.inboxForm.value.goals.outcomesOfLife) {
            labelIds.push(this.inboxForm.value.goals.outcomesOfLife);
        }

        const task: UpdateTaskProps = {
            itemId: this.thoughtId,
            title: this.inboxForm.value.description,
            note:   'Notes:\n' + this.inboxForm.value.notes +
                    '\nSuccessful Outcome:\n' + this.inboxForm.value.successfulOutcome,
            labelIds: labelIds,
            rank: this.inboxForm.value.priority,
            parentProject: parentProject
        };
        this.marvinService
            .updateTask(task)
            .pipe(take(1))
            .subscribe((response) => {
                console.log(response);
                this.nextTask();
            });
        console.log('task: ', task);
    }

    processLabelCategories(groups: any, labels: Label[]): void {
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

    ngOnDestroy(): void {
        // Clear any selections
        this.checklistSelection.clear();
        
        // Clear data sources
        this.dataSource.data = [];
        
        // Reset component state
        this.tasks = [];
        this.showSpinner = false;
        
        // Trigger change detection one final time
        this.cdRef.detectChanges();
    }
}
