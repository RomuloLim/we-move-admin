import React, { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { Mail, Lock, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login, isAuthenticated, isLoading } = useAuth()

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            await login({ email, password })
        } catch (err: any) {
            setError(err.message || "Erro ao realizar login. Tente novamente.")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            {/* Container com responsividade e profundidade */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden md:max-w-md lg:shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                {/* Header decorativo apenas em desktop */}
                <div className="hidden md:block h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="flex flex-col p-6 md:p-8 lg:p-10 space-y-6">
                    {/* Logo */}
                    <div className="flex justify-center mb-4 md:mb-8">
                        <div className="flex items-center gap-4 transform hover:scale-105 transition-transform duration-200">
                            <img
                                src="/images/blue-typographic-logo.svg"
                                alt="WeMove"
                                className="h-16 md:h-20 lg:h-24"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-error-50 border border-error-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-error-600 flex-shrink-0" />
                            <p className="text-sm text-error-700">{error}</p>
                        </div>
                    )}

                    {/* Input Fields */}
                    <div className="space-y-4">
                        {/* Email Input */}
                        <Input
                            label="Email"
                            type="email"
                            placeholder="estudante@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail className="w-4 h-4" />}
                            size="lg"
                            required
                            disabled={isLoading}
                        />

                        {/* Password Input */}
                        <Input
                            label="Senha"
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            leftIcon={<Lock className="w-4 h-4" />}
                            size="lg"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Login Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 shadow-md hover:shadow-lg transition-all duration-200"
                            size="lg"
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? "Entrando..." : "Login"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
