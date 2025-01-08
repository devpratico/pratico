
import { AlertDialog, Button, Flex, IconButton } from "@radix-ui/themes";
import { Trash2 } from "lucide-react";

export function RemoveReportAlertDialog ({roomOpen, date, setDeleteOk}: {roomOpen: boolean, date: string, setDeleteOk: (deleteOk: boolean) => void}) {

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <IconButton disabled={roomOpen} variant="ghost">
                    <Trash2 size="20" />
                </IconButton>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <AlertDialog.Title>{`Supprimer le rapport du ${date}`}</AlertDialog.Title>
                <AlertDialog.Description>
                    Etes-vous sûr de vouloir supprimer ce rapport ? Cette action est irréversible.
                </AlertDialog.Description>
                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Annuler
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button color="red" onClick={() => setDeleteOk(true)}>
                            Supprimer
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};