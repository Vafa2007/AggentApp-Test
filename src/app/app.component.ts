import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { ListFormat } from 'typescript';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iTickets';
  offer:boolean = false;
  requestForm: FormGroup;
  // company_result: Result = { econom: null, premium: null, lux: null };
  total_result: Companies = { aeroflot: null, rjd: null};
  
  companies_array = ['aeroflot', 'rjd'];
  conditions_array = [{
      aeroflot: [
        { class: 'econom', distance_rub: 4, free_baggage: 5, paid_baggage: 4000, max_baggage: 20, children: [0, 1, 0] },
        { class: 'premium', distance_rub: 8, free_baggage: 20, paid_baggage: 5000, max_baggage: 50, children: [7, 0.3, 0] },
        { class: 'lux', distance_rub: 15, free_baggage: 50, paid_baggage: 0, max_baggage: 50, children: [16, 0.3, 1] }
      ],
      rjd: [
        { class: 'econom', distance_rub: 0.5, free_baggage: 15, paid_baggage: 50, max_baggage: 50, children: [5, 0.5, 0] },
        { class: 'premium', distance_rub: 2, free_baggage: 20, paid_baggage: 50, max_baggage: 60, children: [8, 0.5, 0] },
        { class: 'lux', distance_rub: 4, free_baggage: 60, paid_baggage: 0, max_baggage: 60, children: [16, 0.2, 1] }
      ]
  }]

  // _aeroflot = this.conditions_array[0]['aeroflot'];
  // _rjd = this.conditions_array[0]['rjd'];

  constructor(private form_b: FormBuilder) {
    this.requestForm = this.form_b.group({
      distance: [''],
      age: [''],
      baggage: ['']
    });
  }

  onSubmit(formValue: FormGroup) {
    console.log(formValue.value)
    let _distance = formValue.get('distance').value;
    let _age = formValue.get('age').value;
    let _baggage = formValue.get('baggage').value;
    
    this.process(_distance, _age, _baggage)
    this.offer = true;
    console.log(this.total_result)
  }
  
  process(_distance: number, _age: number, _baggage: number){
    
    for (let k = 0; k < this.companies_array.length; k++) {
      let _company = this.conditions_array[0][this.companies_array[k]];
      
      console.log(this.companies_array[k]) 

      let company_result: Result = { econom: null, premium: null, lux: null };
      for (let i = 0; i < _company.length; i++) {
        let variant = _company[i];
        
        let result: number;
        // console.log(variant, result)
        if (_baggage <= variant['max_baggage']) {

          result = _distance * variant['distance_rub'];
          // console.log(this.result_array)
          if (_age <= variant['children'][0]) {
            result *= (1 - variant['children'][1])
          }
          // console.log(this.result_array)
          if ( _baggage > variant['free_baggage']) {     
            let baggage_total: number;

            if(this.companies_array[k] == 'rjd'){
              baggage_total = variant['paid_baggage'] * (_baggage - variant['free_baggage'])
            }else{
              baggage_total = variant['paid_baggage']
            }

            if(_age <= variant['children'][0] && variant['children'][2] == 1) 
            // variant['children'][2] == 1 - ushaqlara olan endirim baqajada aiddir, 0 - baqaja aid deyil
            {
              result += (baggage_total * (1 - variant['children'][1]))
            }else{              
              result += baggage_total
            }
          }
          // console.log(this.result_array)
        } else {
          result = null;
        }
        
        company_result[variant['class']] = result;
        // console.log(company_result)
        // console.log(this.total_result)
      }
      console.log(this.total_result)
      this.total_result[this.companies_array[k]] = company_result;      
      console.log(this.total_result)
           
    }
  }
}

interface Result {
  econom: number;
  premium: number;
  lux: number;
}

interface Companies {
  aeroflot: [];
  rjd: [];
}

