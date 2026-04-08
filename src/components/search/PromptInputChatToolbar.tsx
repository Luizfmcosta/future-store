"use client";

import {
  PromptInputAction,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { ui } from "@/lib/ui-tokens";
import { useT } from "@/lib/useT";
import { cn } from "@/lib/utils";
import { ArrowUp, Ellipsis, Mic, Plus } from "lucide-react";

/** Botões circulares secundários — leve vidro para combinar com o prompt. */
const circleSecondary =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-stone-200/70 bg-white/60 text-stone-600 shadow-none backdrop-blur-sm transition-colors hover:bg-white/80";

const sendChatClass =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0f0f0f]/88 text-white shadow-sm backdrop-blur-sm transition-[transform,background-color] hover:bg-[#262626]/95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

export type PromptInputChatToolbarProps = {
  fileInputId: string;
  onSend: () => void;
  sendDisabled?: boolean;
  /** Tooltip / aria do botão enviar (default: “Enviar mensagem”). */
  sendLabel?: string;
  disabled?: boolean;
  className?: string;
  onImageSelected?: (file: File) => void;
  /** Microfone (ex.: ditado / entrada por voz — demo pode ficar vazio). */
  onMicClick?: () => void;
  /** Botão ⋯ (menu extra). */
  onMoreClick?: () => void;
};

/**
 * Barra inferior: [+] [microfone] [⋯] à esquerda, enviar à direita. Enter no textarea também envia.
 * Usa [Prompt Input](https://www.prompt-kit.com/docs/prompt-input) (`PromptInputAction` / `PromptInputActions`).
 */
export function PromptInputChatToolbar({
  fileInputId,
  onSend,
  sendDisabled,
  sendLabel,
  disabled,
  className,
  onImageSelected,
  onMicClick,
  onMoreClick,
}: PromptInputChatToolbarProps) {
  const t = useT();
  const sendText = sendLabel ?? t("common.sendMessage");

  return (
    <div className={cn("mt-2 flex w-full min-w-0 items-center justify-between gap-2", className)}>
      <PromptInputActions className="min-w-0 flex-1 flex-wrap justify-start gap-1.5 p-0">
        <PromptInputAction tooltip={t("common.addAttachment")} side="top">
          <label
            htmlFor={fileInputId}
            className={cn(
              circleSecondary,
              "cursor-pointer",
              disabled && "pointer-events-none opacity-50",
              ui.home.focusRing,
              "focus-within:ring-offset-0",
            )}
          >
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={disabled}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImageSelected?.(f);
                e.target.value = "";
              }}
            />
            <Plus className="size-4" strokeWidth={2} aria-hidden />
          </label>
        </PromptInputAction>

        <PromptInputAction tooltip={t("common.voiceInput")} side="top">
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onMicClick?.();
            }}
            className={cn(
              circleSecondary,
              disabled && "pointer-events-none opacity-50",
              ui.home.focusRing,
              "focus-visible:rounded-full",
            )}
            aria-label={t("common.voiceInput")}
          >
            <Mic className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </PromptInputAction>

        <PromptInputAction tooltip={t("common.moreOptions")} side="top">
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick?.();
            }}
            className={cn(circleSecondary, disabled && "opacity-50", ui.home.focusRing, "focus-visible:rounded-full")}
            aria-label={t("common.moreOptions")}
          >
            <Ellipsis className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </PromptInputAction>
      </PromptInputActions>

      <PromptInputAction tooltip={sendText} side="top">
        <button
          type="button"
          disabled={disabled || sendDisabled}
          onClick={(e) => {
            e.stopPropagation();
            onSend();
          }}
          className={cn(sendChatClass, ui.home.focusRing, "focus-visible:rounded-full")}
          aria-label={sendText}
        >
          <ArrowUp className="size-4" strokeWidth={2.25} aria-hidden />
        </button>
      </PromptInputAction>
    </div>
  );
}
