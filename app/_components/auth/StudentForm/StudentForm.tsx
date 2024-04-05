'use client'
import Form from "@/app/_components/primitives/Form/Form"
import { Field } from "@/app/_components/primitives/Form/Form"


interface StudentFormProps {
    onSubmit: (firstName: string, lastName: string) => void;
}


export default function StudentForm({ onSubmit }: StudentFormProps) {


    const fields: Field[] = [
        {
            name: "firstName",
            placeholder: "Prénom",
            type: "text",
            required: true,
            errorMessage: "Veuillez entrer votre prénom"
        },
        {
            name: "lastName",
            placeholder: "Nom",
            type: "text",
            required: true,
            errorMessage: "Veuillez entrer votre nom"
        }
    ]


    const handleSubmit = (event: React.FormEvent) => {
        const form = event.target as HTMLFormElement;
        const firstName = form.firstName.value;
        const lastName = form.lastName.value;
        onSubmit(firstName, lastName);
    }



    return (
        <div>
            <h2>Entrez votre Prénom et Nom</h2>
            <Form fields={fields} onSubmit={handleSubmit} />
        </div>
    )
}