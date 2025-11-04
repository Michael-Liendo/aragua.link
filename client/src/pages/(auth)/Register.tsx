import {
	APP_NAME_CAPITALIZED,
	UserForRegisterSchema,
} from "@aragualink/shared";
import { useFormik } from "formik";
import { Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TextField } from "@/components/text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthRoutesEnum, PrivateRoutesEnum } from "@/data/routesEnums";
import { useAuth } from "@/features/auth";
import { useSEO } from "@/features/seo";
import { toast } from "@/features/ui/useToast";
import Services from "@/services";
import { toFormikValidationSchema } from "@/utils/toFormikValidationSchema";

export default function RegisterPage() {
	useSEO({ title: "Registro" });
	const { setToken } = useAuth();
	const navigate = useNavigate();

	const {
		values,
		errors,
		handleChange,
		handleSubmit,
		isSubmitting,
		setFieldValue,
	} = useFormik({
		initialValues: {
			first_name: "",
			last_name: "",
			email: "",
			password: "",
			company_name: "",
			company_address: "",
			company_phone: "",
		},
		validationSchema: toFormikValidationSchema(UserForRegisterSchema),
		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: async (vals) => {
			try {
				// 1) Register user and store token
				const registerRes = await Services.auth.register({
					first_name: vals.first_name,
					last_name: vals.last_name,
					email: vals.email,
					password: vals.password,
				});

				const rawToken = registerRes?.data?.token as unknown;
				const tokenValue =
					typeof rawToken === "string"
						? rawToken
						: // some backends return { token: string }
							(rawToken as { token?: string })?.token;
				if (!tokenValue) throw new Error("Invalid register response");
				setToken(tokenValue);

				toast({
					description: (
						<div className="flex items-center justify-between w-full space-x-4">
							<Check className="text-green-600 ml-auto" />
							<span>¡Cuenta creada con éxito!</span>
						</div>
					),
				});

				navigate(PrivateRoutesEnum.Home);
			} catch (e) {
				toast({
					description: (
						<div className="flex items-center justify-between w-full space-x-4">
							<X className="text-red-600 ml-auto" />
							<span>Error al crear la cuenta</span>
						</div>
					),
				});
				console.error(e);
			}
		},
	});

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
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
							Únete a AraguaLink
						</h2>
					</div>
				</div>
			</div>

			<div className="flex flex-col justify-center items-center p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
				<div className="w-full max-w-md py-8">
					{/* Logo y título */}
					<div className="flex flex-col items-center mb-8">
						<img
							src="/logo.png"
							alt="AraguaLink Logo"
							className="w-20 h-20 mb-4 drop-shadow-lg"
						/>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							{APP_NAME_CAPITALIZED}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 mt-2 text-center">
							Crea tu cuenta
						</p>
					</div>

					<Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
						<CardHeader className="space-y-1 pb-4">
							<CardTitle className="text-2xl font-bold text-center">
								Registro
							</CardTitle>
							<p className="text-sm text-muted-foreground text-center">
								Completa el formulario para crear tu cuenta
							</p>
						</CardHeader>
						<CardContent>
							<form className="space-y-4" onSubmit={handleSubmit}>
								{/* User info */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<TextField
										type="text"
										name="first_name"
										placeholder="Juan"
										label="Nombre"
										value={values.first_name}
										error={errors.first_name as string}
										onChange={(e) => {
											handleChange(e);
											// Suggest a default workspace name based on name fields
											const f =
												e.target.name === "first_name"
													? e.target.value
													: values.first_name;
											const l =
												e.target.name === "last_name"
													? e.target.value
													: values.last_name;
											const suggested = `Workspace de ${f} ${l}`.trim();
											if (!values.company_name)
												setFieldValue("company_name", suggested);
										}}
									/>
									<TextField
										type="text"
										name="last_name"
										placeholder="Pérez"
										label="Apellido"
										value={values.last_name}
										error={errors.last_name as string}
										onChange={(e) => {
											handleChange(e);
											const f =
												e.target.name === "first_name"
													? e.target.value
													: values.first_name;
											const l =
												e.target.name === "last_name"
													? e.target.value
													: values.last_name;
											const suggested = `Workspace de ${f} ${l}`.trim();
											if (!values.company_name)
												setFieldValue("company_name", suggested);
										}}
									/>
								</div>

								<TextField
									type="text"
									name="email"
									autoComplete="email"
									placeholder="correo@dominio.com"
									label="Correo electrónico"
									value={values.email}
									error={errors.email as string}
									onChange={handleChange}
								/>

								<TextField
									type="password"
									name="password"
									autoComplete="new-password"
									placeholder="••••••••"
									label="Contraseña"
									value={values.password}
									error={errors.password as string}
									onChange={handleChange}
								/>

								<Button
									type="submit"
									className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
								</Button>

								<div className="text-center text-sm text-muted-foreground pt-4">
									¿Ya tienes cuenta?{" "}
									<Link
										to={AuthRoutesEnum.Login}
										className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-semibold underline-offset-4 hover:underline transition-colors"
									>
										Inicia sesión
									</Link>
								</div>
							</form>
						</CardContent>
					</Card>

					<p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
						Al crear una cuenta, aceptas nuestros términos y condiciones
					</p>
				</div>
			</div>
		</div>
	);
}
