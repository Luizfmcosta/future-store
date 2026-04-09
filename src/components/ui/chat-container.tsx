"use client"

import { cn } from "@/lib/utils"
import { StickToBottom } from "use-stick-to-bottom"

export type ChatContainerRootProps = {
  children: React.ReactNode
  className?: string
  /**
   * StickToBottom initial scroll: `false` starts at the top (read from the start of the thread).
   * `"instant"` / `"smooth"` keep the classic chat behavior (pinned to the latest message).
   */
  stickInitial?: false | "instant" | "smooth"
} & Omit<React.HTMLAttributes<HTMLDivElement>, "initial">

export type ChatContainerContentProps = {
  children: React.ReactNode
  className?: string
  /** Applied to the library’s scroll viewport (not the message column). */
  scrollClassName?: string
} & React.HTMLAttributes<HTMLDivElement>

export type ChatContainerScrollAnchorProps = {
  className?: string
  ref?: React.RefObject<HTMLDivElement>
} & React.HTMLAttributes<HTMLDivElement>

function ChatContainerRoot({
  children,
  className,
  stickInitial = "instant",
  ...props
}: ChatContainerRootProps) {
  return (
    <StickToBottom
      className={cn("flex overflow-y-auto scrollbar-none", className)}
      resize="smooth"
      initial={stickInitial}
      role="log"
      {...props}
    >
      {children}
    </StickToBottom>
  )
}

function ChatContainerContent({
  children,
  className,
  scrollClassName,
  ...props
}: ChatContainerContentProps) {
  return (
    <StickToBottom.Content
      className={cn("flex w-full flex-col", className)}
      scrollClassName={cn(
        "scrollbar-none ![scrollbar-gutter:auto]",
        scrollClassName,
      )}
      {...props}
    >
      {children}
    </StickToBottom.Content>
  )
}

function ChatContainerScrollAnchor({
  className,
  ...props
}: ChatContainerScrollAnchorProps) {
  return (
    <div
      className={cn("h-px w-full shrink-0 scroll-mt-4", className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor }
