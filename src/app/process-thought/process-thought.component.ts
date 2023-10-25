import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-process-thought',
  templateUrl: './process-thought.component.html',
  styleUrls: ['./process-thought.component.scss']
})
export class ProcessThoughtComponent implements OnInit {
  thought = 'See if there is a new book in the Banjamin Ashwood series in a few months';
  comment = 'https://www.goodreads.com/series/205201-benjamin-ashwood';

  inboxForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  onComplete() {
    console.log('Complete triggered');
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
    console.log('Start Now triggered');
  }

  onSubmit() {
    console.log('Submit triggered');
  }

  onUpdateTask() {
    console.log('Update Task triggered');
  }

  private initForm() {
    this.inboxForm = new FormGroup({
      'thought': new FormControl(this.thought),
      'comment': new FormControl(this.comment),
      'isActionable': new FormControl(),
      'isProject': new FormControl(),
      'isQuickAction': new FormControl(),
      'isDone': new FormControl(),
      'topic': new FormControl(),
      'successfulOutcome': new FormControl(),
      'description': new FormControl(),
      'context': new FormControl(),
      'duration': new FormControl(),
      'energy': new FormControl(),
      'priority': new FormControl(),
      'status': new FormControl(),
      'dueDate': new FormControl(),
      'startDate': new FormControl(),
      'notes': new FormControl(),
      'goals': new FormGroup({
        'responsibilities': new FormControl(),
        'shortTermGoals': new FormControl(),
        'mediumTermGoals': new FormControl(),
        'longTermGoals': new FormControl(),
        'outcomesOfLife': new FormControl()
      }),
      'isNewProject': new FormControl(),
      'newProjectName': new FormControl(),
      'projectParent': new FormControl()
    });
  }
}
