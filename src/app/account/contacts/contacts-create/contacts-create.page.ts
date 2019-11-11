import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';
import { ContactsService } from '../../../services/contacts.service';
import { QrScannerService } from '../../../services/ui/qr-scanner.service';

import { QrCodeModalComponent } from '../../../modals/qr-code-modal/qr-code-modal.component';

@Component({
  selector: 'app-contacts-create',
  templateUrl: './contacts-create.page.html',
  styleUrls: ['./contacts-create.page.scss'],
})
export class ContactsCreatePage implements OnInit {

  contact = {
		label: '',
		address: '',
		publicKey: '',
		walletId: ''
	};

  form: FormGroup;

  subjects: any = {};

  errors: any = {
    address: false
  };

  constructor(
    private ref: ChangeDetectorRef,
    private clipboard: Clipboard,
    private qrScannerService: QrScannerService,
    private doorgetsTranslateService: DoorgetsTranslateService,
    private contactsService: ContactsService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
      label: new FormControl('', Validators.required),
      address: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^0x[a-fA-F0-9]{40}$')
      ])),
      publicKey: new FormControl(''),
      walletId: new FormControl('')
    });

    this.subjects.scan = this.qrScannerService.onScan.subscribe((result) => {
        if (!result.contact) {
          return;
        }

        let _contact = {
          label: result.contact.label || '',
          publicKey: result.contact.publicKey || '',
          walletId: result.contact.walletId || '',
          address: result.contact.address || '',
        };

        this.contact = _contact;
        this.form.patchValue(_contact);

    });
  }

  createContact() {
    this.errors.address = false;

    let data = this.form.value;

  	if (this.form.valid && /^0x[a-fA-F0-9]{40}$/.test(data.address)) {
	  	this.contactsService.add(data);

      setTimeout(() => {
        this.dismiss();
        this.contactsService.onSelected.emit(data);
      }, 1000);
  	} else {
      this.errors.address = false;
    }
  }

  paste() {
    this.clipboard.paste().then(
      (resolve: string) => {
        let contact;
        try {
          contact  = JSON.parse(resolve);
        } catch(e) {}

        if (!contact) {
          return;
        }

        let _contact = {
          label: contact.label || '',
          publicKey: contact.publicKey || '',
          walletId: contact.walletId || '',
          address: contact.address || '',
        };

        this.contact = _contact;
        this.form.patchValue(_contact);
      },
       (reject: string) => { console.error('Error: ' + reject); }
     )
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async openScanModal() {
    const modal = await this.modalController.create({
      component: QrCodeModalComponent
    });

    return await modal.present();
  }

  // openScanModal() {

    // this.qrScanner.prepare()
    //   .then((status: QRScannerStatus) => {
    //      if (status.authorized) {
    //        // camera permission was granted

    //        // start scanning
    //        this.scanSub = this.qrScanner.scan().subscribe((contact: any) => {

    //          let _contact = JSON.parse(contact);

    //          if (_contact) {
    //            this.contact = Object.assign({}, this.contact, _contact);

    //            this.form.patchValue(this.contact);

    //          }

    //          // this.qrScanner.hide(); // hide camera preview
    //          // scanSub.unsubscribe(); // stop scanning
    //          // this.hideCamera();

    //          // this.ref.detectChanges();
    //        });

    //        this.qrScanner.show();

    //      } else if (status.denied) {
    //        // camera permission was permanently denied
    //        // you must use QRScanner.openSettings() method to guide the user to the settings page
    //        // then they can grant the permission from there
    //         this.qrScanner.hide().then((s: any) => {
    //         }); // hide camera preview
    //      } else {
    //         this.qrScanner.hide().then((s: any) => {
    //         }); // hide camera preview
    //        // permission was denied, but not permanently. You can ask for permission again at a later time.
    //      }
    //   })
  // }

  // closeCam() {
  //    this.qrScanner.hide(); // hide camera preview
  //    this.qrScanner.destroy().then((e: any) => {
  //    });
  // }

  // showCamera() {
  //   (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  // }

  // hideCamera() {
  //   (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  // }

  // ionViewWillEnter(){
  //    this.showCamera();
  //    this.openScanModal();
  // }

  // ionViewWillLeave(){
  //   this.qrScanner.hide(); // hide camera preview
  //   this.scanSub.unsubscribe(); // stop scanning
  //   this.hideCamera();
  // }

}
