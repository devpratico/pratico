import * as Form from '@radix-ui/react-form';
import { Text } from '@radix-ui/themes';


interface ClientMismatchMessageProps {
    match?: Form.FormMessageProps['match'];
    message?: string;
}

/**
 * Displays a message when the input value does not match the expected format.
 * Should be placed inside a Form.Field component
 * https://www.radix-ui.com/primitives/docs/components/form
 */
export default function ClientMismatchMessage({ match, message }: ClientMismatchMessageProps) {
    return (
        <Form.Message match={match || 'typeMismatch'} asChild>
            <Text as='span' color='orange' size='1'>
                {message || 'Valeur non valide'}
            </Text>
        </Form.Message>
    )
}