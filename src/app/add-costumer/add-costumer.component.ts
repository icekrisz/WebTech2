import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoadService } from '../load.service';
import { Costumer } from '../models/costumer';

@Component({
  selector: 'app-add-costumer',
  templateUrl: './add-costumer.component.html',
  styleUrls: ['./add-costumer.component.css'],
})
export class AddCostumerComponent implements OnInit {
  closeResult = '';
  costumers!: Costumer[];
  prefix!: number;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loadservice: LoadService
  ) {}

  newCostumer = this.fb.group({
    name: ['', Validators.required],
    zip: [, [Validators.required, Validators.min(1000), Validators.max(9985)]],
    city: [, Validators.required],
    address1: ['', Validators.required],
    address2: [, [Validators.required]],
    telephonePrefix: [, Validators.required],
    telephone: [
      ,
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(7),
        Validators.maxLength(7),
      ],
    ],
  });

  async addCostumer() {
    const costumer = this.newCostumer.value;
    costumer.id = this.costumers[this.costumers.length - 1].id + 1;
    await this.loadservice.addCostumer(costumer);

    this.newCostumer.reset();
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.addCostumer();
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async ngOnInit() {
    this.costumers = await this.loadservice.loadCostumers();
  }
}
