import {
	getSpecialLinkDisplay,
	type IPublicBioPage,
	SPECIAL_LINK_TEMPLATES,
	type SpecialLinkType,
} from "@aragualink/shared";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import Services from "@/services";

interface BioPageProps {
	bioPageData?: IPublicBioPage;
}

export default function BioPage({ bioPageData }: BioPageProps = {}) {
	const { slug } = useParams<{ slug: string }>();

	const { data: bioPage, isLoading } = useQuery({
		queryKey: ["bioPage", slug],
		queryFn: () => Services.bioPages.getPublicBioPage(slug!),
		enabled: !!slug && !bioPageData,
	});

	// Use provided data or fetched data
	const displayBioPage = bioPageData || bioPage;

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
				<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
			</div>
		);
	}

	if (!displayBioPage) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Página no encontrada
					</h1>
					<p className="text-gray-600">
						Esta página bio no existe o no está disponible.
					</p>
				</div>
			</div>
		);
	}

	// Theme classes
	const themeClasses = {
		light: "bg-gradient-to-br from-purple-50 to-blue-50",
		dark: "bg-gradient-to-br from-gray-900 to-gray-800",
		gradient: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
	};

	const textClasses = {
		light: "text-gray-900",
		dark: "text-white",
		gradient: "text-white",
	};

	const cardClasses = {
		light: "bg-white border border-gray-200 hover:border-purple-300",
		dark: "bg-gray-800 border border-gray-700 hover:border-purple-500",
		gradient:
			"bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30",
	};

	const theme = displayBioPage.theme as "light" | "dark" | "gradient";

	return (
		<div className={`min-h-screen ${themeClasses[theme]} py-12 px-4`}>
			<div className="max-w-2xl mx-auto">
				{/* Profile Section */}
				<div className="text-center mb-8">
					{displayBioPage.avatar_url && (
						<img
							src={displayBioPage.avatar_url}
							alt={displayBioPage.display_name}
							className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
						/>
					)}
					<h1 className={`text-3xl font-bold mb-2 ${textClasses[theme]}`}>
						{displayBioPage.display_name}
					</h1>
					{displayBioPage.bio && (
						<p
							className={`text-lg ${theme === "light" ? "text-gray-600" : theme === "dark" ? "text-gray-300" : "text-white/90"} max-w-md mx-auto`}
						>
							{displayBioPage.bio}
						</p>
					)}
				</div>

				{/* Links Section */}
				<div className="space-y-4">
					{displayBioPage.links.map((link) => {
						const isSpecialLink =
							link.special_type && link.special_type !== "custom";
						const specialTemplate =
							isSpecialLink && link.special_type
								? SPECIAL_LINK_TEMPLATES[link.special_type as SpecialLinkType]
								: null;

						return (
							<a
								key={link.id}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className={`block ${cardClasses[theme]} rounded-xl p-6 transition-all duration-200 hover:scale-105 hover:shadow-xl group`}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4 flex-1">
										{isSpecialLink && specialTemplate && (
											<span className="text-3xl">{specialTemplate.icon}</span>
										)}
										<div className="flex-1">
											<h3
												className={`text-lg font-semibold ${textClasses[theme]} group-hover:underline`}
											>
												{link.title}
											</h3>
											{link.description && (
												<p
													className={`text-sm mt-1 ${theme === "light" ? "text-gray-600" : theme === "dark" ? "text-gray-400" : "text-white/80"}`}
												>
													{link.description}
												</p>
											)}
											{isSpecialLink &&
												link.special_code &&
												link.special_type &&
												link.special_type !== "custom" && (
													<p
														className={`text-sm mt-1 ${theme === "light" ? "text-purple-600" : theme === "dark" ? "text-purple-400" : "text-white/90"} font-medium`}
													>
														{getSpecialLinkDisplay(
															link.special_type as SpecialLinkType,
															link.special_code,
														)}
													</p>
												)}
										</div>
									</div>
									<ExternalLink
										className={`w-5 h-5 ${theme === "light" ? "text-gray-400" : theme === "dark" ? "text-gray-500" : "text-white/70"} group-hover:${theme === "light" ? "text-purple-600" : theme === "dark" ? "text-purple-400" : "text-white"} transition-colors`}
									/>
								</div>
							</a>
						);
					})}
				</div>

				{/* Footer */}
				<div className="text-center mt-12">
					<p
						className={`text-sm ${theme === "light" ? "text-gray-500" : theme === "dark" ? "text-gray-400" : "text-white/70"}`}
					>
						Creado con{" "}
						<a
							href="/"
							className={`font-semibold ${theme === "light" ? "text-purple-600 hover:text-purple-700" : theme === "dark" ? "text-purple-400 hover:text-purple-300" : "text-white hover:text-white/90"} transition-colors`}
						>
							AraguaLink
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
