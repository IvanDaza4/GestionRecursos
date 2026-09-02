"use client";

import { X } from "lucide-react";

interface ModalProps {
  eyebrow?: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ eyebrow, title, onClose, children, footer }: ModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal movement-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2>{title}</h2>
          </div>
          <button className="icon-button" aria-label="Cerrar" onClick={onClose}>
            <X size={19} />
          </button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
