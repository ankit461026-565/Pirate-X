import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-cursed-500/20 border border-cursed-500/40 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-cursed-500" />
          </div>
        </div>
        <p className="text-parchment-300 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn-danger w-full"
            aria-label={confirmLabel}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onClose}
            className="btn-outline text-sm w-full"
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
