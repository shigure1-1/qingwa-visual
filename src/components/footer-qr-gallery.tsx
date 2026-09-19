"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FooterQrCode = {
  label: string;
  src: string;
};

type FooterQrGalleryProps = {
  codes: FooterQrCode[];
};

export function FooterQrGallery({ codes }: FooterQrGalleryProps) {
  const [activeCode, setActiveCode] = useState<FooterQrCode | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      setActiveCode(null);
    };

    const handleClose = () => {
      lastTriggerRef.current?.focus();
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeCode && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!activeCode && dialog.open) {
      dialog.close();
    }
  }, [activeCode]);

  return (
    <>
      <div className="footer-qr-grid">
        {codes.map((code) => (
          <div className="footer-qr-item" key={code.src}>
            <button
              className="footer-qr-trigger"
              type="button"
              aria-label={`放大查看${code.label}二维码`}
              onClick={(event) => {
                lastTriggerRef.current = event.currentTarget;
                setActiveCode(code);
              }}
            >
              <span className="footer-qr-image">
                <Image src={code.src} alt={`${code.label}二维码`} fill sizes="(max-width: 580px) 15vw, 92px" />
              </span>
            </button>
            <span>{code.label}</span>
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="footer-qr-lightbox"
        aria-labelledby="footer-qr-lightbox-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveCode(null);
        }}
      >
        {activeCode && (
          <div className="footer-qr-lightbox-dialog">
            <div className="footer-qr-lightbox-heading">
              <div>
                <p id="footer-qr-lightbox-title">{activeCode.label}</p>
                <span>SCAN / CONNECT</span>
              </div>
              <button
                ref={closeButtonRef}
                className="footer-qr-lightbox-close"
                type="button"
                aria-label="关闭二维码放大预览"
                onClick={() => setActiveCode(null)}
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="footer-qr-lightbox-image">
              <Image src={activeCode.src} alt={`${activeCode.label}二维码大图`} fill sizes="min(70vw, 28rem)" priority />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
