import { HomeIcon, Link2, MenuIcon, Palette, XIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { PrivateRoutesEnum } from "@/data/routesEnums";
import { useIsMobile } from "@/features/ui";
import { NavUser } from "./nav-user";

type NavItem = {
	title: string;
	url: PrivateRoutesEnum;
	icon: React.ForwardRefExoticComponent<
		Omit<React.SVGProps<SVGSVGElement>, "ref"> &
			React.RefAttributes<SVGSVGElement>
	>;
};

const navMain: { title?: string; items: NavItem[] }[] = [
	{
		items: [
			{
				title: "Inicio",
				url: PrivateRoutesEnum.Home,
				icon: HomeIcon,
			},
			{
				title: "Mis Enlaces",
				url: PrivateRoutesEnum.Links,
				icon: Link2,
			},
			{
				title: "Página Bio",
				url: PrivateRoutesEnum.BioPage,
				icon: Palette,
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { pathname } = useLocation();

	const isMobile = useIsMobile();
	const { toggleSidebar, open: isOpen } = useSidebar();

	return (
		<>
			{isMobile && (
				<button
					type="button"
					onClick={toggleSidebar}
					className="fixed z-50 bottom-4 left-4 bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-all"
				>
					{isOpen ? (
						<MenuIcon className="w-5 h-5" />
					) : (
						<XIcon className="w-5 h-5" />
					)}
				</button>
			)}

			<Sidebar collapsible="icon" {...props}>
				<SidebarHeader>
					<div className="flex items-center gap-2 p-4">
						<img
							src="/logo.png"
							alt="AraguaLink Logo"
							className="h-8 w-8 object-contain"
						/>
						<h2 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
							AraguaLink
						</h2>
					</div>
				</SidebarHeader>
				<SidebarContent>
					{navMain.map((item, idx) => (
						<SidebarGroup key={item.title ?? idx}>
							{item.title && (
								<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
							)}
							<SidebarGroupContent>
								<SidebarMenu>
									{item.items.map((i) => (
										<SidebarMenuItem
											key={i.title}
											className={i.url === pathname ? "bg-sidebar-accent" : ""}
										>
											<SidebarMenuButton asChild>
												<Link to={i.url}>
													{i.icon && <i.icon />}
													<span>{i.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarContent>
				<SidebarFooter>
					<NavUser />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
		</>
	);
}
