import {
	APP_NAME_CAPITALIZED,
	UserForRegisterSchema,
} from "@aragualink/shared";
import { useFormik } from "formik";
import { Check, GalleryVerticalEnd, X } from "lucide-react";
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
			<div className="flex flex-col justify-center items-center p-8">
				<div className="flex items-center gap-2 font-medium">
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<GalleryVerticalEnd className="size-4" />
					</div>
					<h1 className="text-xl font-bold">{APP_NAME_CAPITALIZED}</h1>
				</div>
				<br />
				<p className="text-lg mb-10 text-center">
					Crea tu cuenta y tu workspace personal
				</p>

				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Registro</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="space-y-6" onSubmit={handleSubmit}>
							{/* User info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<TextField
									type="text"
									name="first_name"
									placeholder="Nombre"
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
									placeholder="Apellido"
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
								label="Correo"
								value={values.email}
								error={errors.email as string}
								onChange={handleChange}
							/>

							<TextField
								type="password"
								name="password"
								autoComplete="new-password"
								placeholder="* * * * * * *"
								label="Contraseña"
								value={values.password}
								error={errors.password as string}
								onChange={handleChange}
							/>

							{/* Workspace info */}
							<div className="grid grid-cols-1 gap-4">
								<TextField
									type="text"
									name="company_name"
									placeholder="Mi Workspace Personal"
									label="Nombre del workspace (opcional)"
									value={values.company_name}
									onChange={handleChange}
								/>
								<TextField
									type="text"
									name="company_address"
									placeholder="Descripción del workspace"
									label="Descripción (opcional)"
									value={values.company_address}
									onChange={handleChange}
								/>
								<TextField
									type="url"
									name="company_phone"
									placeholder="https://mi-sitio-web.com"
									label="Sitio web (opcional)"
									value={values.company_phone}
									onChange={handleChange}
								/>
							</div>

							<Button
								type="submit"
								className="w-full mt-4"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Creando..." : "Crear cuenta"}
							</Button>

							<div className="text-center text-sm text-muted-foreground">
								¿Ya tienes cuenta?{" "}
								<Link
									to={AuthRoutesEnum.Login}
									className="text-primary underline"
								>
									Inicia sesión
								</Link>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>

			<div className="relative hidden bg-muted lg:block">
				<img
					src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1887&auto=format&fit=crop"
					alt="Background"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}
