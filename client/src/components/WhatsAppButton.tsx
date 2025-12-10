import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "584149409930";
const WHATSAPP_MESSAGE = "Hola, me interesa saber más sobre AraguaLink";

export function WhatsAppButton() {
	const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
		WHATSAPP_MESSAGE,
	)}`;

	return (
		<a
			href={whatsappUrl}
			target="_blank"
			rel="noopener noreferrer"
			className="fixed bottom-6 right-6 z-50"
			aria-label="Contáctanos por WhatsApp"
		>
			<Button
				size="lg"
				className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-green-500 hover:bg-green-600 text-white"
			>
				<MessageCircle className="h-6 w-6" />
			</Button>
		</a>
	);
}
