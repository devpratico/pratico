
import { AlertDialog, Button, Flex, IconButton, Text } from "@radix-ui/themes";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function RemoveReportAlertDialog ({date, setDeleteOk}: {date: string, setDeleteOk: (deleteOk: boolean) => void}) {
    const [ open, setOpen ] = useState(false);

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger>
                <IconButton variant="ghost">
                    <Trash2 size="20" />
                </IconButton>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
                <Flex direction="column" gap="3" justify="center">
                    <AlertDialog.Title align="center">{`Supprimer le rapport du ${date} ?`}</AlertDialog.Title>
                    <Flex gap="5" justify="center">
                        <Button onClick={() => {
                            setDeleteOk(true);
                            setOpen(false);
                        }}>Supprimer</Button>
                        <Button variant="ghost" color="red" style={{ margin: "0px" }}
                            onClick={() => setOpen(false)}>Annuler</Button>
                    </Flex>       
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};