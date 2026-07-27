import { X } from "lucide-react";
import { useEffect, useId, type ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * 通用弹窗组件
 * 提供统一的弹窗外观和交互，包括遮罩层、标题栏和关闭按钮
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  bodyClassName,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-panel ${className || ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-heading">
            <h3 id={titleId}>{title}</h3>
            {description && <p id={descriptionId}>{description}</p>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="关闭">
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <div className={`modal-body ${bodyClassName || ""}`}>{children}</div>
      </div>
    </div>
  );
}
