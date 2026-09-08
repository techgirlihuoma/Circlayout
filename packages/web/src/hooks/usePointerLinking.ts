import { useAppStore } from "../state/store";
import { pushHistory } from "../state/history";
import { NetClass } from "@perfboard/core";

/**
 * Tap-to-connect: tap pin A, tap pin B -> link created. Same handler serves
 * mouse and touch since it's driven by pointer events, not drag gestures --
 * this is what keeps the desktop-first build mobile-ready without a
 * separate interaction path later.
 */
export function usePointerLinking() {
  const pendingLinkPin = useAppStore((s) => s.pendingLinkPin);
  const beginOrCompleteLink = useAppStore((s) => s.beginOrCompleteLink);

  const onPinTap = (componentId: string, pinId: string, netClass: NetClass) => {
    const wasCompleting = pendingLinkPin !== null;
    beginOrCompleteLink(componentId, pinId, netClass);
    if (wasCompleting) pushHistory();
  };

  const isPending = (componentId: string, pinId: string) =>
    pendingLinkPin?.componentId === componentId && pendingLinkPin?.pinId === pinId;

  return { onPinTap, isPending, hasPendingLink: pendingLinkPin !== null };
}
