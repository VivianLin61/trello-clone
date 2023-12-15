import React from 'react'
import { Navbar } from './_components/navbar';

interface DashboardLayoutProps {
    children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="h-full">
            <Navbar />
            {children}
        </div>
    );
}
export default DashboardLayout
