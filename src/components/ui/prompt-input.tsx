"use client"

import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

type PromptInputContextType = {
  isLoading: boolean
  value: string
  setValue: (value: string) => void
  maxHeight: number | string
  onSubmit?: () => void
  disabled?: boolean
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
}

const PromptInputContext = createContext<PromptInputContextType>({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
  textareaRef: React.createRef<HTMLTextAreaElement>(),
})

function usePromptInput() {
  return useContext(PromptInputContext)
}

export type PromptInputProps = {
  isLoading?: boolean
  value?: string
  onValueChange?: (value: string) => void
  maxHeight?: number | string
  onSubmit?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
} & React.ComponentProps<"div">

function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
  disabled = false,
  onClick,
  ...props
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState(value || "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!disabled) textareaRef.current?.focus()
    onClick?.(e)
  }

  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          disabled,
          textareaRef,
        }}
      >
        <div
          onClick={handleClick}
          className={cn(
            "border-input bg-background cursor-text rounded-[1.75rem] border px-3 py-2.5 shadow-xs",
            disabled && "cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  )
}

export type PromptInputTextareaProps = {
  disableAutosize?: boolean
} & React.ComponentProps<typeof Textarea>

/** One-line floor from metrics — empty textareas often report scrollHeight below real line box, which causes overflow + scrollbar. */
function minTextareaHeightPx(el: HTMLTextAreaElement): number {
  const cs = getComputedStyle(el)
  const lineHeight = parseFloat(cs.lineHeight)
  const lh = Number.isFinite(lineHeight) ? lineHeight : 22
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
  return Math.max(Math.ceil(lh + padY), 28)
}

function applyTextareaAutosize(
  el: HTMLTextAreaElement,
  maxHeight: number | string,
  disableAutosize: boolean,
) {
  if (disableAutosize) return

  el.style.height = "auto"
  const minH = minTextareaHeightPx(el)

  if (typeof maxHeight === "number") {
    const contentH = el.scrollHeight
    const next = Math.min(Math.max(contentH, minH), maxHeight)
    el.style.height = `${next}px`
    el.style.overflowY = contentH > maxHeight ? "auto" : "hidden"
  } else {
    const contentH = Math.max(el.scrollHeight, minH)
    el.style.height = `min(${contentH}px, ${maxHeight})`
    el.style.overflowY = "auto"
  }
}

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}: PromptInputTextareaProps) {
  const { value, setValue, maxHeight, onSubmit, disabled, textareaRef } =
    usePromptInput()

  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (!el) return
    applyTextareaAutosize(el, maxHeight, disableAutosize)
  }

  const handleRef = (el: HTMLTextAreaElement | null) => {
    textareaRef.current = el
    adjustHeight(el)
  }

  useLayoutEffect(() => {
    if (!textareaRef.current || disableAutosize) return
    applyTextareaAutosize(textareaRef.current, maxHeight, disableAutosize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, maxHeight, disableAutosize])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight(e.target)
    setValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit?.()
    }
    onKeyDown?.(e)
  }

  return (
    <Textarea
      ref={handleRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={cn(
        /* Base `Textarea` uses `field-sizing-content`, which fights JS autosize and can leave a bogus vertical scrollbar. */
        "field-sizing-fixed block text-primary w-full min-h-[1lh] resize-none border-none bg-transparent py-0.5 text-[15px] leading-snug text-stone-800 shadow-none outline-none placeholder:text-stone-400 focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      rows={1}
      disabled={disabled}
      {...props}
    />
  )
}

export type PromptInputActionsProps = React.HTMLAttributes<HTMLDivElement>

function PromptInputActions({
  children,
  className,
  ...props
}: PromptInputActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  )
}

export type PromptInputActionProps = {
  className?: string
  tooltip: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
} & React.ComponentProps<typeof Tooltip>

function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: PromptInputActionProps) {
  const { disabled } = usePromptInput()

  return (
    <Tooltip {...props}>
      <TooltipTrigger
        disabled={disabled}
        render={(triggerProps) => {
          if (!React.isValidElement(children)) {
            return (
              <button
                type="button"
                {...triggerProps}
                onClick={(e) => {
                  e.stopPropagation()
                  triggerProps.onClick?.(e)
                }}
              >
                {children}
              </button>
            )
          }
          const child = children as React.ReactElement<{
            onClick?: (e: React.MouseEvent) => void
          }>
          return React.cloneElement(child, {
            ...triggerProps,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation()
              triggerProps.onClick?.(e)
              child.props.onClick?.(e)
            },
          })
        }}
      />
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
}
