import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  headerTitle: string = 'Car-Form';

  constructor(private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.headerTitle$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((title) => {
      this.headerTitle = title;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }


}
