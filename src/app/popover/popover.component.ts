import { DbService } from 'src/app/shared/services/db.service';
import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() options: any[];

  selectedOptions: string[] = [];

  constructor(private popoverCtrl: PopoverController,
    private dbService: DbService) {

    // console.log('Type',this.options);
  }


  ngOnInit() {
    // console.log('Type', this.options)
  }
  onCheckboxChange(item: string, event: CustomEvent) {
    if (event.detail.checked) {
      this.selectedOptions.push(item);
    } else {
      const index = this.selectedOptions.indexOf(item);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    }
  }


  applyFilter() {
    this.popoverCtrl.dismiss(this.selectedOptions);
  }

}
