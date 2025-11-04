import { APP_NAME_CAPITALIZED, UserForLoginSchema } from "@aragualink/shared";
import { useFormik } from "formik";
import { Check, GalleryVerticalEnd, X } from "lucide-react";
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
			<div className="flex flex-col justify-center items-center p-8">
				<div className="flex items-center gap-2 font-medium">
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<GalleryVerticalEnd className="size-4" />
					</div>
					<h1 className="text-xl font-bold">{APP_NAME_CAPITALIZED}</h1>
				</div>
				<br />
				<p className="text-lg mb-10 text-center">
					Inicie sesión y maneje el sistema
				</p>

				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Inicio de sesión</CardTitle>
					</CardHeader>
					<CardContent>
						<form className="space-y-6" onSubmit={handleSubmit}>
							<TextField
								type="text"
								name="email"
								autoComplete="email"
								placeholder="correo@dominio.com"
								label="Correo"
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
								placeholder="* * * * * * *"
								value={values.password}
								error={errors.password}
								onChange={handleChange}
								required
							/>
							<Button
								type="submit"
								className="w-full mt-4"
								disabled={isSubmitting}
							>
								{isSubmitting ? "Cargando..." : "Entrar"}
							</Button>
							<div className="text-center text-sm text-muted-foreground">
								¿No tienes cuenta?{" "}
								<a
									href={AuthRoutesEnum.Register}
									className="text-primary underline"
								>
									Regístrate
								</a>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>

			<div className="relative hidden bg-muted lg:block">
				<img
					src="https://www.venez.pl/wp-content/uploads/2013/12/MA_20141130_005966_D.jpg"
					alt="Background"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}
