import { IconDotsVertical, IconEdit } from "@tabler/icons-react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { AuthRoutesEnum } from "@/data/routesEnums";
import { useAuth } from "@/features/auth";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const [_editOpen, setEditOpen] = useState(false);
	function openEditModal() {
		setEditOpen(true);
	}
	function handleLogout() {
		logout();

		navigate(AuthRoutesEnum.Login);
	}
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg grayscale">
								<AvatarFallback className="rounded-lg">
									{user?.first_name?.charAt?.(0)}
									{user?.last_name?.charAt?.(0)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{user?.first_name} {user?.last_name}
								</span>
								<span className="text-muted-foreground truncate text-xs">
									{user?.email}
								</span>
							</div>
							<IconDotsVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarFallback className="rounded-lg">
										{user?.first_name.charAt(0)}
										{user?.last_name.charAt(0)}
									</AvatarFallback>{" "}
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user?.first_name}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										{user?.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuItem onClick={openEditModal}>
							<IconEdit className="size-4 mr-1" />
							Editar cuenta
						</DropdownMenuItem>

						<DropdownMenuItem onClick={() => handleLogout()}>
							<LogOut className="size-4 mr-1" />
							Cerrar sesión
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
