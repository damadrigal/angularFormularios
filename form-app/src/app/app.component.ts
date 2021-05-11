import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'form-app';

  public sentencias: string[] = [
    'Seleccionar ',
    'Select',
    'Insert',
    'Update',
    'Delete',
  ];
  public tiposJoin: string[] = [
    'Inner Join',
    'Left join',
    'Outer Join',
    'Right Join',
  ];
  public sentencia: string = this.sentencias[0];
  public joinSeleccionado: string = this.tiposJoin[0];
  public secciones: number = 0;

  public selects: FormGroup[] = []; // lista de partes de los selects
  public joins: FormGroup[] = []; // lista de partes de los selects
  public selectForm: FormGroup = new FormGroup({}); //nombre asignado al formulario de select
  public insertForm: FormGroup = new FormGroup({}); //nombre asignado al formulario de insert
  public updateForm: FormGroup = new FormGroup({}); //nombre asignado al formulario de update
  public deleteForm: FormGroup = new FormGroup({}); //nombre asignado al formulario de delete
  public JoinForm: FormGroup = new FormGroup({}); //nombre asignado al formulario de insert
  public selectIndice = 0; //permite contar las s1tructuras agregadas dinamicamente
  public joinIndice = 0; //permite contar las s1tructuras agregadas dinamicamente de los join
  public tablasSelect: any[]=[];
  public joinTablas :any[]=[];
  public resultado = ''; // resultado de los selects
  public whereValue = '';
  public showJoin = false;
  public showWhere = false;
  public desabilitarBoton = true;
  public tablaSelected = 0;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.selectForm = new FormGroup({
      ['Columnas' + this.selectIndice]: new FormControl('', [
        Validators.required,
      ]),
      ['Tabla' + this.selectIndice]: new FormControl('', [Validators.required]),
    });
    this.updateForm = new FormGroup({
      ['Tabla']: new FormControl('', [Validators.required]),
      ['Columnas']: new FormControl('', [
        Validators.required,
      ]),
    });
    this.deleteForm = new FormGroup({
      ['Tabla']: new FormControl('', [Validators.required]),
      ['Columnas']: new FormControl('', [
        Validators.required,
      ]),
    });
    this.selects.push(this.selectForm);

    this.JoinForm = new FormGroup({
      ['TipoJoin' + this.joinIndice]: new FormControl('', [
        Validators.required,
      ]),
      ['Tabla' + this.joinIndice + '1']: new FormControl('', [
        Validators.required,
      ]),
      ['Columna' + this.joinIndice + '1']: new FormControl('', [
        Validators.required,
      ]),
      ['Tabla' + this.joinIndice + '2']: new FormControl('', [
        Validators.required,
      ]),
      ['Columna' + this.joinIndice + '2']: new FormControl('', [
        Validators.required,
      ]),
    }
    );

    this.joins.push(this.JoinForm);
    this.joinTablas.push({tabla1:0,tabla2:0});

    this.insertForm = new FormGroup({
      ['Tabla']: new FormControl('', [Validators.required]),
      ['Columnas']: new FormControl('', [Validators.required]),
      ['Valores']: new FormControl('', [Validators.required]),
    });
  }

  setSeccion(sen: number) {
    this.secciones = sen;
    this.sentencia = this.sentencias[sen];
  }

  

  addElementSelect() {
    this.selectIndice++;
    this.selectForm = new FormGroup({
      ['Columnas' + this.selectIndice]: new FormControl('', [
        Validators.required,
      ]),
      ['Tabla' + this.selectIndice]: new FormControl('', [Validators.required]),
    });
    this.selects.push(this.selectForm);

  }

  
  addElementJoin() {
    if (this.showJoin || this.joins.length==0) {
      this.JoinForm = new FormGroup({
        ['TipoJoin' + this.joinIndice]: new FormControl('', [
          Validators.required,
        ]),
        ['Tabla' + this.joinIndice + '1']: new FormControl('', [
          Validators.required,
        ]),
        ['Columna' + this.joinIndice + '1']: new FormControl('', [
          Validators.required,
        ]),
        ['Tabla' + this.joinIndice + '2']: new FormControl('', [
          Validators.required,
        ]),
        ['Columna' + this.joinIndice + '2']: new FormControl('', [
          Validators.required,
        ]),
      });
      this.joins.push(this.JoinForm);
      this.joinTablas.push({tabla1:0,tabla2:0});
    }
    this.joinIndice++;
    this.showJoin = true;
  }

  setJoin(i: number) {
    this.joinSeleccionado = this.tiposJoin[i];
  }

  deleteElementSelect(index: number) {
    this.selects.splice(index, 1);
    this.selectIndice--;
  }

  deleteElementJoin(index: number) {
    this.joins.splice(index, 1);
    this.joinTablas.splice(index,1);
    this.joinIndice--;
    if(this.joinIndice==0){
      this.showJoin = false;
    }
  }

  onClickSelect(index: number) {
    if (
      this.selects[index].value['Columnas' + index] !=
        this.selectForm.value['Columnas' + index] ||
      this.selects[index].value['Tabla' + index] !=
        this.selectForm.value['Tabla' + index]
    ) {
      if (
        this.selects[index].value['Columnas' + index] != '' ||
        this.selects[index].value['Tabla' + index] != ''
      ) {
        this.selectForm = this.formBuilder.group({
          ['Columnas' + index]: new FormControl(
            this.selects[index].value['Columnas' + index],
            [Validators.required]
          ),
          ['Tabla' + index]: new FormControl(
            this.selects[index].value['Tabla' + index],
            [Validators.required]
          ),
        });
        this.selects[index] = this.selectForm;
      }
    }
  }

  onChangeSelect(index: number) {
    if (
      this.selects[index].value['Columnas' + index] != '' ||
      this.selects[index].value['Tabla' + index] != ''
    )
      this.selectForm = this.formBuilder.group({
        ['Columnas' + index]: new FormControl(
          this.selects[index].value['Columnas' + index],
          [Validators.required]
        ),
        ['Tabla' + index]: new FormControl(
          this.selects[index].value['Tabla' + index],
          [Validators.required]
        ),
      });
    this.selects[index] = this.selectForm;
    this.setTablesJoin();
    this.habilitarBoton();
  }

  onChangeJoin(index: number) {
    if (
      this.joins[index].value['TipoJoin' + index] != '' ||
      this.joins[index].value['Tabla' + index + '1'] != '' ||
      this.joins[index].value['Columna' + index + '1'] != '' ||
      this.joins[index].value['Tabla' + index + '2'] != '' ||
      this.joins[index].value['Columna' + index + '2'] != ''
    )
      this.JoinForm = this.formBuilder.group({
        ['TipoJoin' + index]: new FormControl(this.joins[index].value['TipoJoin' + index], [
          Validators.required,
        ]),
        ['Tabla' + index + '1']: new FormControl(this.joins[index].value['Tabla' + index + '1'], [
          Validators.required,
        ]),
        ['Columna' + index + '1']: new FormControl(this.joins[index].value['Columna' + index + '1'], [
          Validators.required,
        ]),
        ['Tabla' + index + '2']: new FormControl(this.joins[index].value['Tabla' + index + '2'], [
          Validators.required,
        ]),
        ['Columna' + index + '2']: new FormControl(this.joins[index].value['Columna' + index + '2'], [
          Validators.required,
        ]),
      });
    this.joins[index] = this.JoinForm;
    this.habilitarBoton();
  }

  setTablesJoin(){
    this.tablasSelect=[];
    this.selects.forEach((select, index) => {
      var tabla ={};
      if(!select.invalid){
        tabla = {
          tabla:select.value['Tabla' + index],
          columnas:select.value['Columnas' + index].split(',')
        }
      }
      this.tablasSelect.push(tabla);
    });

  }

  habilitarBoton(){
    if(this.showJoin){
      if(!this.selectForm.invalid && !this.JoinForm.invalid){
        this.desabilitarBoton = false;
      }else{
        this.desabilitarBoton = true;
      }
    }else{
      this.desabilitarBoton = this.selectForm.invalid;
    }
  }

  onWhereChange(event: any) {
    this.whereValue = event.target.value;
  }

  onChangeInsert() {
    if (
      this.insertForm.value['Columnas'] != '' ||
      this.insertForm.value['Tabla'] != ''
    )
      this.insertForm = this.formBuilder.group({
        ['Tabla']: new FormControl(this.insertForm.value['Tabla'], [
          Validators.required,
        ]),
        ['Columnas']: new FormControl(this.insertForm.value['Columnas']),
        ['Valores']: new FormControl(this.insertForm.value['Valores'], [
          Validators.required,
        ]),
      });
  }
  onChangeUpdate() {
    if (
      this.updateForm.value['Columnas'] != '' ||
      this.updateForm.value['Tabla'] != ''
    )
      this.insertForm = this.formBuilder.group({
        ['Tabla']: new FormControl(
          this.updateForm.value['Tabla'],
          [Validators.required]
        ),
        ['Columnas']: new FormControl(
          this.updateForm.value['Columnas']
        ),
      });
  }
  onChangeDelete() {
    if (
      this.deleteForm.value['Columnas'] != '' ||
      this.deleteForm.value['Tabla'] != ''
    )
      this.deleteForm = this.formBuilder.group({
        ['Tabla']: new FormControl(
          this.deleteForm.value['Tabla'],
          [Validators.required]
        ),
        ['Columnas']: new FormControl(
          this.deleteForm.value['Columnas']
        ),
      });
  }
  onSubmit() {
    if (this.secciones == 1) {
      this.summitSelect();
    } else if (this.secciones == 2) {
      this.resultado = 'Insert into ';
      this.resultado += this.insertForm.value['Tabla'];
      if (this.insertForm.value['Columnas'] != '') {
        this.resultado += ' (' + this.insertForm.value['Columnas'] + ')';
      }
      this.resultado += '\n';
      this.resultado += ' values(' + this.insertForm.value['Valores'] + ')';
    } else if (this.secciones == 3) {
      this.resultado = 'Update ';
      this.resultado+= this.updateForm.value['Tabla'];
      this.resultado+= ' set ';
        if(this.updateForm.value['Columnas']!=''){
          this.resultado+= ' ' +this.updateForm.value['Columnas']+' = "$'+this.updateForm.value['Columnas'] + '"';
          const valor =  this.updateForm.value['Columnas'].toISOString().substring(1, 3);
          this.resultado+=valor;
        }
      this.resultado+='\n';
    } else if (this.secciones == 4) {
      this.resultado = 'Delete ';
      this.resultado+= this.deleteForm.value['Tabla'];
	    this.resultado+= ' Where ';
      if(this.deleteForm.value['Columnas']!=''){
        this.resultado += this.deleteForm.value['Columnas'];
      }
    }
    this.resultado += ';';
  }

  summitSelect() {
    this.resultado = 'Select ';
    this.selects.forEach((select, index) => {
      if (this.selects.length == 1) {
        this.resultado += select.value['Columnas' + index] + '\n';
      }
      if (this.selects.length >= 1 && index < this.selects.length - 1) {
        this.resultado += select.value['Columnas' + index] + ',';
      }
      if (this.selects.length > 1 && index == this.selects.length - 1) {
        this.resultado += select.value['Columnas' + index] + '\n';
      }
    });
    this.resultado = this.resultado + 'From ';
    this.selects.forEach((select, index) => {
      if (this.selects.length == 1) {
        this.resultado += select.value['Tabla' + index] + '\n';
      }
      if (this.selects.length >= 1 && index < this.selects.length - 1) {
        this.resultado += select.value['Tabla' + index] + ',';
      }
      if (this.selects.length > 1 && index == this.selects.length - 1) {
        this.resultado += select.value['Tabla' + index] + '\n';
      }
    });

    if(this.showJoin && !this.JoinForm.invalid){
      this.joins.forEach((join, index) => {
        this.resultado += join.value['TipoJoin' + index]+' ';
        this.resultado += this.tablasSelect[join.value['Tabla' + index+'1']].tabla+'.';
        this.resultado += join.value['Columna' + index+'1']+' ON ';
        this.resultado += this.tablasSelect[join.value['Tabla' + index+'2']].tabla+'.';
        this.resultado += join.value['Columna' + index+'2'] + '\n';
      });
    }

    this.resultado += this.showWhere?(this.whereValue != '' ? 'Where ' + this.whereValue : ''):'';
  }

  selectJoinTable(index:number,tabla1:boolean,event:any){
    this.onChangeJoin(index);
    if(tabla1){
      this.joinTablas[index].tabla1 = event.target.value;
    }
    else{
      this.joinTablas[index].tabla2 = event.target.value;
    }
  }
}
