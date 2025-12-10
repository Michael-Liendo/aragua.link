import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./nav-sidebar/app-sidebar";
import { WhatsAppButton } from "./WhatsAppButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 60)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
							{children}
						</div>
					</div>
				</div>
			</SidebarInset>
			<WhatsAppButton />
		</SidebarProvider>
	);
}
