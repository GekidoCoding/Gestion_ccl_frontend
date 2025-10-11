import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './yes-no-warning.component.html',
  styleUrls: ['./yes-no-warning.component.scss'],
})
export class YesNoWarningComponent implements AfterViewInit {
  @Input() message: string = `Êtes-vous sûr de vouloir continuer ?\nCette action est irréversible.\nVeuillez confirmer.`;
  @Output() confirm = new EventEmitter<void>();
  @Output() decline = new EventEmitter<void>();

  @ViewChild('textAreaRef') textArea!: ElementRef<HTMLTextAreaElement>;

  constructor(public activeModal: NgbActiveModal) {}

  ngAfterViewInit() {
    if (this.textArea) {
      this.autoResizeTextArea(this.textArea.nativeElement);
    }
  }

  onConfirm() {
    this.confirm.emit();
    this.activeModal.close('Confirm click');
  }

  onClose() {
    this.decline.emit();
    this.activeModal.dismiss('Close click');
  }

  autoResizeTextArea(textArea: HTMLTextAreaElement) {
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}
