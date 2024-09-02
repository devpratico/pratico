import { AlertDialog, Button, Flex } from '@radix-ui/themes';


/**
 * Button on the top right corner of the dialog
 */
export default function CancelButton({ onCancel }: { onCancel: () => void }) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button variant='ghost' color='gray'>Annuler</Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>

                <AlertDialog.Title>Annuler la création</AlertDialog.Title>


                <AlertDialog.Description>
                    Voulez-vous vraiment annuler la création du quiz ? Les modifications seront perdues.
                </AlertDialog.Description>

                <Flex justify='end' gap='3'>
                    <AlertDialog.Cancel>
                        <Button variant='soft' color='red' onClick={onCancel}>Oui, annuler</Button>
                    </AlertDialog.Cancel>

                    <AlertDialog.Action>
                        <Button>Continuer</Button>
                    </AlertDialog.Action>
                </Flex>

            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}