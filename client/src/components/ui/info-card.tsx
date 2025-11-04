import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { cn } from "@/utils/cn";

interface InfoCardProps {
	title: string;
	children: React.ReactNode;
	headerColor?: "primary" | "orange" | "blue" | "green" | "purple";
	onEdit?: () => void;
	className?: string;
	badge?: React.ReactNode;
}

const headerColorClasses = {
	primary: {
		header: "bg-gradient-to-r from-primary/5 to-primary/10",
		title: "text-primary",
		button: "hover:bg-primary/10",
	},
	orange: {
		header: "bg-gradient-to-r from-orange-50 to-orange-100",
		title: "text-orange-700",
		button: "hover:bg-orange-100",
	},
	blue: {
		header: "bg-gradient-to-r from-blue-50 to-blue-100",
		title: "text-blue-700",
		button: "hover:bg-blue-100",
	},
	green: {
		header: "bg-gradient-to-r from-green-50 to-green-100",
		title: "text-green-700",
		button: "hover:bg-green-100",
	},
	purple: {
		header: "bg-gradient-to-r from-purple-50 to-purple-100",
		title: "text-purple-700",
		button: "hover:bg-purple-100",
	},
};

export function InfoCard({
	title,
	children,
	headerColor = "primary",
	onEdit,
	className,
	badge,
}: InfoCardProps) {
	const colorClasses = headerColorClasses[headerColor];

	return (
		<Card
			className={cn(
				"shadow-sm hover:shadow-md transition-shadow pt-0",
				className,
			)}
		>
			<CardHeader
				className={cn("pb-4 pt-4", colorClasses.header, "rounded-t-xl")}
			>
				<div className="flex items-center justify-between">
					<CardTitle
						className={cn("text-lg font-semibold", colorClasses.title)}
					>
						{title}
					</CardTitle>
					<div className="flex items-center gap-2">
						{badge}
						{onEdit && (
							<Button
								variant="ghost"
								size="sm"
								className={colorClasses.button}
								onClick={onEdit}
							>
								<Edit className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

// Componente para elementos de información con formato consistente
interface InfoItemProps {
	label: string;
	value: string | React.ReactNode;
	valueColor?: string;
	isLast?: boolean;
}

export function InfoItem({
	label,
	value,
	valueColor,
	isLast = false,
}: InfoItemProps) {
	return (
		<div
			className={cn(
				"flex justify-between items-center py-2",
				!isLast && "border-b border-border/50",
			)}
		>
			<p className="text-sm font-medium text-muted-foreground">{label}</p>
			<p className={cn("text-sm font-semibold", valueColor)}>{value}</p>
		</div>
	);
}
