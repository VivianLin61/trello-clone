"use client"
import { UserButton } from '@clerk/nextjs';
import React from 'react'

interface ProtectedPageProps {

}

export const ProtectedPage: React.FC<ProtectedPageProps> = async ({ }) => {


    return (
        <div>
            <UserButton afterSignOutUrl='/' />

        </div>
    );
}
export default ProtectedPage
