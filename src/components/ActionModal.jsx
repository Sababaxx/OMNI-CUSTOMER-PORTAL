import React, { useEffect } from "react";

export default function ActionModal({
  title,
  children,
  onClose,
  onAction,
  actionLabel = "Continue",
  actionVariant = "primary",
  size = "default",
  className = "",
  hideFooter = false,
}) {
  useEffect(() => {
    if (!title) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add("omni-modal-open");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("omni-modal-open");
      document.body.style.overflow = previousOverflow;
    };
  }, [title]);

  if (!title) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className={`action-modal action-modal-${size} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close popup">
          ×
        </button>
        <h3 id="action-modal-title">{title}</h3>
        <div className="modal-body">
          {children || (
            <p>
              This action is ready for the next step. Final pricing, inventory, and account rules can be connected when
              the subscription backend is available.
            </p>
          )}
        </div>
        {!hideFooter && (
          <div className="modal-actions">
            <button className="btn btn-outline" type="button" onClick={onClose}>Cancel</button>
            <button className={`btn btn-${actionVariant}`} type="button" onClick={onAction || onClose}>
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
