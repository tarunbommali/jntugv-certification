// src/components/ErrorBoundary.jsx (New File)

import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error in component:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="p-10 bg-red-50 min-h-[400px] flex flex-col items-center justify-center rounded-xl shadow-lg border-2 border-red-300">
                    <AlertTriangle className="w-16 h-16 text-red-600 mb-4" />
                    <h1 className="text-xl font-bold text-red-700 mb-2">Something went wrong in the dashboard section.</h1>
                    <p className="text-gray-600 text-center text-sm">
                        Please notify IT. Error Details: {this.state.error ? this.state.error.message : 'Unknown Error'}
                    </p>
                    <button 
                        onClick={() => this.setState({ hasError: false, error: null })} 
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;