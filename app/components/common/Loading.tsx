'use client';

export default function Loading() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando...</p>

            </div>
        </div>
    )
}

