export type PopupType = 'success' | 'error' | 'warning' | 'info';

export interface PopupOptions {
  title: string;
  message: string;
  type?: PopupType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ToastOptions {
  id?: string;
  message: string;
  type?: PopupType;
  duration?: number;
}

export const SHOW_POPUP_EVENT = 'fztools_show_popup';
export const SHOW_TOAST_EVENT = 'fztools_show_toast';

export function brutalistAlert(titleOrOptions: string | PopupOptions, message?: string, type: PopupType = 'info'): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(true);

  return new Promise((resolve) => {
    let options: PopupOptions;
    if (typeof titleOrOptions === 'string') {
      options = {
        title: titleOrOptions,
        message: message || '',
        type,
        confirmText: 'MENGERTI',
        onConfirm: () => resolve(true),
      };
    } else {
      const origConfirm = titleOrOptions.onConfirm;
      const origCancel = titleOrOptions.onCancel;
      options = {
        ...titleOrOptions,
        onConfirm: () => {
          if (origConfirm) origConfirm();
          resolve(true);
        },
        onCancel: () => {
          if (origCancel) origCancel();
          resolve(false);
        },
      };
    }

    window.dispatchEvent(new CustomEvent(SHOW_POPUP_EVENT, { detail: options }));
  });
}

export function brutalistConfirm(title: string, message: string, type: PopupType = 'warning'): Promise<boolean> {
  return brutalistAlert({
    title,
    message,
    type,
    confirmText: 'YA, LANJUTKAN',
    cancelText: 'BATAL',
  });
}

export function brutalistToast(message: string, type: PopupType = 'info', duration: number = 3200): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(SHOW_TOAST_EVENT, {
      detail: {
        id: Math.random().toString(36).substring(2, 9),
        message,
        type,
        duration,
      },
    })
  );
}
