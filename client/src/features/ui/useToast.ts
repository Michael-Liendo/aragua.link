import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

type ToasterToast = ToastProps & {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: ToastActionElement;
};

type ToastVariant = "default" | "success" | "error" | "info" | "warning";

const actionTypes = {
	ADD_TOAST: "ADD_TOAST",
	UPDATE_TOAST: "UPDATE_TOAST",
	DISMISS_TOAST: "DISMISS_TOAST",
	REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;
type Action =
	| { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
	| { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast> }
	| { type: ActionType["DISMISS_TOAST"]; toastId?: string }
	| { type: ActionType["REMOVE_TOAST"]; toastId?: string };

interface State {
	toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

let count = 0;
function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

function addToRemoveQueue(toastId: string) {
	if (toastTimeouts.has(toastId)) return;

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({ type: "REMOVE_TOAST", toastId });
	}, TOAST_REMOVE_DELAY);

	toastTimeouts.set(toastId, timeout);
}

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "ADD_TOAST":
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};
		case "UPDATE_TOAST":
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === action.toast.id ? { ...t, ...action.toast } : t,
				),
			};
		case "DISMISS_TOAST": {
			const { toastId } = action;
			if (toastId) {
				addToRemoveQueue(toastId);
			} else {
				for (const toast of state.toasts) {
					addToRemoveQueue(toast.id);
				}
			}
			return {
				...state,
				toasts: state.toasts.map((t) =>
					!toastId || t.id === toastId ? { ...t, open: false } : t,
				),
			};
		}
		case "REMOVE_TOAST":
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId),
			};
		default:
			return state;
	}
};

// --- Subscribers ---
const listeners = new Set<(state: State) => void>();
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
	memoryState = reducer(memoryState, action);

	for (const listener of listeners) {
		listener(memoryState);
	}
}

function subscribe(listener: (state: State) => void): () => void {
	listeners.add(listener);
	listener(memoryState);
	return () => {
		listeners.delete(listener);
	};
}

// --- API ---
type ToastParams = Omit<ToasterToast, "id"> & { variant?: ToastVariant };

type ToastFunction = {
	(
		props: ToastParams,
	): {
		id: string;
		dismiss: () => void;
		update: (props: Partial<ToasterToast>) => void;
	};
	success: (
		description: React.ReactNode,
		title?: React.ReactNode,
	) => ReturnType<ToastFunction>;
	error: (
		description: React.ReactNode,
		title?: React.ReactNode,
	) => ReturnType<ToastFunction>;
};

const toast = (() => {
	const baseToast = (props: ToastParams) => {
		const id = genId();
		const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
		const update = (updatedProps: Partial<ToasterToast>) =>
			dispatch({ type: "UPDATE_TOAST", toast: { ...updatedProps, id } });

		dispatch({
			type: "ADD_TOAST",
			toast: {
				...props,
				id,
				open: true,
				onOpenChange: (open) => {
					if (!open) dismiss();
				},
			},
		});

		return { id, dismiss, update };
	};

	baseToast.success = (description: React.ReactNode, title?: React.ReactNode) =>
		baseToast({ variant: "success", title: title as string, description });

	baseToast.error = (description: React.ReactNode, title?: React.ReactNode) =>
		baseToast({ variant: "error", title: title as string, description });

	return baseToast;
})() as ToastFunction;

// --- Hook ---
function useToast() {
	const [state, setState] = React.useState<State>(memoryState);

	React.useEffect(() => {
		const unsubscribe = subscribe(setState);
		return unsubscribe;
	}, []);

	return {
		...state,
		toast,
		dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
	};
}

export { useToast, toast };
