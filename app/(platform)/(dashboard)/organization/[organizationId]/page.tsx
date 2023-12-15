import { create } from '@/actions/create-board';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { OrganizationSwitcher, auth } from '@clerk/nextjs';
import React from 'react'

interface OrganizationIdPageProps {

}

export const OrganizationIdPage: React.FC<OrganizationIdPageProps> = async ({ }) => {
    const boards = await db.board.findMany();
    return (
        <div>
            <form action={create}>
                <input id="title" name="title" required type="text" placeholder="Enter your name" />
                <Button type="submit">
                    Submit
                </Button>
            </form>
        </div>
    );
}
export default OrganizationIdPage
