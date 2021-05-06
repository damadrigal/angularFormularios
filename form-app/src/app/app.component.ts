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
    'Seleccionar ',
    'Join',
    'Left join',
    'Inner Join',
    'Right Join',
  ];
  public sentencia: string = this.sentencias[0];
  public joinSeleccionado: string = this.tiposJoin[0];
  public secciones: number = 0;

  public selects: FormGroup[] = []; // lista de partes de los selects
  public selectForm: FormGroup = new FormGroup({}); //nombre asignado al formulario de select
  public selectIndice = 0; //permite contar las s1tructuras agregadas dinamicamente
  public resultado = ''; // resultado de los selects
  public showJoin = false;
  public showWhere = false;


  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.selectForm = new FormGroup({
      ['Columnas' + this.selectIndice]: new FormControl('', [
        Validators.required,
      ]),
      ['Tabla' + this.selectIndice]: new FormControl('', [Validators.required]),
    });
    this.selects.push(this.selectForm);
  }

  setSeccion(sen: number) {
    this.secciones = sen;
  }

  setJoin(i: number) {
    this.joinSeleccionado = this.tiposJoin[i];
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

  deleteElementSelect(index: number) {
    this.selects.splice(index, 1);
    this.selectIndice--;
  }

  onClick(index: number) {
    if (this.selects[index].value['Columnas' + index] != this.selectForm.value['Columnas' + index] ||
      this.selects[index].value['Tabla' + index] != this.selectForm.value['Tabla' + index]) {
      if (this.selects[index].value['Columnas' + index] != '' ||
        this.selects[index].value['Tabla' + index] != '') 
      {
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

  onChange(index: number) {
    if (this.selects[index].value['Columnas' + index] != '' ||
      this.selects[index].value['Tabla' + index] != '')
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

  onSubmit() {
    if (this.secciones == 1) {
      this.resultado = 'Select ';
      this.selects.forEach((select, index) => {
        if (this.selects.length == 1) {
          this.resultado =
            this.resultado + select.value['Columnas' + index] + '\n';
        }
        if (this.selects.length >= 1 && index < this.selects.length - 1) {
          this.resultado =
            this.resultado + select.value['Columnas' + index] + ',';
        }
        if (this.selects.length > 1 && index == this.selects.length - 1) {
          this.resultado =
            this.resultado + select.value['Columnas' + index] + '\n';
        }
      });
      this.resultado = this.resultado + 'From ';
      this.selects.forEach((select, index) => {
        if (this.selects.length == 1) {
          this.resultado = this.resultado + select.value['Tabla' + index] + ';';
        }
        if (this.selects.length >= 1 && index < this.selects.length - 1) {
          this.resultado = this.resultado + select.value['Tabla' + index] + ',';
        }
        if (this.selects.length > 1 && index == this.selects.length - 1) {
          this.resultado = this.resultado + select.value['Tabla' + index] + ';';
        }
      });
    } else if (this.secciones == 2) {
    }
  }

  showJoinContainer() {
    this.showJoin = !this.showJoin;
  }
}
