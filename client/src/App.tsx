import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "@/features/theme";
import { ModalProvider } from "@/features/ui/useModal";
import { Toaster } from "./components/ui/toaster";
import { Routes } from "./Routes";

const queryClient = new QueryClient();

function App() {
	return (
		<>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<ModalProvider>
							<Routes />
						</ModalProvider>
					</AuthProvider>
				</QueryClientProvider>
			</ThemeProvider>
			<Toaster />
		</>
	);
}

export default App;
