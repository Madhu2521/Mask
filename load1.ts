import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common-services/shared.service';
import { AccessManagementService } from '../services/access-management.service';
import { UserRoleService } from 'src/app/user-maintenance/user-role/services/user-role.service';

@Component({
  selector: 'app-profile-data-load',
  templateUrl: './profile-data-load.component.html',
  styleUrls: ['./profile-data-load.component.css']
})
export class ProfileDataLoadComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  public userInfo: any = [];
  displayLoader: boolean;
  showResults: boolean;

  devInserted = 0; devUpdated = 0; devDeleted = 0;
  uatInserted = 0; uatUpdated = 0; uatDeleted = 0;
  adpInserted = 0; adpUpdated = 0; adpDeleted = 0;
  odpInserted = 0; odpUpdated = 0; odpDeleted = 0;

  gridData: any[] = [];

  constructor(
    public sharedService: SharedService,
    private accessManagementService: AccessManagementService,
    public userService: UserRoleService
  ) {}

  ngOnInit(): void {
    this.displayLoader = false;
    this.showResults = false;
    this.userInfo = this.sharedService.getUserInfo();
  }

  sendProfiles() {
    this.displayLoader = true;
    this.accessManagementService.sendProfiles(this.userInfo.UserID).subscribe({
      next: (data: any[]) => {
        this.bindData(data);
        this.displayLoader = false;
        this.showResults = true;
      },
      error: () => {
        this.displayLoader = false;
        this.showResults = true;
      }
    });
  }

  bindData(data: any[]) {
    this.devInserted = this.getRecordCount(data, 'D', 'I');
    this.devUpdated = this.getRecordCount(data, 'D', 'U');
    this.devDeleted = this.getRecordCount(data, 'D', 'D');

    this.uatInserted = this.getRecordCount(data, 'U', 'I');
    this.uatUpdated = this.getRecordCount(data, 'U', 'U');
    this.uatDeleted = this.getRecordCount(data, 'U', 'D');

    this.adpInserted = this.getRecordCount(data, 'A', 'I');
    this.adpUpdated = this.getRecordCount(data, 'A', 'U');
    this.adpDeleted = this.getRecordCount(data, 'A', 'D');

    this.odpInserted = this.getRecordCount(data, 'P', 'I');
    this.odpUpdated = this.getRecordCount(data, 'P', 'U');
    this.odpDeleted = this.getRecordCount(data, 'P', 'D');

    this.gridData = [
      { environment: 'ODP-RCHTERA', deleteStatus: this.odpDeleted, insertStatus: this.odpInserted, updateStatus: this.odpUpdated },
      { environment: 'UAT-WUATERA', deleteStatus: this.uatDeleted, insertStatus: this.uatInserted, updateStatus: this.uatUpdated },
      { environment: 'Dev/SIT-WDVTERA', deleteStatus: this.devDeleted, insertStatus: this.devInserted, updateStatus: this.devUpdated },
      { environment: 'ADP-APRTERA', deleteStatus: this.adpDeleted, insertStatus: this.adpInserted, updateStatus: this.adpUpdated },
    ];
  }

  getRecordCount(data: any[], platformId: string, moveFlag: string): number {
    return data.find(i => i.PlatformId === platformId && i.MoveFlag === moveFlag)?.RecordCount || 0;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
