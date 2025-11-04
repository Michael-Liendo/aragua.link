import { APP_NAME_CAPITALIZED, UserForLoginSchema } from "@aragualink/shared";
import { useFormik } from "formik";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@/components/text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthRoutesEnum, PrivateRoutesEnum } from "@/data/routesEnums";
import { useAuth } from "@/features/auth";
import { useSEO } from "@/features/seo";
import { toast } from "@/features/ui/useToast";
import { toFormikValidationSchema } from "@/utils/toFormikValidationSchema";
import Services from "../../services";

export default function LoginPage() {
	useSEO({
		title: "Inicio de sesión",
	});
	const { setToken } = useAuth();
	const navigate = useNavigate();

	const { values, errors, handleChange, handleSubmit, isSubmitting } =
		useFormik({
			initialValues: { email: "", password: "" },
			validationSchema: toFormikValidationSchema(UserForLoginSchema),
			validateOnChange: false,
			validateOnBlur: false,
			onSubmit: async (values) => {
				try {
					const results = await Services.auth.login({
						email: values.email,
						password: values.password,
					});
					setToken(results?.data?.token);

					toast({
						description: (
							<div className="flex items-center justify-between w-full space-x-4">
								<Check className="text-green-600 ml-auto" />
								<span>Inicio de sesión exitoso!</span>
							</div>
						),
					});

					navigate(PrivateRoutesEnum.Home);
				} catch (e) {
					toast({
						description: (
							<div className="flex items-center justify-between w-full space-x-4">
								<X className="text-red-600 ml-auto" />
								<span>Credenciales inválidas</span>
							</div>
						),
					});
					console.error(e);
				}
			},
		});

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
			<div className="flex flex-col justify-center items-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
				<div className="w-full max-w-md">
					{/* Logo y título */}
					<div className="flex flex-col items-center mb-8">
						<img
							src="/logo.png"
							alt="AragualLink Logo"
							className="w-20 h-20 mb-4 drop-shadow-lg"
						/>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							{APP_NAME_CAPITALIZED}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
							Conecta y gestiona tus enlaces
						</p>
					</div>

					<Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
						<CardHeader className="space-y-1 pb-4">
							<CardTitle className="text-2xl font-bold text-center">
								Iniciar sesión
							</CardTitle>
							<p className="text-sm text-muted-foreground text-center">
								Ingresa tus credenciales para continuar
							</p>
						</CardHeader>
						<CardContent>
							<form className="space-y-4" onSubmit={handleSubmit}>
								<TextField
									type="text"
									name="email"
									autoComplete="email"
									placeholder="correo@dominio.com"
									label="Correo electrónico"
									value={values.email}
									error={errors.email}
									onChange={handleChange}
									required
								/>

								<TextField
									type="password"
									label="Contraseña"
									name="password"
									autoComplete="current-password"
									placeholder="••••••••"
									value={values.password}
									error={errors.password}
									onChange={handleChange}
									required
								/>

								<Button
									type="submit"
									className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
								</Button>

								<div className="text-center text-sm text-muted-foreground pt-4">
									¿No tienes cuenta?{" "}
									<a
										href={AuthRoutesEnum.Register}
										className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-semibold underline-offset-4 hover:underline transition-colors"
									>
										Crear cuenta
									</a>
								</div>
							</form>
						</CardContent>
					</Card>

					<p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
						Al iniciar sesión, aceptas nuestros términos y condiciones
					</p>
				</div>
			</div>

			<div className="relative hidden lg:block bg-gradient-to-br from-amber-400 to-orange-500">
				<div className="absolute inset-0 bg-black/20" />
				<img
					src="https://primicia.com.ve/wp-content/uploads/2021/05/dc72fa991a32a1863edc4e1ed2ca98ad.jpg"
					alt="Background"
					className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-40"
				/>
				<div className="relative h-full flex flex-col justify-center items-center text-white p-12">
					<div className="max-w-md text-center space-y-6">
						<h2 className="text-4xl font-bold drop-shadow-lg">
							Bienvenido de vuelta
						</h2>
						<p className="text-lg drop-shadow-md opacity-90">
							Gestiona tus enlaces de forma simple y efectiva con AragualLink
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
