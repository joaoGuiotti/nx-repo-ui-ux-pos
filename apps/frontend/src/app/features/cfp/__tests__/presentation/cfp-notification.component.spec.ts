import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CfpNotificationComponent } from '../../presentation/presenters/cfp-notification/cfp-notification.component';

describe('CfpNotificationComponent (Presenter)', () => {
  let fixture: ComponentFixture<CfpNotificationComponent>;
  let component: CfpNotificationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfpNotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CfpNotificationComponent);
    component = fixture.componentInstance;
  });

  it('deve renderizar notificação de sucesso com mensagem e classes Tailwind correspondentes', () => {
    fixture.componentRef.setInput('type', 'success');
    fixture.componentRef.setInput('title', 'Sucesso!');
    fixture.componentRef.setInput('message', 'Operação realizada com sucesso.');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const alertBox = compiled.querySelector('[role="alert"]') as HTMLElement;

    expect(alertBox).toBeTruthy();
    expect(alertBox.classList.contains('bg-feedback-success-bg')).toBe(true);
    expect(compiled.textContent).toContain('Sucesso!');
    expect(compiled.textContent).toContain('Operação realizada com sucesso.');
  });

  it('deve renderizar notificação de erro com classes Tailwind de feedback-error', () => {
    fixture.componentRef.setInput('type', 'error');
    fixture.componentRef.setInput('title', 'Erro!');
    fixture.componentRef.setInput('message', 'Falha ao processar requisição.');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const alertBox = compiled.querySelector('[role="alert"]') as HTMLElement;

    expect(alertBox.classList.contains('bg-feedback-error-bg')).toBe(true);
    expect(compiled.textContent).toContain('Erro!');
  });

  it('deve emitir o evento dismissed ao clicar no botão fechar', () => {
    fixture.componentRef.setInput('type', 'info');
    fixture.componentRef.setInput('message', 'Mensagem informativa.');
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    let dismissedEmitted = false;
    component.dismissed.subscribe(() => {
      dismissedEmitted = true;
    });

    const closeBtn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(closeBtn).toBeTruthy();
    closeBtn.click();

    expect(dismissedEmitted).toBe(true);
  });
});
