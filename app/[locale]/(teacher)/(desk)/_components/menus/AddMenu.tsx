'use client'
import { useTLEditor } from "@/app/_hooks/useTLEditor"
import { useParams } from "next/navigation"
import { Flex, Button, Progress, AlertDialog, RadioGroup, Heading, Separator, Card, Text, Box, Grid } from "@radix-ui/themes"
import { ArrowDown, Plus, File, CircleCheck } from "lucide-react"
import { useRef, useState } from "react"
import logger from "@/app/_utils/logger"
import { useNav } from "@/app/_hooks/useNav"
import { useDisable } from "@/app/_hooks/useDisable"
import { convertPdfToImages, getPdfNumPages } from "@/app/_utils/pdfUtils"
import { getPublicUrl } from "@/app/api/actions/capsule"
import uploadCapsuleFile from "@/app/_utils/uploadCapsuleFile"
import importPdfBackground from "@/app/_utils/tldraw/importPdfBackground"
import { AssetData } from "@/app/_utils/tldraw/importPdfBackground"
import { Image } from "@radix-ui/react-avatar"



interface ImageData {
    bitmap: string
    width: number
    height: number
}



export default function AddMenu() {

    return (
        <Flex gap='3' direction='column'>
            <ImportDocumentBtn />
            <NewPageBtn />
        </Flex>
        
    )
}


function NewPageBtn() {
    const { newPage } = useNav()
    const { disabled } = useDisable()

    async function handleClick() {
        /*
        if (capsuleId) {
            newPage?.()
        } else {
            // We are in the empty capsule page. Lets create a capsule first
            const { user, error: userError } = await fetchUser()
            if (userError || !user) return
            const { data, error } = await saveCapsule({ created_by: user.id, title: 'Sans titre' })
            if (error || !data) return
            router.push(`/capsule/${data.id}`)
        }*/
        newPage?.()
    }

    return (
        <Button variant='outline' style={{ justifyContent: 'start' }} onClick={handleClick} disabled={disabled}>
            <Plus size='15' /> Page blanche
        </Button>
    )
}




function ImportDocumentBtn() {
    const [ openDialog, setOpenDialog ] = useState(false)
    const { editor } = useTLEditor()
    const { capsule_id: capsuleId } = useParams<{ capsule_id: string }>()
    const { disabled } = useDisable()
    const [fileName, setFileName] = useState<string | undefined>(undefined)
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'uploading' | 'inserting' >('idle')
    const [progress, setProgress] = useState<number | undefined>(0)
    const [pagesProgress, setPagesProgress] = useState<{ loading: number, total: number }>({ loading: 0, total: 0 })
    const [images, setImages] = useState<ImageData[]>([])
    const [pagesPosition, setPagesPosition] = useState<'next' | 'last'>('next')

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setState('loading')
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) return

        const name = file?.name
        setFileName(name)
        logger.log('system:file', 'File received locally', name, file?.type)

        const numPages = await getPdfNumPages(file)
        setImages(new Array(numPages))
        setPagesProgress({ loading: 0, total: numPages || 0 })

        const imagesPromises = await convertPdfToImages({ file })

        if (!imagesPromises) {
            logger.error('system:file', 'Error converting PDF to images')
            return
        }

        Promise.all(imagesPromises.map(async (promise, index) => {
            return promise.then((image) => {
                setImages((prev) => {
                    prev[index] = image || { bitmap: '', width: 0, height: 0 }
                    return prev
                })
                logger.log('system:file', `Loaded page ${index}`)
                setProgress((prev) => (prev || 0) + 100 / (numPages || 1))
                setPagesProgress((prev) => ({ loading: prev.loading + 1, total: prev.total }))
            })
        }).map(async (promise) => {
            await promise

        })).then(() => {
            logger.log('system:file', 'Images received', images.length)
            setState('success')
        })
    }

    const handleUpload = async () => {
        setState('uploading')
        setProgress(0)
        setPagesProgress({ loading: 0, total: images.length })

        if (images.length == 0) return

        let assets: AssetData[] = new Array(images.length);

        Promise.all(images.map(async (image, index) => {
            const cleanPdfName = fileName?.split('.')[0].substring(0, 50);
            const pageFileName = cleanPdfName + '-' + index + '.png';

            const { data, error } = await uploadCapsuleFile({dataUrl: image.bitmap, name: pageFileName, capsuleId: capsuleId, folder: cleanPdfName });
            if (error || !data) {
                logger.error('system:file', 'Error uploading file', error)
                return
            }

            const url = await getPublicUrl(data.path);
            if (!url || url == '') {
                logger.error('system:file', 'Error getting public URL')
                return
            }

            logger.log('supabase:storage', `Uploaded page ${index}`)
            assets[index] = { width: image.width, height: image.height, publicUrl: url, name: pageFileName }

            setProgress((prev) => (prev || 0) + 100 / images.length)
            setPagesProgress((prev) => ({ loading: prev.loading + 1, total: prev.total }))

        })).then(async () => {
            logger.log('system:file', 'All pages uploaded')
            setState('inserting')
            setProgress(undefined)
            if (!editor) {
                logger.error('tldraw:editor', 'No editor found - cannot insert images')
                return
            }
            await importPdfBackground({ images: assets, editor, position: pagesPosition })
            setState('idle')
            setOpenDialog(false)
        })
    }

    return (
        <AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>

            <AlertDialog.Trigger>
                <Button disabled={disabled} style={{ justifyContent: 'start' }}>
                    <File size='15' /> Document
                </Button>
            </AlertDialog.Trigger>

            <AlertDialog.Content>
                <AlertDialog.Title>Importer un document</AlertDialog.Title>
                
                <Card variant='surface' my='4'>

                    {/* IDLE */}
                    <Flex align='center' gap='3' display={state=='idle' ? 'flex' : 'none'}>

                        {/*<Box p='3' style={{ border: '2px dashed var(--gray-6)', borderRadius: 'var(--radius-3)' }}>
                            <Text color='gray'>Déposer ici</Text>
                        </Box>*/}

                        <Button asChild>
                            <label htmlFor='input'>Choisir un fichier</label>
                        </Button>

                        <input
                            id='input'
                            style={{ display: 'none' }}
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />

                        

                        <AlertDialog.Description size='1' align='center' color='gray'>
                            {`Vous pouvez importer un document PDF pour l'ajouter à votre capsule.`}
                        </AlertDialog.Description>

                        

                    </Flex>

                    {/* LOADING */}
                    <Flex direction='column' align='center' gap='3' display={state=='loading' ? 'flex' : 'none'}>

                        <Flex align='center' justify='between' gap='1' width='100%' style={{color:'var(--gray-10)'}}>
                            <Text trim='both'>{fileName}</Text>
                            <Text size='1'>{`Conversion page ${pagesProgress.loading} sur ${pagesProgress.total}`}</Text>
                        </Flex>

                        <Box width='100%'>
                            <Progress value={progress} />
                        </Box> 
                    </Flex>


                    {/* SUCCESS */}
                    <Flex align='center' style={{justifyContent:'space-around'}} gap='3' display={state == 'success' ? 'flex' : 'none'}>
						<Image alt="" src={images[0]?.bitmap} style={{ width: '100px', height:'auto', boxShadow:('var(--shadow-2)'), borderRadius:'var(--radius-3)' }} />
                        <Flex align='center' gap='1' style={{ color: 'var(--green)' }}>
                            <CircleCheck size='15' style={{ color: 'var(--green)' }} />
                            <Text trim='both'>{fileName}</Text>
                        </Flex>
                    </Flex>

                    {/* UPLOADING */}
                    <Flex direction='column' align='center' gap='3' display={state == 'uploading' ? 'flex' : 'none'}>

                        <Flex align='center' justify='between' gap='1' width='100%' style={{ color: 'var(--gray-10)' }}>
                            <Text trim='both'>{fileName}</Text>
                            <Text size='1'>{`Chargement page ${pagesProgress.loading} sur ${pagesProgress.total}`}</Text>
                        </Flex>

                        <Box width='100%'>
                            <Progress value={progress} />
                        </Box>
                    </Flex>

                    {/* INSERTING */}
                    <Flex direction='column' align='center' gap='3' display={state == 'inserting' ? 'flex' : 'none'}>

                        <Flex align='center' justify='between' gap='1' width='100%' style={{ color: 'var(--gray-10)' }}>
                            <Text trim='both'>{fileName}</Text>
                            <Text size='1'>{`Insertion des pages...`}</Text>
                        </Flex>

                        <Box width='100%'>
                            <Progress value={progress} />
                        </Box>
                    </Flex>

                </Card>


                <Heading size='2'>Positionner les pages</Heading>

                <RadioGroup.Root value={pagesPosition} onValueChange={(value) => setPagesPosition(value as 'next' | 'last')} name='position'>
                    <RadioGroup.Item value='next'>À la position actuelle</RadioGroup.Item>
                    <RadioGroup.Item value='last'>À la fin</RadioGroup.Item>
                </RadioGroup.Root>

                <Flex justify='between' mt='4'>
                    <AlertDialog.Cancel>
                        <Button variant='soft'>Annuler</Button>
                    </AlertDialog.Cancel>
                
                    <Button disabled={state != 'success'} onClick={handleUpload}>
                        Importer
                    </Button>


                </Flex>


            </AlertDialog.Content>

        </AlertDialog.Root>
    )
}