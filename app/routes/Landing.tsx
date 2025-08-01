import { Link,NavLink } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Users, Shield, Zap, ArrowRight, Edit3, FolderOpen, Search } from 'lucide-react';

const Landing = () => {

    const features = [
        {
            icon: Edit3,
            title: "Rich Text Editor",
            description: "Format your notes with bold, italic, colors, and lists"
        },
        {
            icon: FolderOpen,
            title: "Smart Categories",
            description: "Organize notes into custom categories for easy access"
        },
        {
            icon: Search,
            title: "Quick Search",
            description: "Find any note instantly with our powerful search"
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Optimized for speed and smooth performance"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-semibold text-gray-900">Notes</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <NavLink to="/login" tabIndex={-1}>
                                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-blue-50">
                                    Sign In
                                </Button>
                            </NavLink>
                            <NavLink to="/signup" tabIndex={-1}>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Get Started
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                        Your thoughts,
                        <span className="text-blue-600"> beautifully organized</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        A clean, modern note-taking app that helps you capture ideas, organize thoughts,
                        and stay productive. Simple, fast, and distraction-free.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" tabIndex={-1}>
                            <Button
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 "
                            >
                                Start Taking Notes
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="" tabIndex={-1}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="text-lg px-12 sm:px-8 py-3 border-gray-300  hover:bg-indigo-50"
                            >
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Everything you need to stay organized
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Powerful features wrapped in a clean, intuitive interface
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                                <CardHeader className="text-center pb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center pt-0">
                                    <CardDescription className="text-gray-600">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to get organized?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of users who have transformed their note-taking experience
                        </p>
                        <NavLink to="/signup" tabIndex={-1}>
                            <Button
                                size="lg"
                                variant="secondary"
                                className="bg-white text-blue-600 hover:text-blue-700 hover:bg-gray-50 text-lg px-8 py-3"
                            >
                                Start Your Journey
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <FileText className="h-6 w-6 text-blue-600" />
                            <span className="text-lg font-semibold text-gray-900">Notes</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                        © 2024 Notes. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
