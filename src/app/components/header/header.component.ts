import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements AfterViewInit {
  @Input() isMobile: boolean;
  @Input() isPlatformBrowser: boolean;

  @Output()
  menuButtonRendered = new EventEmitter<HTMLButtonElement | null>();
  @Output()
  navigateHome = new EventEmitter<void>();
  @Output()
  menuClicked = new EventEmitter<void>();
  @Output()
  resetState = new EventEmitter<void>();

  ngAfterViewInit(): void {
    if (this.isPlatformBrowser) {
      this.menuButtonRendered.emit(document.querySelector('button'));
    }
  }
}
