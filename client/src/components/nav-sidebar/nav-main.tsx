import type { LucideProps } from "lucide-react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { PrivateRoutesEnum } from "@/data/routesEnums";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		items: {
			title: string;
			url: PrivateRoutesEnum;
			icon: React.ForwardRefExoticComponent<
				Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
			>;
		}[];
	}[];
}) {
	const { pathname } = useLocation();

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarGroup key={item.title}>
							<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{item.items.map((item) => (
										<SidebarMenuItem
											key={item.title}
											className={
												item.url === pathname ? "bg-sidebar-accent" : ""
											}
										>
											<SidebarMenuButton asChild>
												<Link to={item.url}>
													{item.icon && <item.icon />}
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
