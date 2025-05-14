import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';

export interface ScoringData {
    RevolvingUtilizationOfUnsecuredLines: number;
    age: number;
    NumberOfTime30_59DaysPastDueNotWorse: number;
    DebtRatio: number;
    MonthlyIncome: number;
    NumberOfOpenCreditLinesAndLoans: number;
    NumberRealEstateLoansOrLines: number;
    NumberOfDependents: number;
}

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    private baseUrl = environment.domain;

    constructor(private http: HttpClient) { }

    predict(data: any): Observable<any> {
        const payload: ScoringData = {
            RevolvingUtilizationOfUnsecuredLines: data.utilization,
            age: data.age,
            NumberOfTime30_59DaysPastDueNotWorse: data.pastTimes,
            DebtRatio: data.ratio,
            MonthlyIncome: data.income,
            NumberOfOpenCreditLinesAndLoans: data.openLoans,
            NumberRealEstateLoansOrLines: data.estateLoans,
            NumberOfDependents: data.dependents,
        };

        return this.http
            .post<ScoringData>(
                `${this.baseUrl}/api/scoring/predict`,
                payload,
                { observe: 'response' }
            )
            .pipe(
                map((res: HttpResponse<any>) => res.body),
                catchError(err => throwError(() => err))
            );
    }
}