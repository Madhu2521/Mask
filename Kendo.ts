import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { sharedservice } from 'src/app/common-services/shared.service';
import { AccessManagementservice } from '../services/access-management.service';
import { UserRoleservice } from 'src/app/user-maintenance/user-role/services/user-role.service';

@Component({
  selector: 'app-profile-data-load',
  templateUrl: './profile-data-load.component.html',
  styleUrls: ['./profile-data-load.component.css']
})
export class ProfileDataLoadComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  public userInfo: any = [];
  displayloader: boolean;
  showResults: boolean;

  public gridData: any[] = [];

  constructor(
    public sharedservice: sharedservice,
    private accessManagementService: AccessManagementservice,
    public userService: UserRoleservice
  ) {}

  ngOnInit(): void {
    this.displayloader = false;
    this.showResults = false;
    this.userInfo = this.sharedservice.getUserInfo();

    // Initialize gridData with default values
    this.gridData = [
      {
        Environment: 'ODP-RCHTERA',
        DeleteStatus: 0,
        InsertStatus: 0,
        UpdateStatus: 0
      },
      {
        Environment: 'UAT-WUATERA',
        DeleteStatus: 0,
        InsertStatus: 0,
        UpdateStatus: 0
      },
      {
        Environment: 'Dev/SIT-WDVTERA',
        DeleteStatus: 0,
        InsertStatus: 0,
        UpdateStatus: 0
      },
      {
        Environment: 'ADP-APRTERA',
        DeleteStatus: 0,
        InsertStatus: 0,
        UpdateStatus: 0
      }
    ];
  }

  sendProfiles() {
    this.displayloader = true;
    const result4 = this.accessManagementService.sendProfiles(this.userInfo.UserID).subscribe({
      next: (data: any[]) => {
        this.bindData(data);
        this.displayloader = false;
        this.showResults = true;
      },
      error: (errorResponse) => {
        this.displayloader = false;
        this.showResults = true;
      },
      complete: () => {
        this.displayloader = false;
        this.showResults = true;
      }
    });
    this.subs.push(result4);
  }

  bindData(data: any[]) {
    this.gridData = [
      {
        Environment: 'ODP-RCHTERA',
        DeleteStatus: data.filter(i => i.PlatformId == 'P' && i.MoveFlag == 'D')[0]?.RecordCount || 0,
        InsertStatus: data.filter(i => i.PlatformId == 'P' && i.MoveFlag == 'I')[0]?.RecordCount || 0,
        UpdateStatus: data.filter(i => i.PlatformId == 'P' && i.MoveFlag == 'U')[0]?.RecordCount || 0
      },
      {
        Environment: 'UAT-WUATERA',
        DeleteStatus: data.filter(i => i.PlatformId == 'U' && i.MoveFlag == 'D')[0]?.RecordCount || 0,
        InsertStatus: data.filter(i => i.PlatformId == 'U' && i.MoveFlag == 'I')[0]?.RecordCount || 0,
        UpdateStatus: data.filter(i => i.PlatformId == 'U' && i.MoveFlag == 'U')[0]?.RecordCount || 0
      },
      {
        Environment: 'Dev/SIT-WDVTERA',
        DeleteStatus: data.filter(i => i.PlatformId == 'D' && i.MoveFlag == 'D')[0]?.RecordCount || 0,
        InsertStatus: data.filter(i => i.PlatformId == 'D' && i.MoveFlag == 'I')[0]?.RecordCount || 0,
        UpdateStatus: data.filter(i => i.PlatformId == 'D' && i.MoveFlag == 'U')[0]?.RecordCount || 0
      },
      {
        Environment: 'ADP-APRTERA',
        DeleteStatus: data.filter(i => i.PlatformId == 'A' && i.MoveFlag == 'D')[0]?.RecordCount || 0,
        InsertStatus: data.filter(i => i.PlatformId == 'A' && i.MoveFlag == 'I')[0]?.RecordCount || 0,
        UpdateStatus: data.filter(i => i.PlatformId == 'A' && i.MoveFlag == 'U')[0]?.RecordCount || 0
      }
    ];
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
