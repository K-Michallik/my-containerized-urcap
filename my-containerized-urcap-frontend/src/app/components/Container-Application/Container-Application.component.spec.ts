import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ContainerApplicationComponent} from "./Container-Application.component";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {Observable, of} from "rxjs";

describe('ContainerApplicationComponent', () => {
  let fixture: ComponentFixture<ContainerApplicationComponent>;
  let component: ContainerApplicationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContainerApplicationComponent],
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader, useValue: {
            getTranslation(): Observable<Record<string, string>> {
              return of({});
            }
          }
        }
      })],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerApplicationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
