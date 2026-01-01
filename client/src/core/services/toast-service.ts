import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  /**
   *
   */
  constructor() {

  }
  private testContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end';
      // container.style.position = 'fixed';
      // container.style.top = '20px';
      // container.style.right = '20px';
      // container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
  }
  private createToastElement(message: string, alertClass: string, duration = 5000) {
    this.testContainer();
    const testContainer = document.getElementById('toast-container'); // as HTMLElement;
    if (!testContainer) return;
    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg');
    toast.innerHTML = `
    <span>${message}</span>
    <button class=" ml-4 btn btn-sm btn-ghost">x</button>
    `;

    toast.querySelector('button')?.addEventListener('click', () => {
      testContainer.removeChild(toast);
    });

    testContainer.appendChild(toast);

    // auto remove after duration with a fade
    setTimeout(() => {
      if (testContainer.contains(toast)) {
        testContainer.removeChild(toast);
      }
    }, duration);
  }

  success(message: string, duration = 5000) {
    this.createToastElement(message, 'alert-success', duration);
  }
  error(message: string, duration = 5000) {
    this.createToastElement(message, 'alert-error', duration);
  }
  warning(message: string, duration = 5000) {
    this.createToastElement(message, 'alert-warning', duration);
  }
  info(message: string, duration = 5000) {
    this.createToastElement(message, 'alert-info', duration);
  }
}
