import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluateComponent } from './pages/evaluate/evaluate.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'evaluate' },
    { path: 'evaluate', component: EvaluateComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }