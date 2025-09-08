import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './warning-popup.component.html',
  styleUrls: ['./warning-popup.component.scss'],

})
export class WarningPopupComponent {
  @Input() message: string = 'Êtes-vous sûr de vouloir continuer ?';
  @Output() confirm = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) {}

  onConfirm() {
    this.confirm.emit();
    this.activeModal.close('Confirm click');
  }
  autoResizeTextArea(textArea: HTMLTextAreaElement) {
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  ngAfterViewInit() {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      this.autoResizeTextArea(textarea as HTMLTextAreaElement);
    }
  }

  onClose() {
    this.activeModal.dismiss('Close click');
  }
}