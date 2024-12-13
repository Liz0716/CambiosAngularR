import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderService } from '../../../services/provider.service';
import { LocalstorageService } from '../../../services/localstorage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { OrderDetailComponent } from '../../../private/order-detail/order-detail.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private _form_builder: FormBuilder = inject(FormBuilder);
  private _http: HttpClient = inject(HttpClient);
  private _router: Router = inject(Router);
  private _provider: ProviderService = inject(ProviderService);
  private _localstorage: LocalstorageService = inject(LocalstorageService);
  private dialog: MatDialog = inject(MatDialog);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  req: any;

  form_signup: FormGroup = this._form_builder.group({
    name: [null, [Validators.required]],
    password: [null, [Validators.required]],
    phone: [null],
    rol: [3, Validators.required],
  });

  async signup(){
    if(this.form_signup.valid){
      console.log(this.form_signup);

      this.req = await this._provider.request('POST', 'auth/signup',  this.form_signup.value);
      console.log(this.req);

      if(this.req == 'queries_executed'){
        this._localstorage.setItem('user', this.req);
        this._router.navigate(['/auth/sign-in']);
      }else{
        this._snackBar.open('Error al registrar', 'cerrar', {duration:5000});
      }
    }
  }

  async actualOrder() {

    const orderExist = this._localstorage.getItem('user').actual_order;
    console.log(orderExist);
    if (orderExist) {
      this.dialog.open(OrderDetailComponent, { data: { idorder: orderExist } });
    }
  }






}
