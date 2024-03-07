import Form from "@/components/primitives/Form/Form"
import { Field } from "@/components/primitives/Form/Form"


export default function StudentForm() {


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



    return (
        <div>
            <h2>Entrez votre Prénom et Nom</h2>
            <Form fields={fields}/>
        </div>
    )
}