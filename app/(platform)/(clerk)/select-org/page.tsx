import { OrganizationList } from '@clerk/nextjs';
import React from 'react'

interface CreateOrganizationPageProps {

}

export const CreateOrganizationPage: React.FC<CreateOrganizationPageProps> = ({ }) => {
    return (
        <div>
            <OrganizationList
                hidePersonal
                afterSelectOrganizationUrl="/organization/:id"
                afterCreateOrganizationUrl="/organization/:id"
            />
        </div>
    );
}
export default CreateOrganizationPage
