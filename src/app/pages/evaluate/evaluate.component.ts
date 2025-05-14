import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpService } from '../../services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { PredictionComponent } from '../../components/prediction/prediction.component';

@Component({
  selector: 'app-evaluate',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './evaluate.component.html',
  styleUrl: './evaluate.component.scss'
})
export class EvaluateComponent {
  isLoading = false;
  errorMessage: string | null = null;
  readonly dialog = inject(MatDialog);
  scoringForm = new FormGroup({
    age: new FormControl(null, [
      Validators.required,
      Validators.min(20),
      Validators.max(80),
      Validators.pattern(/^[0-9]+$/),
    ]),
    dependents: new FormControl(null, [
      Validators.min(0),
      Validators.max(99),
      Validators.pattern(/^[0-9]+$/),
    ]),
    income: new FormControl(null, [
      Validators.min(0),
    ]),
    openLoans: new FormControl(null, [
      Validators.min(0),
      Validators.pattern(/^[0-9]+$/),
    ]),
    estateLoans: new FormControl(null, [
      Validators.min(0),
      Validators.pattern(/^[0-9]+$/),
    ]),
    utilization: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
    ratio: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
    pastTimes: new FormControl(null, [
      Validators.min(0),
      Validators.pattern(/^[0-9]+$/),
    ]),
  });

  constructor(private httpService: HttpService) { }

  prepareData(data: any): any {
    return {
      age: data.age,
      dependents: data.dependents || 0.0,
      income: data.income || 0.0,
      openLoans: data.openLoans || 0.0,
      estateLoans: data.estateLoans || 0.0,
      utilization: data.utilization ? (data.utilization / 100) : 0.0,
      ratio: data.ratio ? (data.ratio / 100) : 0.0,
      pastTimes: data.pastTimes || 0.0
    }
  }

  onSubmit(): void {

    if (!this.scoringForm.valid) {
      console.log('Form is not valid');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const data = this.prepareData(this.scoringForm.value);
    this.httpService.predict(data).subscribe(
      result => {
        this.openDialog(data, result.prediction);
        this.isLoading = false;
      },
      error => {
        console.error('Prediction error:', error)
        this.errorMessage = '*Произошла ошибка при попытке выполнить оценку. Попробуйте снова.';
        this.isLoading = false;
      }
    );
  }

  openDialog(info: any, prediction: any): void {
    const dialogRef = this.dialog.open(PredictionComponent, {
      data: { info, prediction },
      height: '520px',
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.scoringForm.reset();
    });
  }
}
