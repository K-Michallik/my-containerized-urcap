import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApplicationPresenterAPI, ApplicationPresenter, RobotSettings } from '@universal-robots/contribution-api';
import { ContainerApplicationNode } from './Container-Application.node';
import { BackendService } from './backend.service';
import { URCAP_ID, VENDOR_ID } from 'src/generated/contribution-constants';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl: './Container-Application.component.html',
    styleUrls: ['./Container-Application.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerApplicationComponent implements ApplicationPresenter, OnChanges {
    // applicationAPI is optional
    @Input() applicationAPI: ApplicationPresenterAPI;
    // robotSettings is optional
    @Input() robotSettings: RobotSettings;
    // applicationNode is required
    @Input() applicationNode: ContainerApplicationNode;
    private beService: BackendService = inject(BackendService);
    readonly randomNumber$ = this.beService.randomNumber$;
    private backendHttpUrl: string;

    public imageDataUrl: string | null = null;
    public error: string | null = null

    constructor(
        protected readonly translateService: TranslateService,
        protected readonly cd: ChangeDetectorRef,
        private http: HttpClient
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.robotSettings) {
            if (!changes?.robotSettings?.currentValue) {
                return;
            }

            if (changes?.robotSettings?.isFirstChange()) {
                if (changes?.robotSettings?.currentValue) {
                    this.translateService.use(changes?.robotSettings?.currentValue?.language);
                    this.backendHttpUrl = this.applicationAPI.getContainerContributionURL(VENDOR_ID, URCAP_ID, 'my-containerized-urcap-backend', 'rest-api');
                }
                this.translateService.setDefaultLang('en');
            }

            this.translateService
                .use(changes?.robotSettings?.currentValue?.language)
                .pipe(first())
                .subscribe(() => {
                    this.cd.detectChanges();
                });
        }
    }

    getRandomNumber(): void {
        this.beService.fetchRandomNumber(this.backendHttpUrl);
    }

    getTestResponse(): void {
        const url = this.backendHttpUrl;
        const fullUrl = 'http://' + url + '/test';
        this.http.get<{ response: string }>(fullUrl).subscribe(response => {
          console.log(`Response is: ${JSON.stringify(response)}`);
        });
      }

    fetchImage(): void {
        const url = this.backendHttpUrl;
        const fullUrl = 'http://' + url + '/image';
        this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
          next: (blob) => {
            // Create an object URL from the blob
            this.imageDataUrl = URL.createObjectURL(blob);
            console.log('Image loaded!')
            this.cd.detectChanges();
          },
          error: (error) => {
            console.error('Error fetching image:', error);
            this.error = 'Error fetching image';
            this.cd.detectChanges();
          },
        });
      }
      
    onImageLoad(): void {
        if (this.imageDataUrl) {
          URL.revokeObjectURL(this.imageDataUrl);
          console.log('ObjectURL revoked.')
        }
    }


    // call saveNode to save node parameters
    saveNode() {
        this.cd.detectChanges();
        this.applicationAPI.applicationNodeService.updateNode(this.applicationNode);
    }
}
